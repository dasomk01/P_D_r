import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";

function supabaseNotConfiguredResponse() {
  return NextResponse.json(
    { error: "Supabase 환경변수가 설정되지 않았습니다. .env.local을 확인하세요." },
    { status: 503 },
  );
}

/**
 * Creates a question-generation batch (야마그대로/야마변형/티야/탈야 across the
 * selected lecture sessions) in "generating" status and returns immediately —
 * it does not run any generation itself. The questions hub page's tick loop
 * drives every round via POST /api/question-round (see
 * src/lib/questions/run-round.ts for why rounds can't chain server-side).
 */
export async function POST(request: NextRequest, ctx: RouteContext<"/api/courses/[id]/question-batches">) {
  if (!isSupabaseConfigured()) return supabaseNotConfiguredResponse();
  const { id: courseId } = await ctx.params;

  const body = await request.json().catch(() => null);
  const sessionIds = body?.lectureSessionIds;
  if (!Array.isArray(sessionIds) || sessionIds.length === 0 || !sessionIds.every((v) => typeof v === "string")) {
    return NextResponse.json({ error: "lectureSessionIds 배열이 필요합니다." }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data: course, error: courseError } = await supabase.from("courses").select("id").eq("id", courseId).maybeSingle();
  if (courseError) return NextResponse.json({ error: courseError.message }, { status: 500 });
  if (!course) return NextResponse.json({ error: "강의를 찾을 수 없습니다." }, { status: 404 });

  const { data: sessions, error: sessionsError } = await supabase
    .from("lecture_sessions")
    .select("id")
    .in("id", sessionIds)
    .eq("course_id", courseId);
  if (sessionsError) return NextResponse.json({ error: sessionsError.message }, { status: 500 });
  if (!sessions || sessions.length !== sessionIds.length) {
    return NextResponse.json({ error: "선택한 수업 중 이 강의에 속하지 않는 항목이 있습니다." }, { status: 400 });
  }

  const { data: inserted, error: insertError } = await supabase
    .from("question_batches")
    .insert({ course_id: courseId, status: "generating" })
    .select("*")
    .single();
  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

  const { error: linkError } = await supabase
    .from("question_batch_sessions")
    .insert(sessionIds.map((lectureSessionId) => ({ question_batch_id: inserted.id, lecture_session_id: lectureSessionId })));
  if (linkError) return NextResponse.json({ error: linkError.message }, { status: 500 });

  return NextResponse.json({ batch: inserted }, { status: 202 });
}

/** Lists question-generation batches for a course, most recent first. */
export async function GET(_request: NextRequest, ctx: RouteContext<"/api/courses/[id]/question-batches">) {
  if (!isSupabaseConfigured()) return supabaseNotConfiguredResponse();
  const { id: courseId } = await ctx.params;

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("question_batches")
    .select("id, status, round, error_message, created_at, question_batch_sessions(lecture_session:lecture_sessions(id, date, period, part_name))")
    .eq("course_id", courseId)
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ batches: data ?? [] });
}
