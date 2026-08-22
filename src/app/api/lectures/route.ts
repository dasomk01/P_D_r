import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { isValidDateKey, isValidMonthKey, isValidPeriod } from "@/lib/lectures";

function supabaseNotConfiguredResponse() {
  return NextResponse.json(
    { error: "Supabase 환경변수가 설정되지 않았습니다. .env.local을 확인하세요." },
    { status: 503 },
  );
}

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured()) return supabaseNotConfiguredResponse();

  const searchParams = request.nextUrl.searchParams;
  const month = searchParams.get("month");
  const date = searchParams.get("date");

  const supabase = createServiceClient();

  if (month) {
    if (!isValidMonthKey(month)) {
      return NextResponse.json({ error: "month는 YYYY-MM 형식이어야 합니다." }, { status: 400 });
    }

    const [y, m] = month.split("-").map(Number);
    const monthStart = `${month}-01`;
    const nextMonth = new Date(y, m, 1);
    const monthEnd = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, "0")}-01`;

    const { data, error } = await supabase
      .from("lectures")
      .select("date")
      .gte("date", monthStart)
      .lt("date", monthEnd);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const counts: Record<string, number> = {};
    for (const row of data ?? []) {
      counts[row.date] = (counts[row.date] ?? 0) + 1;
    }

    return NextResponse.json({ counts });
  }

  if (date) {
    if (!isValidDateKey(date)) {
      return NextResponse.json({ error: "date는 YYYY-MM-DD 형식이어야 합니다." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("lectures")
      .select("*")
      .eq("date", date)
      .order("period");

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ lectures: data ?? [] });
  }

  return NextResponse.json({ error: "month 또는 date 쿼리 파라미터가 필요합니다." }, { status: 400 });
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) return supabaseNotConfiguredResponse();

  const body = await request.json().catch(() => null);
  const date = body?.date;
  const period = Number(body?.period);
  const subject = typeof body?.subject === "string" ? body.subject.trim() : "";
  const title = typeof body?.title === "string" ? body.title.trim() : "";

  if (typeof date !== "string" || !isValidDateKey(date)) {
    return NextResponse.json({ error: "date는 YYYY-MM-DD 형식이어야 합니다." }, { status: 400 });
  }
  if (!isValidPeriod(period)) {
    return NextResponse.json({ error: "period는 1~8 사이의 정수여야 합니다." }, { status: 400 });
  }
  if (!subject || !title) {
    return NextResponse.json({ error: "과목과 강의명을 입력하세요." }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("lectures")
    .upsert(
      { date, period, subject, title, updated_at: new Date().toISOString() },
      { onConflict: "date,period" },
    )
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ lecture: data });
}
