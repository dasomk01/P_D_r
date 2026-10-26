"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { SLOT_LABEL, slotStatus, structuralCheck, VARIANTS, type SlotStatus, type Variant } from "@/lib/toon-spec";
import type { Asset, Character, ImageQc, ToonCut, ToonData } from "@/lib/types";
import { AssetImage, Lightbox } from "../asset-image";
import { Uploader } from "../uploader";
import { Button, Field, NotConnected } from "../ui";
import { PhotoPicker } from "./photo-picker";

const STATUS_TONE: Record<SlotStatus, string> = {
  missing: "bg-cream text-muted",
  pass: "bg-[#eef3ec] text-ok",
  fail: "bg-[#fbeeee] text-danger",
  review: "bg-[#f6e8d8] text-warn",
};

/** 서버 검수 전이라도 업로드 때 기록된 크기로 미리 규격 판단 */
export function effectiveQc(a: Asset, variant: Variant): ImageQc {
  if (a.qc?.structural) return a.qc;
  const pre = structuralCheck({ format: a.mime_type === "image/png" ? "png" : "unknown", width: a.width ?? 0, height: a.height ?? 0 }, variant);
  return { ...(a.qc ?? {}), structural: pre };
}

export function SlotBadge({ status }: { status: SlotStatus }) {
  return <span className={`rounded-full px-1.5 py-0.5 text-[0.6rem] font-medium ${STATUS_TONE[status]}`}>{SLOT_LABEL[status]}</span>;
}

