"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { ProjectId } from "@/lib/types";
import { Button, ErrorNote, Field, TagInput } from "@/components/ui";

export function IdeaForm({ project, onSaved }: { project: ProjectId; onSaved: (id: string) => void }) {
  const [title, setTitle] = useState("");
  const [memo, setMemo] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [links, setLinks] = useState("");
  const [priority, setPriority] = useState<1 | 2 | 3>(2);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        const { data, error } = await supabase()
          .from("ideas")
          .insert({
            project_id: project,
            title: title.trim(),
            memo,
            tags,
            links: links.split(/\s+/).filter((l) => /^https?:\/\//.test(l)),
            priority,
          })
          .select("id")
          .single();
        setBusy(false);
        if (error) return setError(error.message);
        onSaved(data.id);
      }}
    >
      <Field label="제목 *">
        <input className="input" required value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
      </Field>
      <Field label="메모">
        <textarea className="input min-h-[110px]" value={memo} onChange={(e) => setMemo(e.target.value)} />
      </Field>
      <Field label="태그" hint="엔터나 쉼표로 구분">
        <TagInput value={tags} onChange={setTags} placeholder="부산, 바다" />
      </Field>
      <Field label="참고 링크" hint="여러 개는 줄바꿈 또는 공백으로 구분">
        <textarea className="input" rows={2} value={links} onChange={(e) => setLinks(e.target.value)} placeholder="https://" />
      </Field>
      <Field label="제작 우선순위">
        <div className="flex gap-2">
          {([1, 2, 3] as const).map((p) => (
            <button
              type="button"
              key={p}
              onClick={() => setPriority(p)}
              className={`flex-1 rounded-[3px] border py-2 text-sm ${priority === p ? "border-navy bg-navy text-ivory" : "border-line"}`}
            >
              {p === 1 ? "높음" : p === 2 ? "보통" : "낮음"}
            </button>
          ))}
        </div>
      </Field>
      <p className="text-xs text-muted">사진·파일은 저장 후 상세 화면에서 첨부할 수 있어요.</p>
      <ErrorNote error={error} />
      <Button type="submit" busy={busy} disabled={!title.trim()} className="w-full">
        저장
      </Button>
    </form>
  );
}
