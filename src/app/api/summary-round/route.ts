import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { runOneRound, type SummaryKind } from "@/lib/summary/run-round";

// One round's own Claude call is wall-clock-bounded well under this (see
// generate-summary.ts), leaving headroom for material downloads and, on the
// finishing round, docx/pdf rendering + upload.
export const maxDuration = 60;

/**
 * Advances exactly one bounded round of generation for a "generating"
 * summary/combined-summary row and reports its state afterward. Called
 * repeatedly by the browser while a summary is generating (see the detail
 * pages' tick loop) — rounds are NOT chained server-side, because Vercel's
 * own infrastructure detects a function calling back into its own
 * deployment as a request loop and blocks it (508 Loop Detected). Not
 * authenticated, same posture as the rest of this single-user app's API.
 */
export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase 환경변수가 설정되지 않았습니다." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const kind = body?.kind as SummaryKind | undefined;
  const id = body?.id as string | undefined;
  if ((kind !== "individual" && kind !== "combined") || typeof id !== "string") {
    return NextResponse.json({ error: "kind/id가 필요합니다." }, { status: 400 });
  }

  await runOneRound(kind, id);

  const supabase = createServiceClient();
  const table = kind === "individual" ? "summaries" : "combined_summaries";
  const { data: row, error } = await supabase.from(table).select("status, round").eq("id", id).maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!row) return NextResponse.json({ error: "정리본을 찾을 수 없습니다." }, { status: 404 });

  return NextResponse.json({ status: row.status, round: row.round });
}
