"use client";

import { useState } from "react";
import type { Asset, Character, ToonData } from "@/lib/types";
import { AssetImage } from "../asset-image";
import { Uploader } from "../uploader";
import { Button, Field, NotConnected } from "../ui";
import { PhotoPicker } from "./photo-picker";

export function ToonEditor({
  data,
  onChange,
  assets,
  characters,
  contentId,
  readOnly,
  onAssetsChanged,
}: {
  data: ToonData;
  onChange: (d: ToonData) => void;
  assets: Asset[];
  characters: Character[];
  contentId: string;
  readOnly: boolean;
  onAssetsChanged: () => void;
}) {
  const [picking, setPicking] = useState<number | null>(null);
  const byId = new Map(assets.map((a) => [a.id, a]));
  const set = <K extends keyof ToonData>(k: K, v: ToonData[K]) => onChange({ ...data, [k]: v });
  const setCut = (i: number, patch: Partial<ToonData["cuts"][number]>) => set("cuts", data.cuts.map((c, j) => (j === i ? { ...c, ...patch } : c)));
  const speakers = [...characters.map((c) => c.name), "내레이션", "기타"];

  return (
    <fieldset disabled={readOnly} className="space-y-10">
      <Field label="에피소드 줄거리">
        <textarea className="input min-h-[110px]" value={data.synopsis} onChange={(e) => set("synopsis", e.target.value)} />
      </Field>

      <section>
        <p className="eyebrow mb-3">컷별 스토리보드 · 대사</p>
        <div className="mb-4">
          <NotConnected
            what="AI 컷 이미지 생성"
            detail="연결된 이미지 생성 서비스가 없습니다. 캐릭터 설정집을 참고해 그린 컷 이미지를 업로드하세요."
          />
        </div>
        <div className="space-y-4">
          {data.cuts.map((c, i) => {
            const asset = c.asset_id ? byId.get(c.asset_id) : undefined;
            return (
              <div key={i} className="card grid gap-4 p-4 md:grid-cols-[150px_1fr]" data-testid="cut-editor">
                <div>
                  <button type="button" className="block w-full" onClick={() => setPicking(i)} disabled={readOnly}>
                    {asset ? (
                      <AssetImage asset={asset} className="ratio-45 w-full" />
                    ) : (
                      <span className="ratio-45 flex w-full items-center justify-center border border-dashed text-xs text-muted">컷 이미지</span>
                    )}
                  </button>
                  {!readOnly && (
                    <div className="mt-2">
                      <Uploader
                        compact
                        label="컷 업로드"
                        meta={{ project_id: "med-toon", content_id: contentId, kind: "page_image", origin: "own_photo", usage_allowed: true, license: "자체 제작" }}
                        onUploaded={(list) => {
                          if (list[0]) setCut(i, { asset_id: list[0].id });
                          onAssetsChanged();
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="display text-2xl text-rose-deep">컷 {c.no}</span>
                    <span className="flex-1" />
                    {!readOnly && (
                      <button type="button" className="text-xs text-muted hover:text-danger" onClick={() => set("cuts", data.cuts.filter((_, j) => j !== i).map((x, j) => ({ ...x, no: j + 1 })))}>
                        컷 삭제
                      </button>
                    )}
                  </div>
                  <textarea className="input" rows={2} placeholder="장면 설명 (배경·행동·표정)" value={c.scene} onChange={(e) => setCut(i, { scene: e.target.value })} />
                  {c.lines.map((l, k) => (
                    <div key={k} className="flex gap-2">
                      <select className="input !w-32" value={l.speaker} onChange={(e) => setCut(i, { lines: c.lines.map((x, m) => (m === k ? { ...x, speaker: e.target.value } : x)) })}>
                        {speakers.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                      <input className="input" placeholder="대사" value={l.text} onChange={(e) => setCut(i, { lines: c.lines.map((x, m) => (m === k ? { ...x, text: e.target.value } : x)) })} />
                      <button type="button" className="text-xs text-muted" onClick={() => setCut(i, { lines: c.lines.filter((_, m) => m !== k) })}>
                        ×
                      </button>
                    </div>
                  ))}
                  <Button type="button" size="sm" variant="ghost" onClick={() => setCut(i, { lines: [...c.lines, { speaker: speakers[0], text: "" }] })}>
                    + 대사
                  </Button>
                  <input className="input" placeholder="내부 메모" value={c.notes} onChange={(e) => setCut(i, { notes: e.target.value })} />
                </div>
              </div>
            );
          })}
        </div>
        <Button type="button" variant="ghost" size="sm" className="mt-2" onClick={() => set("cuts", [...data.cuts, { no: data.cuts.length + 1, scene: "", lines: [], asset_id: null, notes: "" }])}>
          + 컷 추가
        </Button>
      </section>

      <section className="grid gap-4">
        <Field label="캡션">
          <textarea className="input min-h-[90px]" value={data.caption} onChange={(e) => set("caption", e.target.value)} />
        </Field>
        <Field label="해시태그" hint="공백으로 구분">
          <input className="input" value={data.hashtags.join(" ")} onChange={(e) => set("hashtags", e.target.value.split(/\s+/).filter(Boolean))} />
        </Field>
      </section>

      <PhotoPicker
        open={picking !== null}
        onClose={() => setPicking(null)}
        assets={assets}
        preferredPlaceIds={[]}
        onPick={(a) => picking !== null && setCut(picking, { asset_id: a?.id ?? null })}
      />
    </fieldset>
  );
}
