import { NextRequest, NextResponse, after } from "next/server";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { generateSummaryText } from "@/lib/ai/generate-summary";
import { renderAndUploadSummary } from "@/lib/summary/generate-and-store";
import { individualSummaryPath } from "@/lib/summary/storage";

// Generation itself happens in `after()`, past the point this handler
// returns its response — but on Vercel that background work is still
// bounded by the same maxDuration as the request. Use the longest duration
// the current plan allows (see README for the Hobby-plan caveat: long
// combined summaries can still exceed this and leave a row stuck at
// status "generating").
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

  after(async () => {
    try {
      const taggedText = await generateSummaryText(supabase, [session], { subject: course.subject, combined: false });

      const docxPath = individualSummaryPath(course.id, inserted.id, "docx");
      const pdfPath = individualSummaryPath(course.id, inserted.id, "pdf");
      await renderAndUploadSummary(supabase, taggedText, `${course.subject}_솜리본`, docxPath, pdfPath);

      await supabase
        .from("summaries")
        .update({ content: taggedText, docx_path: docxPath, pdf_path: pdfPath, status: "done" })
        .eq("id", inserted.id);
    } catch (err) {
      const message = err instanceof Error ? err.message : "정리본 생성에 실패했습니다.";
      await supabase.from("summaries").update({ status: "error", error_message: message }).eq("id", inserted.id);
    }
  });

  return NextResponse.json({ summary: inserted }, { status: 202 });
}
