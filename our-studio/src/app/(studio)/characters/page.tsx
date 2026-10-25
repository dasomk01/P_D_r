"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useLive } from "@/lib/live";
import { getAssets, getCharacters } from "@/lib/queries";
import type { Asset, Character } from "@/lib/types";
import { useStudio } from "@/components/studio-context";
import { AssetImage } from "@/components/asset-image";
import { AssetEditor } from "@/components/asset-editor";
import { Uploader } from "@/components/uploader";
import { Button, ErrorNote, Field, Loading, PageHeader } from "@/components/ui";

const FIELDS: [keyof Character, string, number][] = [
  ["appearance", "외형 (일관성 유지 기준)", 3],
  ["personality", "성격", 2],
  ["speech_style", "말투", 2],
  ["rules", "그릴 때 지킬 규칙", 3],
];

export default function CharactersPage() {
  const { project, me } = useStudio();
  const proj = project("med-toon");
  const { data, reload } = useLive(
    "characters",
    async () => {
      const [characters, assets] = await Promise.all([getCharacters(), getAssets({ project_id: "med-toon" })]);
      return { characters, assets };
    },
    ["characters", "assets", "projects"],
  );
  const [style, setStyle] = useState<string | null>(null);
  const [editing, setEditing] = useState<Asset | null>(null);
  const [error, setError] = useState<string | null>(null);
  if (!data || !proj) return <Loading />;
  const styleRefs = data.assets.filter((a) => a.kind === "style_ref");

  return (
    <div className="space-y-12">
      <PageHeader
        eyebrow="MED SCHOOL TOON · Character bible"
        title="캐릭터 설정집"
        sub="그림체와 캐릭터 외형의 일관성을 위한 기준. AI 줄거리·대사 생성도 이 설정을 참고합니다."
      />

      {data.characters.map((c) => (
        <CharacterCard key={c.id + c.updated_at} c={c} assets={data.assets.filter((a) => a.character_id === c.id)} onChanged={reload} onEdit={setEditing} me={me.display_name} />
      ))}

      <Button
        variant="ghost"
        onClick={async () => {
          const { error } = await supabase().from("characters").insert({ name: "새 캐릭터", sort_order: data.characters.length + 1 });
          if (error) setError(error.message);
          void reload();
        }}
      >
        + 조연 캐릭터 추가
      </Button>

      <section className="card space-y-4 p-6">
        <h2 className="display text-2xl text-navy">그림체 설정</h2>
        <textarea
          className="input min-h-[120px]"
          value={style ?? proj.settings.style ?? ""}
          onChange={(e) => setStyle(e.target.value)}
          placeholder="선 굵기, 채색 방식, 배경 밀도, 말풍선 폰트, 컷 비율 등"
        />
        <Button
          size="sm"
          disabled={style === null}
          onClick={async () => {
            const { error } = await supabase()
              .from("projects")
              .update({ settings: { ...proj.settings, style } })
              .eq("id", "med-toon");
            if (error) return setError(error.message);
            setStyle(null);
          }}
        >
          그림체 설정 저장
        </Button>
        <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
          {styleRefs.map((a) => (
            <button key={a.id} onClick={() => setEditing(a)}>
              <AssetImage asset={a} className="aspect-square w-full" />
            </button>
          ))}
        </div>
        <Uploader compact label="그림체 레퍼런스 올리기" meta={{ project_id: "med-toon", kind: "style_ref", origin: "own_photo", usage_allowed: true, rights_holder: me.display_name }} onUploaded={() => reload()} />
      </section>
      <ErrorNote error={error} />
      <AssetEditor asset={editing} onClose={() => setEditing(null)} onChanged={() => reload()} />
    </div>
  );
}

function CharacterCard({ c, assets, onChanged, onEdit, me }: { c: Character; assets: Asset[]; onChanged: () => void; onEdit: (a: Asset) => void; me: string }) {
  const [d, setD] = useState(c);
  const [busy, setBusy] = useState(false);
  const dirty = JSON.stringify(d) !== JSON.stringify(c);
  return (
    <section className="card grid gap-6 p-6 md:grid-cols-[260px_1fr]" data-testid="character">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {assets.map((a) => (
            <button key={a.id} onClick={() => onEdit(a)} className="block text-left">
              <AssetImage asset={a} className="aspect-square w-full" />
              <span className="text-[0.62rem] text-muted">{a.kind === "character_ref" ? "원본" : "표정·포즈"}</span>
            </button>
          ))}
          {assets.length === 0 && <div className="col-span-2 flex aspect-square items-center justify-center bg-cream text-xs text-muted">레퍼런스 없음</div>}
        </div>
        <div className="flex flex-wrap gap-2">
          <Uploader compact label="원본" meta={{ project_id: "med-toon", kind: "character_ref", character_id: c.id, origin: "own_photo", usage_allowed: true, rights_holder: me }} onUploaded={onChanged} />
          <Uploader compact label="표정·포즈" meta={{ project_id: "med-toon", kind: "pose_ref", character_id: c.id, origin: "own_photo", usage_allowed: true, rights_holder: me }} onUploaded={onChanged} />
        </div>
      </div>
      <div className="space-y-3">
        <div className="grid gap-3 md:grid-cols-3">
          <Field label="이름">
            <input className="input display !text-xl" value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} />
          </Field>
          <Field label="종">
            <input className="input" value={d.species} onChange={(e) => setD({ ...d, species: e.target.value })} />
          </Field>
          <Field label="역할">
            <input className="input" value={d.role} onChange={(e) => setD({ ...d, role: e.target.value })} />
          </Field>
        </div>
        {FIELDS.map(([k, label, rows]) => (
          <Field key={k} label={label}>
            <textarea className="input" rows={rows} value={String(d[k] ?? "")} onChange={(e) => setD({ ...d, [k]: e.target.value })} />
          </Field>
        ))}
        <Button
          size="sm"
          busy={busy}
          disabled={!dirty}
          onClick={async () => {
            setBusy(true);
            await supabase()
              .from("characters")
              .update({ name: d.name, species: d.species, role: d.role, appearance: d.appearance, personality: d.personality, speech_style: d.speech_style, rules: d.rules })
              .eq("id", c.id);
            setBusy(false);
            onChanged();
          }}
        >
          저장
        </Button>
      </div>
    </section>
  );
}
