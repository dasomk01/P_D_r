"use client";

import Link from "next/link";
import { useState } from "react";
import { TRAVEL_FORMATS } from "@/lib/constants";
import type { Asset, Place, TravelData } from "@/lib/types";
import { AssetImage } from "../asset-image";
import { Uploader } from "../uploader";
import { Button, Chip, Field, NotConnected } from "../ui";
import { PhotoPicker } from "./photo-picker";

export function TravelEditor({
  data,
  onChange,
  assets,
  places,
  contentId,
  readOnly,
  onAssetsChanged,
}: {
  data: TravelData;
  onChange: (d: TravelData) => void;
  assets: Asset[];
  places: Place[];
  contentId: string;
  readOnly: boolean;
  onAssetsChanged: () => void;
}) {
  const [picking, setPicking] = useState<number | null>(null);
  const byId = new Map(assets.map((a) => [a.id, a]));
  const set = <K extends keyof TravelData>(k: K, v: TravelData[K]) => onChange({ ...data, [k]: v });
  const setPage = (i: number, patch: Partial<TravelData["pages"][number]>) =>
    set(
      "pages",
      data.pages.map((p, j) => (j === i ? { ...p, ...patch } : p)),
    );

  return (
    <fieldset disabled={readOnly} className="space-y-10">
      <section className="grid gap-4 md:grid-cols-[200px_1fr]">
        <Field label="구성">
          <select className="input" value={data.format} onChange={(e) => set("format", e.target.value)}>
            {TRAVEL_FORMATS.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </Field>
        <Field
          label="콘셉트 (내부 메모)"
          hint={data.format === "1박 2일" ? "당일치기 핵심 코스에 장소를 확장" : data.format === "2박 3일" ? "1박 2일보다 여유로운 여행 경험으로 확장" : data.format === "당일치기" ? "핵심 필수 코스 중심" : undefined}
        >
          <input className="input" value={data.concept} onChange={(e) => set("concept", e.target.value)} />
        </Field>
      </section>

      <section>
        <p className="eyebrow mb-3">코스 · 이동 동선</p>
        <ol className="space-y-2">
          {data.route.map((r, i) => (
            <li key={i} className="card grid gap-2 p-3 md:grid-cols-[24px_1.3fr_1fr_0.8fr_1fr_auto] md:items-center">
              <span className="display text-lg text-rose-deep">{i + 1}</span>
              <select
                className="input"
                value={r.place_id ?? ""}
                onChange={(e) => {
                  const p = places.find((x) => x.id === e.target.value);
                  const route = [...data.route];
                  route[i] = { ...r, place_id: p?.id ?? null, name: p?.name ?? r.name };
                  onChange({ ...data, route, place_ids: [...new Set([...data.place_ids, ...(p ? [p.id] : [])])] });
                }}
              >
                <option value="">직접 입력</option>
                {places.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.status === "visited" ? "✓" : ""}
                  </option>
                ))}
              </select>
              <input className="input" placeholder="장소명" value={r.name} onChange={(e) => set("route", data.route.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} />
              <input className="input" placeholder="머무는 시간" value={r.duration} onChange={(e) => set("route", data.route.map((x, j) => (j === i ? { ...x, duration: e.target.value } : x)))} />
              <input className="input" placeholder="다음까지 이동 (예: Bus 202, 15 min)" value={r.transport} onChange={(e) => set("route", data.route.map((x, j) => (j === i ? { ...x, transport: e.target.value } : x)))} />
              <button type="button" className="text-xs text-muted hover:text-danger" onClick={() => set("route", data.route.filter((_, j) => j !== i))}>
                삭제
              </button>
            </li>
          ))}
        </ol>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-2"
          onClick={() => set("route", [...data.route, { place_id: null, name: "", transport: "", duration: "", note: "" }])}
        >
          + 코스 추가
        </Button>
      </section>

      <section>
        <p className="eyebrow mb-3">장소 정보 확인 · 공식 출처</p>
        <div className="space-y-2">
          {data.facts.map((f, i) => (
            <div key={i} className="grid gap-2 md:grid-cols-[1fr_1.4fr_1.4fr_auto] md:items-center">
              <input className="input" value={f.item} onChange={(e) => set("facts", data.facts.map((x, j) => (j === i ? { ...x, item: e.target.value } : x)))} />
              <input className="input" placeholder="내용" value={f.value} onChange={(e) => set("facts", data.facts.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))} />
              <input className="input" placeholder="공식 출처 URL" value={f.source_url} onChange={(e) => set("facts", data.facts.map((x, j) => (j === i ? { ...x, source_url: e.target.value } : x)))} />
              <label className="flex items-center gap-1.5 text-xs">
                <input type="checkbox" checked={f.verified} onChange={(e) => set("facts", data.facts.map((x, j) => (j === i ? { ...x, verified: e.target.checked } : x)))} />
                확인
              </label>
            </div>
          ))}
        </div>
        <Button type="button" variant="ghost" size="sm" className="mt-2" onClick={() => set("facts", [...data.facts, { item: "", value: "", source_url: "", verified: false }])}>
          + 확인 항목
        </Button>
      </section>

      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="eyebrow">7-page carousel · 1080 × 1350 · English</p>
        </div>
        <div className="mb-4">
          <NotConnected
            what="AI 이미지 생성 (페이지 디자인 자동 제작)"
            detail="연결된 이미지 생성 서비스가 없습니다. 디자인 툴에서 완성한 페이지 이미지를 각 페이지에 업로드하면 미리보기·ZIP 에 사용됩니다."
          />
        </div>
        <div className="space-y-4">
          {data.pages.map((p, i) => {
            const asset = p.asset_id ? byId.get(p.asset_id) : undefined;
            return (
              <div key={p.no} className="card grid gap-4 p-4 md:grid-cols-[150px_1fr]" data-testid="page-editor">
                <div>
                  <button type="button" onClick={() => setPicking(i)} className="block w-full" disabled={readOnly}>
                    {asset ? (
                      <AssetImage asset={asset} className="ratio-45 w-full" />
                    ) : (
                      <span className="ratio-45 flex w-full items-center justify-center border border-dashed text-xs text-muted">사진 선택</span>
                    )}
                  </button>
                  {asset && !asset.usage_allowed && <p className="mt-1 text-[0.68rem] text-danger">사용 미허가 사진</p>}
                  {asset?.origin === "ai_generated" && <p className="mt-1 text-[0.68rem] text-[#5a4f78]">AI 생성 — 실제 사진 아님 표기 필요</p>}
                  {!readOnly && (
                    <div className="mt-2">
                      <Uploader
                        compact
                        label="완성본 업로드"
                        meta={{ project_id: "korea-trip", content_id: contentId, kind: "page_image", origin: "own_photo", usage_allowed: true, license: "자체 제작" }}
                        onUploaded={(list) => {
                          if (list[0]) setPage(i, { asset_id: list[0].id });
                          onAssetsChanged();
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="display text-2xl text-rose-deep">{p.no}</span>
                    <input className="input !w-48" value={p.role} onChange={(e) => setPage(i, { role: e.target.value })} aria-label="페이지 역할" />
                  </div>
                  <input className="input display !text-lg" placeholder="Headline (English)" value={p.headline} onChange={(e) => setPage(i, { headline: e.target.value })} />
                  <textarea className="input" rows={3} placeholder="Body copy (English)" value={p.body} onChange={(e) => setPage(i, { body: e.target.value })} />
                  <div className="grid gap-2 md:grid-cols-2">
                    <input className="input" placeholder="Photo credit (예: © OUR STUDIO)" value={p.photo_credit} onChange={(e) => setPage(i, { photo_credit: e.target.value })} />
                    <input className="input" placeholder="내부 메모 (공개 안 됨)" value={p.notes} onChange={(e) => setPage(i, { notes: e.target.value })} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4">
        <Field label="Instagram caption (English)">
          <textarea className="input min-h-[120px]" value={data.caption} onChange={(e) => set("caption", e.target.value)} />
        </Field>
        <Field label="해시태그 — 정확히 5개">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
            {[0, 1, 2, 3, 4].map((i) => (
              <input
                key={i}
                className="input"
                placeholder={`#tag${i + 1}`}
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

      {data.place_ids.length > 0 && (
        <section>
          <p className="eyebrow mb-2">연결된 아카이브 장소</p>
          <div className="flex flex-wrap gap-1.5">
            {data.place_ids.map((id) => {
              const p = places.find((x) => x.id === id);
              return p ? (
                <Link key={id} href={`/archive/places/${id}`}>
                  <Chip tone={p.status === "visited" ? "navy" : "rose"}>{p.name}</Chip>
                </Link>
              ) : null;
            })}
          </div>
        </section>
      )}

      <PhotoPicker
        open={picking !== null}
        onClose={() => setPicking(null)}
        assets={assets}
        preferredPlaceIds={data.place_ids}
        onPick={(a) => {
          if (picking === null) return;
          setPage(picking, { asset_id: a?.id ?? null, photo_credit: a ? (a.rights_holder ? `© ${a.rights_holder}` : data.pages[picking].photo_credit) : "" });
        }}
      />
    </fieldset>
  );
}
