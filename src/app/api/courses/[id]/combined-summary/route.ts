import { NextRequest, NextResponse, after } from "next/server";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { runSummaryRound } from "@/lib/summary/run-round";

// The first round runs in this invocation's after(); if it doesn't finish,
// run-round.ts chains further rounds as separate invocations, each getting
// this same budget — see that file for why one invocation can't just loop.
export const maxDuration = 60;

function supabaseNotConfiguredResponse() {
  return NextResponse.json(
    { error: "Supabase 환경변수가 설정되지 않았습니다. .env.local을 확인하세요." },
    { status: 503 },
  );
}

/**
 * Generates one combined summary directly from the selected sessions' raw
 * materials (never from their individual summaries, even if those exist —
 * keeps cost down and avoids compounding errors across regenerations).
 * Returns immediately with a "generating" row; the client polls
 * GET /api/combined-summaries/[id] until status flips to "done" or "error".
 */
export async function POST(request: NextRequest, ctx: RouteContext<"/api/courses/[id]/combined-summary">) {
  if (!isSupabaseConfigured()) return supabaseNotConfiguredResponse();
  const { id: courseId } = await ctx.params;

  const body = await request.json().catch(() => null);
  const sessionIds = body?.lectureSessionIds;
  if (!Array.isArray(sessionIds) || sessionIds.length === 0 || !sessionIds.every((v) => typeof v === "string")) {
    return NextResponse.json({ error: "lectureSessionIds 배열이 필요합니다." }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("id, subject")
    .eq("id", courseId)
    .maybeSingle();
  if (courseError) return NextResponse.json({ error: courseError.message }, { status: 500 });
  if (!course) return NextResponse.json({ error: "강의를 찾을 수 없습니다." }, { status: 404 });

  const { data: sessions, error: sessionsError } = await supabase
    .from("lecture_sessions")
    .select("*")
    .in("id", sessionIds)
    .eq("course_id", courseId);
  if (sessionsError) return NextResponse.json({ error: sessionsError.message }, { status: 500 });
  if (!sessions || sessions.length !== sessionIds.length) {
    return NextResponse.json({ error: "선택한 수업 중 이 강의에 속하지 않는 항목이 있습니다." }, { status: 400 });
  }

  const { data: inserted, error: insertError } = await supabase
    .from("combined_summaries")
    .insert({ course_id: courseId, version: 1, status: "generating" })
    .select("*")
    .single();
  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

  const { error: linkError } = await supabase
    .from("combined_summary_sessions")
    .insert(sessionIds.map((lectureSessionId) => ({ combined_summary_id: inserted.id, lecture_session_id: lectureSessionId })));
  if (linkError) return NextResponse.json({ error: linkError.message }, { status: 500 });

  const baseUrl = new URL(request.url).origin;
  after(() => runSummaryRound("combined", inserted.id, baseUrl));

  return NextResponse.json({ combinedSummary: inserted }, { status: 202 });
}
