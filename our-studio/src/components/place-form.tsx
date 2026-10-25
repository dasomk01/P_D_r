"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { CATEGORY_LABEL } from "@/lib/constants";
import type { Place, PlaceCategory, Trip } from "@/lib/types";
import { useStudio } from "./studio-context";
import { KoreaMap } from "./korea-map";
import { Button, ErrorNote, Field, TagInput } from "./ui";

export type PlaceDraft = Omit<Place, "id" | "created_by" | "updated_by" | "created_at" | "updated_at">;

export function emptyPlace(): PlaceDraft {
  return {
    name: "",
    region: "",
    address: "",
    lat: null,
    lng: null,
    status: "visited",
    category: "restaurant",
    trip_id: null,
    visited_on: null,
    visitors: [],
    review: "",
    recommended: "",
    price_paid: "",
    pros: "",
    cons: "",
    why_foreigners: "",
    revisit: null,
    links: [],
    tags: [],
  };
}

interface GeoHit {
  name: string;
  address: string;
  lat: number;
  lng: number;
  region: string;
}

export function PlaceForm({
  initial,
  trips,
  onSaved,
  placeId,
}: {
  initial: PlaceDraft;
  trips: Trip[];
  onSaved: (id: string) => void;
  placeId?: string;
}) {
  const { members } = useStudio();
  const [p, setP] = useState<PlaceDraft>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [geoQ, setGeoQ] = useState("");
  const [hits, setHits] = useState<GeoHit[] | null>(null);
  const [geoBusy, setGeoBusy] = useState(false);
  const set = <K extends keyof PlaceDraft>(k: K, v: PlaceDraft[K]) => setP((x) => ({ ...x, [k]: v }));

  async function geocode() {
    if (!geoQ.trim()) return;
    setGeoBusy(true);
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(geoQ)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setHits(json.results);
    } catch (e) {
      setError(`주소 검색 실패: ${e instanceof Error ? e.message : e} — 지도를 눌러 직접 위치를 지정할 수 있어요.`);
    } finally {
      setGeoBusy(false);
    }
  }

  return (
    <form
      className="space-y-8"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError(null);
        const payload = { ...p, links: p.links.map((l) => l.trim()).filter(Boolean), visited_on: p.visited_on || null };
        const res = placeId
          ? await supabase().from("places").update(payload).eq("id", placeId).select("id").single()
          : await supabase().from("places").insert(payload).select("id").single();
        setBusy(false);
        if (res.error) return setError(res.error.message);
        onSaved(res.data.id);
      }}
    >
      <section className="grid gap-4 md:grid-cols-2">
        <Field label="장소 이름 *">
          <input className="input" required value={p.name} onChange={(e) => set("name", e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="구분">
            <select className="input" value={p.status} onChange={(e) => set("status", e.target.value as PlaceDraft["status"])}>
              <option value="visited">직접 방문</option>
              <option value="wishlist">미방문 추천 장소</option>
            </select>
          </Field>
          <Field label="종류">
            <select className="input" value={p.category} onChange={(e) => set("category", e.target.value as PlaceCategory)}>
              {Object.entries(CATEGORY_LABEL).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="지역" hint="예: 강릉, 부산, 서울 종로">
          <input className="input" value={p.region} onChange={(e) => set("region", e.target.value)} />
        </Field>
        <Field label="주소">
          <input className="input" value={p.address} onChange={(e) => set("address", e.target.value)} />
        </Field>
      </section>

      <section className="space-y-3">
        <p className="eyebrow">지도상 위치</p>
        <div className="flex gap-2">
          <input
            className="input"
            placeholder="장소명이나 주소로 검색 (OpenStreetMap)"
            value={geoQ}
            onChange={(e) => setGeoQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void geocode();
              }
            }}
          />
          <Button type="button" variant="outline" busy={geoBusy} onClick={geocode}>
            검색
          </Button>
        </div>
        {hits && (
          <ul className="card divide-y hairline text-sm">
            {hits.length === 0 && <li className="px-3 py-2 text-muted">결과 없음 — 지도를 눌러 직접 지정하세요.</li>}
            {hits.map((h, i) => (
              <li key={i}>
                <button
                  type="button"
                  className="w-full px-3 py-2 text-left hover:bg-cream"
                  onClick={() => {
                    setP((x) => ({ ...x, lat: h.lat, lng: h.lng, address: x.address || h.address, region: x.region || h.region }));
                    setHits(null);
                  }}
                >
                  {h.name} <span className="text-xs text-muted">{h.address}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <KoreaMap points={[]} pick={p.lat != null && p.lng != null ? { lat: p.lat, lng: p.lng } : null} onPick={(lat, lng) => setP((x) => ({ ...x, lat, lng }))} height={280} />
        <p className="text-xs text-muted">
          {p.lat != null ? `선택한 좌표: ${p.lat.toFixed(5)}, ${p.lng!.toFixed(5)}` : "지도를 눌러 위치를 지정하세요."}
        </p>
      </section>

      <section className="space-y-4">
        <div>
          <p className="eyebrow">Our experience · 직접 경험</p>
          <p className="mt-1 text-xs text-muted">방문 날짜와 방문자는 내부 관리용이며 공개 콘텐츠에 자동으로 노출되지 않습니다.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="방문 날짜 (선택)">
            <input className="input" type="date" value={p.visited_on ?? ""} onChange={(e) => set("visited_on", e.target.value || null)} />
          </Field>
          <Field label="방문자">
            <div className="flex gap-2">
              {members.map((m) => {
                const on = p.visitors.includes(m.user_id);
                return (
                  <button
                    type="button"
                    key={m.user_id}
                    onClick={() => set("visitors", on ? p.visitors.filter((x) => x !== m.user_id) : [...p.visitors, m.user_id])}
                    className={`flex-1 rounded-[3px] border py-2 text-sm ${on ? "border-navy bg-navy text-ivory" : "border-line"}`}
                  >
                    {m.display_name}
                  </button>
                );
              })}
            </div>
          </Field>
          <Field label="여행 기록">
            <select className="input" value={p.trip_id ?? ""} onChange={(e) => set("trip_id", e.target.value || null)}>
              <option value="">— 없음 —</option>
              {trips.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="방문 후기">
          <textarea className="input min-h-[110px]" value={p.review} onChange={(e) => set("review", e.target.value)} />
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="추천 메뉴·활동">
            <textarea className="input" rows={2} value={p.recommended} onChange={(e) => set("recommended", e.target.value)} />
          </Field>
          <Field label="실제 지불한 가격 (선택)">
            <input className="input" value={p.price_paid} onChange={(e) => set("price_paid", e.target.value)} placeholder="예: 2인 32,000원" />
          </Field>
          <Field label="좋았던 점">
            <textarea className="input" rows={2} value={p.pros} onChange={(e) => set("pros", e.target.value)} />
          </Field>
          <Field label="아쉬웠던 점">
            <textarea className="input" rows={2} value={p.cons} onChange={(e) => set("cons", e.target.value)} />
          </Field>
        </div>
        <Field label="외국인에게 추천할 만한 이유">
          <textarea className="input" rows={2} value={p.why_foreigners} onChange={(e) => set("why_foreigners", e.target.value)} />
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="재방문 의사">
            <div className="flex gap-2">
              {(
                [
                  ["yes", "있음"],
                  ["maybe", "글쎄"],
                  ["no", "없음"],
                ] as const
              ).map(([v, l]) => (
                <button
                  type="button"
                  key={v}
                  onClick={() => set("revisit", p.revisit === v ? null : v)}
                  className={`flex-1 rounded-[3px] border py-2 text-sm ${p.revisit === v ? "border-navy bg-navy text-ivory" : "border-line"}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </Field>
          <Field label="태그">
            <TagInput value={p.tags} onChange={(v) => set("tags", v)} placeholder="바다, 순두부" />
          </Field>
        </div>
        <Field label="관련 링크" hint="한 줄에 하나 (공식 홈페이지, 지도 링크 등)">
          <textarea className="input" rows={2} value={p.links.join("\n")} onChange={(e) => set("links", e.target.value.split("\n"))} />
        </Field>
      </section>

      <ErrorNote error={error} />
      <Button type="submit" busy={busy} disabled={!p.name.trim()} className="w-full md:w-auto">
        {placeId ? "장소 저장" : "장소 등록"}
      </Button>
    </form>
  );
}
