import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";

function supabaseNotConfiguredResponse() {
  return NextResponse.json(
    { error: "Supabase 환경변수가 설정되지 않았습니다. .env.local을 확인하세요." },
    { status: 503 },
  );
}

/**
 * 오답노트: questions whose most recent attempt was wrong. A question that
 * was once wrong but has since been answered correctly drops off this list
 * — it tracks current standing, not history.
 */
export async function GET(_request: NextRequest, ctx: RouteContext<"/api/courses/[id]/questions/wrong">) {
  if (!isSupabaseConfigured()) return supabaseNotConfiguredResponse();
  const { id: courseId } = await ctx.params;

  const supabase = createServiceClient();

  const { data: questions, error: questionsError } = await supabase
    .from("questions")
    .select("id, category, content_json, review_status, review_notes, created_at")
    .eq("course_id", courseId)
    .neq("review_status", "rejected");
  if (questionsError) return NextResponse.json({ error: questionsError.message }, { status: 500 });
  if (!questions || questions.length === 0) return NextResponse.json({ questions: [] });

  const { data: attempts, error: attemptsError } = await supabase
    .from("attempts")
    .select("question_id, is_wrong, attempted_at")
    .in(
      "question_id",
      questions.map((q) => q.id),
    )
    .order("attempted_at", { ascending: true });
  if (attemptsError) return NextResponse.json({ error: attemptsError.message }, { status: 500 });

  const latestByQuestion = new Map<string, boolean>();
  for (const a of attempts ?? []) latestByQuestion.set(a.question_id, a.is_wrong);

  const wrong = questions.filter((q) => latestByQuestion.get(q.id) === true);
  return NextResponse.json({ questions: wrong });
}
