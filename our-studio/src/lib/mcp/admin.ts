import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "../supabase/env";

let admin: SupabaseClient | null = null;

/**
 * MCP 요청은 Supabase 로그인 세션이 없으므로 서버 전용 키로 접근하고,
 * 대신 매 요청마다 토큰의 사용자가 members 에 있는지 직접 확인합니다.
 */
export function adminClient(): SupabaseClient {
  if (!admin) {
    admin = createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
  }
  return admin;
}

export async function memberById(userId: string) {
  const { data } = await adminClient().from("members").select("user_id, display_name").eq("user_id", userId).maybeSingle();
  return data as { user_id: string; display_name: string } | null;
}
