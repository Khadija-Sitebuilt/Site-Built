import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Ensure URL starts with https://
const formattedUrl = supabaseUrl?.startsWith("https")
  ? supabaseUrl
  : `https://${supabaseUrl}`;

export function createClient() {
  return createBrowserClient(formattedUrl, supabaseAnonKey);
}
