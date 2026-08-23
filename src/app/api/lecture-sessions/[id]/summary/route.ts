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
 * Generates an individual summary for one lecture session (uses only that
 * session's materials). Returns immediately with a "generating" row and
 * does the actual Claude call + rendering in the background — a full
 * summary routinely takes longer than a synchronous request should block
 * on. The client polls GET /api/summaries/[id] until status flips to
 * "done" or "error".
 */
export async function POST(request: NextRequest, ctx: RouteContext<"/api/lecture-sessions/[id]/summary">) {
  if (!isSupabaseConfigured()) return supabaseNotConfiguredResponse();
  const { id: sessionId } = await ctx.params;

  const supabase = createServiceClient();

  const { data: session, error: sessionError } = await supabase
    .from("lecture_sessions")
    .select("*")
    .eq("id", sessionId)
    .maybeSingle();
  if (sessionError) return NextResponse.json({ error: sessionError.message }, { status: 500 });
  if (!session) return NextResponse.json({ error: "수업을 찾을 수 없습니다." }, { status: 404 });

  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("id, subject")
    .eq("id", session.course_id)
    .maybeSingle();
  if (courseError) return NextResponse.json({ error: courseError.message }, { status: 500 });
  if (!course) return NextResponse.json({ error: "강의를 찾을 수 없습니다." }, { status: 404 });

  const { count } = await supabase
    .from("summaries")
    .select("id", { count: "exact", head: true })
    .eq("lecture_session_id", sessionId);

  const { data: inserted, error: insertError } = await supabase
    .from("summaries")
    .insert({ lecture_session_id: sessionId, course_id: course.id, version: (count ?? 0) + 1, status: "generating" })
    .select("*")
    .single();
  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

  const baseUrl = new URL(request.url).origin;
  after(() => runSummaryRound("individual", inserted.id, baseUrl));

  return NextResponse.json({ summary: inserted }, { status: 202 });
}
