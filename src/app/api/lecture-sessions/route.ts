import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { isValidDateKey, isValidPeriod } from "@/lib/lecture-sessions";

function supabaseNotConfiguredResponse() {
  return NextResponse.json(
    { error: "Supabase 환경변수가 설정되지 않았습니다. .env.local을 확인하세요." },
    { status: 503 },
  );
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) return supabaseNotConfiguredResponse();

  const body = await request.json().catch(() => null);
  const courseId = body?.course_id;
  const date = body?.date;
  const period = Number(body?.period);
  const professor = typeof body?.professor === "string" ? body.professor.trim() || null : null;
  const partName = typeof body?.part_name === "string" ? body.part_name.trim() || null : null;

  if (typeof courseId !== "string" || !courseId) {
    return NextResponse.json({ error: "course_id가 필요합니다." }, { status: 400 });
  }
  if (typeof date !== "string" || !isValidDateKey(date)) {
    return NextResponse.json({ error: "date는 YYYY-MM-DD 형식이어야 합니다." }, { status: 400 });
  }
  if (!isValidPeriod(period)) {
    return NextResponse.json({ error: "period는 1~8 사이의 정수여야 합니다." }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("id")
    .eq("id", courseId)
    .maybeSingle();
  if (courseError) return NextResponse.json({ error: courseError.message }, { status: 500 });
  if (!course) return NextResponse.json({ error: "강의를 찾을 수 없습니다." }, { status: 404 });

  const { data, error } = await supabase
    .from("lecture_sessions")
    .insert({ course_id: courseId, date, period, professor, part_name: partName })
    .select("*")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "이미 그 날짜/교시에 다른 수업이 등록되어 있습니다." },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ session: data }, { status: 201 });
}
