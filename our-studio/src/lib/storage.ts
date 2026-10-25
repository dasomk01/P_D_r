"use client";

import { supabase } from "./supabase/client";
import { STORAGE_BUCKET } from "./supabase/env";
import type { Asset, AssetKind, AssetOrigin, ProjectId } from "./types";

const urlCache = new Map<string, { url: string; exp: number }>();

/** 비공개 버킷 파일의 서명 URL (1시간) — 같은 경로는 캐시합니다. */
export async function signedUrl(path: string): Promise<string> {
  const hit = urlCache.get(path);
  if (hit && hit.exp > Date.now() + 60_000) return hit.url;
  const { data, error } = await supabase().storage.from(STORAGE_BUCKET).createSignedUrl(path, 3600);
  if (error || !data) throw new Error(error?.message ?? "signed url failed");
  urlCache.set(path, { url: data.signedUrl, exp: Date.now() + 3600_000 });
  return data.signedUrl;
}

export async function signedUrls(paths: string[]): Promise<Record<string, string>> {
  const missing = paths.filter((p) => {
    const hit = urlCache.get(p);
    return !hit || hit.exp <= Date.now() + 60_000;
  });
  if (missing.length) {
    const { data, error } = await supabase().storage.from(STORAGE_BUCKET).createSignedUrls(missing, 3600);
    if (error) throw new Error(error.message);
    for (const row of data ?? []) {
      if (row.path && row.signedUrl) urlCache.set(row.path, { url: row.signedUrl, exp: Date.now() + 3600_000 });
    }
  }
  const out: Record<string, string> = {};
  for (const p of paths) {
    const hit = urlCache.get(p);
    if (hit) out[p] = hit.url;
  }
  return out;
}

async function loadImage(file: Blob): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = url;
    await img.decode();
    return img;
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

/** 미리보기용 썸네일(긴 변 640px, JPEG). 원본은 그대로 보관합니다. */
async function makeThumb(file: File): Promise<{ blob: Blob; width: number; height: number } | null> {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") return null;
  try {
    const img = await loadImage(file);
    const scale = Math.min(1, 640 / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.82));
    return blob ? { blob, width: img.naturalWidth, height: img.naturalHeight } : null;
  } catch {
    return null;
  }
}

function safeName(name: string): string {
  const dot = name.lastIndexOf(".");
  const ext = dot > 0 ? name.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, "") : "bin";
  return `${crypto.randomUUID()}.${ext || "bin"}`;
}

export interface UploadMeta {
  project_id: ProjectId;
  kind?: AssetKind;
  origin?: AssetOrigin;
  usage_allowed?: boolean;
  rights_holder?: string;
  caption?: string;
  location_text?: string;
  place_id?: string | null;
  trip_id?: string | null;
  idea_id?: string | null;
  content_id?: string | null;
  character_id?: string | null;
  license?: string;
}

/** 파일을 Storage 에 올리고 assets 행을 만듭니다. 사진이면 썸네일도 함께 저장. */
export async function uploadAsset(file: File, meta: UploadMeta): Promise<Asset> {
  const sb = supabase();
  const folder = `${meta.project_id}/${new Date().toISOString().slice(0, 7)}`;
  const path = `${folder}/${safeName(file.name)}`;
  const up = await sb.storage.from(STORAGE_BUCKET).upload(path, file, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });
  if (up.error) throw new Error(`업로드 실패 (${file.name}): ${up.error.message}`);

  let thumb_path: string | null = null;
  let width: number | null = null;
  let height: number | null = null;
  const thumb = await makeThumb(file);
  if (thumb) {
    width = thumb.width;
    height = thumb.height;
    const tp = path.replace(/\.[^.]+$/, "") + ".thumb.jpg";
    const t = await sb.storage.from(STORAGE_BUCKET).upload(tp, thumb.blob, { contentType: "image/jpeg" });
    if (!t.error) thumb_path = tp;
  }

  const origin = meta.origin ?? "own_photo";
  const { data, error } = await sb
    .from("assets")
    .insert({
      project_id: meta.project_id,
      storage_path: path,
      thumb_path,
      file_name: file.name,
      mime_type: file.type || "application/octet-stream",
      size_bytes: file.size,
      width,
      height,
      kind: meta.kind ?? (file.type.startsWith("image/") ? "photo" : "file"),
      origin,
      usage_allowed: origin === "reference_only" ? false : (meta.usage_allowed ?? false),
      rights_holder: meta.rights_holder ?? "",
      caption: meta.caption ?? "",
      location_text: meta.location_text ?? "",
      license: meta.license ?? "",
      place_id: meta.place_id ?? null,
      trip_id: meta.trip_id ?? null,
      idea_id: meta.idea_id ?? null,
      content_id: meta.content_id ?? null,
      character_id: meta.character_id ?? null,
    })
    .select()
    .single();
  if (error) {
    await sb.storage.from(STORAGE_BUCKET).remove([path, ...(thumb_path ? [thumb_path] : [])]);
    throw new Error(error.message);
  }
  return data as Asset;
}

export async function deleteAsset(asset: Asset): Promise<void> {
  const sb = supabase();
  const { error } = await sb.from("assets").delete().eq("id", asset.id);
  if (error) throw new Error(error.message);
  await sb.storage.from(STORAGE_BUCKET).remove([asset.storage_path, ...(asset.thumb_path ? [asset.thumb_path] : [])]);
}

export async function downloadBlob(path: string): Promise<Blob> {
  const { data, error } = await supabase().storage.from(STORAGE_BUCKET).download(path);
  if (error || !data) throw new Error(error?.message ?? "download failed");
  return data;
}

export function saveBlob(blob: Blob, filename: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