export function ToonEditor({
  data,
  onChange,
  assets,
  characters,
  contentId,
  readOnly,
  onAssetsChanged,
}: {
  data: ToonData;
  onChange: (d: ToonData) => void;
  assets: Asset[];
  characters: Character[];
  contentId: string;
  readOnly: boolean;
  onAssetsChanged: () => void;
}) {
  const [picking, setPicking] = useState<{ cut: number; variant: Variant } | null>(null);
  const [zoom, setZoom] = useState<Asset | null>(null);
  const byId = new Map(assets.map((a) => [a.id, a]));
  // 여러 칸을 동시에 올려도 서로 덮어쓰지 않도록 항상 최신 데이터 기준으로 수정
  const latest = useRef(data);
  useEffect(() => {
    latest.current = data;
  }, [data]);
  const set = <K extends keyof ToonData>(k: K, v: ToonData[K]) => {
    latest.current = { ...latest.current, [k]: v };
    onChange(latest.current);
  };
  const setCut = (i: number, patch: Partial<ToonCut>) => set("cuts", latest.current.cuts.map((c, j) => (j === i ? { ...c, ...patch } : c)));
  const speakers = [...characters.map((c) => c.name), "내레이션", "기타"];
  const slotKey = (v: Variant) => (v === "feed" ? "asset_id" : "reel_asset_id") as "asset_id" | "reel_asset_id";

  // 컴포넌트가 아닌 렌더 함수 — 업로드 중 다시 그려져도 업로더 상태가 초기화되지 않게
  function slot(cut: ToonCut, i: number, variant: Variant) {
    const id = cut[slotKey(variant)] ?? null;
    const a = id ? byId.get(id) : undefined;
    const status = a ? slotStatus({ qc: effectiveQc(a, variant) }) : "missing";
    const issues = a ? Object.values(effectiveQc(a, variant)).flatMap((p) => (p && typeof p === "object" && "ok" in p && !p.ok ? p.issues : [])) : [];
    return (
      <div key={variant} className="space-y-1" data-testid={`slot-${cut.no}-${variant}`}>
        <div className="flex items-center justify-between gap-1">
          <span className="text-[0.62rem] tracking-wide text-muted">{VARIANTS[variant].label}</span>
          <SlotBadge status={status} />
        </div>
        <button type="button" className="block w-full" onClick={() => (a ? setZoom(a) : !readOnly && setPicking({ cut: i, variant }))}>
          {a ? (
            <AssetImage asset={a} className={`${variant === "feed" ? "aspect-[4/5]" : "aspect-[9/16]"} w-full !object-contain`} />
          ) : (
            <span className={`flex ${variant === "feed" ? "aspect-[4/5]" : "aspect-[9/16]"} w-full items-center justify-center border border-dashed text-[0.62rem] text-muted`}>
              {VARIANTS[variant].width}×{VARIANTS[variant].height}
            </span>
          )}
        </button>
        {issues.length > 0 && <p className="text-[0.62rem] leading-tight text-danger">{issues.join(" / ")}</p>}
        {!readOnly && (
          <div className="flex flex-wrap items-center gap-1">
            <Uploader
              compact
              accept="image/png,image/*"
              label={a ? "교체" : "올리기"}
              meta={{ project_id: "med-toon", content_id: contentId, kind: "page_image", variant, origin: "own_photo", usage_allowed: true, license: "자체 제작" }}
              onUploaded={(list) => {
                if (list[0]) setCut(i, { [slotKey(variant)]: list[0].id } as Partial<ToonCut>);
                onAssetsChanged();
              }}
            />
            {a && (
              <button
                type="button"
                className={`text-[0.62rem] ${a.qc?.human?.ok === false ? "text-danger" : "text-muted hover:text-danger"}`}
                onClick={async () => {
                  const failed = a.qc?.human?.ok === false;
                  const note = failed ? "" : (prompt("무엇이 문제인가요? (예: 곰 얼굴이 다름, 글자 잘림)") ?? "");
                  const qc: ImageQc = { ...(a.qc ?? {}), human: failed ? { ok: true, issues: [], by: "human" } : { ok: false, issues: [note || "사람이 다시 제작 요청"], by: "human" } };
                  await supabase().from("assets").update({ qc }).eq("id", a.id);
                  onAssetsChanged();
                }}
              >
                {a.qc?.human?.ok === false ? "다시 제작 해제" : "다시 제작"}
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <fieldset disabled={readOnly} className="space-y-10">
      <Field label="에피소드 줄거리">
        <textarea className="input min-h-[110px]" value={data.synopsis} onChange={(e) => set("synopsis", e.target.value)} />
      </Field>

      <section>
        <p className="eyebrow mb-2">컷별 스토리보드 · 대사 · 이미지</p>
        <p className="mb-4 text-xs leading-relaxed text-muted">
          컷 수는 이야기에 맞게 자유롭게. 한 컷 = 독립된 이미지 한 장 (콜라주를 만든 뒤 자르기 금지). 같은 대본으로 피드 4:5 1080×1350 PNG 와 릴스 9:16
          1080×1920 PNG 를 각각 한 장씩 — 릴스도 동영상이 아닌 정지 이미지입니다. ChatGPT 연결 시 upload_cut_image 로 자동 저장되고, 여기서 갤러리 사진을 직접 올릴 수도 있어요.
        </p>
        <div className="mb-4">
          <NotConnected what="사이트 안의 AI 이미지 생성" detail="이미지는 ChatGPT(연결된 앱)에서 그려 저장하거나 직접 올립니다." />
        </div>
        <div className="space-y-4">
          {data.cuts.map((c, i) => (
            <div key={i} className="card grid gap-4 p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,0.7fr)_minmax(0,2fr)]" data-testid="cut-editor">
              {slot(c, i, "feed")}
              {slot(c, i, "reels")}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="display text-2xl text-rose-deep">컷 {c.no}</span>
                  <span className="flex-1" />
                  {!readOnly && (
                    <>
                      <button type="button" className="text-xs text-muted disabled:opacity-30" disabled={i === 0} onClick={() => set("cuts", swap(data.cuts, i, i - 1))}>
                        ↑
                      </button>
                      <button type="button" className="text-xs text-muted disabled:opacity-30" disabled={i === data.cuts.length - 1} onClick={() => set("cuts", swap(data.cuts, i, i + 1))}>
                        ↓
                      </button>
                      <button type="button" className="text-xs text-muted hover:text-danger" onClick={() => set("cuts", data.cuts.filter((_, j) => j !== i).map((x, j) => ({ ...x, no: j + 1 })))}>
                        컷 삭제
                      </button>
                    </>
                  )}
                </div>
                <textarea className="input" rows={2} placeholder="장면 설명 (배경·행동·표정)" value={c.scene} onChange={(e) => setCut(i, { scene: e.target.value })} />
                {c.lines.map((l, k) => (
                  <div key={k} className="flex gap-2">
                    <select className="input !w-32" value={l.speaker} onChange={(e) => setCut(i, { lines: c.lines.map((x, m) => (m === k ? { ...x, speaker: e.target.value } : x)) })}>
                      {speakers.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                    <input className="input" placeholder="대사" value={l.text} onChange={(e) => setCut(i, { lines: c.lines.map((x, m) => (m === k ? { ...x, text: e.target.value } : x)) })} />
                    <button type="button" className="text-xs text-muted" onClick={() => setCut(i, { lines: c.lines.filter((_, m) => m !== k) })}>
                      ×
                    </button>
                  </div>
                ))}
                <Button type="button" size="sm" variant="ghost" onClick={() => setCut(i, { lines: [...c.lines, { speaker: speakers[0], text: "" }] })}>
                  + 대사
                </Button>
                <input className="input" placeholder="내부 메모" value={c.notes} onChange={(e) => setCut(i, { notes: e.target.value })} />
              </div>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-2"
          onClick={() => set("cuts", [...data.cuts, { no: data.cuts.length + 1, scene: "", lines: [], asset_id: null, reel_asset_id: null, notes: "" }])}
        >
          + 컷 추가
        </Button>
      </section>

      <section className="grid gap-4">
        <Field label="캡션 (1개)">
          <textarea className="input min-h-[90px]" value={data.caption} onChange={(e) => set("caption", e.target.value)} />
        </Field>
        <Field label="해시태그 — 정확히 5개">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
            {[0, 1, 2, 3, 4].map((i) => (
              <input
                key={i}
                className="input"
                placeholder={`#태그${i + 1}`}
                value={data.hashtags[i] ?? ""}
                onChange={(e) => {
                  const h = [...data.hashtags];
                  while (h.length < 5) h.push("");
                  let v = e.target.value.replace(/\s/g, "");
                  if (v && !v.startsWith("#")) v = "#" + v;
                  h[i] = v;
                  set("hashtags", h.slice(0, 5));
                }}
              />
            ))}
          </div>
        </Field>
      </section>

      <PhotoPicker
        open={picking !== null}
        onClose={() => setPicking(null)}
        assets={assets.filter((a) => a.kind === "page_image" || a.kind === "final")}
        preferredPlaceIds={[]}
        onPick={(a) => picking && setCut(picking.cut, { [slotKey(picking.variant)]: a?.id ?? null } as Partial<ToonCut>)}
      />
      <Lightbox asset={zoom} onClose={() => setZoom(null)} />
    </fieldset>
  );
}

function swap<T>(arr: T[], i: number, j: number): T[] {
  const a = [...arr];
  [a[i], a[j]] = [a[j], a[i]];
  return a.map((x, k) => ({ ...(x as object), no: k + 1 }) as T);
}
