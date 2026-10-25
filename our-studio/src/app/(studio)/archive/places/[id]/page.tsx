"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useLive, must } from "@/lib/live";
import { getAssets, getContents, getPlaces, getResearch, getTrips } from "@/lib/queries";
import { CATEGORY_LABEL, RESEARCH_LABEL, USAGE_STATUS_LABEL } from "@/lib/constants";
import { nearby } from "@/lib/geo";
import { tokenize } from "@/lib/similarity";
import { formatDateTime, formatKDate } from "@/lib/dates";
import { emptyTravel } from "@/lib/content-template";
import type { Asset, Place, PlaceResearch, ResearchKind } from "@/lib/types";
import { useStudio } from "@/components/studio-context";
import { AssetImage, OriginBadge } from "@/components/asset-image";
import { AssetEditor } from "@/components/asset-editor";
import { Uploader } from "@/components/uploader";
import { Comments } from "@/components/comments";
import { KoreaMap } from "@/components/korea-map";
import { Avatar, Button, Chip, ErrorNote, Field, Loading, NotConnected, SectionTitle, StatusBadge } from "@/components/ui";

const REVISIT = { yes: "다시 가고 싶음", maybe: "글쎄", no: "다시 안 감" } as const;

export default function PlaceDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { me, memberById, ai } = useStudio();
  const { data, reload } = useLive(
    `place:${id}`,
    async () => {
      const place = must(await supabase().from("places").select("*").eq("id", id).maybeSingle()) as Place | null;
      if (!place) return null;
      const [photos, research, places, contents, trips, usedIn] = await Promise.all([
        getAssets({ place_id: id }),
        getResearch(id),
        getPlaces(),
        getContents("korea-trip"),
        getTrips(),
        supabase()
          .from("content_versions")
          .select("content_id")
          .filter("data->place_ids", "cs", JSON.stringify([id]))
          .then((r) => new Set((must(r) as { content_id: string }[]).map((x) => x.content_id))),
      ]);
      return { place, photos, research, places, contents, trips, usedIn };
    },
    ["places", "assets", "place_research", "contents", "content_versions"],
  );
  const [editing, setEditing] = useState<Asset | null>(null);
  const [usable, setUsable] = useState(true);
  const [researching, setResearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  if (data === undefined) return <Loading />;
  if (data === null) return <p className="py-20 text-center text-muted">장소를 찾을 수 없습니다.</p>;
  const { place } = data;
  const near = nearby(place, data.places, 15).slice(0, 8);
  const pt = tokenize(`${place.name}`);
  const related = data.contents.filter(
    (c) => data.usedIn.has(c.id) || [...tokenize(c.title)].some((t) => pt.has(t)),
  );
  const trip = data.trips.find((t) => t.id === place.trip_id);
  const byKind = data.research.reduce<Record<string, PlaceResearch[]>>((acc, r) => ((acc[r.kind] ??= []).push(r), acc), {});

  async function runResearch() {
    setResearching(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/place-research", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ placeId: place.id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? res.statusText);
      void reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setResearching(false);
    }
  }

  async function startContent() {
    const d = emptyTravel("장소 단독 소개");
    d.place_ids = [place.id, ...near.slice(0, 3).map((n) => n.item.id)];
    d.route = [place, ...near.slice(0, 3).map((n) => n.item)].map((p) => ({ place_id: p.id, name: p.name, transport: "", duration: "", note: "" }));
    const { data: cid, error } = await supabase().rpc("create_content", {
      p_project_id: "korea-trip",
      p_title: `${place.region ? place.region + " " : ""}${place.name}`,
      p_keywords: [place.region, place.name].filter(Boolean),
      p_data: d,
    });
    if (error) return setError(error.message);
    router.push(`/studio/${cid}`);
  }

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between text-xs text-muted">
        <Link href="/archive" className="tracking-wider hover:text-navy">
          ← 여행 아카이브
        </Link>
        <span className="flex gap-4">
          <Link href={`/archive/places/${place.id}/edit`} className="hover:text-navy">
            수정
          </Link>
          <button
            className="hover:text-danger"
            onClick={async () => {
              if (!confirm("장소를 삭제할까요? 사진은 남고 장소 연결만 해제되며, 조사 자료는 함께 삭제됩니다.")) return;
              await supabase().from("comments").delete().eq("target_type", "place").eq("target_id", place.id);
              await supabase().from("places").delete().eq("id", place.id);
              router.replace("/archive");
            }}
          >
            삭제
          </button>
        </span>
      </div>

      <header>
        <div className="mb-3 flex flex-wrap gap-1.5">
          <Chip tone={place.status === "visited" ? "navy" : "rose"}>{place.status === "visited" ? "직접 방문" : "미방문 추천 장소"}</Chip>
          <Chip>{CATEGORY_LABEL[place.category]}</Chip>
          {place.tags.map((t) => (
            <Chip key={t}>#{t}</Chip>
          ))}
        </div>
        <h1 className="display text-5xl leading-tight text-navy md:text-6xl">{place.name}</h1>
        <p className="mt-2 text-sm text-muted">{[place.region, place.address].filter(Boolean).join(" · ")}</p>
      </header>

      {/* Photos */}
      <section>
        <SectionTitle>사진 보관함 · {data.photos.length}</SectionTitle>
        {data.photos.length > 0 && (
          <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {data.photos.map((a) => (
              <button key={a.id} className="group relative block text-left" onClick={() => setEditing(a)}>
                <AssetImage asset={a} className="aspect-square w-full transition group-hover:opacity-85" />
                <span className="absolute left-1.5 top-1.5">
                  <OriginBadge asset={a} />
                </span>
                {a.caption && <span className="mt-1 block truncate text-xs text-muted">{a.caption}</span>}
              </button>
            ))}
          </div>
        )}
        <label className="mb-2 flex items-center gap-2 text-sm">
          <input type="checkbox" checked={usable} onChange={(e) => setUsable(e.target.checked)} />
          이번에 올리는 사진은 공개 콘텐츠에 사용해도 됨 (직접 촬영)
        </label>
        <Uploader
          label="이 장소 사진 올리기"
          meta={{
            project_id: "korea-trip",
            place_id: place.id,
            trip_id: place.trip_id,
            location_text: place.name,
            rights_holder: me.display_name,
            origin: "own_photo",
            usage_allowed: usable,
            license: "직접 촬영",
          }}
          onUploaded={() => reload()}
        />
      </section>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Our experience */}
        <section className="card p-6" data-testid="our-experience">
          <p className="eyebrow mb-1">Our experience</p>
          <h2 className="display mb-5 text-2xl text-navy">우리의 실제 경험</h2>
          <dl className="space-y-4 text-sm">
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted">
              {place.visited_on && <span>방문 {formatKDate(place.visited_on)} (내부용)</span>}
              {place.visitors.length > 0 && (
                <span className="flex items-center gap-1">
                  방문자 {place.visitors.map((v) => <Avatar key={v} member={memberById(v)} size={16} />)}
                </span>
              )}
              {trip && <span>여행: {trip.title}</span>}
              {place.revisit && <span>재방문: {REVISIT[place.revisit]}</span>}
            </div>
            {(
              [
                ["후기", place.review],
                ["추천 메뉴·활동", place.recommended],
                ["실제 지불한 가격", place.price_paid],
                ["좋았던 점", place.pros],
                ["아쉬웠던 점", place.cons],
                ["외국인에게 추천하는 이유", place.why_foreigners],
              ] as const
            )
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[0.72rem] tracking-wider text-muted">{k}</dt>
                  <dd className="mt-0.5 whitespace-pre-wrap leading-relaxed">{v}</dd>
                </div>
              ))}
            {place.links.filter(Boolean).length > 0 && (
              <div>
                <dt className="text-[0.72rem] tracking-wider text-muted">관련 링크</dt>
                {place.links.filter(Boolean).map((l) => (
                  <dd key={l}>
                    <a href={l} target="_blank" rel="noreferrer" className="break-all text-navy-soft underline">
                      {l}
                    </a>
                  </dd>
                ))}
              </div>
            )}
            {!place.review && !place.pros && <p className="text-muted">아직 후기가 없습니다. &lsquo;수정&rsquo;에서 적어주세요.</p>}
          </dl>
        </section>

        {/* Location & nearby */}
        <section className="space-y-4">
          {place.lat != null && place.lng != null ? (
            <KoreaMap
              points={[
                { id: place.id, lat: place.lat, lng: place.lng, label: place.name, tone: "selected" },
                ...near.map((n) => ({ id: n.item.id, lat: n.item.lat!, lng: n.item.lng!, label: n.item.name, tone: n.item.status })),
              ]}
              onSelect={(pid) => pid !== place.id && router.push(`/archive/places/${pid}`)}
              height={300}
            />
          ) : (
            <p className="card p-5 text-sm text-muted">지도 위치가 없습니다. 수정에서 위치를 지정하면 근처 장소를 찾아볼 수 있어요.</p>
          )}
          <div>
            <p className="eyebrow mb-2">아카이브의 근처 장소 (15km 이내)</p>
            {near.length === 0 ? (
              <p className="text-xs text-muted">근처에 등록된 장소가 없습니다.</p>
            ) : (
              <ul className="space-y-1.5 text-sm">
                {near.map((n) => (
                  <li key={n.item.id} className="flex justify-between gap-2">
                    <Link href={`/archive/places/${n.item.id}`} className="truncate hover:underline">
                      {n.item.name} <span className="text-xs text-muted">{n.item.status === "visited" ? "방문" : "추천"}</span>
                    </Link>
                    <span className="text-xs text-muted">{n.km.toFixed(1)}km</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <p className="eyebrow mb-2">관련 콘텐츠 제작 이력</p>
            {related.length === 0 ? (
              <p className="text-xs text-muted">아직 이 장소로 만든 콘텐츠가 없습니다.</p>
            ) : (
              <ul className="space-y-1.5 text-sm">
                {related.map((c) => (
                  <li key={c.id} className="flex justify-between gap-2">
                    <Link href={`/studio/${c.id}`} className="truncate hover:underline">
                      {c.title}
                    </Link>
                    <StatusBadge status={c.status} />
                  </li>
                ))}
              </ul>
            )}
            <Button size="sm" variant="outline" className="mt-3" onClick={startContent}>
              이 장소로 콘텐츠 제작 시작
            </Button>
          </div>
        </section>
      </div>

      {/* Research */}
      <section data-testid="research">
        <SectionTitle
          action={
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => setShowAdd((v) => !v)}>
                + 직접 추가
              </Button>
              {ai.features.place_research && (
                <Button size="sm" variant="rose" busy={researching} onClick={runResearch}>
                  AI 주변 자료 조사
                </Button>
              )}
            </div>
          }
        >
          조사 자료 <span className="text-base text-muted">· 직접 경험과 구분</span>
        </SectionTitle>
        {!ai.features.place_research && (
          <div className="mb-4">
            <NotConnected
              what="AI 주변 자료 수집 (위치·주변 명소·카페·동선·공식 정보·사진 후보·콘텐츠 주제)"
              detail="ANTHROPIC_API_KEY 설정 시 Claude 웹 검색으로 조사해 출처와 함께 이곳에 저장합니다. 지금은 직접 추가할 수 있어요."
            />
          </div>
        )}
        <p className="mb-4 text-xs leading-relaxed text-muted">
          조사 자료는 바로 게시물로 만들지 않고 참고용으로 보관합니다. 사진 후보는 이미지를 내려받지 않고 출처 링크로만 저장하며, 사용 허가를 확인하기 전까지 콘텐츠에 쓰지 않습니다.
        </p>
        <ErrorNote error={error} />
        {showAdd && <ResearchForm placeId={place.id} onSaved={() => (setShowAdd(false), void reload())} />}
        {data.research.length === 0 ? (
          <p className="text-sm text-muted">저장된 조사 자료가 없습니다.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {(Object.keys(RESEARCH_LABEL) as ResearchKind[])
              .filter((k) => byKind[k]?.length)
              .map((k) => (
                <div key={k} className="card p-5">
                  <p className="eyebrow mb-3">{RESEARCH_LABEL[k]}</p>
                  <ul className="space-y-3">
                    {byKind[k].map((r) => (
                      <ResearchItem key={r.id} r={r} place={place} onChanged={() => reload()} />
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        )}
      </section>

      <section className="border-t hairline pt-8">
        <Comments projectId="korea-trip" targetType="place" targetId={place.id} />
      </section>

      <AssetEditor asset={editing} onClose={() => setEditing(null)} onChanged={() => reload()} places={data.places} />
    </div>
  );
}

function ResearchItem({ r, place, onChanged }: { r: PlaceResearch; place: Place; onChanged: () => void }) {
  const router = useRouter();
  return (
    <li className="text-sm">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="font-medium">{r.title}</span>
        <Chip tone={r.provenance === "ai" ? "rose" : "plain"}>{r.provenance === "ai" ? "AI 조사" : "직접 조사"}</Chip>
        {r.verified ? <Chip tone="ok">확인됨</Chip> : <Chip tone="warn">미확인</Chip>}
        {r.kind === "photo_candidate" && <Chip tone="warn">{USAGE_STATUS_LABEL[r.usage_status]}</Chip>}
      </div>
      {r.body && <p className="mt-1 whitespace-pre-wrap text-muted">{r.body}</p>}
      {r.url && (
        <a href={r.url} target="_blank" rel="noreferrer" className="mt-0.5 block break-all text-xs text-navy-soft underline">
          {r.source_name || r.url}
        </a>
      )}
      {r.license_note && <p className="text-xs text-muted">라이선스: {r.license_note}</p>}
      <div className="mt-1 flex gap-3 text-[0.7rem] text-muted">
        <span>{formatDateTime(r.created_at)}</span>
        <button
          className="hover:text-navy"
          onClick={async () => {
            await supabase().from("place_research").update({ verified: !r.verified }).eq("id", r.id);
            onChanged();
          }}
        >
          {r.verified ? "미확인으로" : "확인 완료로 표시"}
        </button>
        {r.kind === "photo_candidate" && (
          <select
            className="bg-transparent"
            value={r.usage_status}
            onChange={async (e) => {
              await supabase().from("place_research").update({ usage_status: e.target.value }).eq("id", r.id);
              onChanged();
            }}
          >
            {Object.entries(USAGE_STATUS_LABEL).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        )}
        {(r.kind === "nearby_attraction" || r.kind === "nearby_food") && (
          <button
            className="hover:text-navy"
            title="지도에 '미방문 추천 장소'로 추가 (위치는 직접 지정)"
            onClick={async () => {
              const { data, error } = await supabase()
                .from("places")
                .insert({
                  name: r.title,
                  region: place.region,
                  status: "wishlist",
                  category: r.kind === "nearby_food" ? "restaurant" : "attraction",
                  links: r.url ? [r.url] : [],
                  review: "",
                  tags: ["AI 조사"],
                })
                .select("id")
                .single();
              if (!error) router.push(`/archive/places/${data.id}/edit`);
            }}
          >
            추천 장소로 추가
          </button>
        )}
        <button
          className="hover:text-danger"
          onClick={async () => {
            await supabase().from("place_research").delete().eq("id", r.id);
            onChanged();
          }}
        >
          삭제
        </button>
      </div>
    </li>
  );
}

function ResearchForm({ placeId, onSaved }: { placeId: string; onSaved: () => void }) {
  const [r, setR] = useState({ kind: "nearby_attraction" as ResearchKind, title: "", body: "", url: "", source_name: "", license_note: "" });
  const [error, setError] = useState<string | null>(null);
  return (
    <form
      className="card mb-5 grid gap-3 p-5 md:grid-cols-2"
      onSubmit={async (e) => {
        e.preventDefault();
        const { error } = await supabase()
          .from("place_research")
          .insert({ ...r, url: r.url || null, place_id: placeId, provenance: "manual" });
        if (error) return setError(error.message);
        onSaved();
      }}
    >
      <Field label="종류">
        <select className="input" value={r.kind} onChange={(e) => setR({ ...r, kind: e.target.value as ResearchKind })}>
          {Object.entries(RESEARCH_LABEL).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </Field>
      <Field label="제목 *">
        <input className="input" required value={r.title} onChange={(e) => setR({ ...r, title: e.target.value })} />
      </Field>
      <div className="md:col-span-2">
        <Field label="내용">
          <textarea className="input" rows={3} value={r.body} onChange={(e) => setR({ ...r, body: e.target.value })} />
        </Field>
      </div>
      <Field label="출처 URL">
        <input className="input" value={r.url} onChange={(e) => setR({ ...r, url: e.target.value })} />
      </Field>
      <Field label="출처 이름">
        <input className="input" value={r.source_name} onChange={(e) => setR({ ...r, source_name: e.target.value })} placeholder="예: 강릉시 공식 관광" />
      </Field>
      <div className="md:col-span-2">
        <Field label="라이선스·사용 조건 메모">
          <input className="input" value={r.license_note} onChange={(e) => setR({ ...r, license_note: e.target.value })} />
        </Field>
      </div>
      <ErrorNote error={error} />
      <Button type="submit" size="sm" className="md:col-span-2" disabled={!r.title.trim()}>
        저장
      </Button>
    </form>
  );
}
