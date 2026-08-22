import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { SUMMARY_DOCX_BUCKET, SUMMARY_PDF_BUCKET } from "@/lib/summary/storage";

const SIGNED_URL_TTL_SECONDS = 60 * 60;

function supabaseNotConfiguredResponse() {
  return NextResponse.json(
    { error: "Supabase 환경변수가 설정되지 않았습니다. .env.local을 확인하세요." },
    { status: 503 },
  );
}

export async function GET(_request: NextRequest, ctx: RouteContext<"/api/summaries/[id]">) {
  if (!isSupabaseConfigured()) return supabaseNotConfiguredResponse();
  const { id } = await ctx.params;

  const supabase = createServiceClient();
  const { data: summary, error } = await supabase
    .from("summaries")
    .select("*, lecture_session:lecture_sessions(id, date, period, part_name, professor)")
    .eq("id", id)
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!summary) return NextResponse.json({ error: "정리본을 찾을 수 없습니다." }, { status: 404 });

  const [docxSigned, pdfSigned] = await Promise.all([
    summary.docx_path
      ? supabase.storage.from(SUMMARY_DOCX_BUCKET).createSignedUrl(summary.docx_path, SIGNED_URL_TTL_SECONDS)
      : Promise.resolve({ data: null }),
    summary.pdf_path
      ? supabase.storage.from(SUMMARY_PDF_BUCKET).createSignedUrl(summary.pdf_path, SIGNED_URL_TTL_SECONDS)
      : Promise.resolve({ data: null }),
  ]);

  return NextResponse.json({
    summary: { ...summary, docx_url: docxSigned.data?.signedUrl ?? null, pdf_url: pdfSigned.data?.signedUrl ?? null },
  });
}

export async function DELETE(_request: NextRequest, ctx: RouteContext<"/api/summaries/[id]">) {
  if (!isSupabaseConfigured()) return supabaseNotConfiguredResponse();
  const { id } = await ctx.params;

  const supabase = createServiceClient();
  const { data: summary, error: fetchError } = await supabase
    .from("summaries")
    .select("docx_path, pdf_path")
    .eq("id", id)
    .maybeSingle();
  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 });
  if (!summary) return NextResponse.json({ error: "정리본을 찾을 수 없습니다." }, { status: 404 });

  await Promise.all([
    summary.docx_path ? supabase.storage.from(SUMMARY_DOCX_BUCKET).remove([summary.docx_path]) : null,
    summary.pdf_path ? supabase.storage.from(SUMMARY_PDF_BUCKET).remove([summary.pdf_path]) : null,
  ]);

  const { error: deleteError } = await supabase.from("summaries").delete().eq("id", id);
  if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
