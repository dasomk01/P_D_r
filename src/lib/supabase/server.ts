import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

/**
 * Service-role client for server-side (API route) use only.
 * Never import this from a client component — the service key bypasses RLS.
 */
export function createServiceClient() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase 환경변수가 설정되지 않았습니다 (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).",
    );
  }

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}
