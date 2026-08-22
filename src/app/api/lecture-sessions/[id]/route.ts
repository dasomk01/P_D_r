import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { SESSION_FILE_CONFIG, isValidDateKey, isValidPeriod } from "@/lib/lecture-sessions";

const SIGNED_URL_TTL_SECONDS = 60 * 60;

function supabaseNotConfiguredResponse() {
  return NextResponse.json(
    { error: "Supabase 환경변수가 설정되지 않았습니다. .env.local을 확인하세요." },
    { status: 503 },
  );
}

export async function GET(_request: NextRequest, ctx: RouteContext<"/api/lecture-sessions/[id]">) {
  if (!isSupabaseConfigured()) return supabaseNotConfiguredResponse();
  const { id } = await ctx.params;

  const supabase = createServiceClient();
  const { data: session, error } = await supabase
    .from("lecture_sessions")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!session) return NextResponse.json({ error: "수업을 찾을 수 없습니다." }, { status: 404 });

  const [lectureUrl, sttUrl] = await Promise.all([
    session.lecture_pdf_path
      ? supabase.storage
          .from(SESSION_FILE_CONFIG.lecture_pdf.bucket)
          .createSignedUrl(session.lecture_pdf_path, SIGNED_URL_TTL_SECONDS)
      : Promise.resolve({ data: null }),
    session.stt_path
      ? supabase.storage.from(SESSION_FILE_CONFIG.stt_txt.bucket).createSignedUrl(session.stt_path, SIGNED_URL_TTL_SECONDS)
      : Promise.resolve({ data: null }),
  ]);

  return NextResponse.json({
    session: {
      ...session,
      lecture_pdf_url: lectureUrl.data?.signedUrl ?? null,
      stt_url: sttUrl.data?.signedUrl ?? null,
    },
  });
}

export async function PATCH(request: NextRequest, ctx: RouteContext<"/api/lecture-sessions/[id]">) {
  if (!isSupabaseConfigured()) return supabaseNotConfiguredResponse();
  const { id } = await ctx.params;

  const body = await request.json().catch(() => null);
  const update: Record<string, unknown> = {};

  if (body?.date !== undefined) {
    if (typeof body.date !== "string" || !isValidDateKey(body.date)) {
      return NextResponse.json({ error: "date는 YYYY-MM-DD 형식이어야 합니다." }, { status: 400 });
    }
    update.date = body.date;
  }
  if (body?.period !== undefined) {
    const period = Number(body.period);
    if (!isValidPeriod(period)) {
      return NextResponse.json({ error: "period는 1~8 사이의 정수여야 합니다." }, { status: 400 });
    }
    update.period = period;
  }
  if (body?.professor !== undefined) {
    update.professor = typeof body.professor === "string" ? body.professor.trim() || null : null;
  }
  if (body?.part_name !== undefined) {
    update.part_name = typeof body.part_name === "string" ? body.part_name.trim() || null : null;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "수정할 필드가 없습니다." }, { status: 400 });
  }
  update.updated_at = new Date().toISOString();

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("lecture_sessions")
    .update(update)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "이미 그 날짜/교시에 다른 수업이 등록되어 있습니다." },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) return NextResponse.json({ error: "수업을 찾을 수 없습니다." }, { status: 404 });

  return NextResponse.json({ session: data });
}

export async function DELETE(_request: NextRequest, ctx: RouteContext<"/api/lecture-sessions/[id]">) {
  if (!isSupabaseConfigured()) return supabaseNotConfiguredResponse();
  const { id } = await ctx.params;

  const supabase = createServiceClient();
  const { data: session, error: sessionError } = await supabase
    .from("lecture_sessions")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (sessionError) return NextResponse.json({ error: sessionError.message }, { status: 500 });
  if (!session) return NextResponse.json({ error: "수업을 찾을 수 없습니다." }, { status: 404 });

  await Promise.all([
    session.lecture_pdf_path
      ? supabase.storage.from(SESSION_FILE_CONFIG.lecture_pdf.bucket).remove([session.lecture_pdf_path])
      : null,
    session.stt_path
      ? supabase.storage.from(SESSION_FILE_CONFIG.stt_txt.bucket).remove([session.stt_path])
      : null,
  ]);

  const { error: deleteError } = await supabase.from("lecture_sessions").delete().eq("id", id);
  if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
