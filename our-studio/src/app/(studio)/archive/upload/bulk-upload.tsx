"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useLive } from "@/lib/live";
import { getAssets, getPlaces, getTrips } from "@/lib/queries";
import type { Asset } from "@/lib/types";
import { useStudio } from "@/components/studio-context";
import { Uploader } from "@/components/uploader";
import { AssetImage, OriginBadge } from "@/components/asset-image";
import { AssetEditor } from "@/components/asset-editor";
import { Button, Field, Loading, PageHeader } from "@/components/ui";

/**
 * 여행 한 번에 찍은 사진(바다·음식·호텔·거리…)을 한꺼번에 올리고
 * 각각을 장소에 연결하는 화면.
 */
export function BulkUpload() {
  const params = useSearchParams();
  const router = useRouter();
  const tripId = params.get("trip") ?? "";
  const { me } = useStudio();
  const [usable, setUsable] = useState(true);
  const [editing, setEditing] = useState<Asset | null>(null);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [bulkPlace, setBulkPlace] = useState("");

  const { data, reload } = useLive(
    `bulk:${tripId}`,
    async () => {
      const [trips, places, assets] = await Promise.all([getTrips(), getPlaces(), getAssets({ project_id: "korea-trip" })]);
      return { trips, places, assets: assets.filter((a) => a.mime_type.startsWith("image/")) };
    },
    ["assets", "places", "trips"],
  );
  if (!data) return <Loading />;
  const trip = data.trips.find((t) => t.id === tripId);
  const pool = data.assets.filter((a) => (tripId ? a.trip_id === tripId : !a.place_id));
  const unassigned = pool.filter((a) => !a.place_id);
  const placeOptions = data.places.filter((p) => !tripId || p.trip_id === tripId || !p.trip_id);

  async function assign(ids: string[], placeId: string | null) {
    const place = data!.places.find((p) => p.id === placeId);
    await supabase()
      .from("assets")
      .update({ place_id: placeId, ...(place ? { location_text: place.name } : {}) })
      .in("id", ids);
    setChecked(new Set());
    void reload();
  }

  return (
    <div>
      <PageHeader
        eyebrow="Travel archive"
        title="사진 한꺼번에 올리기"
        sub="여행에서 찍은 사진을 한 번에 올린 뒤, 사진마다 어느 장소인지 연결하세요. 연결하지 않은 사진도 보관함에 안전하게 남습니다."
        actions={
          <Link href="/archive" className="text-xs tracking-wider text-navy hover:underline">
            ← 아카이브
          </Link>
        }
      />
      <div className="grid gap-4 md:grid-cols-[280px_1fr]">
        <div className="space-y-4">
          <Field label="여행 기록">
            <select className="input" value={tripId} onChange={(e) => router.replace(e.target.value ? `/archive/upload?trip=${e.target.value}` : "/archive/upload")}>
              <option value="">— 여행 기록 없이 —</option>
              {data.trips.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </Field>
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" className="mt-1" checked={usable} onChange={(e) => setUsable(e.target.checked)} />
            <span>
              직접 찍은 사진이며 공개 콘텐츠에 사용해도 됨
              <span className="block text-xs text-muted">사람 얼굴이 크게 나온 사진 등은 나중에 개별로 해제할 수 있어요.</span>
            </span>
          </label>
        </div>
        <Uploader
          label={trip ? `${trip.title} 사진 올리기` : "사진 여러 장 올리기"}
          meta={{
            project_id: "korea-trip",
            trip_id: tripId || null,
            origin: "own_photo",
            usage_allowed: usable,
            rights_holder: me.display_name,
            license: "직접 촬영",
            location_text: trip?.region ?? "",
          }}
          onUploaded={() => reload()}
        />
      </div>

      <div className="mt-10">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <h2 className="display text-2xl text-navy">
            {tripId ? "이 여행의 사진" : "장소에 연결되지 않은 사진"} · {pool.length}
          </h2>
          <span className="text-xs text-muted">미연결 {unassigned.length}</span>
          <span className="flex-1" />
          {checked.size > 0 && (
            <div className="flex items-center gap-2">
              <select className="input !w-auto" value={bulkPlace} onChange={(e) => setBulkPlace(e.target.value)}>
                <option value="">장소 선택…</option>
                {placeOptions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <Button size="sm" disabled={!bulkPlace} onClick={() => assign([...checked], bulkPlace)}>
                선택한 {checked.size}장 연결
              </Button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {pool.map((a) => (
            <div key={a.id} className="card overflow-hidden" data-testid="bulk-photo">
              <div className="relative">
                <button className="block w-full" onClick={() => setEditing(a)}>
                  <AssetImage asset={a} className="aspect-square w-full" />
                </button>
                <label className="absolute left-2 top-2 rounded bg-ivory/90 px-1.5 py-0.5">
                  <input
                    type="checkbox"
                    checked={checked.has(a.id)}
                    onChange={(e) => {
                      const n = new Set(checked);
                      if (e.target.checked) n.add(a.id);
                      else n.delete(a.id);
                      setChecked(n);
                    }}
                  />
                </label>
              </div>
              <div className="space-y-1.5 p-2">
                <OriginBadge asset={a} />
                <select
                  className="input !py-1.5 !text-xs"
                  value={a.place_id ?? ""}
                  onChange={(e) => assign([a.id], e.target.value || null)}
                  aria-label="연결할 장소"
                >
                  <option value="">— 장소 미연결 —</option>
                  {placeOptions.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
      <AssetEditor asset={editing} onClose={() => setEditing(null)} onChanged={() => reload()} places={data.places} />
    </div>
  );
}
