import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { SESSION_FILE_CONFIG, isSessionFileType } from "@/lib/lecture-sessions";

function supabaseNotConfiguredResponse() {
  return NextResponse.json(
    { error: "Supabase 환경변수가 설정되지 않았습니다. .env.local을 확인하세요." },
    { status: 503 },
  );
}

/** Step 1 of the direct-to-Supabase upload flow — see study-material/init for why. */
export async function POST(request: NextRequest, ctx: RouteContext<"/api/lecture-sessions/[id]/files/init">) {
  if (!isSupabaseConfigured()) return supabaseNotConfiguredResponse();
  const { id: sessionId } = await ctx.params;

  const body = await request.json().catch(() => null);
  const type = body?.type;
  if (!isSessionFileType(type)) {
    return NextResponse.json({ error: "type은 lecture_pdf 또는 stt_txt여야 합니다." }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data: session, error: sessionError } = await supabase
    .from("lecture_sessions")
    .select("id")
    .eq("id", sessionId)
    .maybeSingle();
  if (sessionError) return NextResponse.json({ error: sessionError.message }, { status: 500 });
  if (!session) return NextResponse.json({ error: "수업을 찾을 수 없습니다." }, { status: 404 });

  const config = SESSION_FILE_CONFIG[type];
  const path = `${sessionId}.${config.extension}`;

  const { data: signed, error: signError } = await supabase.storage
    .from(config.bucket)
    .createSignedUploadUrl(path, { upsert: true });
  if (signError) return NextResponse.json({ error: signError.message }, { status: 500 });

  return NextResponse.json({ bucket: config.bucket, path, token: signed.token, contentType: config.contentType });
}
