"use client";

import JSZip from "jszip";
import { captionFile } from "@/lib/content-template";
import { downloadBlob, saveBlob } from "@/lib/storage";
import type { Asset, ContentData } from "@/lib/types";

function slug(s: string) {
  return (
    s
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "content"
  );
}

function units(d: ContentData) {
  return d.kind === "travel"
    ? d.pages.map((p) => ({ no: p.no, asset_id: p.asset_id, title: p.headline }))
    : d.cuts.map((c) => ({ no: c.no, asset_id: c.asset_id, title: c.scene }));
}

async function blobToImage(b: Blob): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(b);
  const img = new Image();
  img.src = url;
  await img.decode();
  return img;
}

/** 전체 미리보기 한 장 (contact sheet) */
async function contactSheet(title: string, items: { no: number; blob: Blob | null; title: string }[]): Promise<Blob> {
  const cols = 4;
  const tw = 270;
  const th = 338;
  const gap = 18;
  const head = 90;
  const rows = Math.ceil(items.length / cols);
  const canvas = document.createElement("canvas");
  canvas.width = cols * tw + (cols + 1) * gap;
  canvas.height = head + rows * (th + gap) + gap;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fbf8f2";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#1b2540";
  ctx.font = "500 30px Georgia, serif";
  ctx.fillText(title.slice(0, 60), gap, 52);
  ctx.font = "13px sans-serif";
  ctx.fillStyle = "#6f6a62";
  ctx.fillText(`${items.length} pages · preview`, gap, 76);
  for (let i = 0; i < items.length; i++) {
    const x = gap + (i % cols) * (tw + gap);
    const y = head + Math.floor(i / cols) * (th + gap);
    const it = items[i];
    if (it.blob) {
      const img = await blobToImage(it.blob);
      const s = Math.max(tw / img.naturalWidth, th / img.naturalHeight);
      const w = img.naturalWidth * s;
      const h = img.naturalHeight * s;
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, tw, th);
      ctx.clip();
      ctx.drawImage(img, x + (tw - w) / 2, y + (th - h) / 2, w, h);
      ctx.restore();
    } else {
      ctx.fillStyle = "#1b2540";
      ctx.fillRect(x, y, tw, th);
      ctx.fillStyle = "#fbf8f2";
      ctx.font = "500 18px Georgia, serif";
      ctx.fillText(it.title.slice(0, 26) || "(no image)", x + 14, y + th - 24);
    }
    ctx.fillStyle = "rgba(251,248,242,0.92)";
    ctx.fillRect(x + 8, y + 8, 26, 20);
    ctx.fillStyle = "#1b2540";
    ctx.font = "12px sans-serif";
    ctx.fillText(String(it.no), x + 16, y + 22);
  }
  return new Promise((r) => canvas.toBlob((b) => r(b!), "image/jpeg", 0.9));
}

export async function exportZip(opts: { title: string; versionNo: number; data: ContentData; assets: Map<string, Asset> }) {
  const zip = new JSZip();
  const items: { no: number; blob: Blob | null; title: string }[] = [];
  const credits: string[] = [];
  for (const u of units(opts.data)) {
    const asset = u.asset_id ? opts.assets.get(u.asset_id) : undefined;
    let blob: Blob | null = null;
    if (asset) {
      blob = await downloadBlob(asset.storage_path);
      const ext = asset.file_name.split(".").pop()?.toLowerCase() || "jpg";
      zip.file(`${String(u.no).padStart(2, "0")}.${ext}`, blob);
      credits.push(
        `${u.no}. ${asset.file_name} — ${asset.origin === "ai_generated" ? "AI 생성 이미지" : asset.origin}${asset.rights_holder ? ` · © ${asset.rights_holder}` : ""}${asset.license ? ` · ${asset.license}` : ""}${asset.source_url ? ` · ${asset.source_url}` : ""}${asset.usage_allowed ? "" : " · ⚠ 사용 미허가"}`,
      );
    } else {
      credits.push(`${u.no}. (이미지 없음)`);
    }
    items.push({ no: u.no, blob, title: u.title });
  }
  zip.file("preview.jpg", await contactSheet(opts.title, items));
  zip.file("caption.txt", captionFile(opts.title, opts.data));
  zip.file("credits.txt", `${opts.title} · v${opts.versionNo}\n\n${credits.join("\n")}\n`);
  const blob = await zip.generateAsync({ type: "blob" });
  saveBlob(blob, `${slug(opts.title)}-v${opts.versionNo}.zip`);
}
