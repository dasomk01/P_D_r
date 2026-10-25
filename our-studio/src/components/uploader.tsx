"use client";

import { useRef, useState } from "react";
import { uploadAsset, type UploadMeta } from "@/lib/storage";
import type { Asset } from "@/lib/types";
import { Button, ErrorNote } from "./ui";

/**
 * 여러 파일 업로드. 모바일에서는 사진 보관함에서 여러 장을 한 번에 고를 수 있습니다.
 */
export function Uploader({
  meta,
  accept = "image/*",
  label = "사진 올리기",
  onUploaded,
  compact,
}: {
  meta: UploadMeta;
  accept?: string;
  label?: string;
  onUploaded?: (assets: Asset[]) => void;
  compact?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);

  async function handle(files: FileList | File[]) {
    const list = Array.from(files);
    if (!list.length) return;
    setError(null);
    setProgress({ done: 0, total: list.length });
    const out: Asset[] = [];
    const errors: string[] = [];
    // 3개씩 병렬 업로드
    let idx = 0;
    async function worker() {
      while (idx < list.length) {
        const f = list[idx++];
        try {
          out.push(await uploadAsset(f, meta));
        } catch (e) {
          errors.push(e instanceof Error ? e.message : String(e));
        }
        setProgress((p) => (p ? { ...p, done: p.done + 1 } : p));
      }
    }
    await Promise.all([worker(), worker(), worker()]);
    setProgress(null);
    if (errors.length) setError(errors.join("\n"));
    if (input.current) input.current.value = "";
    onUploaded?.(out);
  }

  const busy = progress !== null;
  const picker = (
    <input
      ref={input}
      type="file"
      multiple
      accept={accept}
      className="hidden"
      data-testid="file-input"
      onChange={(e) => e.target.files && handle(e.target.files)}
    />
  );

  if (compact) {
    return (
      <>
        {picker}
        <Button variant="outline" size="sm" busy={busy} onClick={() => input.current?.click()} type="button">
          {busy ? `${progress.done}/${progress.total}` : label}
        </Button>
        <ErrorNote error={error} />
      </>
    );
  }

  return (
    <div>
      {picker}
      <button
        type="button"
        onClick={() => input.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          void handle(e.dataTransfer.files);
        }}
        disabled={busy}
        className={`flex w-full flex-col items-center justify-center rounded-[4px] border border-dashed px-6 py-8 text-center transition ${
          drag ? "border-navy bg-cream" : "border-muted/40 hover:border-navy hover:bg-cream/50"
        }`}
      >
        <span className="display text-xl text-navy">{busy ? `업로드 중 ${progress.done} / ${progress.total}` : label}</span>
        <span className="mt-1 text-xs text-muted">탭하여 여러 장 선택 · PC 에서는 끌어다 놓기</span>
      </button>
      <div className="mt-2">
        <ErrorNote error={error} />
      </div>
    </div>
  );
}
