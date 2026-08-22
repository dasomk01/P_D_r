import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";

function supabaseNotConfiguredResponse() {
  return NextResponse.json(
    { error: "Supabase 환경변수가 설정되지 않았습니다. .env.local을 확인하세요." },
    { status: 503 },
  );
}

export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/courses/[id]/lecture-sessions">,
) {
  if (!isSupabaseConfigured()) return supabaseNotConfiguredResponse();
  const { id: courseId } = await ctx.params;

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("lecture_sessions")
    .select("*")
    .eq("course_id", courseId)
    .order("date", { ascending: false })
    .order("period", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ sessions: data ?? [] });
}
