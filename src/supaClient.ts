import { createClient } from '@supabase/supabase-js';
import { getEnv } from './utils';

const supabaseURL = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

if (!supabaseURL || !supabaseAnonKey) {
    throw new Error(
        'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Copy .env.example to .env and fill in your Supabase (dev) values.',
    );
}

export const supaClient = createClient(supabaseURL, supabaseAnonKey);
