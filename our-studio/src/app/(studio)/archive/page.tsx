"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useLive } from "@/lib/live";
import { getAssets, getContents, getPlaces, getTrips } from "@/lib/queries";
import { CATEGORY_LABEL } from "@/lib/constants";
import { tokenize } from "@/lib/similarity";
import { emptyTravel } from "@/lib/content-template";
import { formatKDate } from "@/lib/dates";
import type { Asset, Place, PlaceCategory } from "@/lib/types";
import { KoreaMap, type MapPoint } from "@/components/korea-map";
import { AssetImage } from "@/components/asset-image";
import { Button, Chip, Empty, ErrorNote, Field, Loading, Modal, PageHeader, StatusBadge, Tabs } from "@/components/ui";

type View = "map" | "list" | "regions" | "trips";

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export default function ArchivePage() {
  const router = useRouter();
  const [view, setView] = useState<View>("map");
  const [region, setRegion] = useState("");
  const [status, setStatus] = useState<"all" | "visited" | "wishlist">("all");
  const [category, setCategory] = useState<PlaceCategory | "">("");
  const [photoOnly, setPhotoOnly] = useState(false);
  const [q, setQ] = useState("");
  const [course, setCourse] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [tripOpen, setTripOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const { data, reload } = useLive(
    "archive",
    async () => {
      const [places, assets, contents, trips] = await Promise.all([getPlaces(), getAssets({ project_id: "korea-trip" }), getContents("korea-trip"), getTrips()]);
      const photosByPlace: Record<string, Asset[]> = {};
      for (const a of assets) if (a.place_id && a.mime_type.startsWith("image/")) (photosByPlace[a.place_id] ??= []).push(a);
      return { places, assets, contents, trips, photosByPlace };
    },
    ["places", "assets", "contents", "trips"],
  );

  const regions = useMemo(() => [...new Set((data?.places ?? []).map((p) => p.region).filter(Boolean))].sort(), [data]);

  const filtered = useMemo(() => {
    if (!data) return [];
    const needle = q.trim().toLowerCase();
    return data.places.filter(
      (p) =>
        (!region || p.region === region) &&
        (status === "all" || p.status === status) &&
        (!category || p.category === category) &&
        (!photoOnly || (data.photosByPlace[p.id]?.length ?? 0) > 0) &&
        (!needle || `${p.name} ${p.region} ${p.address} ${p.tags.join(" ")} ${p.review}`.toLowerCase().includes(needle)),
    );
  }, [data, q, region, status, category, photoOnly]);

  if (!data) return <Loading />;

  const points: MapPoint[] = filtered
    .filter((p) => p.lat != null && p.lng != null)
    .map((p) => {
      const n = data.photosByPlace[p.id]?.length ?? 0;
      return {
        id: p.id,
        lat: p.lat!,
        lng: p.lng!,
        label: p.name,
        tone: selected === p.id ? "selected" : p.status,
        hasPhoto: n > 0,
        popupHtml: `<div style="font-family:inherit"><strong>${esc(p.name)}</strong><br/><span style="color:#6f6a62;font-size:11px">${esc(p.region)} · ${CATEGORY_LABEL[p.category]} · ${p.status === "visited" ? "직접 방문" : "미방문 추천"}${n ? ` · 사진 ${n}` : ""}</span>${p.review ? `<p style="margin:6px 0 0;font-size:12px">${esc(p.review.slice(0, 120))}${p.review.length > 120 ? "…" : ""}</p>` : ""}<p style="margin:6px 0 0"><a href="/archive/places/${p.id}">자세히 보기 →</a></p></div>`,
      };
    });
  const sel = selected ? data.places.find((p) => p.id === selected) : null;
  const courseItems = course.map((id) => data.places.find((p) => p.id === id)).filter(Boolean) as Place[];

  async function createCourseContent() {
    if (!courseItems.length) return;
    setCreating(true);
    const d = emptyTravel(courseItems.length > 4 ? "1박 2일" : "당일치기");
    d.place_ids = courseItems.map((p) => p.id);
    d.route = courseItems.map((p) => ({ place_id: p.id, name: p.name, transport: "", duration: "", note: "" }));
    const regionName = courseItems[0].region || "Korea";
    const title = `${regionName} 코스: ${courseItems.map((p) => p.name).join(" → ")}`.slice(0, 120);
    const { data: id, error } = await supabase().rpc("create_content", {
      p_project_id: "korea-trip",
      p_title: title,
      p_keywords: [...new Set(courseItems.map((p) => p.region).filter(Boolean))],
      p_data: d,
    });
    setCreating(false);
    if (error) return setError(error.message);
    router.push(`/studio/${id}`);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Our travel archive · KOREA TRIP"
        title="여행 아카이브"
        sub="둘이 실제로 다녀온 장소와 사진, 후기를 쌓아두는 곳. 등록한다고 바로 게시물이 되지 않아요 — 나중에 콘텐츠를 만들 때 꺼내 씁니다."
        actions={
          <>
            <Button variant="ghost" size="sm" onClick={() => setTripOpen(true)}>
              여행 기록 추가
            </Button>
            <Link href="/archive/upload" className="rounded-[3px] border border-navy/70 px-3 py-1.5 text-xs text-navy hover:bg-navy hover:text-ivory">
              사진 한꺼번에 올리기
            </Link>
            <Link href="/archive/new" className="rounded-[3px] bg-navy px-3 py-1.5 text-xs text-ivory hover:bg-navy-soft">
              + 장소 등록
            </Link>
          </>
        }
      />

      <div className="mb-5 grid gap-2 md:grid-cols-[1fr_auto_auto_auto_auto]">
        <input className="input" placeholder="장소·후기·태그 검색" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="input md:!w-auto" value={region} onChange={(e) => setRegion(e.target.value)} aria-label="지역">
          <option value="">전체 지역</option>
          {regions.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
        <select className="input md:!w-auto" value={status} onChange={(e) => setStatus(e.target.value as typeof status)} aria-label="방문 여부">
          <option value="all">방문 + 추천</option>
          <option value="visited">직접 방문한 곳</option>
          <option value="wishlist">아직 안 가본 추천 장소</option>
        </select>
        <select className="input md:!w-auto" value={category} onChange={(e) => setCategory(e.target.value as PlaceCategory | "")} aria-label="종류">
          <option value="">모든 종류</option>
          {Object.entries(CATEGORY_LABEL).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 px-1 text-sm text-muted">
          <input type="checkbox" checked={photoOnly} onChange={(e) => setPhotoOnly(e.target.checked)} /> 사진 있는 곳
        </label>
      </div>

      <Tabs<View>
        value={view}
        onChange={setView}
        items={[
          { value: "map", label: "지도" },
          { value: "list", label: `목록 ${filtered.length}` },
          { value: "regions", label: "지역별" },
          { value: "trips", label: `여행 기록 ${data.trips.length}` },
        ]}
      />

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_300px]">
        <div>
          {view === "map" && (
            <div className="space-y-4">
              <KoreaMap points={points} onSelect={setSelected} height={520} />
              <div className="flex flex-wrap gap-4 text-xs text-muted">
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-navy" /> 직접 방문
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full border-2 border-rose-deep bg-ivory" /> 미방문 추천
                </span>
                <span>큰 점 = 사진 있음</span>
                {filtered.length - points.length > 0 && <span>· 좌표 없는 장소 {filtered.length - points.length}곳은 목록에서 확인</span>}
              </div>
              {sel && (
                <PlaceCard
                  place={sel}
                  photos={data.photosByPlace[sel.id] ?? []}
                  inCourse={course.includes(sel.id)}
                  onCourse={() => setCourse((c) => (c.includes(sel.id) ? c.filter((x) => x !== sel.id) : [...c, sel.id]))}
                />
              )}
            </div>
          )}

          {view === "list" &&
            (filtered.length === 0 ? (
              <Empty title="등록된 장소가 없습니다">다녀온 곳을 하나씩 기록해 보세요. 사진은 나중에 올려도 됩니다.</Empty>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {filtered.map((p) => (
                  <PlaceCard
                    key={p.id}
                    place={p}
                    photos={data.photosByPlace[p.id] ?? []}
                    inCourse={course.includes(p.id)}
                    onCourse={() => setCourse((c) => (c.includes(p.id) ? c.filter((x) => x !== p.id) : [...c, p.id]))}
                  />
                ))}
              </div>
            ))}

          {view === "regions" && (
            <div className="space-y-6">
              {regions.length === 0 && <p className="text-sm text-muted">지역 정보가 있는 장소가 없습니다.</p>}
              {regions.map((r) => {
                const ps = data.places.filter((p) => p.region === r);
                const rt = tokenize(r);
                const made = data.contents.filter((c) => [...tokenize(`${c.title} ${c.keywords.join(" ")}`)].some((t) => rt.has(t)));
                return (
                  <section key={r} className="card p-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="display text-2xl text-navy">{r}</h3>
                      <span className="text-xs text-muted">
                        방문 {ps.filter((p) => p.status === "visited").length} · 추천 {ps.filter((p) => p.status === "wishlist").length} · 사진{" "}
                        {ps.reduce((n, p) => n + (data.photosByPlace[p.id]?.length ?? 0), 0)}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {ps.map((p) => (
                        <Link key={p.id} href={`/archive/places/${p.id}`} className="rounded-full bg-cream px-2.5 py-1 text-xs hover:bg-sand">
                          {p.name}
                        </Link>
                      ))}
                    </div>
                    <p className="eyebrow mb-2 mt-4">콘텐츠 제작 이력</p>
                    {made.length === 0 ? (
                      <p className="text-xs text-muted">아직 이 지역으로 만든 콘텐츠가 없습니다.</p>
                    ) : (
                      <ul className="space-y-1 text-sm">
                        {made.map((c) => (
                          <li key={c.id} className="flex items-center justify-between gap-2">
                            <Link href={`/studio/${c.id}`} className="truncate hover:underline">
                              {c.title}
                            </Link>
                            <StatusBadge status={c.status} />
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                );
              })}
            </div>
          )}

          {view === "trips" && (
            <div className="space-y-4">
              {data.trips.length === 0 && <Empty title="여행 기록이 없습니다">강릉 1박 2일처럼 여행 단위로 묶어두면 사진을 한 번에 올리고 장소에 나눠 연결하기 쉬워요.</Empty>}
              {data.trips.map((t) => {
                const ps = data.places.filter((p) => p.trip_id === t.id);
                const photos = data.assets.filter((a) => a.trip_id === t.id && a.mime_type.startsWith("image/"));
                return (
                  <section key={t.id} className="card p-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="display text-2xl text-navy">{t.title}</h3>
                      <span className="text-xs text-muted">
                        {t.region} {t.start_date && `· ${formatKDate(t.start_date)}`}
                        {t.end_date && t.end_date !== t.start_date && ` – ${formatKDate(t.end_date)}`}
                      </span>
                    </div>
                    {t.notes && <p className="mt-2 text-sm text-muted">{t.notes}</p>}
                    <div className="mt-3 grid grid-cols-6 gap-1.5">
                      {photos.slice(0, 6).map((a) => (
                        <AssetImage key={a.id} asset={a} className="aspect-square w-full" />
                      ))}
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      {ps.map((p) => (
                        <Link key={p.id} href={`/archive/places/${p.id}`} className="rounded-full bg-cream px-2.5 py-1 text-xs">
                          {p.name}
                        </Link>
                      ))}
                      <Link href={`/archive/upload?trip=${t.id}`} className="ml-auto text-xs text-navy underline-offset-4 hover:underline">
                        사진 올리기·정리 →
                      </Link>
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="card p-5">
            <p className="eyebrow mb-3">여행 코스 담기 · {courseItems.length}</p>
            {courseItems.length === 0 ? (
              <p className="text-xs leading-relaxed text-muted">장소 카드의 &lsquo;코스에 추가&rsquo;로 여러 장소를 모아 동선을 짜고, 그대로 콘텐츠 제작을 시작할 수 있어요.</p>
            ) : (
              <ol className="space-y-2 text-sm">
                {courseItems.map((p, i) => (
                  <li key={p.id} className="flex items-center gap-2">
                    <span className="display w-4 text-rose-deep">{i + 1}</span>
                    <span className="flex-1 truncate">{p.name}</span>
                    <button className="text-xs text-muted" disabled={i === 0} onClick={() => setCourse((c) => swap(c, i, i - 1))}>
                      ↑
                    </button>
                    <button className="text-xs text-muted" onClick={() => setCourse((c) => c.filter((x) => x !== p.id))}>
                      ×
                    </button>
                  </li>
                ))}
              </ol>
            )}
            {courseItems.length > 0 && (
              <Button size="sm" className="mt-4 w-full" busy={creating} onClick={createCourseContent}>
                이 코스로 콘텐츠 제작 시작
              </Button>
            )}
            <ErrorNote error={error} />
          </div>
          <div className="card p-5 text-xs leading-relaxed text-muted">
            <p className="eyebrow mb-2">사진 저작권 원칙</p>
            인터넷에서 찾은 사진은 내려받아 재사용하지 않고 참고용 링크로만 보관합니다. 사용 허가가 확인된 사진만 콘텐츠에 쓸 수 있어요. AI 생성 이미지는 실제 현장 사진과 구분해 표시합니다.
          </div>
        </aside>
      </div>

      <TripModal open={tripOpen} onClose={() => setTripOpen(false)} onSaved={() => void reload()} />
    </div>
  );
}

function swap<T>(arr: T[], i: number, j: number): T[] {
  const a = [...arr];
  [a[i], a[j]] = [a[j], a[i]];
  return a;
}

function PlaceCard({ place, photos, inCourse, onCourse }: { place: Place; photos: Asset[]; inCourse: boolean; onCourse: () => void }) {
  return (
    <article className="card overflow-hidden" data-testid="place-card">
      <Link href={`/archive/places/${place.id}`} className="block">
        {photos[0] ? (
          <AssetImage asset={photos[0]} className="aspect-[4/3] w-full" />
        ) : (
          <div className="flex aspect-[4/3] w-full items-center justify-center bg-cream text-xs tracking-[0.2em] text-muted">NO PHOTO</div>
        )}
      </Link>
      <div className="p-4">
        <div className="mb-1 flex flex-wrap items-center gap-1.5">
          <Chip tone={place.status === "visited" ? "navy" : "rose"}>{place.status === "visited" ? "직접 방문" : "미방문 추천"}</Chip>
          <Chip>{CATEGORY_LABEL[place.category]}</Chip>
          {photos.length > 0 && <Chip>사진 {photos.length}</Chip>}
        </div>
        <Link href={`/archive/places/${place.id}`} className="display text-xl text-navy hover:underline">
          {place.name}
        </Link>
        <p className="text-xs text-muted">{[place.region, place.address].filter(Boolean).join(" · ")}</p>
        {place.review && <p className="mt-2 line-clamp-2 text-sm">{place.review}</p>}
        <button onClick={onCourse} className={`mt-3 text-xs ${inCourse ? "text-rose-deep" : "text-navy"} underline-offset-4 hover:underline`}>
          {inCourse ? "✓ 코스에 담김" : "+ 코스에 추가"}
        </button>
      </div>
    </article>
  );
}

function TripModal({ open, onClose, onSaved }: { open: boolean; onClose: () => void; onSaved: () => void }) {
  const [t, setT] = useState({ title: "", region: "", start_date: "", end_date: "", notes: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <Modal open={open} onClose={onClose} title="여행 기록 추가">
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          const { error } = await supabase()
            .from("trips")
            .insert({ ...t, start_date: t.start_date || null, end_date: t.end_date || null });
          setBusy(false);
          if (error) return setError(error.message);
          setT({ title: "", region: "", start_date: "", end_date: "", notes: "" });
          onSaved();
          onClose();
        }}
      >
        <Field label="여행 이름 *">
          <input className="input" required value={t.title} onChange={(e) => setT({ ...t, title: e.target.value })} placeholder="예: 강릉 1박 2일" />
        </Field>
        <Field label="지역">
          <input className="input" value={t.region} onChange={(e) => setT({ ...t, region: e.target.value })} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="시작일 (내부용)">
            <input className="input" type="date" value={t.start_date} onChange={(e) => setT({ ...t, start_date: e.target.value })} />
          </Field>
          <Field label="종료일">
            <input className="input" type="date" value={t.end_date} onChange={(e) => setT({ ...t, end_date: e.target.value })} />
          </Field>
        </div>
        <Field label="메모">
          <textarea className="input" rows={3} value={t.notes} onChange={(e) => setT({ ...t, notes: e.target.value })} />
        </Field>
        <ErrorNote error={error} />
        <Button type="submit" busy={busy} disabled={!t.title.trim()} className="w-full">
          저장
        </Button>
      </form>
    </Modal>
  );
}
