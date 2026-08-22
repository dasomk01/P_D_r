import { Calendar } from "@/components/calendar";

export default function SummaryCalendarPage() {
  return (
    <div className="flex flex-1 flex-col items-center gap-6 px-6 py-12">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">📚 정리본</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          날짜를 선택해 1~8교시 정리본을 관리하세요.
        </p>
      </div>
      <Calendar />
    </div>
  );
}
