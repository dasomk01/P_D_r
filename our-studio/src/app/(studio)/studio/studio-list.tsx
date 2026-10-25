"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useLive } from "@/lib/live";
import { getAssets, getContents, getIdeas, getPlaces, getResearch } from "@/lib/queries";
import { STATUS_LABEL } from "@/lib/constants";
import { formatKDate, kstToday } from "@/lib/dates";
import { emptyData } from "@/lib/content-template";
import { recentDuplicates } from "@/lib/recommend";
import { matchArchive } from "@/lib/archive-match";
import type { ContentStatus, ProjectId } from "@/lib/types";
import { useStudio } from "@/components/studio-context";
import { Avatar, Button, Empty, ErrorNote, Field, Loading, Modal, PageHeader, StatusBadge, Tabs, TagInput } from "@/components/ui";

const ORDER: ContentStatus[] = ["in_review", "revising", "in_production", "ready", "ai_planning", "approved"];

export function StudioList() {
  const params = useSearchParams();
  const router = useRouter();
  const project = (params.get("p") as ProjectId) || "korea-trip";
  const { memberById } = useStudio();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const { data } = useLive(
    `studio:${project}`,
    async () => {
      const [contents, ideas] = await Promise.all([getContents(project), getIdeas(project)]);
      return { contents, ideas };
    },
    ["contents", "ideas"],
  );

  const grouped = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = (data?.contents ?? []).filter((c) => !needle || `${c.title} ${c.keywords.join(" ")}`.toLowerCase().includes(needle));
    return ORDER.map((s) => ({ status: s, items: list.filter((c) => c.status === s) })).filter((g) => g.items.length);
  }, [data, q]);

  return (
    <div>
      <PageHeader
        eyebrow="Production studio"
        title="콘텐츠 제작실"
        sub={project === "korea-trip" ? "주제 → 코스 → 장소 확인 → 사진 → 7장 구성 → 영어 문구 → 이미지 → 검수" : "소재 → 줄거리 → 컷 스토리보드 → 캐릭터 확인 → 대사 → 이미지 → 익명성 검수"}
        actions={<Button onClick={() => setOpen(true)}>+ 새 콘텐츠</Button>}
      />
      <Tabs<ProjectId>
        value={project}
        onChange={(v) => router.replace(`/studio?p=${v}`)}
        items={[
          { value: "korea-trip", label: "KOREA TRIP" },
          { value: "med-toon", label: "MED SCHOOL TOON" },
        ]}
      />
      <div className="mt-6">
        <input className="input" placeholder="제목·키워드 검색" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {!data ? (
        <Loading />
      ) : grouped.length === 0 ? (
        <div className="mt-8">
          <Empty title="아직 제작 중인 콘텐츠가 없습니다">아이디어 보드나 여행 아카이브의 장소에서 바로 제작을 시작할 수도 있어요.</Empty>
        </div>
      ) : (
        <div className="mt-8 space-y-10">
          {grouped.map((g) => (
            <section key={g.status}>
              <p className="eyebrow mb-3">
                {STATUS_LABEL[g.status]} · {g.items.length}
              </p>
              <ul className="divide-y hairline border-y hairline">
                {g.items.map((c) => (
                  <li key={c.id}>
                    <Link href={`/studio/${c.id}`} className="flex items-center gap-3 py-3.5 hover:bg-cream/40" data-testid="content-row">
                      <div className="min-w-0 flex-1">
                        <p className="display truncate text-xl text-navy">{c.title}</p>
                        <p className="text-xs text-muted">
                          {c.scheduled_date ? formatKDate(c.scheduled_date) : "일정 미정"} · v{c.current_version_no}
                          {c.keywords.length > 0 && ` · ${c.keywords.map((k) => `#${k}`).join(" ")}`}
                        </p>
                      </div>
                      <Avatar member={memberById(c.updated_by)} size={20} />
                      <StatusBadge status={c.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
      <NewContentModal open={open} onClose={() => setOpen(false)} project={project} ideas={data?.ideas ?? []} />
    </div>
  );
}

function NewContentModal({
  open,
  onClose,
  project,
  ideas,
}: {
  open: boolean;
  onClose: () => void;
  project: ProjectId;
  ideas: import("@/lib/types").Idea[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [ideaId, setIdeaId] = useState("");
  const [date, setDate] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: ctx } = useLive(
    `new-content:${project}`,
    async () => {
      const [contents, places, assets, research] = await Promise.all([
        getContents(project),
        project === "korea-trip" ? getPlaces() : Promise.resolve([]),
        project === "korea-trip" ? getAssets({ project_id: "korea-trip" }) : Promise.resolve([]),
        project === "korea-trip" ? getResearch() : Promise.resolve([]),
      ]);
      return { contents, places, assets, research };
    },
    [],
  );
  const topic = `${title} ${keywords.join(" ")}`.trim();
  const dupes = ctx && topic.length > 1 ? recentDuplicates(topic, ctx.contents, kstToday()) : [];
  const match = ctx && project === "korea-trip" && topic.length > 1 ? matchArchive(topic, { ...ctx }) : null;

  return (
    <Modal open={open} onClose={onClose} title="새 콘텐츠">
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          const d = emptyData(project === "korea-trip" ? "travel" : "toon");
          const idea = ideas.find((i) => i.id === ideaId);
          if (d.kind === "travel") {
            d.place_ids = [...new Set([...(idea?.place_ids ?? []), ...(match?.places.filter((p) => p.status === "visited").slice(0, 6).map((p) => p.id) ?? [])])];
            if (/2박/.test(topic)) d.format = "2박 3일";
            else if (/1박/.test(topic)) d.format = "1박 2일";
          }
          const { data: id, error } = await supabase().rpc("create_content", {
            p_project_id: project,
            p_title: title.trim(),
            p_idea_id: ideaId || null,
            p_keywords: keywords,
            p_scheduled_date: date || null,
            p_data: d,
          });
          setBusy(false);
          if (error) return setError(error.message);
          router.push(`/studio/${id}`);
        }}
      >
        <Field label="아이디어에서 시작 (선택)">
          <select
            className="input"
            value={ideaId}
            onChange={(e) => {
              setIdeaId(e.target.value);
              const i = ideas.find((x) => x.id === e.target.value);
              if (i) {
                setTitle(i.title);
                setKeywords(i.tags);
              }
            }}
          >
            <option value="">— 없음 —</option>
            {ideas
              .filter((i) => i.status !== "approved")
              .map((i) => (
                <option key={i.id} value={i.id}>
                  {i.is_next ? "★ " : ""}
                  {i.title}
                </option>
              ))}
          </select>
        </Field>
        <Field label="주제 *">
          <input className="input" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder={project === "korea-trip" ? "예: 강릉 2박 3일" : "예: 해부학 시험 전날"} />
        </Field>
        <Field label="키워드">
          <TagInput value={keywords} onChange={setKeywords} placeholder="강릉, 바다" />
        </Field>
        <Field label="제작 예정일">
          <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        {dupes.length > 0 && (
          <p className="rounded-[3px] border border-warn/30 bg-[#fbf3e8] px-3 py-2 text-xs text-warn" data-testid="dupe-warning">
            최근 30일 내 비슷한 콘텐츠: {dupes.map((d) => d.item.title).join(", ")}
          </p>
        )}
        {match && match.places.length > 0 && (
          <div className="rounded-[3px] bg-cream/60 p-3 text-xs" data-testid="archive-match">
            <p className="mb-1 font-medium text-navy">아카이브에서 찾은 자료 — 자동으로 연결됩니다</p>
            <p className="text-muted">
              직접 방문 {match.places.filter((p) => p.status === "visited").length}곳 ({match.places.filter((p) => p.status === "visited").slice(0, 4).map((p) => p.name).join(", ")}) · 직접 찍은 사진 {match.ownPhotos.length}장 · 조사 자료 {match.research.length}건
            </p>
          </div>
        )}
        <ErrorNote error={error} />
        <Button type="submit" busy={busy} disabled={!title.trim()} className="w-full">
          제작 시작
        </Button>
      </form>
    </Modal>
  );
}
