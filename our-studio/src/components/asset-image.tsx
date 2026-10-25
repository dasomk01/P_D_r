"use client";

import { useEffect, useState } from "react";
import { signedUrl } from "@/lib/storage";
import type { Asset } from "@/lib/types";
import { ORIGIN_LABEL } from "@/lib/constants";

/** 비공개 버킷 이미지를 서명 URL 로 표시 (기본은 썸네일) */
export function AssetImage({
  asset,
  full,
  className = "",
  alt,
}: {
  asset: Asset;
  full?: boolean;
  className?: string;
  alt?: string;
}) {
  const path = full || !asset.thumb_path ? asset.storage_path : asset.thumb_path;
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    signedUrl(path)
      .then((u) => alive && setUrl(u))
      .catch(() => alive && setUrl(null));
    return () => {
      alive = false;
    };
  }, [path]);
  if (!asset.mime_type.startsWith("image/")) {
    return (
      <div className={`flex items-center justify-center bg-cream p-3 text-center text-xs text-muted ${className}`}>
        {asset.file_name}
      </div>
    );
  }
  return url ? (
    // eslint-disable-next-line @next/next/no-img-element -- signed private URLs, sizes vary
    <img src={url} alt={alt ?? asset.caption ?? asset.file_name} className={`bg-cream object-cover ${className}`} loading="lazy" />
  ) : (
    <div className={`animate-pulse bg-cream ${className}`} />
  );
}

/** 사진 출처 구분 배지 — AI 생성 이미지와 실제 사진을 혼동하지 않도록 */
export function OriginBadge({ asset }: { asset: Asset }) {
  const tone =
    asset.origin === "ai_generated"
      ? "bg-[#ece7f3] text-[#5a4f78]"
      : asset.origin === "reference_only"
        ? "bg-[#f6e8d8] text-warn"
        : asset.usage_allowed
          ? "bg-[#eef3ec] text-ok"
          : "bg-cream text-muted";
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-[0.62rem] font-medium ${tone}`}>
      {asset.origin === "ai_generated" ? "AI 생성" : ORIGIN_LABEL[asset.origin]}
      {asset.origin !== "reference_only" && (asset.usage_allowed ? " · 사용 가능" : " · 사용 미허가")}
    </span>
  );
}

export function Lightbox({ asset, onClose }: { asset: Asset | null; onClose: () => void }) {
  useEffect(() => {
    if (!asset) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [asset, onClose]);
  if (!asset) return null;
  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/85 p-4" onClick={onClose}>
      <AssetImage asset={asset} full className="max-h-[82dvh] max-w-full !object-contain" />
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-white/80">
        <OriginBadge asset={asset} />
        {asset.caption && <span>{asset.caption}</span>}
        {asset.rights_holder && <span>© {asset.rights_holder}</span>}
      </div>
    </div>
  );
}
