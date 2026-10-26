"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useLive, must } from "@/lib/live";
import { getApprovals, getAssets, getCharacters, getContents, getPlaces, getResearch, getVersions } from "@/lib/queries";
import { STATUS_LABEL } from "@/lib/constants";
import { formatDateTime, kstToday } from "@/lib/dates";
import { publicText, validateTravel } from "@/lib/content-template";
import { scanPrivacy } from "@/lib/privacy";
import { validateToonScript, VARIANTS, type ToonQcReport, type Variant } from "@/lib/toon-spec";
import { recentDuplicates } from "@/lib/recommend";
import { matchArchive } from "@/lib/archive-match";
import type { Asset, Content, ContentData, ContentStatus, ToonData, TravelData } from "@/lib/types";
import { useStudio } from "@/components/studio-context";
import { Comments } from "@/components/comments";
import { AssetImage } from "@/components/asset-image";
import { TravelEditor } from "@/components/content/travel-editor";
import { ToonEditor } from "@/components/content/toon-editor";
import { PageTile, previewUnits } from "@/components/content/preview";
import { VersionCompare } from "@/components/content/version-compare";
import { exportZip } from "@/components/content/export";
import { Avatar, Button, Chip, ErrorNote, Field, Loading, Modal, NotConnected, StatusBadge, Tabs, TagInput } from "@/components/ui";

type Tab = "edit" | "review" | "versions" | "download";
const CONTENT_STATUSES: ContentStatus[] = ["ai_planning", "ready", "in_production", "in_review", "revising", "approved"];

