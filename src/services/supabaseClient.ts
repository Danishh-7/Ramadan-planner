import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'YOUR_SUPABASE_URL_HERE') {
    console.warn('Supabase URL or Key is missing. Please check your .env.local file.');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(
    supabaseUrl || '',
    supabaseAnonKey || ''
);

// Helper to create an authenticated client with Clerk token
export const createClientWithToken = (token: string) => {
    return createClient(
        supabaseUrl || '',
        supabaseAnonKey || '',
        {
            global: {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        }
    );
};
