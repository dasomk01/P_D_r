"use client";

import Link from "next/link";
import { useLive } from "@/lib/live";
import { getActivity, getAssets, getContents, getIdeas, getPlaces, getVotes, voteCounts } from "@/lib/queries";
import { addDays, formatKDate, kstToday, timeAgo } from "@/lib/dates";
import { PROJECT_IDS, STATUS_LABEL } from "@/lib/constants";
import { recommendNext, recommendationHref } from "@/lib/recommend";
import type { Activity, Content, IdeaStatus, ProjectId } from "@/lib/types";
import { useStudio } from "@/components/studio-context";
import { AssetImage } from "@/components/asset-image";
import { Avatar, Chip, Loading, SectionTitle, StatusBadge, TextLink } from "@/components/ui";

const ENTITY_LABEL: Record<string, string> = {
  ideas: "아이디어",
  places: "장소",
  trips: "여행 기록",
  assets: "자료",
  contents: "콘텐츠",
  content_versions: "새 버전",
  approvals: "승인",
  comments: "댓글",
};

function activityText(a: Activity) {
  const what = ENTITY_LABEL[a.entity] ?? a.entity;
  if (a.entity === "approvals") return "최종 승인";
  if (a.entity === "comments") return "댓글";
  if (a.action.startsWith("status:")) return `${what} → ${STATUS_LABEL[a.action.slice(7) as IdeaStatus] ?? a.action.slice(7)}`;
  return `${what} ${a.action === "insert" ? "등록" : a.action === "delete" ? "삭제" : "수정"}`;
}

