import { createClient } from "@supabase/supabase-js";

const supabaseURL =
  import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

export const supaClient = createClient(supabaseURL, supabaseAnonKey);
