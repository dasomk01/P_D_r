"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useLive } from "@/lib/live";
import { getComments } from "@/lib/queries";
import { timeAgo } from "@/lib/dates";
import type { Comment, ProjectId } from "@/lib/types";
import { useStudio } from "./studio-context";
import { Avatar, Button, Chip, ErrorNote } from "./ui";

export function Comments({
  projectId,
  targetType,
  targetId,
  pageNo,
  versionNo,
  title = "댓글",
  filterPage,
}: {
  projectId: ProjectId;
  targetType: Comment["target_type"];
  targetId: string;
  pageNo?: number | null;
  versionNo?: number | null;
  title?: string;
  /** true 면 pageNo 와 일치하는 댓글만 보여줌 */
  filterPage?: boolean;
}) {
  const { memberById, me } = useStudio();
  const { data, reload } = useLive(`comments:${targetType}:${targetId}`, () => getComments(targetType, targetId), ["comments"]);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const list = (data ?? []).filter((c) => !filterPage || (c.page_no ?? null) === (pageNo ?? null));

  async function submit() {
    if (!body.trim()) return;
    setBusy(true);
    setError(null);
    const { error } = await supabase().from("comments").insert({
      project_id: projectId,
      target_type: targetType,
      target_id: targetId,
      page_no: pageNo ?? null,
      version_no: versionNo ?? null,
      body: body.trim(),
    });
    setBusy(false);
    if (error) return setError(error.message);
    setBody("");
    void reload();
  }

  return (
    <div>
      <p className="eyebrow mb-3">
        {title} · {list.length}
      </p>
      <ul className="space-y-3">
        {list.map((c) => (
          <li key={c.id} className="flex gap-2.5">
            <Avatar member={memberById(c.author)} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                <span className="text-navy">{memberById(c.author)?.display_name ?? "?"}</span>
                <span>{timeAgo(c.created_at)}</span>
                {c.page_no != null && !filterPage && <Chip>{c.page_no}번 페이지</Chip>}
                {c.version_no != null && <Chip>v{c.version_no}</Chip>}
                {c.kind === "revision_request" && <Chip tone={c.resolved ? "ok" : "warn"}>{c.resolved ? "수정 완료" : "수정 요청"}</Chip>}
              </div>
              <p className="mt-0.5 whitespace-pre-wrap text-sm leading-relaxed">{c.body}</p>
              <div className="mt-1 flex gap-3 text-[0.7rem] text-muted">
                {c.kind === "revision_request" && (
                  <button
                    className="hover:text-navy"
                    onClick={async () => {
                      await supabase().from("comments").update({ resolved: !c.resolved }).eq("id", c.id);
                      void reload();
                    }}
                  >
                    {c.resolved ? "다시 열기" : "해결로 표시"}
                  </button>
                )}
                {c.author === me.user_id && (
                  <button
                    className="hover:text-danger"
                    onClick={async () => {
                      await supabase().from("comments").delete().eq("id", c.id);
                      void reload();
                    }}
                  >
                    삭제
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex gap-2">
        <textarea
          className="input min-h-[44px] flex-1 resize-y"
          rows={1}
          placeholder="의견을 남겨주세요"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) void submit();
          }}
        />
        <Button onClick={submit} busy={busy} disabled={!body.trim()} size="sm" className="self-end">
          등록
        </Button>
      </div>
      <ErrorNote error={error} />
    </div>
  );
}