export default function Dashboard() {
  const { projects, memberById, me } = useStudio();
  const today = kstToday();
  const { data } = useLive(
    "dashboard",
    async () => {
      const [ideas, contents, assets, activity, places, votes] = await Promise.all([
        getIdeas(),
        getContents(),
        getAssets(),
        getActivity(14),
        getPlaces(),
        getVotes(),
      ]);
      return { ideas, contents, assets: assets.slice(0, 8), activity, places, votes: voteCounts(votes) };
    },
    ["ideas", "contents", "assets", "activity", "places", "idea_votes"],
  );

  if (!data) return <Loading />;

  const stats = (pid: ProjectId) => {
    const ideas = data.ideas.filter((i) => i.project_id === pid);
    const contents = data.contents.filter((c) => c.project_id === pid);
    return {
      ideas: ideas.filter((i) => i.status !== "approved").length,
      ready: [...ideas.filter((i) => i.status === "ready" && !contents.some((c) => c.idea_id === i.id)), ...contents.filter((c) => c.status === "ready")].length,
      today: contents.filter((c) => c.scheduled_date === today).length,
      review: contents.filter((c) => c.status === "in_review").length,
      approved: contents.filter((c) => c.status === "approved").length,
    };
  };

  const upcoming = data.contents
    .filter((c) => c.scheduled_date && c.scheduled_date >= today && c.scheduled_date <= addDays(today, 13))
    .sort((a, b) => a.scheduled_date!.localeCompare(b.scheduled_date!));
  const reviewQueue = data.contents.filter((c) => c.status === "in_review" || c.status === "revising");

  return (
    <div className="space-y-14">
      <header className="flex flex-col gap-3 border-b hairline pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow mb-3">{formatKDate(today)} · Asia/Seoul</p>
          <h1 className="display text-5xl leading-[1.02] text-navy md:text-6xl">
            Good to see you, <em className="text-rose-deep">{me.display_name}</em>
          </h1>
        </div>
        <Link href="/ideas?new=1" className="self-start rounded-[3px] bg-navy px-5 py-3 text-sm tracking-wide text-ivory hover:bg-navy-soft md:self-auto">
          + 아이디어 한 줄 남기기
        </Link>
      </header>

      {/* Projects */}
      <section className="grid gap-5 md:grid-cols-2">
        {PROJECT_IDS.map((pid) => {
          const p = projects.find((x) => x.id === pid);
          const s = stats(pid);
          const rec = recommendNext({
            projectKind: pid === "korea-trip" ? "travel" : "toon",
            ideas: data.ideas.filter((i) => i.project_id === pid),
            votes: data.votes,
            places: pid === "korea-trip" ? data.places : undefined,
            contents: data.contents.filter((c) => c.project_id === pid),
            limit: 3,
          });
          return (
            <article key={pid} className={`card overflow-hidden ${pid === "korea-trip" ? "" : ""}`}>
              <div className={`px-6 pb-5 pt-6 ${pid === "korea-trip" ? "bg-navy text-ivory" : "bg-rose-wash text-navy"}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className={`eyebrow ${pid === "korea-trip" ? "!text-ivory/60" : ""}`}>{p?.handle}</p>
                    <h2 className="display mt-1 text-3xl">{p?.name}</h2>
                  </div>
                  <span className={`text-right text-xs ${pid === "korea-trip" ? "text-ivory/70" : "text-muted"}`}>
                    매일 {p?.daily_time.slice(0, 5)}
                    <br />
                    KST 목표
                  </span>
                </div>
              </div>
              <dl className="grid grid-cols-5 divide-x hairline border-b hairline text-center">
                {[
                  ["아이디어", s.ideas],
                  ["제작 대기", s.ready],
                  ["오늘 예정", s.today],
                  ["검토 대기", s.review],
                  ["승인 완료", s.approved],
                ].map(([k, v]) => (
                  <div key={k} className="px-1 py-4">
                    <dd className="display text-3xl text-navy">{v}</dd>
                    <dt className="mt-0.5 text-[0.64rem] tracking-wide text-muted">{k}</dt>
                  </div>
                ))}
              </dl>
              <div className="px-6 py-5">
                <p className="eyebrow mb-3">Next up · 다음 제작 추천</p>
                {rec.length === 0 ? (
                  <p className="text-sm text-muted">추천할 아이디어가 없습니다. 아이디어 보드에서 AI 제안을 받아보세요.</p>
                ) : (
                  <ol className="space-y-2">
                    {rec.map((r, i) => (
                      <li key={i} className="flex items-baseline gap-3 text-sm">
                        <span className="display w-4 text-rose-deep">{i + 1}</span>
                        <Link
                          href={recommendationHref(r)}
                          className="flex-1 truncate hover:underline"
                        >
                          {r.title}
                        </Link>
                        <span className="hidden text-xs text-muted sm:inline">{r.reason}</span>
                      </li>
                    ))}
                  </ol>
                )}
                <div className="mt-5 flex gap-4">
                  <TextLink href={`/ideas?p=${pid}`}>아이디어 보드 →</TextLink>
                  <TextLink href={`/studio?p=${pid}`}>제작실 →</TextLink>
                  {pid === "korea-trip" ? <TextLink href="/archive">아카이브 →</TextLink> : <TextLink href="/characters">설정집 →</TextLink>}
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
        <div>
          <SectionTitle action={<TextLink href="/calendar">전체 캘린더 →</TextLink>}>제작 캘린더 · 2주</SectionTitle>
          <TwoWeekStrip today={today} contents={data.contents} />
          <div className="mt-6 space-y-2">
            {upcoming.length === 0 && <p className="text-sm text-muted">앞으로 2주간 예정된 콘텐츠가 없습니다.</p>}
            {upcoming.slice(0, 6).map((c) => (
              <ContentRow key={c.id} c={c} today={today} />
            ))}
          </div>
        </div>
        <div>
          <SectionTitle>검토 대기</SectionTitle>
          {reviewQueue.length === 0 ? (
            <p className="text-sm text-muted">검토를 기다리는 콘텐츠가 없습니다.</p>
          ) : (
            <div className="space-y-2">
              {reviewQueue.map((c) => (
                <ContentRow key={c.id} c={c} today={today} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
        <div>
          <SectionTitle action={<TextLink href="/library">자료 보관함 →</TextLink>}>최근 업로드한 자료</SectionTitle>
          {data.assets.length === 0 ? (
            <p className="text-sm text-muted">아직 업로드한 자료가 없습니다.</p>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {data.assets.map((a) => (
                <Link key={a.id} href={a.place_id ? `/archive/places/${a.place_id}` : `/library?p=${a.project_id}`} className="group block">
                  <AssetImage asset={a} className="aspect-square w-full transition group-hover:opacity-85" />
                </Link>
              ))}
            </div>
          )}
        </div>
        <div>
          <SectionTitle>최근 댓글·수정 내역</SectionTitle>
          <ul className="space-y-3">
            {data.activity.map((a) => (
              <li key={a.id} className="flex items-start gap-2.5 text-sm">
                <Avatar member={memberById(a.actor)} />
                <div className="min-w-0 flex-1">
                  <p className="truncate">
                    <span className="text-muted">{activityText(a)} · </span>
                    {a.title}
                  </p>
                  <p className="text-xs text-muted">
                    {a.project_id === "korea-trip" ? "KOREA TRIP" : a.project_id === "med-toon" ? "MED SCHOOL TOON" : ""} · {timeAgo(a.created_at)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

function ContentRow({ c, today }: { c: Content; today: string }) {
  return (
    <Link href={`/studio/${c.id}`} className="card flex items-center gap-3 px-4 py-3 transition hover:border-navy/40">
      <span className={`h-8 w-1 rounded-full ${c.project_id === "korea-trip" ? "bg-navy" : "bg-rose"}`} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm">{c.title}</p>
        <p className="text-xs text-muted">
          {c.scheduled_date ? (c.scheduled_date === today ? "오늘" : formatKDate(c.scheduled_date)) : "일정 미정"} · v{c.current_version_no}
        </p>
      </div>
      <StatusBadge status={c.status} />
    </Link>
  );
}

function TwoWeekStrip({ today, contents }: { today: string; contents: Content[] }) {
  const days = Array.from({ length: 14 }, (_, i) => addDays(today, i));
  return (
    <div className="grid grid-cols-7 gap-1.5">
      {days.map((d) => {
        const items = contents.filter((c) => c.scheduled_date === d);
        const dt = new Date(d + "T00:00:00");
        return (
          <Link
            key={d}
            href={`/calendar?d=${d}`}
            className={`card min-h-[68px] px-1.5 py-1.5 text-center ${d === today ? "!border-navy" : ""}`}
          >
            <p className="text-[0.6rem] tracking-wide text-muted">{["일", "월", "화", "수", "목", "금", "토"][dt.getDay()]}</p>
            <p className="display text-lg leading-tight text-navy">{dt.getDate()}</p>
            <div className="mt-1 flex justify-center gap-1">
              {items.map((c) => (
                <span key={c.id} className={`h-1.5 w-1.5 rounded-full ${c.project_id === "korea-trip" ? "bg-navy" : "bg-rose-deep"}`} />
              ))}
            </div>
            {items.length > 0 && <span className="sr-only"><Chip>{items.length}</Chip></span>}
          </Link>
        );
      })}
    </div>
  );
}
