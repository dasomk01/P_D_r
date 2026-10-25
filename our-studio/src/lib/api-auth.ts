import "server-only";

import { NextResponse } from "next/server";
import { requireMember } from "./supabase/server";
import { aiConfigured } from "./ai/config";

/** API 라우트용: 로그인 + 멤버 확인. 실패하면 응답 객체를 돌려줍니다. */
export async function apiMember(opts: { needAi?: boolean } = {}) {
  const { sb, user, member } = await requireMember();
  if (!user) return { error: NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 }) } as const;
  if (!member) return { error: NextResponse.json({ error: "멤버만 사용할 수 있습니다." }, { status: 403 }) } as const;
  if (opts.needAi && !aiConfigured())
    return { error: NextResponse.json({ error: "AI 연동 준비 중입니다 (ANTHROPIC_API_KEY 미설정)." }, { status: 503 }) } as const;
  return { sb, user, member } as const;
}
