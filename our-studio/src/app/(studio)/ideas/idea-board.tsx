"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useLive, must } from "@/lib/live";
import { getContents, getIdeas, getPlaces, getVotes, voteCounts } from "@/lib/queries";
import { PRIORITY_LABEL, STATUS_FLOW, STATUS_LABEL } from "@/lib/constants";
import { findSimilar } from "@/lib/similarity";
import { recommendNext, recentDuplicates, recommendationHref } from "@/lib/recommend";
import { kstToday, timeAgo } from "@/lib/dates";
import type { Comment, Idea, IdeaStatus, ProjectId } from "@/lib/types";
import { useStudio } from "@/components/studio-context";
import { Avatar, Button, Chip, Empty, ErrorNote, Loading, Modal, NotConnected, PageHeader, StatusBadge, Tabs } from "@/components/ui";
import { IdeaForm } from "./idea-form";

type Sort = "priority" | "votes" | "new";

export function IdeaBoard() {
  const params = useSearchParams();
  const router = useRouter();
  const project = (params.get("p") as ProjectId) || "korea-trip";
  const { me, memberById, ai } = useStudio();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<IdeaStatus | "all" | "open">("open");
  const [tag, setTag] = useState<string | null>(null);
  const [sort, setSort] = useState<Sort>("priority");
  const [quick, setQuick] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(params.get("new") === "1");
  const [showImport, setShowImport] = useState(false);
  const [showAi, setShowAi] = useState(false);

  const { data, reload } = useLive(
    `ideas:${project}`,
    async () => {
      const [ideas, votes, contents, places, comments] = await Promise.all([
        getIdeas(project),
        getVotes(),
        getContents(project),
        project === "korea-trip" ? getPlaces() : Promise.resolve([]),
        supabase().from("comments").select("target_id").eq("target_type", "idea").then((r) => must(r) as Pick<Comment, "target_id">[]),
      ]);
      const commentCount: Record<string, number> = {};
      for (const c of comments) commentCount[c.target_id] = (commentCount[c.target_id] ?? 0) + 1;
      return { ideas, votes, counts: voteCounts(votes), contents, places, commentCount };
    },
    ["ideas", "idea_votes", "contents", "comments", "places"],
  );

  const similar = useMemo(() => {
    if (!data || quick.trim().length < 2) return { ideas: [], contents: [] };
    return {
      ideas: findSimilar(quick, data.ideas, (i) => `${i.title} ${i.tags.join(" ")}`, 0.25).slice(0, 3),
      contents: recentDuplicates(quick, data.contents, kstToday()).slice(0, 2),
    };
  }, [quick, data]);

  const tags = useMemo(() => [...new Set((data?.ideas ?? []).flatMap((i) => i.tags))].sort(), [data]);

  const list = useMemo(() => {
    if (!data) return [];
    const needle = q.trim().toLowerCase();
    return data.ideas
      .filter((i) => (status === "all" ? true : status === "open" ? i.status !== "approved" : i.status === status))
      .filter((i) => !tag || i.tags.includes(tag))
      .filter((i) => !needle || `${i.title} ${i.memo} ${i.tags.join(" ")}`.toLowerCase().includes(needle))
      .sort((a, b) => {
        if (a.is_next !== b.is_next) return a.is_next ? -1 : 1;
        if (sort === "votes") return (data.counts[b.id] ?? 0) - (data.counts[a.id] ?? 0) || a.priority - b.priority;
        if (sort === "new") return b.created_at.localeCompare(a.created_at);
        return a.priority - b.priority || (data.counts[b.id] ?? 0) - (data.counts[a.id] ?? 0) || a.sort_order - b.sort_order;
      });
  }, [data, q, status, tag, sort]);

  const recs = useMemo(
    () =>
      data
        ? recommendNext({
            projectKind: project === "korea-trip" ? "travel" : "toon",
            ideas: data.ideas,
            votes: data.counts,
            places: data.places,
            contents: data.contents,
            limit: 5,
          })
        : [],
    [data, project],
  );

  async function quickAdd() {
    const title = quick.trim();
    if (!title) return;
    setBusy(true);
    setError(null);
    const { error } = await supabase().from("ideas").insert({ project_id: project, title });
    setBusy(false);
    if (error) return setError(error.message);
    setQuick("");
    void reload();
  }

  async function toggleVote(idea: Idea) {
    const mine = data?.votes.some((v) => v.idea_id === idea.id && v.user_id === me.user_id);
    if (mine) await supabase().from("idea_votes").delete().eq("idea_id", idea.id).eq("user_id", me.user_id);
    else await supabase().from("idea_votes").insert({ idea_id: idea.id });
    void reload();
  }

  async function toggleNext(idea: Idea) {
    await supabase().from("ideas").update({ is_next: !idea.is_next }).eq("id", idea.id);
    void reload();
  }

  return (
    <div>
      <PageHeader
        eyebrow="Shared idea board"
        title="아이디어 보드"
        sub="한 줄만 적어도 저장됩니다. 둘 다 수정·댓글·투표할 수 있어요."
        actions={
          <>
            <Button variant="ghost" size="sm" onClick={() => setShowImport(true)}>
              가져오기
            </Button>
            <Button variant="rose" size="sm" onClick={() => setShowAi(true)}>
              AI 주제 제안
            </Button>
            <Button size="sm" onClick={() => setShowForm(true)}>
              자세히 등록
            </Button>
          </>
        }
      />

      <Tabs<ProjectId>
        value={project}
        onChange={(v) => router.replace(`/ideas?p=${v}`)}
        items={[
          { value: "korea-trip", label: "KOREA TRIP" },
          { value: "med-toon", label: "MED SCHOOL TOON" },
        ]}
      />

      {/* Quick add */}
      <div className="mt-6">
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            void quickAdd();
          }}
        >
          <input
            className="input !py-3 !text-base"
            placeholder={project === "korea-trip" ? "예: 부산 해운대 당일치기" : "예: 해부학 시험 전날 생긴 일"}
            value={quick}
            onChange={(e) => setQuick(e.target.value)}
            aria-label="아이디어 한 줄"
          />
          <Button type="submit" busy={busy} disabled={!quick.trim()}>
            저장
          </Button>
        </form>
        <ErrorNote error={error} />
        {(similar.ideas.length > 0 || similar.contents.length > 0) && (
          <div className="mt-2 rounded-[3px] border border-warn/30 bg-[#fbf3e8] px-3 py-2 text-xs text-warn" data-testid="similar-warning">
            비슷한 항목이 있어요:{" "}
            {similar.ideas.map((h) => (
              <Link key={h.item.id} href={`/ideas/${h.item.id}`} className="mr-2 underline">
                {h.item.title} ({STATUS_LABEL[h.item.status]})
              </Link>
            ))}
            {similar.contents.map((h) => (
              <Link key={h.item.id} href={`/studio/${h.item.id}`} className="mr-2 underline">
                최근 30일 콘텐츠: {h.item.title}
              </Link>
            ))}
          </div>
        )}
      </div>

      {!data ? (
        <Loading />
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_280px]">
          <div>
            {/* Filters */}
            <div className="mb-5 flex flex-col gap-3">
              <div className="flex gap-2">
                <input className="input" placeholder="검색 (제목·메모·태그)" value={q} onChange={(e) => setQ(e.target.value)} />
                <select className="input !w-auto" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
                  <option value="priority">우선순위순</option>
                  <option value="votes">공감순</option>
                  <option value="new">최신순</option>
                </select>
              </div>
              <div className="scrollbar-none flex gap-1.5 overflow-x-auto">
                {(["open", "all", ...STATUS_FLOW] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`shrink-0 rounded-full border px-3 py-1 text-xs ${
                      status === s ? "border-navy bg-navy text-ivory" : "border-line text-muted hover:border-navy/40"
                    }`}
                  >
                    {s === "open" ? "진행 중 전체" : s === "all" ? "모두" : STATUS_LABEL[s]}
                    {s !== "open" && s !== "all" && (
                      <span className="ml-1 opacity-60">{data.ideas.filter((i) => i.status === s).length}</span>
                    )}
                  </button>
                ))}
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTag(tag === t ? null : t)}
                      className={`rounded-full px-2 py-0.5 text-[0.7rem] ${tag === t ? "bg-rose-deep text-white" : "bg-cream text-muted"}`}
                    >
                      #{t}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {list.length === 0 ? (
              <Empty title="아이디어가 없습니다">
                위 입력창에 한 줄만 적어도 바로 저장돼요. 아이디어가 비어 있으면 &lsquo;AI 주제 제안&rsquo;으로 새 주제를 받아볼 수 있습니다.
              </Empty>
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2">
                {list.map((idea) => {
                  const votes = data.counts[idea.id] ?? 0;
                  const mine = data.votes.some((v) => v.idea_id === idea.id && v.user_id === me.user_id);
                  return (
                    <li key={idea.id} className={`card flex flex-col p-4 ${idea.is_next ? "!border-rose-deep/60" : ""}`} data-testid="idea-card">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <StatusBadge status={idea.status} />
                        <div className="flex items-center gap-1.5">
                          {idea.priority === 1 && <Chip tone="rose">우선 {PRIORITY_LABEL[1]}</Chip>}
                          {idea.source !== "manual" && <Chip>{idea.source === "imported" ? "가져옴" : "AI 제안"}</Chip>}
                        </div>
                      </div>
                      <Link href={`/ideas/${idea.id}`} className="display text-xl leading-snug text-navy hover:underline">
                        {idea.title}
                      </Link>
                      {idea.memo && <p className="mt-1 line-clamp-2 text-sm text-muted">{idea.memo}</p>}
                      {idea.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {idea.tags.map((t) => (
                            <span key={t} className="text-[0.7rem] text-rose-deep">
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="mt-auto flex items-center justify-between pt-4 text-xs text-muted">
                        <span className="flex items-center gap-1.5">
                          <Avatar member={memberById(idea.created_by)} size={18} />
                          {timeAgo(idea.created_at)}
                          {(data.commentCount[idea.id] ?? 0) > 0 && <span>· 댓글 {data.commentCount[idea.id]}</span>}
                        </span>
                        <span className="flex items-center gap-3">
                          <button
                            onClick={() => toggleNext(idea)}
                            className={idea.is_next ? "text-rose-deep" : "hover:text-navy"}
                            title="다음 제작으로 지정"
                          >
                            {idea.is_next ? "★ 다음 제작" : "☆ 다음으로"}
                          </button>
                          <button
                            onClick={() => toggleVote(idea)}
                            className={mine ? "text-rose-deep" : "hover:text-navy"}
                            aria-pressed={mine}
                            data-testid="vote"
                          >
                            {mine ? "♥" : "♡"} {votes}
                          </button>
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <aside>
            <p className="eyebrow mb-3">추천 · 다음에 만들 것</p>
            {recs.length === 0 ? (
              <p className="text-sm text-muted">추천할 항목이 없습니다.</p>
            ) : (
              <ol className="space-y-3">
                {recs.map((r, i) => (
                  <li key={i} className="border-b hairline pb-3">
                    <Link
                      href={recommendationHref(r)}
                      className="flex gap-3 text-sm hover:underline"
                    >
                      <span className="display text-lg leading-none text-rose-deep">{i + 1}</span>
                      <span>
                        {r.title}
                        <span className="block text-xs text-muted">{r.reason}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            )}
            <p className="mt-4 text-[0.7rem] leading-relaxed text-muted">
              순서: ① 다음 제작 지정 → ② 아직 만들지 않은 공동 아이디어 → {project === "korea-trip" && "③ 아카이브 방문 기록 → "}
              과거 아이디어 → AI 새 제안
            </p>
          </aside>
        </div>
      )}

      <Modal open={showForm} onClose={() => setShowForm(false)} title="아이디어 등록">
        <IdeaForm
          project={project}
          onSaved={(id) => {
            setShowForm(false);
            router.push(`/ideas/${id}`);
          }}
        />
      </Modal>

      <ImportModal open={showImport} onClose={() => setShowImport(false)} project={project} onDone={reload} />
      <AiSuggestModal open={showAi} onClose={() => setShowAi(false)} project={project} aiOn={ai.features.idea_suggest} onDone={reload} />
    </div>
  );
}

function ImportModal({ open, onClose, project, onDone }: { open: boolean; onClose: () => void; project: ProjectId; onDone: () => void }) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lines = text
    .split("\n")
    .map((l) => l.replace(/^[-*•\d.)\s]+/, "").trim())
    .filter(Boolean);
  return (
    <Modal open={open} onClose={onClose} title="아이디어 가져오기">
      <div className="space-y-4 text-sm">
        <p className="leading-relaxed text-muted">
          ChatGPT 등에서 정리한 아이디어 중 <b className="text-navy">공유하고 싶은 부분만</b> 붙여넣으세요. 한 줄이 아이디어 하나가 됩니다.
          이 웹사이트는 개인 채팅 기록에 자동으로 접근하지 않으며, 여기 붙여넣은 내용만 두 사람이 함께 보는 공동 아이디어로 저장됩니다.
        </p>
        <textarea className="input min-h-[180px]" value={text} onChange={(e) => setText(e.target.value)} placeholder={"- 경주 1박 2일\n- 외국인을 위한 KTX 예매 팁"} />
        <ErrorNote error={error} />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted">{lines.length}개 아이디어</span>
          <Button
            busy={busy}
            disabled={!lines.length}
            onClick={async () => {
              setBusy(true);
              const { error } = await supabase()
                .from("ideas")
                .insert(lines.map((title) => ({ project_id: project, title: title.slice(0, 200), source: "imported" })));
              setBusy(false);
              if (error) return setError(error.message);
              setText("");
              onDone();
              onClose();
            }}
          >
            공동 아이디어로 저장
          </Button>
        </div>
      </div>
    </Modal>
  );
}

interface Suggestion {
  title: string;
  memo: string;
  tags: string[];
  why: string;
}

function AiSuggestModal({
  open,
  onClose,
  project,
  aiOn,
  onDone,
}: {
  open: boolean;
  onClose: () => void;
  project: ProjectId;
  aiOn: boolean;
  onDone: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [items, setItems] = useState<Suggestion[]>([]);
  const [saved, setSaved] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);
  return (
    <Modal open={open} onClose={onClose} title="AI 주제 제안" wide>
      {!aiOn ? (
        <NotConnected what="AI 주제 제안" detail="서버에 ANTHROPIC_API_KEY 가 설정되면 활성화됩니다. 지금은 추천 목록(공동 아이디어·아카이브 기반)만 동작합니다." />
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted">
            기존 아이디어·최근 콘텐츠{project === "korea-trip" ? "·여행 아카이브" : ""}와 겹치지 않는 새 주제를 제안합니다. 마음에 드는 것만 저장하세요.
          </p>
          <Button
            variant="rose"
            busy={busy}
            onClick={async () => {
              setBusy(true);
              setError(null);
              setSaved(new Set());
              try {
                const res = await fetch("/api/ai/suggest-ideas", {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify({ project }),
                });
                const json = await res.json();
                if (!res.ok) throw new Error(json.error ?? res.statusText);
                setItems(json.ideas);
              } catch (e) {
                setError(e instanceof Error ? e.message : String(e));
              } finally {
                setBusy(false);
              }
            }}
          >
            {items.length ? "다시 제안받기" : "제안받기"}
          </Button>
          <ErrorNote error={error} />
          <ul className="grid gap-3 md:grid-cols-2">
            {items.map((s, i) => (
              <li key={i} className="card p-4">
                <p className="display text-lg text-navy">{s.title}</p>
                <p className="mt-1 text-sm">{s.memo}</p>
                <p className="mt-2 text-xs text-muted">{s.why}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[0.7rem] text-rose-deep">{s.tags.map((t) => `#${t}`).join(" ")}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={saved.has(i)}
                    onClick={async () => {
                      const { error } = await supabase()
                        .from("ideas")
                        .insert({ project_id: project, title: s.title, memo: `${s.memo}\n\n(AI 제안 이유) ${s.why}`, tags: s.tags, source: "ai_suggested" });
                      if (error) return setError(error.message);
                      setSaved(new Set(saved).add(i));
                      onDone();
                    }}
                  >
                    {saved.has(i) ? "저장됨" : "아이디어로 저장"}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Modal>
  );
}
