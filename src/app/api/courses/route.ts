import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { isCourseStatus } from "@/lib/courses";

function supabaseNotConfiguredResponse() {
  return NextResponse.json(
    { error: "Supabase 환경변수가 설정되지 않았습니다. .env.local을 확인하세요." },
    { status: 503 },
  );
}

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured()) return supabaseNotConfiguredResponse();

  const status = request.nextUrl.searchParams.get("status");
  if (status && !isCourseStatus(status)) {
    return NextResponse.json({ error: "status는 active 또는 archived여야 합니다." }, { status: 400 });
  }

  const supabase = createServiceClient();
  let query = supabase.from("courses").select("*").order("updated_at", { ascending: false });
  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ courses: data ?? [] });
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) return supabaseNotConfiguredResponse();

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const subject = typeof body?.subject === "string" ? body.subject.trim() : "";
  const professor = typeof body?.professor === "string" ? body.professor.trim() : "";

  if (!name || !subject) {
    return NextResponse.json({ error: "강의명과 과목을 입력하세요." }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("courses")
    .insert({ name, subject, professor: professor || null })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ course: data }, { status: 201 });
}
