import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { isQuestionCategory } from "@/lib/questions";

function supabaseNotConfiguredResponse() {
  return NextResponse.json(
    { error: "Supabase 환경변수가 설정되지 않았습니다. .env.local을 확인하세요." },
    { status: 503 },
  );
}

/**
 * Lists generated questions for a course, optionally filtered by category
 * (?category=야마그대로 등). Excludes rejected questions; pending ones
 * (flagged by Gemini as needing review — see review_notes) are still
 * included so the pool isn't blocked on a manual moderation step, but the
 * UI shows them with a visible badge.
 */
export async function GET(request: NextRequest, ctx: RouteContext<"/api/courses/[id]/questions">) {
  if (!isSupabaseConfigured()) return supabaseNotConfiguredResponse();
  const { id: courseId } = await ctx.params;

  const categoryParam = request.nextUrl.searchParams.get("category");
  if (categoryParam && !isQuestionCategory(categoryParam)) {
    return NextResponse.json({ error: "알 수 없는 카테고리입니다." }, { status: 400 });
  }

  const supabase = createServiceClient();
  let query = supabase
    .from("questions")
    .select("id, category, content_json, review_status, review_notes, created_at")
    .eq("course_id", courseId)
    .neq("review_status", "rejected")
    .order("created_at", { ascending: true });
  if (categoryParam) query = query.eq("category", categoryParam);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ questions: data ?? [] });
}
