import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { SESSION_FILE_CONFIG, isSessionFileType } from "@/lib/lecture-sessions";

const SIGNED_URL_TTL_SECONDS = 60 * 60;

function supabaseNotConfiguredResponse() {
  return NextResponse.json(
    { error: "Supabase 환경변수가 설정되지 않았습니다. .env.local을 확인하세요." },
    { status: 503 },
  );
}

/** Step 2: record the now-uploaded file's path on the session row. */
export async function POST(
  request: NextRequest,
  ctx: RouteContext<"/api/lecture-sessions/[id]/files/complete">,
) {
  if (!isSupabaseConfigured()) return supabaseNotConfiguredResponse();
  const { id: sessionId } = await ctx.params;

  const body = await request.json().catch(() => null);
  const type = body?.type;
  if (!isSessionFileType(type)) {
    return NextResponse.json({ error: "type은 lecture_pdf 또는 stt_txt여야 합니다." }, { status: 400 });
  }

  const config = SESSION_FILE_CONFIG[type];
  const path = `${sessionId}.${config.extension}`;

  const supabase = createServiceClient();
  const { data: session, error } = await supabase
    .from("lecture_sessions")
    .update({ [config.pathColumn]: path, updated_at: new Date().toISOString() })
    .eq("id", sessionId)
    .select("*")
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!session) return NextResponse.json({ error: "수업을 찾을 수 없습니다." }, { status: 404 });

  const { data: signed } = await supabase.storage.from(config.bucket).createSignedUrl(path, SIGNED_URL_TTL_SECONDS);

  return NextResponse.json({ session, url: signed?.signedUrl ?? null });
}
