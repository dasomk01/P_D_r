import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { isCourseStatus } from "@/lib/courses";

function supabaseNotConfiguredResponse() {
  return NextResponse.json(
    { error: "Supabase 환경변수가 설정되지 않았습니다. .env.local을 확인하세요." },
    { status: 503 },
  );
}

export async function GET(_request: NextRequest, ctx: RouteContext<"/api/courses/[id]">) {
  if (!isSupabaseConfigured()) return supabaseNotConfiguredResponse();
  const { id } = await ctx.params;

  const supabase = createServiceClient();
  const { data, error } = await supabase.from("courses").select("*").eq("id", id).maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "강의를 찾을 수 없습니다." }, { status: 404 });

  return NextResponse.json({ course: data });
}

export async function PATCH(request: NextRequest, ctx: RouteContext<"/api/courses/[id]">) {
  if (!isSupabaseConfigured()) return supabaseNotConfiguredResponse();
  const { id } = await ctx.params;

  const body = await request.json().catch(() => null);
  const update: Record<string, unknown> = {};

  if (body?.name !== undefined) {
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name) return NextResponse.json({ error: "강의명을 입력하세요." }, { status: 400 });
    update.name = name;
  }
  if (body?.subject !== undefined) {
    const subject = typeof body.subject === "string" ? body.subject.trim() : "";
    if (!subject) return NextResponse.json({ error: "과목을 입력하세요." }, { status: 400 });
    update.subject = subject;
  }
  if (body?.professor !== undefined) {
    const professor = typeof body.professor === "string" ? body.professor.trim() : "";
    update.professor = professor || null;
  }
  if (body?.status !== undefined) {
    if (!isCourseStatus(body.status)) {
      return NextResponse.json({ error: "status는 active 또는 archived여야 합니다." }, { status: 400 });
    }
    update.status = body.status;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "수정할 필드가 없습니다." }, { status: 400 });
  }
  update.updated_at = new Date().toISOString();

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("courses")
    .update(update)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "강의를 찾을 수 없습니다." }, { status: 404 });

  return NextResponse.json({ course: data });
}

export async function DELETE(request: NextRequest, ctx: RouteContext<"/api/courses/[id]">) {
  if (!isSupabaseConfigured()) return supabaseNotConfiguredResponse();
  const { id } = await ctx.params;

  const body = await request.json().catch(() => ({}));
  if (body?.confirm !== true) {
    return NextResponse.json(
      { error: "삭제를 확인하려면 confirm: true를 함께 보내세요." },
      { status: 400 },
    );
  }

  const supabase = createServiceClient();

  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("id")
    .eq("id", id)
    .maybeSingle();

  if (courseError) return NextResponse.json({ error: courseError.message }, { status: 500 });
  if (!course) return NextResponse.json({ error: "강의를 찾을 수 없습니다." }, { status: 404 });

  // DB rows cascade via FK on delete, but Storage objects do not — clean those up first.
  const [studyMaterials, lectureSessions, summaries, combinedSummaries] = await Promise.all([
    supabase.from("study_materials").select("storage_path").eq("course_id", id),
    supabase.from("lecture_sessions").select("lecture_pdf_path, stt_path").eq("course_id", id),
    supabase.from("summaries").select("docx_path, pdf_path").eq("course_id", id),
    supabase.from("combined_summaries").select("docx_path, pdf_path").eq("course_id", id),
  ]);

  const worksheetPaths = (studyMaterials.data ?? []).map((r) => r.storage_path).filter(Boolean);
  const lecturePdfPaths = (lectureSessions.data ?? [])
    .map((r) => r.lecture_pdf_path)
    .filter((v): v is string => Boolean(v));
  const sttPaths = (lectureSessions.data ?? [])
    .map((r) => r.stt_path)
    .filter((v): v is string => Boolean(v));
  const docxPaths = [...(summaries.data ?? []), ...(combinedSummaries.data ?? [])]
    .map((r) => r.docx_path)
    .filter((v): v is string => Boolean(v));
  const pdfPaths = [...(summaries.data ?? []), ...(combinedSummaries.data ?? [])]
    .map((r) => r.pdf_path)
    .filter((v): v is string => Boolean(v));

  await Promise.all([
    worksheetPaths.length ? supabase.storage.from("worksheet-pdf").remove(worksheetPaths) : null,
    lecturePdfPaths.length ? supabase.storage.from("lecture-pdf").remove(lecturePdfPaths) : null,
    sttPaths.length ? supabase.storage.from("stt-txt").remove(sttPaths) : null,
    docxPaths.length ? supabase.storage.from("summary-docx").remove(docxPaths) : null,
    pdfPaths.length ? supabase.storage.from("summary-pdf").remove(pdfPaths) : null,
  ]);

  const { error: deleteError } = await supabase.from("courses").delete().eq("id", id);
  if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
