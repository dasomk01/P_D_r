"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useLive } from "@/lib/live";
import { getContents } from "@/lib/queries";
import { addDays, formatKDate, kstToday, monthGrid } from "@/lib/dates";
import type { Content, ProjectId } from "@/lib/types";
import { useStudio } from "@/components/studio-context";
import { Button, ErrorNote, Loading, NotConnected, PageHeader, StatusBadge, Tabs } from "@/components/ui";

export function CalendarView() {
  const params = useSearchParams();
  const today = kstToday();
  const initial = params.get("d") ?? today;
  const [cursor, setCursor] = useState(() => ({ y: Number(initial.slice(0, 4)), m: Number(initial.slice(5, 7)) - 1 }));
  const [day, setDay] = useState(initial);
  const [queueProject, setQueueProject] = useState<ProjectId>("korea-trip");
  const [error, setError] = useState<string | null>(null);
  const { projects } = useStudio();
  const { data: contents, reload } = useLive("calendar", () => getContents(), ["contents"]);
  if (!contents) return <Loading />;

  const grid = monthGrid(cursor.y, cursor.m);
  const monthKey = `${cursor.y}-${String(cursor.m + 1).padStart(2, "0")}`;
  const onDay = (d: string) => contents.filter((c) => c.scheduled_date === d).sort((a, b) => a.project_id.localeCompare(b.project_id) || a.sort_order - b.sort_order);

  const queue = contents
    .filter((c) => c.project_id === queueProject && c.status !== "approved")
    .sort((a, b) => (a.scheduled_date ?? "9999").localeCompare(b.scheduled_date ?? "9999") || a.sort_order - b.sort_order);

  async function swap(a: Content, b: Content) {
    setError(null);
    const r1 = await supabase().from("contents").update({ scheduled_date: b.scheduled_date, sort_order: b.sort_order }).eq("id", a.id);
    const r2 = await supabase().from("contents").update({ scheduled_date: a.scheduled_date, sort_order: a.sort_order }).eq("id", b.id);
    if (r1.error || r2.error) setError((r1.error ?? r2.error)!.message);
    void reload();
  }

  async function layoutDaily() {
    if (!confirm(`${queue.length}개 콘텐츠를 오늘부터 하루 하나씩 현재 순서대로 배치할까요?`)) return;
    for (let i = 0; i < queue.length; i++) {
      await supabase().from("contents").update({ scheduled_date: addDays(today, i), sort_order: i }).eq("id", queue[i].id);
    }
    void reload();
  }

  return (
    <div>
      <PageHeader eyebrow="Content calendar · Asia/Seoul" title="콘텐츠 캘린더" />

      <div className="mb-8 grid gap-3 md:grid-cols-2">
        {projects.map((p) => (
          <div key={p.id} className="flex items-center gap-3 text-sm">
            <span className={`h-3 w-3 rounded-full ${p.id === "korea-trip" ? "bg-navy" : "bg-rose-deep"}`} />
            <span>
              {p.name} — 매일 <b>{p.daily_time.slice(0, 5)}</b> KST 제작 목표
            </span>
          </div>
        ))}
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <button className="px-2 text-muted hover:text-navy" onClick={() => setCursor((c) => (c.m === 0 ? { y: c.y - 1, m: 11 } : { y: c.y, m: c.m - 1 }))} aria-label="이전 달">
              ←
            </button>
            <h2 className="display text-3xl text-navy">
              {cursor.y}. {String(cursor.m + 1).padStart(2, "0")}
            </h2>
            <button className="px-2 text-muted hover:text-navy" onClick={() => setCursor((c) => (c.m === 11 ? { y: c.y + 1, m: 0 } : { y: c.y, m: c.m + 1 }))} aria-label="다음 달">
              →
            </button>
          </div>
          <div className="grid grid-cols-7 border-l border-t hairline text-center text-[0.68rem] text-muted">
            {["월", "화", "수", "목", "금", "토", "일"].map((d) => (
              <div key={d} className="border-b border-r hairline py-1.5">
                {d}
              </div>
            ))}
            {grid.map((d) => {
              const items = onDay(d);
              const out = !d.startsWith(monthKey);
              return (
                <button
                  key={d}
                  onClick={() => setDay(d)}
                  className={`min-h-[64px] border-b border-r hairline p-1 text-left align-top md:min-h-[92px] ${out ? "bg-cream/30 text-muted/50" : ""} ${d === day ? "bg-rose-wash/50" : ""}`}
                >
                  <span className={`text-xs ${d === today ? "rounded-full bg-navy px-1.5 py-0.5 text-ivory" : ""}`}>{Number(d.slice(8))}</span>
                  <div className="mt-1 space-y-0.5">
                    {items.slice(0, 3).map((c) => (
                      <span
                        key={c.id}
                        className={`block truncate rounded-sm px-1 text-[0.62rem] leading-4 ${c.project_id === "korea-trip" ? "bg-navy text-ivory" : "bg-rose text-navy"} ${c.status === "approved" ? "opacity-60" : ""}`}
                      >
                        <span className="hidden md:inline">{c.title}</span>
                        <span className="md:hidden">•</span>
                      </span>
                    ))}
                    {items.length > 3 && <span className="text-[0.6rem]">+{items.length - 3}</span>}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6">
            <p className="eyebrow mb-3">{formatKDate(day)}</p>
            {onDay(day).length === 0 ? (
              <p className="text-sm text-muted">예정된 콘텐츠가 없습니다.</p>
            ) : (
              <ul className="space-y-2">
                {onDay(day).map((c) => {
                  const p = projects.find((x) => x.id === c.project_id);
                  return (
                    <li key={c.id}>
                      <Link href={`/studio/${c.id}`} className="card flex items-center gap-3 px-4 py-3 hover:border-navy/40">
                        <span className="text-xs text-muted">{p?.daily_time.slice(0, 5)}</span>
                        <span className="flex-1 truncate text-sm">{c.title}</span>
                        <StatusBadge status={c.status} />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div>
            <p className="eyebrow mb-3">제작 순서</p>
            <Tabs<ProjectId>
              value={queueProject}
              onChange={setQueueProject}
              items={[
                { value: "korea-trip", label: "KOREA TRIP" },
                { value: "med-toon", label: "TOON" },
              ]}
            />
            <ol className="mt-3 space-y-1.5" data-testid="queue">
              {queue.map((c, i) => (
                <li key={c.id} className="card flex items-center gap-2 px-3 py-2 text-sm">
                  <span className="w-20 shrink-0 text-xs text-muted">{c.scheduled_date ? c.scheduled_date.slice(5).replace("-", ".") : "미정"}</span>
                  <Link href={`/studio/${c.id}`} className="flex-1 truncate hover:underline">
                    {c.title}
                  </Link>
                  <button className="px-1 text-muted hover:text-navy disabled:opacity-30" disabled={i === 0} onClick={() => swap(c, queue[i - 1])} aria-label="위로">
                    ↑
                  </button>
                  <button className="px-1 text-muted hover:text-navy disabled:opacity-30" disabled={i === queue.length - 1} onClick={() => swap(c, queue[i + 1])} aria-label="아래로">
                    ↓
                  </button>
                </li>
              ))}
              {queue.length === 0 && <li className="text-sm text-muted">대기 중인 콘텐츠가 없습니다.</li>}
            </ol>
            {queue.length > 0 && (
              <Button variant="outline" size="sm" className="mt-3 w-full" onClick={layoutDaily}>
                오늘부터 하루 하나씩 배치
              </Button>
            )}
            <ErrorNote error={error} />
          </div>
          <NotConnected
            what="자동 제작 스케줄 실행"
            detail="위 시간(17:00 / 23:00 KST)은 ChatGPT 에 따로 설정된 예약의 목표 시간을 표시만 합니다. 이 웹사이트의 일정과 ChatGPT 예약 실행은 연결되어 있지 않으며, 인스타그램 게시·예약 게시도 하지 않습니다."
          />
        </aside>
      </div>
    </div>
  );
}
