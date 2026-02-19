'use client';

import { useUser, useAuth } from '@clerk/nextjs';
import { useEffect, useRef, useState } from 'react';
import { useRamadanStore } from '@/store/store';
import { supabase, createClientWithToken } from '@/services/supabaseClient';

export function AuthSyncProvider() {
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const { importData, exportData } = useRamadanStore();
    const [isSyncing, setIsSyncing] = useState(false);

    // Flag to prevent loop: Import -> State Change -> Subscribe -> Upsert -> Import...
    const isRemoteUpdate = useRef(false);

    useEffect(() => {
        if (!isLoaded || !user) return;

        const getAuthenticatedClient = async () => {
            try {
                const token = await getToken({ template: 'supabase' });
                if (!token) {
                    console.warn('⚠️ No Supabase token found. Check Clerk Dashboard -> JWT Templates.');
                    return supabase;
                }
                return createClientWithToken(token);
            } catch (e: any) {
                console.error('❌ Error getting Supabase token:', e);
                return supabase;
            }
        };

        // 1. Initial Sync (Pull from DB) - user_settings table
        const fetchRemoteData = async () => {
            setIsSyncing(true);
            const client = await getAuthenticatedClient();

            console.log('Fetching remote data for user:', user.id);

            const { data: remoteData, error } = await client
                .from('user_settings')
                .select('data')
                .eq('id', user.id)
                .single();

            if (error) {
                // PGRST116 is "The result contains 0 rows" - safe to ignore for new users
                if (error.code !== 'PGRST116') {
                    console.error('❌ Error fetching remote data:', error.message);
                } else {
                    console.log('ℹ️ No existing data found (New User). Uploading strictly local data.');
                    // Optional: Create initial record
                }
            } else if (remoteData?.data) {
                console.log('✅ Syncing data from Supabase...');
                isRemoteUpdate.current = true;
                importData(JSON.stringify(remoteData.data));

                // Reset flag after a short delay
                setTimeout(() => { isRemoteUpdate.current = false; }, 500);
            }
            setIsSyncing(false);
        };

        fetchRemoteData();

        // 2. Auto-Save Subscription (Debounced)
        let timeout: NodeJS.Timeout;

        const unsubscribe = useRamadanStore.subscribe((state) => {
            // If this change was caused by a remote import, DO NOT push it back
            if (isRemoteUpdate.current) return;

            clearTimeout(timeout);
            timeout = setTimeout(async () => {
                if (!user) return;

                setIsSyncing(true);
                const client = await getAuthenticatedClient();
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
                    console.error('❌ Auto-save failed:', error.message);
                } else {
                    console.log('✅ Auto-saved to Supabase');
                }
                setIsSyncing(false);
            }, 2000); // 2 second debounce
        });

        return () => {
            unsubscribe();
            clearTimeout(timeout);
        };
    }, [isLoaded, user, getToken, importData, exportData]);

    // Optional: Visual indicator (toast or small icon) handled by UI components via isSyncing state
    return null;
}
