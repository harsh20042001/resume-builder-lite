// lib/supabase/client.ts
// Browser-side Supabase client. Use inside Client Components only.

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
        "Set these in your Vercel project's Environment Variables (and in .env.local for local dev)."
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
