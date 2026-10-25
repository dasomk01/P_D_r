"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useLive } from "@/lib/live";
import { getAssets, getContents, getPlaces } from "@/lib/queries";
import { ASSET_KIND_LABEL, ORIGIN_LABEL } from "@/lib/constants";
import { formatKDate } from "@/lib/dates";
import type { Asset, AssetKind, AssetOrigin, ProjectId } from "@/lib/types";
import { useStudio } from "@/components/studio-context";
import { AssetImage, OriginBadge } from "@/components/asset-image";
import { AssetEditor } from "@/components/asset-editor";
import { Uploader } from "@/components/uploader";
import { Field, Loading, PageHeader, StatusBadge, Tabs } from "@/components/ui";

const TRAVEL_KINDS: AssetKind[] = ["photo", "file", "page_image", "final", "other"];
const TOON_KINDS: AssetKind[] = ["character_ref", "pose_ref", "style_ref", "storyboard", "page_image", "final", "file", "other"];

export function Library() {
  const params = useSearchParams();
  const router = useRouter();
  const project = (params.get("p") as ProjectId) || "korea-trip";
  const { me } = useStudio();
  const [section, setSection] = useState<"assets" | "finished">("assets");
  const [kind, setKind] = useState<AssetKind | "">("");
  const [origin, setOrigin] = useState<AssetOrigin | "">("");
  const [usable, setUsable] = useState<"" | "yes" | "no">("");
  const [q, setQ] = useState("");
  const [uploadKind, setUploadKind] = useState<AssetKind>(project === "korea-trip" ? "photo" : "character_ref");
  const [uploadOrigin, setUploadOrigin] = useState<AssetOrigin>("own_photo");
  const [editing, setEditing] = useState<Asset | null>(null);
  const [fq, setFq] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const { data, reload } = useLive(
    `library:${project}`,
    async () => {
      const [assets, contents, places] = await Promise.all([getAssets({ project_id: project }), getContents(project), project === "korea-trip" ? getPlaces() : Promise.resolve([])]);
      return { assets, contents, places };
    },
    ["assets", "contents"],
  );

  const assets = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (data?.assets ?? []).filter(
      (a) =>
        (!kind || a.kind === kind) &&
        (!origin || a.origin === origin) &&
        (!usable || (usable === "yes") === a.usage_allowed) &&
        (!needle || `${a.file_name} ${a.caption} ${a.location_text} ${a.ai_tags.join(" ")} ${a.rights_holder}`.toLowerCase().includes(needle)),
    );
  }, [data, q, kind, origin, usable]);

  const finished = useMemo(() => {
    const needle = fq.trim().toLowerCase();
    return (data?.contents ?? [])
      .filter((c) => c.status === "approved")
      .filter((c) => !needle || `${c.title} ${c.keywords.join(" ")}`.toLowerCase().includes(needle))
      .filter((c) => {
        const d = c.scheduled_date ?? c.updated_at.slice(0, 10);
        return (!from || d >= from) && (!to || d <= to);
      });
  }, [data, fq, from, to]);

  const kinds = project === "korea-trip" ? TRAVEL_KINDS : TOON_KINDS;

  return (
    <div>
      <PageHeader
        eyebrow="Library"
        title="자료 보관함"
        sub={project === "korea-trip" ? "직접 찍은 사진, 방문 장소 자료, 라이선스 정보, 완성 콘텐츠" : "캐릭터 원본, 표정·포즈 레퍼런스, 그림체, 스토리보드, 완성 이미지"}
      />
      <Tabs<ProjectId>
        value={project}
        onChange={(v) => router.replace(`/library?p=${v}`)}
        items={[
          { value: "korea-trip", label: "KOREA TRIP" },
          { value: "med-toon", label: "MED SCHOOL TOON" },
        ]}
      />
      <div className="mt-4 flex gap-4 text-sm">
        {(
          [
            ["assets", "자료"],
            ["finished", "완성 콘텐츠"],
          ] as const
        ).map(([v, l]) => (
          <button key={v} onClick={() => setSection(v)} className={section === v ? "text-navy underline underline-offset-4" : "text-muted"}>
            {l}
          </button>
        ))}
      </div>

      {!data ? (
        <Loading />
      ) : section === "assets" ? (
        <div className="mt-6 space-y-6">
          <div className="card grid gap-3 p-4 md:grid-cols-[180px_180px_1fr]">
            <Field label="올릴 자료 종류">
              <select className="input" value={uploadKind} onChange={(e) => setUploadKind(e.target.value as AssetKind)}>
                {kinds.map((k) => (
                  <option key={k} value={k}>
                    {ASSET_KIND_LABEL[k]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="출처">
              <select className="input" value={uploadOrigin} onChange={(e) => setUploadOrigin(e.target.value as AssetOrigin)}>
                {Object.entries(ORIGIN_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </Field>
            <Uploader
              accept="image/*,application/pdf,.txt,.md,.psd,.clip,.procreate"
              label="자료 올리기"
              meta={{
                project_id: project,
                kind: uploadKind,
                origin: uploadOrigin,
                usage_allowed: uploadOrigin === "own_photo",
                rights_holder: uploadOrigin === "own_photo" ? me.display_name : "",
              }}
              onUploaded={() => reload()}
            />
          </div>

          <div className="grid gap-2 md:grid-cols-[1fr_auto_auto_auto]">
            <input className="input" placeholder="파일명·설명·장소·AI 태그 검색" value={q} onChange={(e) => setQ(e.target.value)} />
            <select className="input md:!w-auto" value={kind} onChange={(e) => setKind(e.target.value as AssetKind | "")} aria-label="종류">
              <option value="">모든 종류</option>
              {kinds.map((k) => (
                <option key={k} value={k}>
                  {ASSET_KIND_LABEL[k]}
                </option>
              ))}
            </select>
            <select className="input md:!w-auto" value={origin} onChange={(e) => setOrigin(e.target.value as AssetOrigin | "")} aria-label="출처">
              <option value="">모든 출처</option>
              {Object.entries(ORIGIN_LABEL).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
            <select className="input md:!w-auto" value={usable} onChange={(e) => setUsable(e.target.value as "" | "yes" | "no")} aria-label="사용 허가">
              <option value="">사용 허가 전체</option>
              <option value="yes">사용 가능</option>
              <option value="no">사용 미허가</option>
            </select>
          </div>
          <p className="text-xs text-muted">{assets.length}개</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {assets.map((a) => (
              <button key={a.id} onClick={() => setEditing(a)} className="group block text-left" data-testid="library-item">
                <AssetImage asset={a} className="aspect-square w-full transition group-hover:opacity-85" />
                <div className="mt-1.5 space-y-0.5">
                  <OriginBadge asset={a} />
                  <p className="truncate text-xs">{a.caption || a.file_name}</p>
                  <p className="text-[0.66rem] text-muted">
                    {ASSET_KIND_LABEL[a.kind]}
                    {a.rights_holder && ` · © ${a.rights_holder}`}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <div className="grid gap-2 md:grid-cols-[1fr_auto_auto]">
            <input className="input" placeholder="주제·키워드 검색" value={fq} onChange={(e) => setFq(e.target.value)} />
            <input className="input md:!w-auto" type="date" value={from} onChange={(e) => setFrom(e.target.value)} aria-label="시작일" />
            <input className="input md:!w-auto" type="date" value={to} onChange={(e) => setTo(e.target.value)} aria-label="종료일" />
          </div>
          <ul className="divide-y hairline border-y hairline">
            {finished.map((c) => (
              <li key={c.id}>
                <Link href={`/studio/${c.id}`} className="flex items-center gap-3 py-3 hover:bg-cream/40">
                  <span className="w-28 shrink-0 text-xs text-muted">{formatKDate(c.scheduled_date ?? c.updated_at.slice(0, 10))}</span>
                  <span className="flex-1 truncate">{c.title}</span>
                  <span className="hidden text-xs text-rose-deep md:inline">{c.keywords.map((k) => `#${k}`).join(" ")}</span>
                  <StatusBadge status={c.status} />
                </Link>
              </li>
            ))}
            {finished.length === 0 && <li className="py-6 text-center text-sm text-muted">승인 완료된 콘텐츠가 없습니다.</li>}
          </ul>
        </div>
      )}
      <AssetEditor asset={editing} onClose={() => setEditing(null)} onChanged={() => reload()} places={project === "korea-trip" ? data?.places : undefined} />
    </div>
  );
}
