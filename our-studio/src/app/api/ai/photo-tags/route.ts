import { NextResponse, type NextRequest } from "next/server";
import { apiMember } from "@/lib/api-auth";
import { aiErrorMessage, jsonCall } from "@/lib/ai/claude";
import { STORAGE_BUCKET } from "@/lib/supabase/env";
import type { Asset } from "@/lib/types";

export const maxDuration = 60;

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["tags", "caption"],
  properties: {
    tags: { type: "array", items: { type: "string" }, description: "Korean content tags, 4-10 items (e.g. 바다, 순두부, 야경, 한옥)" },
    caption: { type: "string", description: "One-line Korean description of the photo" },
  },
} as const;

/** 사진 내용 분석 → ai_tags. 썸네일(640px)을 사용해 비용을 줄입니다. */
export async function POST(req: NextRequest) {
  const auth = await apiMember({ needAi: true });
  if ("error" in auth) return auth.error;
  const { sb } = auth;
  const { assetId } = (await req.json()) as { assetId: string };
  const asset = (await sb.from("assets").select("*").eq("id", assetId).maybeSingle()).data as Asset | null;
  if (!asset || !asset.mime_type.startsWith("image/")) return NextResponse.json({ error: "이미지를 찾을 수 없습니다." }, { status: 404 });
  const path = asset.thumb_path ?? asset.storage_path;
  const file = await sb.storage.from(STORAGE_BUCKET).download(path);
  if (file.error || !file.data) return NextResponse.json({ error: "파일을 읽지 못했습니다." }, { status: 500 });
  const buf = Buffer.from(await file.data.arrayBuffer());
  if (buf.length > 4_500_000) return NextResponse.json({ error: "이미지가 너무 큽니다 (썸네일 없음)." }, { status: 413 });
  const media = (asset.thumb_path ? "image/jpeg" : asset.mime_type) as "image/jpeg" | "image/png" | "image/webp" | "image/gif";
  try {
    const out = await jsonCall<{ tags: string[]; caption: string }>({
      system: "You tag travel/illustration photos for a private content archive. Describe only what is visible. Do not guess people's identities.",
      content: [
        { type: "image", source: { type: "base64", media_type: media, data: buf.toString("base64") } },
        { type: "text", text: `촬영 장소 메모: ${asset.location_text || "(없음)"}. 사진에 보이는 내용 태그와 한 줄 설명을 주세요.` },
      ],
      schema: SCHEMA,
      effort: "low",
      maxTokens: 2000,
    });
    const tags = [...new Set(out.data.tags.map((t) => t.trim()).filter(Boolean))].slice(0, 12);
    await sb.from("assets").update({ ai_tags: tags, ...(asset.caption ? {} : { caption: out.data.caption }) }).eq("id", asset.id);
    return NextResponse.json({ tags, caption: out.data.caption });
  } catch (e) {
    return NextResponse.json({ error: aiErrorMessage(e) }, { status: 502 });
  }
}
