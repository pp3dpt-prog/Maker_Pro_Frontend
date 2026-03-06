import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// REMOVE A LINHA: console.log("URL detetado:", supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
