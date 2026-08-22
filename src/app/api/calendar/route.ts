import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { isValidMonthKey } from "@/lib/date";
import { isValidDateKey } from "@/lib/lecture-sessions";

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
      .from("lecture_sessions")
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
      .from("lecture_sessions")
      .select("id, period, professor, part_name, course:courses(id, name, subject)")
      .eq("date", date)
      .order("period");

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ sessions: data ?? [] });
  }

  return NextResponse.json({ error: "month 또는 date 쿼리 파라미터가 필요합니다." }, { status: 400 });
}
