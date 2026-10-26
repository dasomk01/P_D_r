import { NextResponse, type NextRequest } from "next/server";
import { apiMember } from "@/lib/api-auth";
import { runToonQc } from "@/lib/toon-qc";

export const maxDuration = 300;

/** 사이트의 '이미지 검수' 버튼 — 로그인한 멤버 권한(RLS)으로 실행 */
export async function POST(req: NextRequest) {
  const auth = await apiMember();
  if ("error" in auth) return auth.error;
  const { contentId, recheck } = (await req.json()) as { contentId: string; recheck?: boolean };
  try {
    return NextResponse.json(await runToonQc(auth.sb, contentId, { recheck, vision: true, promote: true }));
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 400 });
  }
}
