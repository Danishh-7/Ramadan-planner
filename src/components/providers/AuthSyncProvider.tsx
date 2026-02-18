'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useRamadanStore } from '@/store/store';
import { supabase } from '@/services/supabaseClient';

export function AuthSyncProvider() {
    const { user, isLoaded } = useUser();
    const { importData, exportData } = useRamadanStore();

    useEffect(() => {
        if (!isLoaded || !user) return;

        // 1. Initial Sync (Pull from DB)
        const fetchRemoteData = async () => {
            const { data: remoteData } = await supabase
                .from('users')
                .select('data')
                .eq('id', user.id)
                .single();

            if (remoteData?.data) {
                console.log('Syncing data from Supabase...');
                importData(JSON.stringify(remoteData.data));
            }
        };

        fetchRemoteData();

        // 2. Real-time Sync (Push to DB on change)
        // We subscribe to the store. simpler than middleware for now.
        let timeout: NodeJS.Timeout;

        const unsubscribe = useRamadanStore.subscribe((state) => {
            clearTimeout(timeout);
            timeout = setTimeout(async () => {
                console.log('Auto-syncing to Supabase...');
                const dataToSave = JSON.parse(exportData());

                await supabase
                    .from('users')
                    .upsert({
                        id: user.id,
                        email: user.primaryEmailAddress?.emailAddress,
                        data: dataToSave,
                        updated_at: new Date().toISOString()
                    });
            }, 2000); // 2 second debounce
        });

        return () => {
            unsubscribe();
            clearTimeout(timeout);
        };
    }, [isLoaded, user, importData, exportData]);

    return null;
}
