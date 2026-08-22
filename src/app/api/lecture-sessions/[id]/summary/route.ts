import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { generateSummaryText } from "@/lib/ai/generate-summary";
import { renderAndUploadSummary } from "@/lib/summary/generate-and-store";
import { individualSummaryPath } from "@/lib/summary/storage";

// Summary generation can stream for a while (large PDFs + long output, with
// automatic continuation past Claude's max_tokens boundary). Use the longest
// duration the current Vercel plan allows — see README for the plan caveat.
export const maxDuration = 60;

function supabaseNotConfiguredResponse() {
  return NextResponse.json(
    { error: "Supabase 환경변수가 설정되지 않았습니다. .env.local을 확인하세요." },
    { status: 503 },
  );
}

/** Generates an individual summary for one lecture session (uses only that session's materials). */
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

  let taggedText: string;
  try {
    taggedText = await generateSummaryText(supabase, [session], { subject: course.subject, combined: false });
  } catch (err) {
    const message = err instanceof Error ? err.message : "정리본 생성에 실패했습니다.";
    return NextResponse.json({ error: message }, { status: message.includes("API 키") ? 503 : 400 });
  }

  const { count } = await supabase
    .from("summaries")
    .select("id", { count: "exact", head: true })
    .eq("lecture_session_id", sessionId);

  const { data: inserted, error: insertError } = await supabase
    .from("summaries")
    .insert({ lecture_session_id: sessionId, course_id: course.id, content: taggedText, version: (count ?? 0) + 1 })
    .select("*")
    .single();
  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

  const docxPath = individualSummaryPath(course.id, inserted.id, "docx");
  const pdfPath = individualSummaryPath(course.id, inserted.id, "pdf");

  let urls: { docxUrl: string | null; pdfUrl: string | null };
  try {
    urls = await renderAndUploadSummary(supabase, taggedText, `${course.subject}_솜리본`, docxPath, pdfPath);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Word/PDF 생성에 실패했습니다." },
      { status: 500 },
    );
  }

  const { data: updated, error: updateError } = await supabase
    .from("summaries")
    .update({ docx_path: docxPath, pdf_path: pdfPath })
    .eq("id", inserted.id)
    .select("*")
    .single();
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  return NextResponse.json(
    { summary: { ...updated, docx_url: urls.docxUrl, pdf_url: urls.pdfUrl } },
    { status: 201 },
  );
}
