"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useLive } from "@/lib/live";
import { getAssets, getCharacters } from "@/lib/queries";
import { STYLE_FIELDS } from "@/lib/toon-spec";
import type { Asset, Character, StyleGuide } from "@/lib/types";
import { useStudio } from "@/components/studio-context";
import { AssetImage } from "@/components/asset-image";
import { AssetEditor } from "@/components/asset-editor";
import { Uploader } from "@/components/uploader";
import { Button, Chip, ErrorNote, Field, Loading, PageHeader } from "@/components/ui";

const FIELDS: [keyof Character, string, number][] = [
  ["appearance", "외형 (일관성 유지 기준)", 3],
  ["personality", "성격", 2],
  ["speech_style", "말투", 2],
  ["rules", "그릴 때 지킬 규칙", 3],
];

const REF_KINDS = new Set(["character_ref", "pose_ref", "style_ref"]);

export default function CharactersPage() {
  const { project, me } = useStudio();
  const proj = project("med-toon");
  const { data, reload } = useLive(
    "characters",
    async () => {
      const [characters, assets] = await Promise.all([getCharacters(), getAssets({ project_id: "med-toon" })]);
      return { characters, assets: assets.filter((a) => REF_KINDS.has(a.kind)) };
    },
    ["characters", "assets", "projects"],
  );
  const [editing, setEditing] = useState<Asset | null>(null);
  const [error, setError] = useState<string | null>(null);
  if (!data || !proj) return <Loading />;
  const pinned = data.assets.filter((a) => a.pinned).sort((a, b) => a.sort_order - b.sort_order);
  const styleRefs = data.assets.filter((a) => a.kind === "style_ref");

  async function togglePin(a: Asset) {
    const { error } = await supabase()
      .from("assets")
      .update({ pinned: !a.pinned, sort_order: a.pinned ? 0 : pinned.length + 1 })
      .eq("id", a.id);
    if (error) setError(error.message);
    void reload();
  }

  return (
    <div className="space-y-12">
      <PageHeader
        eyebrow="MED SCHOOL TOON · Style bible"
        title="그림체 설정집"
        sub="흰 토끼·갈색 곰의 얼굴, 비율, 색감, 선, 말풍선, 글씨체를 고정합니다. ChatGPT 는 컷을 그리기 전에 이 설정과 📌 대표 이미지를 그대로 가져갑니다(get_style_bible)."
      />

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="display text-2xl text-navy">
            📌 대표 이미지 <span className="text-base text-muted">· {pinned.length}장 · ChatGPT 에 전달됨</span>
          </h2>
          <Uploader
            compact
            label="기존 계정 대표 이미지 올리기"
            meta={{ project_id: "med-toon", kind: "style_ref", origin: "own_photo", usage_allowed: true, rights_holder: me.display_name, pinned: true, license: "자체 제작" }}
            onUploaded={() => reload()}
          />
        </div>
        <p className="text-sm text-muted">
          기존 인스타 계정에 올렸던 그림 중 그림체가 가장 잘 드러나는 컷을 3~6장 올려 고정하세요. 원본 파일로 영구 보관되며, 고정된 순서대로 앞의 6장이 ChatGPT
          에 이미지로 전달되고 서버 판독에는 앞의 3장이 쓰입니다.
        </p>
        {pinned.length === 0 ? (
          <p className="card p-6 text-center text-sm text-muted">아직 고정된 대표 이미지가 없습니다. 위 버튼으로 올리거나 아래 레퍼런스에서 📌 를 누르세요.</p>
        ) : (
          <div className="grid grid-cols-3 gap-3 md:grid-cols-6" data-testid="pinned-refs">
            {pinned.map((a, i) => (
              <div key={a.id} className="space-y-1">
                <button onClick={() => setEditing(a)} className="block w-full">
                  <AssetImage asset={a} className="aspect-square w-full" />
                </button>
                <div className="flex items-center justify-between text-[0.7rem] text-muted">
                  <span>{i + 1}번{i >= 6 ? " (전달 안 됨)" : ""}</span>
                  <button className="hover:text-danger" onClick={() => togglePin(a)}>
                    고정 해제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <StyleGuideForm initial={proj.settings.style_guide ?? {}} legacy={proj.settings.style ?? ""} settings={proj.settings} onError={setError} />

      {data.characters.map((c) => (
        <CharacterCard
          key={c.id + c.updated_at}
          c={c}
          assets={data.assets.filter((a) => a.character_id === c.id)}
          onChanged={reload}
          onEdit={setEditing}
          onPin={togglePin}
          me={me.display_name}
        />
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
        <h2 className="display text-2xl text-navy">그림체 레퍼런스</h2>
        <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
          {styleRefs.map((a) => (
            <RefThumb key={a.id} a={a} onEdit={setEditing} onPin={togglePin} />
          ))}
        </div>
        <Uploader compact label="그림체 레퍼런스 올리기" meta={{ project_id: "med-toon", kind: "style_ref", origin: "own_photo", usage_allowed: true, rights_holder: me.display_name }} onUploaded={() => reload()} />
      </section>
      <ErrorNote error={error} />
      <AssetEditor asset={editing} onClose={() => setEditing(null)} onChanged={() => reload()} />
    </div>
  );
}

function RefThumb({ a, onEdit, onPin }: { a: Asset; onEdit: (a: Asset) => void; onPin: (a: Asset) => void }) {
  return (
    <div className="relative">
      <button onClick={() => onEdit(a)} className="block w-full text-left">
        <AssetImage asset={a} className="aspect-square w-full" />
      </button>
      <button
        onClick={() => onPin(a)}
        title={a.pinned ? "대표 고정 해제" : "대표 이미지로 고정"}
        className={`absolute right-1 top-1 rounded-full px-1.5 text-xs ${a.pinned ? "bg-rose-deep text-white" : "bg-ivory/90 text-muted"}`}
        data-testid="pin-toggle"
      >
        📌
      </button>
    </div>
  );
}

function StyleGuideForm({
  initial,
  legacy,
  settings,
  onError,
}: {
  initial: Partial<StyleGuide>;
  legacy: string;
  settings: Record<string, unknown>;
  onError: (e: string) => void;
}) {
  const [g, setG] = useState<Partial<StyleGuide>>(initial);
  const [busy, setBusy] = useState(false);
  // 마지막으로 저장한 내용 (실시간 동기화를 기다리지 않고 바로 '저장됨' 표시)
  const [savedJson, setSavedJson] = useState<string | null>(null);
  const dirty = JSON.stringify(g) !== (savedJson ?? JSON.stringify(initial));
  const saved = savedJson !== null;
  return (
    <section className="card space-y-4 p-6" data-testid="style-guide">
      <div className="flex items-end justify-between">
        <h2 className="display text-2xl text-navy">고정 규칙</h2>
        {saved && !dirty && <Chip tone="ok">저장됨</Chip>}
      </div>
      {legacy && <p className="rounded bg-cream/60 p-3 text-xs text-muted">이전에 적은 그림체 메모 (함께 전달됨): {legacy}</p>}
      <div className="grid gap-4 md:grid-cols-2">
        {STYLE_FIELDS.map((f) => (
          <Field key={f.key} label={f.label} hint={f.hint}>
            <textarea className="input" rows={2} value={g[f.key] ?? ""} onChange={(e) => setG({ ...g, [f.key]: e.target.value })} data-testid={`style-${f.key}`} />
          </Field>
        ))}
      </div>
      <Button
        size="sm"
        busy={busy}
        disabled={!dirty}
        onClick={async () => {
          setBusy(true);
          const { error } = await supabase()
            .from("projects")
            .update({ settings: { ...settings, style_guide: g } })
            .eq("id", "med-toon");
          setBusy(false);
          if (error) return onError(error.message);
          setSavedJson(JSON.stringify(g));
        }}
      >
        고정 규칙 저장
      </Button>
    </section>
  );
}

function CharacterCard({
  c,
  assets,
  onChanged,
  onEdit,
  onPin,
  me,
}: {
  c: Character;
  assets: Asset[];
  onChanged: () => void;
  onEdit: (a: Asset) => void;
  onPin: (a: Asset) => void;
  me: string;
}) {
  const [d, setD] = useState(c);
  const [busy, setBusy] = useState(false);
  const dirty = JSON.stringify(d) !== JSON.stringify(c);
  return (
    <section className="card grid gap-6 p-6 md:grid-cols-[260px_1fr]" data-testid="character">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {assets.map((a) => (
            <div key={a.id}>
              <RefThumb a={a} onEdit={onEdit} onPin={onPin} />
              <span className="text-[0.62rem] text-muted">{a.kind === "character_ref" ? "원본" : a.kind === "pose_ref" ? "표정·포즈" : "그림체"}</span>
            </div>
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
