"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { deleteAsset, signedUrl } from "@/lib/storage";
import { ASSET_KIND_LABEL, ORIGIN_LABEL } from "@/lib/constants";
import { formatDateTime } from "@/lib/dates";
import type { Asset, AssetKind, AssetOrigin, Place } from "@/lib/types";
import { useStudio } from "./studio-context";
import { AssetImage, OriginBadge } from "./asset-image";
import { Button, ErrorNote, Field, Modal, NotConnected, TagInput } from "./ui";

/** 사진·파일 한 장의 출처·권한·연결 정보를 편집 */
export function AssetEditor({
  asset,
  onClose,
  onChanged,
  places,
}: {
  asset: Asset | null;
  onClose: () => void;
  onChanged: () => void;
  places?: Place[];
}) {
  const { memberById, ai } = useStudio();
  const [a, setA] = useState<Asset | null>(asset);
  const [busy, setBusy] = useState(false);
  const [tagging, setTagging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync draft with selected asset
    setA(asset);
    setError(null);
  }, [asset]);
  if (!asset || !a) return null;

  const set = <K extends keyof Asset>(k: K, v: Asset[K]) => setA((x) => (x ? { ...x, [k]: v } : x));

  async function save() {
    setBusy(true);
    setError(null);
    const { error } = await supabase()
      .from("assets")
      .update({
        caption: a!.caption,
        location_text: a!.location_text,
        rights_holder: a!.rights_holder,
        origin: a!.origin,
        usage_allowed: a!.origin === "reference_only" ? false : a!.usage_allowed,
        license: a!.license,
        source_url: a!.source_url || null,
        kind: a!.kind,
        place_id: a!.place_id,
        ai_tags: a!.ai_tags,
        taken_on: a!.taken_on || null,
      })
      .eq("id", a!.id);
    setBusy(false);
    if (error) return setError(error.message);
    onChanged();
    onClose();
  }

  return (
    <Modal open onClose={onClose} title="자료 정보" wide>
      <div className="grid gap-6 md:grid-cols-[1fr_1.1fr]">
        <div>
          <AssetImage asset={asset} full className="max-h-[60dvh] w-full !object-contain" />
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted">
            <OriginBadge asset={asset} />
            <span>
              {memberById(asset.uploaded_by)?.display_name} · {formatDateTime(asset.created_at)}
            </span>
            {asset.width && (
              <span>
                {asset.width}×{asset.height}
              </span>
            )}
            <button
              className="underline"
              onClick={async () => window.open(await signedUrl(asset.storage_path), "_blank", "noopener")}
            >
              원본 열기
            </button>
          </div>
        </div>
        <div className="space-y-4">
          <Field label="사진 설명">
            <textarea className="input" rows={2} value={a.caption} onChange={(e) => set("caption", e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="촬영 장소">
              <input className="input" value={a.location_text} onChange={(e) => set("location_text", e.target.value)} />
            </Field>
            <Field label="종류">
              <select className="input" value={a.kind} onChange={(e) => set("kind", e.target.value as AssetKind)}>
                {Object.entries(ASSET_KIND_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          {places && (
            <Field label="연결된 장소">
              <select className="input" value={a.place_id ?? ""} onChange={(e) => set("place_id", e.target.value || null)}>
                <option value="">— 연결 안 함 —</option>
                {places.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.region ? `${p.region} · ` : ""}
                    {p.name}
                  </option>
                ))}
              </select>
            </Field>
          )}
          <div className="rounded-[3px] border hairline bg-cream/40 p-4">
            <p className="eyebrow mb-3">출처 · 권리</p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="출처 구분">
                <select className="input" value={a.origin} onChange={(e) => set("origin", e.target.value as AssetOrigin)}>
                  {Object.entries(ORIGIN_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="촬영자·권리자">
                <input className="input" value={a.rights_holder} onChange={(e) => set("rights_holder", e.target.value)} />
              </Field>
              <Field label="라이선스·허가 범위">
                <input className="input" value={a.license} onChange={(e) => set("license", e.target.value)} placeholder="예: CC BY 4.0, 직접 촬영" />
              </Field>
              <Field label="원본 출처 URL">
                <input className="input" value={a.source_url ?? ""} onChange={(e) => set("source_url", e.target.value)} />
              </Field>
            </div>
            <label className={`mt-3 flex items-center gap-2 text-sm ${a.origin === "reference_only" ? "opacity-50" : ""}`}>
              <input
                type="checkbox"
                disabled={a.origin === "reference_only"}
                checked={a.origin !== "reference_only" && a.usage_allowed}
                onChange={(e) => set("usage_allowed", e.target.checked)}
              />
              공개 콘텐츠에 사용해도 되는 사진
            </label>
            {a.origin === "ai_generated" && (
              <p className="mt-2 text-xs text-[#5a4f78]">AI 생성 이미지는 실제 현장 사진으로 오인되지 않도록 콘텐츠에서도 별도 표기하세요.</p>
            )}
            {a.origin === "reference_only" && <p className="mt-2 text-xs text-warn">참고용 자료는 공개 콘텐츠에 사용할 수 없습니다.</p>}
          </div>
          <Field label="AI 분석 태그">
            <TagInput value={a.ai_tags} onChange={(v) => set("ai_tags", v)} />
          </Field>
          {asset.mime_type.startsWith("image/") &&
            (ai.features.photo_tags ? (
              <Button
                variant="rose"
                size="sm"
                busy={tagging}
                onClick={async () => {
                  setTagging(true);
                  setError(null);
                  try {
                    const res = await fetch("/api/ai/photo-tags", {
                      method: "POST",
                      headers: { "content-type": "application/json" },
                      body: JSON.stringify({ assetId: asset.id }),
                    });
                    const json = await res.json();
                    if (!res.ok) throw new Error(json.error);
                    setA((x) => (x ? { ...x, ai_tags: json.tags, caption: x.caption || json.caption } : x));
                    onChanged();
                  } catch (e) {
                    setError(e instanceof Error ? e.message : String(e));
                  } finally {
                    setTagging(false);
                  }
                }}
              >
                AI 로 사진 내용 분석
              </Button>
            ) : (
              <NotConnected what="AI 사진 내용 태그" />
            ))}
          <ErrorNote error={error} />
          <div className="flex justify-between gap-2 pt-2">
            <Button
              variant="danger"
              size="sm"
              onClick={async () => {
                if (!confirm("이 파일을 영구 삭제할까요? 콘텐츠 페이지에 쓰였다면 그 칸이 비게 됩니다.")) return;
                try {
                  await deleteAsset(asset);
                  onChanged();
                  onClose();
                } catch (e) {
                  setError(e instanceof Error ? e.message : String(e));
                }
              }}
            >
              삭제
            </Button>
            <Button onClick={save} busy={busy}>
              저장
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
