"use client";

import type { Asset, ContentData } from "@/lib/types";
import { AssetImage } from "../asset-image";

export interface PreviewUnit {
  no: number;
  label: string;
  title: string;
  body: string;
  asset?: Asset;
}

export function previewUnits(d: ContentData, assets: Map<string, Asset>): PreviewUnit[] {
  if (d.kind === "travel") {
    return d.pages.map((p) => ({ no: p.no, label: p.role, title: p.headline, body: p.body, asset: p.asset_id ? assets.get(p.asset_id) : undefined }));
  }
  return d.cuts.map((c) => ({
    no: c.no,
    label: `컷 ${c.no}`,
    title: c.scene,
    body: c.lines.map((l) => `${l.speaker}: ${l.text}`).join("\n"),
    asset: c.asset_id ? assets.get(c.asset_id) : undefined,
  }));
}

/** 4:5 페이지 미리보기. 완성 이미지가 없으면 문구로 레이아웃만 보여줌 */
export function PageTile({ unit, onClick, active }: { unit: PreviewUnit; onClick?: () => void; active?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative block w-full overflow-hidden text-left ring-offset-2 transition ${active ? "ring-2 ring-rose-deep" : "hover:opacity-90"}`}
      data-testid="page-tile"
    >
      {unit.asset ? (
        <AssetImage asset={unit.asset} className="ratio-45 w-full" />
      ) : (
        <div className="ratio-45 flex w-full flex-col justify-end bg-navy p-3 text-ivory">
          <p className="text-[0.55rem] tracking-[0.2em] text-ivory/60">{unit.label.toUpperCase()}</p>
          <p className="display line-clamp-3 text-base leading-tight">{unit.title || "—"}</p>
          <p className="mt-1 line-clamp-3 text-[0.62rem] leading-snug text-ivory/70">{unit.body}</p>
        </div>
      )}
      <span className="absolute left-1.5 top-1.5 rounded-full bg-ivory/90 px-1.5 text-[0.62rem] text-navy">{unit.no}</span>
    </button>
  );
}
