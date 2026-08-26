import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { QuestionContent } from "@/lib/questions";

function supabaseNotConfiguredResponse() {
  return NextResponse.json(
    { error: "Supabase 환경변수가 설정되지 않았습니다. .env.local을 확인하세요." },
    { status: 503 },
  );
}

/** Grades one answer against a question and records the attempt (used for 오답노트). */
export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) return supabaseNotConfiguredResponse();

  const body = await request.json().catch(() => null);
  const questionId = body?.questionId as string | undefined;
  const selected = body?.selected;
  if (typeof questionId !== "string" || !Array.isArray(selected) || !selected.every((v) => Number.isInteger(v))) {
    return NextResponse.json({ error: "questionId와 selected(정수 배열)가 필요합니다." }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data: question, error: questionError } = await supabase
    .from("questions")
    .select("content_json")
    .eq("id", questionId)
    .maybeSingle();
  if (questionError) return NextResponse.json({ error: questionError.message }, { status: 500 });
  if (!question) return NextResponse.json({ error: "문제를 찾을 수 없습니다." }, { status: 404 });

  const content = question.content_json as QuestionContent;
  const correct = selected.length === 1 && selected[0] === content.answerIndex;

  const { error: insertError } = await supabase
    .from("attempts")
    .insert({ question_id: questionId, selected, correct, is_wrong: !correct });
  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

  return NextResponse.json({ correct, answerIndex: content.answerIndex, explanation: content.explanation });
}