export default function ContentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { memberById, project, ai } = useStudio();
  const [tab, setTab] = useState<Tab>("edit");
  const { data, reload } = useLive(
    `content:${id}`,
    async () => {
      const content = must(await supabase().from("contents").select("*").eq("id", id).maybeSingle()) as Content | null;
      if (!content) return null;
      const travel = content.project_id === "korea-trip";
      const [versions, approvals, assets, siblings, places, research, characters] = await Promise.all([
        getVersions(id),
        getApprovals(id),
        getAssets({ project_id: content.project_id }),
        getContents(content.project_id),
        travel ? getPlaces() : Promise.resolve([]),
        travel ? getResearch() : Promise.resolve([]),
        travel ? Promise.resolve([]) : getCharacters(),
      ]);
      return { content, versions, approvals, assets, siblings, places, research, characters };
    },
    ["contents", "content_versions", "approvals", "assets", "comments"],
  );

  const current = data?.versions.find((v) => v.version_no === data.content.current_version_no);
  const [viewNo, setViewNo] = useState<number | null>(null);
  const [draft, setDraft] = useState<ContentData | null>(null);
  const [baseJson, setBaseJson] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number | null>(null);
  const [revBody, setRevBody] = useState("");
  const [revPage, setRevPage] = useState<string>("");
  const [aiNotes, setAiNotes] = useState<string | null>(null);
  const [previewVariant, setPreviewVariant] = useState<Variant>("feed");

  // 서버의 현재 버전이 바뀌면(상대방 저장 포함) 편집 중이 아닐 때만 갱신
  const serverJson = current ? JSON.stringify(current.data) : "";
  useEffect(() => {
    if (!current) return;
    const dirtyNow = draft && JSON.stringify(draft) !== baseJson;
    if (!dirtyNow) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- adopt the latest server version when not editing
      setDraft(current.data);
      setBaseJson(serverJson);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only when server data changes
  }, [serverJson, current?.version_no]);

  const assetMap = useMemo(() => new Map((data?.assets ?? []).map((a) => [a.id, a])), [data?.assets]);

  if (data === undefined || (data && !draft)) return <Loading />;
  if (data === null || !current || !draft) return <p className="py-20 text-center text-muted">콘텐츠를 찾을 수 없습니다.</p>;

  const { content } = data;
  const proj = project(content.project_id);
  const viewing = viewNo != null && viewNo !== current.version_no ? data.versions.find((v) => v.version_no === viewNo) : null;
  const shown: ContentData = viewing ? viewing.data : draft;
  const dirty = JSON.stringify(draft) !== baseJson;
  const approvedVersion = data.versions.find((v) => v.id === content.approved_version_id);
  const usableIds = new Set(data.assets.filter((a) => a.usage_allowed && a.origin !== "reference_only").map((a) => a.id));
  const issues =
    shown.kind === "travel"
      ? validateTravel(shown, usableIds)
      : [
          ...validateToonScript(shown),
          ...scanPrivacy(publicText(shown), proj?.settings.sensitive_terms ?? []).map((f) => `익명성: ${f.message} — “${f.match}”`),
        ];
  const dupes = recentDuplicates(`${content.title} ${content.keywords.join(" ")}`, data.siblings, kstToday(), content.id);
  const units = previewUnits(shown, assetMap, previewVariant);

  async function save(newVersion: boolean) {
    setBusy("save");
    setError(null);
    const { data: no, error } = await supabase().rpc("save_content_version", {
      p_content_id: content.id,
      p_data: draft,
      p_note: note || (current!.locked ? `v${current!.version_no} 승인 후 수정` : ""),
      p_new_version: newVersion,
    });
    setBusy(null);
    if (error) return setError(error.message);
    setNote("");
    setBaseJson(JSON.stringify(draft));
    setViewNo(null);
    if (no !== current!.version_no) setTab("edit");
    void reload();
  }

  async function setStatus(status: ContentStatus) {
    const { error } = await supabase().from("contents").update({ status }).eq("id", content.id);
    if (error) setError(error.message);
    void reload();
  }

  async function patchContent(patch: Partial<Content>) {
    const { error } = await supabase().from("contents").update(patch).eq("id", content.id);
    if (error) setError(error.message);
    void reload();
  }

  async function aiDraft() {
    setBusy("ai");
    setError(null);
    try {
      const res = await fetch("/api/ai/plan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ contentId: content.id, current: draft }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? res.statusText);
      const plan = json.plan as ContentData;
      // 이미 고른 사진과 연결 장소는 유지
      if (plan.kind === "travel" && draft!.kind === "travel") {
        plan.pages = plan.pages.map((p, i) => ({ ...p, asset_id: (draft as TravelData).pages[i]?.asset_id ?? null }));
        plan.place_ids = [...new Set([...(draft as TravelData).place_ids, ...plan.place_ids])];
      }
      if (plan.kind === "toon" && draft!.kind === "toon") {
        plan.cuts = plan.cuts.map((c, i) => ({
          ...c,
          asset_id: (draft as ToonData).cuts[i]?.asset_id ?? null,
          reel_asset_id: (draft as ToonData).cuts[i]?.reel_asset_id ?? null,
        }));
      }
      setDraft(plan);
      setAiNotes(json.summary ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(null);
    }
  }

  async function aiAnonymity() {
    setBusy("anon");
    setError(null);
    try {
      const res = await fetch("/api/ai/anonymity", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ contentId: content.id, text: publicText(draft!) }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? res.statusText);
      setAiNotes(json.report);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between text-xs text-muted">
        <Link href={`/studio?p=${content.project_id}`} className="tracking-wider hover:text-navy">
          ← {proj?.name} 제작실
        </Link>
        {content.idea_id && (
          <Link href={`/ideas/${content.idea_id}`} className="hover:text-navy">
            원본 아이디어 →
          </Link>
        )}
      </div>

      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={content.status} />
          <Chip>v{content.current_version_no}</Chip>
          {approvedVersion && <Chip tone="ok">승인본 v{approvedVersion.version_no}</Chip>}
          {dirty && <Chip tone="warn">저장 안 됨</Chip>}
        </div>
        <input
          className="display w-full border-b hairline bg-transparent pb-2 text-4xl leading-tight text-navy outline-none focus:border-navy md:text-5xl"
          defaultValue={content.title}
          key={content.title}
          onBlur={(e) => e.target.value.trim() && e.target.value !== content.title && patchContent({ title: e.target.value.trim() })}
          aria-label="콘텐츠 제목"
        />
        <div className="grid gap-3 md:grid-cols-[180px_200px_1fr]">
          <Field label={`제작 예정일 · ${proj?.daily_time.slice(0, 5)} KST`}>
            <input className="input" type="date" value={content.scheduled_date ?? ""} onChange={(e) => patchContent({ scheduled_date: e.target.value || null })} />
          </Field>
          <Field label="상태">
            <select className="input" value={content.status} onChange={(e) => setStatus(e.target.value as ContentStatus)}>
              {CONTENT_STATUSES.map((s) => (
                <option key={s} value={s} disabled={s === "approved"}>
                  {STATUS_LABEL[s]}
                  {s === "approved" ? " (승인 버튼으로)" : ""}
                </option>
              ))}
            </select>
          </Field>
          <Field label="키워드 (중복 검사·검색용)">
            <TagInput value={content.keywords} onChange={(keywords) => patchContent({ keywords })} />
          </Field>
        </div>
        {dupes.length > 0 && (
          <p className="rounded-[3px] border border-warn/30 bg-[#fbf3e8] px-3 py-2 text-sm text-warn" data-testid="dupe-warning">
            최근 30일 안에 비슷한 주제의 콘텐츠가 있습니다:{" "}
            {dupes.map((d) => (
              <Link key={d.item.id} className="mr-2 underline" href={`/studio/${d.item.id}`}>
                {d.item.title}
              </Link>
            ))}
          </p>
        )}
      </header>

      <Tabs<Tab>
        value={tab}
        onChange={setTab}
        items={[
          { value: "edit", label: "제작" },
          { value: "review", label: "검토 · 승인" },
          { value: "versions", label: `버전 ${data.versions.length}` },
          { value: "download", label: "다운로드" },
        ]}
      />
      <ErrorNote error={error} />

      {tab === "edit" && (
        <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            {current.locked && !viewing && (
              <p className="rounded-[3px] border border-navy/20 bg-[#e6ecf3] px-4 py-3 text-sm text-navy">
                v{current.version_no} 은 승인되어 잠겨 있습니다. 수정 후 저장하면 승인본은 그대로 보존되고 <b>v{current.version_no + 1}</b> 로 저장되며 다시 승인이 필요합니다.
              </p>
            )}
            {viewing && (
              <p className="rounded-[3px] border border-warn/30 bg-[#fbf3e8] px-4 py-3 text-sm text-warn">
                이전 버전 v{viewing.version_no} 을 보는 중 (읽기 전용).{" "}
                <button className="underline" onClick={() => setViewNo(null)}>
                  현재 버전으로
                </button>
              </p>
            )}
            {shown.kind === "travel" ? (
              <TravelEditor
                data={shown}
                onChange={setDraft}
                assets={data.assets}
                places={data.places}
                contentId={content.id}
                readOnly={!!viewing}
                onAssetsChanged={() => reload()}
              />
            ) : (
              <ToonEditor
                data={shown}
                onChange={setDraft}
                assets={data.assets}
                characters={data.characters}
                contentId={content.id}
                readOnly={!!viewing}
                onAssetsChanged={() => reload()}
              />
            )}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            {!viewing && (
              <div className="card space-y-3 p-5">
                <Field label="변경 메모">
                  <input className="input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="무엇을 바꿨나요?" />
                </Field>
                <Button className="w-full" busy={busy === "save"} disabled={!dirty} onClick={() => save(false)}>
                  {current.locked ? `v${current.version_no + 1} 로 저장` : `v${current.version_no} 저장`}
                </Button>
                {!current.locked && (
                  <Button variant="outline" className="w-full" busy={busy === "save"} onClick={() => save(true)}>
                    새 버전(v{current.version_no + 1})으로 저장
                  </Button>
                )}
                {content.status !== "in_review" && content.status !== "approved" && (
                  <Button variant="rose" className="w-full" disabled={dirty} onClick={() => (setStatus("in_review"), setTab("review"))}>
                    검토 요청
                  </Button>
                )}
              </div>
            )}

            <div className="card p-5">
              <p className="eyebrow mb-3">{shown.kind === "travel" ? "제작 규칙 검수" : "익명성 검수"}</p>
              {issues.length === 0 ? (
                <p className="text-sm text-ok">✓ 문제 없음</p>
              ) : (
                <ul className="space-y-1.5 text-sm text-warn" data-testid="issues">
                  {issues.map((i) => (
                    <li key={i}>· {i}</li>
                  ))}
                </ul>
              )}
              {shown.kind === "toon" && (
                <div className="mt-4 space-y-3 border-t hairline pt-4">
                  <p className="text-xs leading-relaxed text-muted">
                    실명·학교명·학번·구체적 날짜를 쓰지 않고, 실제 연애 시점을 드러내지 않습니다. 해부학을 함께 공부한 이야기를 그리더라도 당시 연애 중이었다고 설정하지 않습니다. 금지어는 설정에서 등록합니다.
                  </p>
                  {ai.features.anonymity_check ? (
                    <Button size="sm" variant="rose" busy={busy === "anon"} onClick={aiAnonymity} className="w-full">
                      AI 익명성 검수
                    </Button>
                  ) : (
                    <NotConnected what="AI 익명성 검수" detail="규칙 기반 검수는 항상 동작합니다." />
                  )}
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      disabled={!!viewing}
                      checked={(shown as ToonData).anonymity_checked}
                      onChange={(e) => setDraft({ ...(draft as ToonData), anonymity_checked: e.target.checked })}
                    />
                    익명성 검수 완료
                  </label>
                </div>
              )}
            </div>

            {shown.kind === "toon" && !viewing && <ToonQcPanel contentId={content.id} dirty={dirty} onDone={() => reload()} />}

            <div className="card space-y-3 p-5">
              <p className="eyebrow">AI 제작 보조</p>
              {ai.features.travel_plan ? (
                <>
                  <p className="text-xs leading-relaxed text-muted">
                    {shown.kind === "travel"
                      ? "아카이브의 직접 경험 → 조사 자료 순으로 참고해 7장 문구·캡션·해시태그 초안을 채웁니다. 결과는 저장 전까지 반영되지 않아요."
                      : "캐릭터 설정집을 참고해 줄거리·컷·대사 초안을 채웁니다."}
                  </p>
                  <Button size="sm" variant="rose" className="w-full" busy={busy === "ai"} disabled={!!viewing} onClick={aiDraft}>
                    AI 초안 채우기
                  </Button>
                </>
              ) : (
                <NotConnected what={shown.kind === "travel" ? "AI 여행 코스·영어 문구 작성" : "AI 줄거리·대사 생성"} />
              )}
              {aiNotes && <p className="whitespace-pre-wrap rounded bg-cream/70 p-3 text-xs leading-relaxed">{aiNotes}</p>}
            </div>

            {shown.kind === "travel" && <ArchivePanel data={data} content={content} draft={draft as TravelData} setDraft={setDraft} />}
            {shown.kind === "toon" && data.characters.length > 0 && (
              <div className="card p-5">
                <p className="eyebrow mb-3">캐릭터 설정 확인</p>
                {data.characters.map((c) => (
                  <div key={c.id} className="mb-3 text-sm">
                    <p className="font-medium">
                      {c.name} <span className="text-xs text-muted">{c.species} · {c.role}</span>
                    </p>
                    <p className="text-xs text-muted">{c.appearance}</p>
                  </div>
                ))}
                <Link href="/characters" className="text-xs text-navy underline-offset-4 hover:underline">
                  설정집 열기 →
                </Link>
              </div>
            )}
          </aside>
        </div>
      )}

      {tab === "review" && (
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <p className="eyebrow">전체 페이지 미리보기 · v{viewing ? viewing.version_no : current.version_no}</p>
                {shown.kind === "toon" &&
                  (["feed", "reels"] as Variant[]).map((v) => (
                    <button
                      key={v}
                      onClick={() => setPreviewVariant(v)}
                      className={`rounded-full border px-2.5 py-0.5 text-xs ${previewVariant === v ? "border-navy bg-navy text-ivory" : "border-line text-muted"}`}
                    >
                      {VARIANTS[v].label}
                    </button>
                  ))}
              </div>
              <select className="input !w-auto !py-1 !text-xs" value={viewNo ?? current.version_no} onChange={(e) => setViewNo(Number(e.target.value))} aria-label="미리볼 버전">
                {data.versions.map((v) => (
                  <option key={v.id} value={v.version_no}>
                    v{v.version_no}
                    {v.locked ? " (승인)" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {units.map((u, i) => (
                <PageTile key={u.no} unit={u} onClick={() => setZoom(i)} tall={shown.kind === "toon" && previewVariant === "reels"} />
              ))}
            </div>
            {shown.kind === "travel" && (
              <div className="card mt-6 p-5 text-sm">
                <p className="eyebrow mb-2">Caption</p>
                <p className="whitespace-pre-wrap">{shown.caption || <span className="text-muted">—</span>}</p>
                <p className="mt-2 text-rose-deep">{shown.hashtags.filter(Boolean).join(" ")}</p>
              </div>
            )}
            <div className="mt-8">
              <Comments projectId={content.project_id} targetType="content" targetId={content.id} title="전체 댓글" versionNo={current.version_no} />
            </div>
          </div>
          <aside className="space-y-6">
            <div className="card space-y-3 p-5">
              <p className="eyebrow">최종 승인</p>
              <p className="text-xs leading-relaxed text-muted">두 사람 중 한 명만 승인해도 최종 승인 완료입니다. 승인자·시각·버전이 기록되고, 그 버전은 잠깁니다.</p>
              {current.locked ? (
                <p className="text-sm text-ok">✓ v{current.version_no} 승인 완료</p>
              ) : (
                <Button
                  className="w-full"
                  busy={busy === "approve"}
                  disabled={dirty}
                  data-testid="approve"
                  onClick={async () => {
                    if (issues.length && !confirm(`검수 경고 ${issues.length}건이 있습니다. 그래도 v${current.version_no} 을 승인할까요?`)) return;
                    setBusy("approve");
                    const { error } = await supabase().rpc("approve_content", { p_content_id: content.id });
                    setBusy(null);
                    if (error) setError(error.message);
                    void reload();
                  }}
                >
                  v{current.version_no} 승인
                </Button>
              )}
              {dirty && <p className="text-xs text-warn">저장하지 않은 변경이 있어 승인할 수 없습니다.</p>}
            </div>

            <div className="card space-y-3 p-5">
              <p className="eyebrow">수정 요청</p>
              <select className="input" value={revPage} onChange={(e) => setRevPage(e.target.value)} aria-label="수정 요청 페이지">
                <option value="">전체</option>
                {units.map((u) => (
                  <option key={u.no} value={u.no}>
                    {u.no}번 {shown.kind === "travel" ? "페이지" : "컷"}
                  </option>
                ))}
              </select>
              <textarea className="input" rows={3} value={revBody} onChange={(e) => setRevBody(e.target.value)} placeholder="무엇을 고치면 좋을까요?" />
              <Button
                variant="outline"
                className="w-full"
                disabled={!revBody.trim()}
                busy={busy === "rev"}
                onClick={async () => {
                  setBusy("rev");
                  const { error } = await supabase().rpc("request_revision", {
                    p_content_id: content.id,
                    p_body: revBody.trim(),
                    p_page_no: revPage ? Number(revPage) : null,
                  });
                  setBusy(null);
                  if (error) return setError(error.message);
                  setRevBody("");
                  void reload();
                }}
              >
                수정 요청 보내기
              </Button>
            </div>

            <div>
              <p className="eyebrow mb-2">승인 이력</p>
              {data.approvals.length === 0 ? (
                <p className="text-xs text-muted">아직 승인 이력이 없습니다.</p>
              ) : (
                <ul className="space-y-2 text-sm" data-testid="approval-history">
                  {data.approvals.map((a) => (
                    <li key={a.id} className="flex items-center gap-2">
                      <Avatar member={memberById(a.approved_by)} size={18} />
                      <span>
                        <b>v{a.version_no}</b> · {memberById(a.approved_by)?.display_name}
                      </span>
                      <span className="text-xs text-muted">{formatDateTime(a.approved_at)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        </div>
      )}

      {tab === "versions" && <VersionCompare versions={data.versions} approvals={data.approvals} assets={assetMap} />}

      {tab === "download" && <DownloadPanel content={content} versions={data.versions} assets={assetMap} approvedId={content.approved_version_id} />}

      <Modal open={zoom !== null} onClose={() => setZoom(null)} title={zoom !== null ? `${units[zoom].no}. ${units[zoom].label}` : ""} wide>
        {zoom !== null && (
          <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
            <div>
              {units[zoom].asset ? (
                <AssetImage asset={units[zoom].asset!} full className="ratio-45 w-full !object-contain" />
              ) : (
                <PageTile unit={units[zoom]} />
              )}
              <div className="mt-3 flex justify-between">
                <Button size="sm" variant="ghost" disabled={zoom === 0} onClick={() => setZoom(zoom - 1)}>
                  ← 이전
                </Button>
                <Button size="sm" variant="ghost" disabled={zoom === units.length - 1} onClick={() => setZoom(zoom + 1)}>
                  다음 →
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="display text-2xl text-navy">{units[zoom].title}</p>
                <p className="mt-2 whitespace-pre-wrap text-sm">{units[zoom].body}</p>
              </div>
              <Comments
                projectId={content.project_id}
                targetType="content"
                targetId={content.id}
                pageNo={units[zoom].no}
                versionNo={current.version_no}
                filterPage
                title={`${units[zoom].no}번 페이지 댓글`}
              />
            </div>
          </div>
        )}
      </Modal>

      <div className="border-t hairline pt-6 text-right">
        <button
          className="text-xs text-muted hover:text-danger"
          onClick={async () => {
            if (data.approvals.length && !confirm("승인 이력이 있는 콘텐츠입니다. 정말 삭제할까요?")) return;
            if (!confirm("콘텐츠와 모든 버전을 삭제할까요?")) return;
            await supabase().from("comments").delete().eq("target_type", "content").eq("target_id", content.id);
            const { error } = await supabase().from("contents").delete().eq("id", content.id);
            if (error) return setError(error.message);
            router.replace(`/studio?p=${content.project_id}`);
          }}
        >
          콘텐츠 삭제
        </button>
      </div>
    </div>
  );
}

function ArchivePanel({
  data,
  content,
  draft,
  setDraft,
}: {
  data: { places: import("@/lib/types").Place[]; assets: Asset[]; research: import("@/lib/types").PlaceResearch[]; siblings: Content[] };
  content: Content;
  draft: TravelData;
  setDraft: (d: TravelData) => void;
}) {
  const m = matchArchive(`${content.title} ${content.keywords.join(" ")}`, {
    places: data.places,
    assets: data.assets,
    research: data.research,
    contents: data.siblings.filter((c) => c.id !== content.id),
  });
  return (
    <div className="card p-5" data-testid="archive-panel">
      <p className="eyebrow mb-3">아카이브 자동 연결</p>
      {m.places.length === 0 ? (
        <p className="text-xs text-muted">제목·키워드와 맞는 아카이브 장소가 없습니다.</p>
      ) : (
        <div className="space-y-4 text-sm">
          <div>
            <p className="mb-1.5 text-xs font-medium text-navy">직접 경험 · 우리 후기</p>
            <ul className="space-y-2">
              {m.places
                .filter((p) => p.status === "visited")
                .slice(0, 6)
                .map((p) => {
                  const linked = draft.place_ids.includes(p.id);
                  return (
                    <li key={p.id}>
                      <div className="flex items-center justify-between gap-2">
                        <Link href={`/archive/places/${p.id}`} className="truncate hover:underline">
                          {p.name}
                        </Link>
                        <button
                          className={`shrink-0 text-xs ${linked ? "text-ok" : "text-navy underline"}`}
                          onClick={() => !linked && setDraft({ ...draft, place_ids: [...draft.place_ids, p.id] })}
                        >
                          {linked ? "연결됨" : "연결"}
                        </button>
                      </div>
                      {p.review && <p className="line-clamp-2 text-xs text-muted">“{p.review}”</p>}
                    </li>
                  );
                })}
            </ul>
          </div>
          <p className="text-xs text-muted">
            직접 찍은 사진 {m.ownPhotos.length}장 · 사용 허가된 기타 사진 {m.otherUsablePhotos.length}장
          </p>
          {m.research.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs font-medium text-rose-deep">AI·조사 자료 (직접 경험 아님)</p>
              <ul className="space-y-1 text-xs text-muted">
                {m.research.slice(0, 6).map((r) => (
                  <li key={r.id}>· {r.title}</li>
                ))}
              </ul>
            </div>
          )}
          {m.pastContents.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs font-medium text-navy">관련 제작 이력</p>
              <ul className="space-y-1 text-xs">
                {m.pastContents.slice(0, 5).map((c) => (
                  <li key={c.id}>
                    <Link href={`/studio/${c.id}`} className="hover:underline">
                      {c.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DownloadPanel({
  content,
  versions,
  assets,
  approvedId,
}: {
  content: Content;
  versions: import("@/lib/types").ContentVersion[];
  assets: Map<string, Asset>;
  approvedId: string | null;
}) {
  const [vno, setVno] = useState(versions.find((v) => v.id === approvedId)?.version_no ?? versions[0].version_no);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const v = versions.find((x) => x.version_no === vno)!;
  const units = previewUnits(v.data, assets);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-3">
        <Field label="버전">
          <select className="input !w-auto" value={vno} onChange={(e) => setVno(Number(e.target.value))}>
            {versions.map((x) => (
              <option key={x.id} value={x.version_no}>
                v{x.version_no}
                {x.id === approvedId ? " — 최종 승인본" : x.locked ? " — 이전 승인본" : ""}
              </option>
            ))}
          </select>
        </Field>
        <Button
          busy={busy}
          onClick={async () => {
            setBusy(true);
            setError(null);
            try {
              await exportZip({ title: content.title, versionNo: v.version_no, data: v.data, assets });
            } catch (e) {
              setError(e instanceof Error ? e.message : String(e));
            } finally {
              setBusy(false);
            }
          }}
        >
          ZIP 다운로드 (개별 이미지 + 전체 미리보기 + 캡션)
        </Button>
      </div>
      {v.id !== approvedId && <p className="text-sm text-warn">이 버전은 최종 승인본이 아닙니다.</p>}
      <ErrorNote error={error} />
      <p className="text-xs text-muted">Instagram·Metricool 자동 업로드는 하지 않습니다. 다운로드한 파일로 직접 게시하세요.</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-7">
        {units.map((u) => (
          <div key={u.no}>
            <PageTile unit={u} />
            {u.asset && (
              <button
                className="mt-1 text-xs text-navy underline-offset-4 hover:underline"
                onClick={async () => {
                  const { downloadBlob, saveBlob } = await import("@/lib/storage");
                  saveBlob(await downloadBlob(u.asset!.storage_path), `${String(u.no).padStart(2, "0")}-${u.asset!.file_name}`);
                }}
              >
                {u.no}번 받기
              </button>
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-muted">마지막 수정 {formatDateTime(v.updated_at)}</p>
    </div>
  );
}

function ToonQcPanel({ contentId, dirty, onDone }: { contentId: string; dirty: boolean; onDone: () => void }) {
  const [busy, setBusy] = useState(false);
  const [report, setReport] = useState<(ToonQcReport & { vision_available: boolean }) | null>(null);
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="card space-y-3 p-5" data-testid="toon-qc">
      <p className="eyebrow">이미지 자동 검수</p>
      <p className="text-xs leading-relaxed text-muted">
        컷마다 피드·릴스 이미지가 다 있는지, 정확한 크기(1080×1350 / 1080×1920)와 PNG 인지, 컷 순서·캡션·해시태그 5개·익명성을 검사합니다. 그림체·잘린 글자·콜라주
        흔적은 서버 이미지 판독(Claude 키)이 있으면 함께 검사하고, 없으면 ChatGPT 나 사람이 확인합니다.
      </p>
      <Button
        size="sm"
        className="w-full"
        busy={busy}
        disabled={dirty}
        onClick={async () => {
          setBusy(true);
          setError(null);
          try {
            const res = await fetch("/api/toon/qc", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ contentId, recheck: true }) });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error ?? res.statusText);
            setReport(json);
            onDone();
          } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
          } finally {
            setBusy(false);
          }
        }}
      >
        이미지 검수 실행
      </Button>
      {dirty && <p className="text-xs text-warn">저장한 뒤에 검수할 수 있어요.</p>}
      <ErrorNote error={error} />
      {report && (
        <div className="space-y-2 text-sm" data-testid="qc-report">
          {report.complete ? (
            <p className="text-ok">✓ {report.cuts}컷 × 2세트 완료{report.needs_review.length ? ` (눈으로 확인 필요 ${report.needs_review.length}칸)` : ""}</p>
          ) : (
            <p className="text-warn">다시 만들 칸 {report.redo.length}개 · 대본 문제 {report.script_issues.length}개</p>
          )}
          {report.redo.length > 0 && (
            <ul className="space-y-1 text-xs text-danger">
              {report.redo.map((r) => (
                <li key={`${r.cut_no}-${r.variant}`}>
                  · 컷 {r.cut_no} {VARIANTS[r.variant].label} — {r.reason}
                </li>
              ))}
            </ul>
          )}
          {report.script_issues.length > 0 && (
            <ul className="space-y-1 text-xs text-warn">
              {report.script_issues.map((i) => (
                <li key={i}>· {i}</li>
              ))}
            </ul>
          )}
          {!report.vision_available && <p className="text-[0.7rem] text-muted">서버 이미지 판독 미연결 — 그림체·잘린 글자는 눈으로 확인해 주세요.</p>}
        </div>
      )}
    </div>
  );
}
