import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { SESSION_FILE_CONFIG, isSessionFileType } from "@/lib/lecture-sessions";

function supabaseNotConfiguredResponse() {
  return NextResponse.json(
    { error: "Supabase 환경변수가 설정되지 않았습니다. .env.local을 확인하세요." },
    { status: 503 },
  );
}

export async function DELETE(request: NextRequest, ctx: RouteContext<"/api/lecture-sessions/[id]/files">) {
  if (!isSupabaseConfigured()) return supabaseNotConfiguredResponse();
  const { id: sessionId } = await ctx.params;

  const type = request.nextUrl.searchParams.get("type");
  if (!isSessionFileType(type)) {
    return NextResponse.json({ error: "type 쿼리 파라미터가 필요합니다 (lecture_pdf | stt_txt)." }, { status: 400 });
  }

  const config = SESSION_FILE_CONFIG[type];
  const path = `${sessionId}.${config.extension}`;

  const supabase = createServiceClient();

  const { error: removeError } = await supabase.storage.from(config.bucket).remove([path]);
  if (removeError) return NextResponse.json({ error: removeError.message }, { status: 500 });

  const { data: session, error } = await supabase
    .from("lecture_sessions")
    .update({ [config.pathColumn]: null, updated_at: new Date().toISOString() })
    .eq("id", sessionId)
    .select("*")
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!session) return NextResponse.json({ error: "수업을 찾을 수 없습니다." }, { status: 404 });

  return NextResponse.json({ session });
}
