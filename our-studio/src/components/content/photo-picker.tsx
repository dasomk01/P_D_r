"use client";

import { useState } from "react";
import type { Asset } from "@/lib/types";
import { AssetImage, OriginBadge } from "../asset-image";
import { Modal } from "../ui";

/** 페이지에 쓸 사진 고르기 — 사용 허가된 사진을 먼저 보여주고, 미허가 사진은 경고 */
export function PhotoPicker({
  open,
  onClose,
  assets,
  preferredPlaceIds,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  assets: Asset[];
  preferredPlaceIds: string[];
  onPick: (asset: Asset | null) => void;
}) {
  const [showAll, setShowAll] = useState(false);
  const images = assets.filter((a) => a.mime_type.startsWith("image/"));
  const rank = (a: Asset) =>
    (a.usage_allowed ? 0 : 10) + (a.place_id && preferredPlaceIds.includes(a.place_id) ? 0 : 2) + (a.origin === "own_photo" ? 0 : 1);
  const sorted = [...images].sort((x, y) => rank(x) - rank(y));
  const list = showAll ? sorted : sorted.filter((a) => a.usage_allowed && a.origin !== "reference_only");
  return (
    <Modal open={open} onClose={onClose} title="사진 선택" wide>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="text-muted">공개 콘텐츠 사용이 허가된 사진만 표시합니다. 이 콘텐츠와 연결된 장소의 직접 촬영 사진이 앞에 옵니다.</span>
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" checked={showAll} onChange={(e) => setShowAll(e.target.checked)} /> 미허가 사진도 보기
        </label>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
        <button onClick={() => (onPick(null), onClose())} className="flex aspect-[4/5] items-center justify-center border border-dashed text-xs text-muted">
          사진 빼기
        </button>
        {list.map((a) => (
          <button key={a.id} onClick={() => (onPick(a), onClose())} className="relative block text-left" data-testid="pick-photo">
            <AssetImage asset={a} className="aspect-[4/5] w-full" />
            <span className="absolute bottom-1 left-1">
              <OriginBadge asset={a} />
            </span>
          </button>
        ))}
      </div>
      {list.length === 0 && <p className="py-6 text-center text-sm text-muted">사용 가능한 사진이 없습니다. 아카이브나 자료 보관함에서 사진을 올리고 사용 허가를 표시하세요.</p>}
    </Modal>
  );
}
