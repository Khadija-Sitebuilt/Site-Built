import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Ensure URL starts with https://
const formattedUrl = supabaseUrl?.startsWith('http')
    ? supabaseUrl
    : `https://${supabaseUrl}`;

export const supabase = createClient(formattedUrl, supabaseAnonKey);
