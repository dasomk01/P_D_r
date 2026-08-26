import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { runOneQuestionRound } from "@/lib/questions/run-round";

// One round's own Gemini call is wall-clock-bounded well under this (see
// generate-questions.ts), leaving headroom for material downloads and, on
// the finishing round, parsing + inserting the resulting question rows.
export const maxDuration = 60;

/**
 * Advances exactly one bounded round of question generation for a
 * "generating" batch and reports its state afterward. Called repeatedly by
 * the browser while a batch is generating (questions hub page's tick loop) —
 * rounds are NOT chained server-side, same reason as /api/summary-round
 * (Vercel blocks a function calling back into its own deployment).
 */
export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase 환경변수가 설정되지 않았습니다." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const id = body?.id as string | undefined;
  if (typeof id !== "string") {
    return NextResponse.json({ error: "id가 필요합니다." }, { status: 400 });
  }

  await runOneQuestionRound(id);

  const supabase = createServiceClient();
  const { data: row, error } = await supabase.from("question_batches").select("status, round").eq("id", id).maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!row) return NextResponse.json({ error: "문제 생성 배치를 찾을 수 없습니다." }, { status: 404 });

  return NextResponse.json({ status: row.status, round: row.round });
}
