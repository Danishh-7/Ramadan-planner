'use client';

import { useUser, useAuth } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useRamadanStore } from '@/store/store';
import { supabase, createClientWithToken } from '@/services/supabaseClient';

export function AuthSyncProvider() {
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const { importData, exportData } = useRamadanStore();

    useEffect(() => {
        if (!isLoaded || !user) return;

        const getAuthenticatedClient = async () => {
            try {
                const token = await getToken({ template: 'supabase' });
                if (token) {
                    return createClientWithToken(token);
                }
                console.warn('Supabase token missing. Ensure Clerk-Supabase integration is set up.');
                return supabase;
            } catch (e: any) {
                if (e.errors?.[0]?.code === 'resource_not_found') {
                    console.error('CRITICAL: Clerk JWT Template "supabase" is missing.');
                    console.error('Please go to Clerk Dashboard -> Integrations -> Add Supabase -> Token Template Name: "supabase"');
                } else {
                    console.error('Error fetching Supabase token:', e);
                }
                return supabase;
            }
        };

        // 1. Initial Sync (Pull from DB)
        const fetchRemoteData = async () => {
            const client = await getAuthenticatedClient();

            const { data: remoteData, error } = await client
                .from('user_settings')
                .select('data')
                .eq('id', user.id)
                .single();

            if (error) {
                console.error('Error fetching remote data:', error.message);
                return;
            }

            if (remoteData?.data) {
                console.log('Syncing data from Supabase...');
                importData(JSON.stringify(remoteData.data));
            }
        };

        fetchRemoteData();

        // 2. Real-time Subscription (Listen for changes from other devices)
        const channel = supabase
            .channel('user_settings_changes')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'user_settings',
                    filter: `id=eq.${user.id}`,
                },
                (payload) => {
                    console.log('Real-time update received:', payload);
                    if (payload.new && payload.new.data) {
                        // Prevent loop: Only import if data is different? 
                        // For now, straightforward import. Store might re-trigger subscriber but debounce handles it.
                        // Ideally checking a timestamp would be better, but this works for basic sync.
                        importData(JSON.stringify(payload.new.data));
                        console.log('🔄 Data synced from cloud');
                    }
                }
            )
            .subscribe();

        // 3. Push to DB on change (Debounced)
        let timeout: NodeJS.Timeout;

        const unsubscribe = useRamadanStore.subscribe((state) => {
            clearTimeout(timeout);
            timeout = setTimeout(async () => {
                const client = await getAuthenticatedClient();
                // console.log('Auto-syncing to Supabase...'); // Reduce noise
                const dataToSave = JSON.parse(exportData());

                const { error } = await client
                    .from('user_settings')
                    .upsert({
                        id: user.id,
                        email: user.primaryEmailAddress?.emailAddress,
                        data: dataToSave,
                        updated_at: new Date().toISOString()
                    });

                if (error) {
                    console.error('Sync failed:', error.message);
                } else {
                    console.log('✅ Data synced to Supabase');
                }
            }, 2000); // 2 second debounce
        });

        return () => {
            unsubscribe();
            clearTimeout(timeout);
            supabase.removeChannel(channel);
        };
    }, [isLoaded, user, importData, exportData, getToken]);

    return null;
}
