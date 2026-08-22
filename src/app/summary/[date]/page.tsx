import Link from "next/link";
import { notFound } from "next/navigation";
import { PERIODS, type Lecture, isValidDateKey } from "@/lib/lectures";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";

function formatDateLabel(dateKey: string): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "short" });
}

export default async function PeriodGridPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  if (!isValidDateKey(date)) notFound();

  const lecturesByPeriod = new Map<number, Lecture>();
  let loadError: string | null = null;

  if (!isSupabaseConfigured()) {
    loadError = "Supabase 환경변수가 설정되지 않아 저장된 정리본을 불러올 수 없습니다. 새로 저장하려면 환경변수를 먼저 연결하세요.";
  } else {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("lectures")
      .select("*")
      .eq("date", date)
      .order("period");

    if (error) {
      loadError = error.message;
    } else {
      for (const lecture of (data ?? []) as Lecture[]) {
        lecturesByPeriod.set(lecture.period, lecture);
      }
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-12">
      <div>
        <Link
          href="/summary"
          className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          ← 달력으로
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          {formatDateLabel(date)}
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">교시를 선택하세요.</p>
      </div>

      {loadError && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:bg-amber-950 dark:text-amber-300">
          {loadError}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {PERIODS.map((period) => {
          const lecture = lecturesByPeriod.get(period);
          return (
            <Link
              key={period}
              href={`/summary/${date}/${period}`}
              className="flex flex-col items-start gap-1 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            >
              <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                {period}교시
              </span>
              {lecture ? (
                <>
                  <span className="font-medium text-zinc-900 dark:text-zinc-50">{lecture.subject}</span>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">{lecture.title}</span>
                </>
              ) : (
                <span className="text-sm text-zinc-400 dark:text-zinc-600">비어있음</span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
