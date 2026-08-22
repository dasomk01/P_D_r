import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";

function supabaseNotConfiguredResponse() {
  return NextResponse.json(
    { error: "Supabase 환경변수가 설정되지 않았습니다. .env.local을 확인하세요." },
    { status: 503 },
  );
}

export async function GET(_request: NextRequest, ctx: RouteContext<"/api/courses/[id]/summaries">) {
  if (!isSupabaseConfigured()) return supabaseNotConfiguredResponse();
  const { id: courseId } = await ctx.params;

  const supabase = createServiceClient();

  const [individualRes, combinedRes] = await Promise.all([
    supabase
      .from("summaries")
      .select("id, version, status, created_at, lecture_session:lecture_sessions(id, date, period, part_name)")
      .eq("course_id", courseId)
      .order("created_at", { ascending: false }),
    supabase
      .from("combined_summaries")
      .select(
        "id, version, status, created_at, combined_summary_sessions(lecture_session:lecture_sessions(id, date, period, part_name))",
      )
      .eq("course_id", courseId)
      .order("created_at", { ascending: false }),
  ]);

  if (individualRes.error) return NextResponse.json({ error: individualRes.error.message }, { status: 500 });
  if (combinedRes.error) return NextResponse.json({ error: combinedRes.error.message }, { status: 500 });

  return NextResponse.json({
    individual: individualRes.data ?? [],
    combined: combinedRes.data ?? [],
  });
}
