import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";

function supabaseNotConfiguredResponse() {
  return NextResponse.json(
    { error: "Supabase 환경변수가 설정되지 않았습니다. .env.local을 확인하세요." },
    { status: 503 },
  );
}

/**
 * Creates an individual summary row for one lecture session in "generating"
 * status and returns immediately — it does not run any generation itself.
 * The detail page's tick loop drives every round via POST
 * /api/summary-round (see run-round.ts for why rounds can't be chained
 * server-side on Vercel).
 */
export async function POST(_request: NextRequest, ctx: RouteContext<"/api/lecture-sessions/[id]/summary">) {
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

  return NextResponse.json({ summary: inserted }, { status: 202 });
}
