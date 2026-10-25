"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useLive, must } from "@/lib/live";
import { getAssets, getContents, getPlaces, getVotes } from "@/lib/queries";
import { PRIORITY_LABEL, STATUS_FLOW, STATUS_LABEL } from "@/lib/constants";
import { findSimilar } from "@/lib/similarity";
import { formatDateTime } from "@/lib/dates";
import { emptyData } from "@/lib/content-template";
import type { ContentData, Idea, IdeaStatus } from "@/lib/types";
import { useStudio } from "@/components/studio-context";
import { Comments } from "@/components/comments";
import { Uploader } from "@/components/uploader";
import { AssetImage, Lightbox } from "@/components/asset-image";
import { Avatar, Button, Chip, ErrorNote, Field, Loading, NotConnected, StatusBadge, TagInput } from "@/components/ui";
import type { Asset } from "@/lib/types";

interface AiRun {
  id: string;
  output: { plan?: ContentData; summary?: string } | null;
  created_at: string;
  model: string | null;
}

export default function IdeaDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { me, memberById, ai } = useStudio();
  const { data, reload } = useLive(
    `idea:${id}`,
    async () => {
      const idea = must(await supabase().from("ideas").select("*").eq("id", id).maybeSingle()) as Idea | null;
      if (!idea) return null;
      const [votes, assets, contents, places, runs, siblings] = await Promise.all([
        getVotes(),
        getAssets({ idea_id: id }),
        getContents(idea.project_id),
        idea.project_id === "korea-trip" ? getPlaces() : Promise.resolve([]),
        supabase()
          .from("ai_runs")
          .select("id,output,created_at,model")
          .eq("target_id", id)
          .eq("kind", "idea_plan")
          .eq("status", "done")
          .order("created_at", { ascending: false })
          .limit(1)
          .then((r) => must(r) as AiRun[]),
        supabase().from("ideas").select("id,title,status,tags").eq("project_id", idea.project_id).neq("id", id).then((r) => must(r) as Idea[]),
      ]);
      return { idea, votes: votes.filter((v) => v.idea_id === id), assets, contents, places, plan: runs[0] ?? null, siblings };
    },
    ["ideas", "idea_votes", "assets", "contents", "ai_runs"],
  );

  const [draft, setDraft] = useState<Idea | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [planning, setPlanning] = useState(false);
  const [starting, setStarting] = useState(false);
  const [lightbox, setLightbox] = useState<Asset | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset local draft when the server row changes
    if (data?.idea) setDraft(data.idea);
  }, [data?.idea]);

  if (data === undefined) return <Loading />;
  if (data === null || !draft) return <p className="py-20 text-center text-muted">아이디어를 찾을 수 없습니다.</p>;
  const idea = data.idea;
  const dirty = JSON.stringify(draft) !== JSON.stringify(idea);
  const linked = data.contents.filter((c) => c.idea_id === idea.id);
  const similar = findSimilar(`${idea.title} ${idea.tags.join(" ")}`, data.siblings, (i) => `${i.title} ${i.tags.join(" ")}`, 0.3).slice(0, 4);
  const myVote = data.votes.some((v) => v.user_id === me.user_id);

  async function save(patch?: Partial<Idea>) {
    setSaving(true);
    setError(null);
    const d = { ...draft!, ...patch };
    const { error } = await supabase()
      .from("ideas")
      .update({
        title: d.title,
        memo: d.memo,
        tags: d.tags,
        links: d.links,
        priority: d.priority,
        status: d.status,
        is_next: d.is_next,
        place_ids: d.place_ids,
      })
      .eq("id", idea.id);
    setSaving(false);
    if (error) setError(error.message);
    void reload();
  }

  async function runPlan() {
    setPlanning(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/plan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ideaId: idea.id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? res.statusText);
      void reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setPlanning(false);
    }
  }

  async function startProduction(fromPlan: boolean) {
    setStarting(true);
    setError(null);
    const kind = idea.project_id === "korea-trip" ? "travel" : "toon";
    const planned = fromPlan ? data!.plan?.output?.plan : undefined;
    const base: ContentData = planned ? structuredClone(planned) : emptyData(kind);
    if (base.kind === "travel") base.place_ids = [...new Set([...base.place_ids, ...idea.place_ids])];
    const { data: cid, error } = await supabase().rpc("create_content", {
      p_project_id: idea.project_id,
      p_title: idea.title,
      p_idea_id: idea.id,
      p_keywords: idea.tags,
      p_data: base,
    });
    setStarting(false);
    if (error) return setError(error.message);
    router.push(`/studio/${cid}`);
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between text-xs text-muted">
        <Link href={`/ideas?p=${idea.project_id}`} className="tracking-wider hover:text-navy">
          ← {idea.project_id === "korea-trip" ? "KOREA TRIP" : "MED SCHOOL TOON"} 아이디어
        </Link>
        <span className="flex items-center gap-1.5">
          <Avatar member={memberById(idea.created_by)} size={18} /> {formatDateTime(idea.created_at)} 등록
        </span>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={idea.status} />
            {idea.is_next && <Chip tone="rose">★ 다음 제작</Chip>}
            {idea.source !== "manual" && <Chip>{idea.source === "imported" ? "가져온 아이디어" : "AI 제안"}</Chip>}
          </div>
          <input
            className="display w-full border-b hairline bg-transparent pb-2 text-4xl text-navy outline-none focus:border-navy md:text-5xl"
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            aria-label="제목"
          />
          <Field label="메모">
            <textarea className="input min-h-[140px]" value={draft.memo} onChange={(e) => setDraft({ ...draft, memo: e.target.value })} />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="태그">
              <TagInput value={draft.tags} onChange={(tags) => setDraft({ ...draft, tags })} />
            </Field>
            <Field label="우선순위">
              <select className="input" value={draft.priority} onChange={(e) => setDraft({ ...draft, priority: Number(e.target.value) as 1 | 2 | 3 })}>
                {([1, 2, 3] as const).map((p) => (
                  <option key={p} value={p}>
                    {PRIORITY_LABEL[p]}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="참고 링크" hint="한 줄에 하나">
            <textarea
              className="input"
              rows={2}
              value={draft.links.join("\n")}
              onChange={(e) => setDraft({ ...draft, links: e.target.value.split("\n") })}
            />
          </Field>
          {idea.links.filter(Boolean).length > 0 && (
            <ul className="space-y-1 text-sm">
              {idea.links.filter(Boolean).map((l) => (
                <li key={l}>
                  <a href={l} target="_blank" rel="noreferrer" className="break-all text-navy-soft underline">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          )}

          {idea.project_id === "korea-trip" && (
            <Field label="연결된 아카이브 장소" hint="콘텐츠 제작 시 이 장소들의 사진·후기를 우선 참고합니다">
              <div className="flex flex-wrap gap-1.5">
                {data.places.map((p) => {
                  const on = draft.place_ids.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() =>
                        setDraft({ ...draft, place_ids: on ? draft.place_ids.filter((x) => x !== p.id) : [...draft.place_ids, p.id] })
                      }
                      className={`rounded-full border px-2.5 py-1 text-xs ${on ? "border-navy bg-navy text-ivory" : "border-line text-muted"}`}
                    >
                      {p.region && `${p.region} · `}
                      {p.name}
                    </button>
                  );
                })}
                {data.places.length === 0 && <span className="text-xs text-muted">아카이브에 등록된 장소가 없습니다.</span>}
              </div>
            </Field>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={() => save()} busy={saving} disabled={!dirty || !draft.title.trim()}>
              변경 저장
            </Button>
            {dirty && <span className="text-xs text-warn">저장하지 않은 변경이 있어요</span>}
            <span className="flex-1" />
            <Button
              variant="danger"
              size="sm"
              onClick={async () => {
                if (!confirm("이 아이디어를 삭제할까요? (댓글·투표도 함께 삭제됩니다)")) return;
                await supabase().from("comments").delete().eq("target_type", "idea").eq("target_id", idea.id);
                await supabase().from("ideas").delete().eq("id", idea.id);
                router.replace(`/ideas?p=${idea.project_id}`);
              }}
            >
              삭제
            </Button>
          </div>
          <ErrorNote error={error} />

          <section className="border-t hairline pt-6">
            <p className="eyebrow mb-3">첨부 사진·파일</p>
            <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
              {data.assets.map((a) => (
                <button key={a.id} onClick={() => setLightbox(a)} className="block">
                  <AssetImage asset={a} className="aspect-square w-full" />
                </button>
              ))}
            </div>
            <Uploader
              compact
              accept="image/*,application/pdf,.txt,.md,.doc,.docx"
              label="사진·파일 첨부"
              meta={{ project_id: idea.project_id, idea_id: idea.id, kind: "file", origin: "own_photo" }}
              onUploaded={() => reload()}
            />
          </section>

          <section className="border-t hairline pt-6">
            <Comments projectId={idea.project_id} targetType="idea" targetId={idea.id} />
          </section>
        </div>

        <aside className="space-y-8">
          <div className="card space-y-4 p-5">
            <Field label="상태">
              <select className="input" value={idea.status} onChange={(e) => save({ status: e.target.value as IdeaStatus })}>
                {STATUS_FLOW.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
            </Field>
            <div className="flex gap-2">
              <Button variant={idea.is_next ? "rose" : "outline"} size="sm" className="flex-1" onClick={() => save({ is_next: !idea.is_next })}>
                {idea.is_next ? "★ 다음 제작 해제" : "☆ 다음 제작으로"}
              </Button>
              <Button
                variant={myVote ? "rose" : "outline"}
                size="sm"
                onClick={async () => {
                  if (myVote) await supabase().from("idea_votes").delete().eq("idea_id", idea.id).eq("user_id", me.user_id);
                  else await supabase().from("idea_votes").insert({ idea_id: idea.id });
                  void reload();
                }}
              >
                {myVote ? "♥" : "♡"} {data.votes.length}
              </Button>
            </div>
          </div>

          <div className="card space-y-3 p-5">
            <p className="eyebrow">AI 기획</p>
            {!ai.features.idea_plan ? (
              <NotConnected what="AI 아이디어 구체화" detail="ANTHROPIC_API_KEY 설정 시 활성화됩니다. 지금은 빈 템플릿으로 제작을 시작할 수 있어요." />
            ) : (
              <>
                <p className="text-xs leading-relaxed text-muted">
                  {idea.project_id === "korea-trip"
                    ? "아카이브의 직접 방문 기록을 우선 참고해 7장 구성·영어 문구·해시태그 5개 초안을 만듭니다."
                    : "캐릭터 설정집을 참고해 줄거리·컷 구성·대사 초안을 만들고 익명성 규칙을 지킵니다."}
                </p>
                <Button variant="rose" size="sm" busy={planning} onClick={runPlan} className="w-full">
                  {data.plan ? "AI 기획 다시 받기" : "AI 기획 받기"}
                </Button>
              </>
            )}
            {data.plan?.output && (
              <div className="rounded-[3px] bg-cream/60 p-3 text-xs leading-relaxed">
                <p className="mb-1 text-muted">
                  {formatDateTime(data.plan.created_at)} · {data.plan.model}
                </p>
                <p className="whitespace-pre-wrap">{data.plan.output.summary}</p>
              </div>
            )}
          </div>

          <div className="card space-y-3 p-5">
            <p className="eyebrow">콘텐츠 제작</p>
            {linked.map((c) => (
              <Link key={c.id} href={`/studio/${c.id}`} className="flex items-center justify-between gap-2 text-sm hover:underline">
                <span className="truncate">{c.title}</span>
                <StatusBadge status={c.status} />
              </Link>
            ))}
            {data.plan?.output?.plan && (
              <Button size="sm" className="w-full" busy={starting} onClick={() => startProduction(true)}>
                AI 기획안으로 제작 시작
              </Button>
            )}
            <Button size="sm" variant="outline" className="w-full" busy={starting} onClick={() => startProduction(false)}>
              {linked.length ? "새 콘텐츠 하나 더 만들기" : "빈 템플릿으로 제작 시작"}
            </Button>
          </div>

          {similar.length > 0 && (
            <div>
              <p className="eyebrow mb-2">비슷한 아이디어</p>
              <ul className="space-y-1.5 text-sm">
                {similar.map((h) => (
                  <li key={h.item.id}>
                    <Link href={`/ideas/${h.item.id}`} className="hover:underline">
                      {h.item.title}
                    </Link>{" "}
                    <span className="text-xs text-muted">{STATUS_LABEL[h.item.status]}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
      <Lightbox asset={lightbox} onClose={() => setLightbox(null)} />
    </div>
  );
}
