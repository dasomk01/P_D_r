"use client";

import Link from "next/link";
import { useEffect, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { STATUS_LABEL } from "@/lib/constants";
import type { IdeaStatus, Member } from "@/lib/types";

type Variant = "primary" | "ghost" | "outline" | "rose" | "danger";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-navy text-ivory hover:bg-navy-soft border border-navy",
  outline: "border border-navy/70 text-navy hover:bg-navy hover:text-ivory",
  ghost: "text-navy hover:bg-cream border border-transparent",
  rose: "bg-rose-wash text-rose-deep border border-rose/60 hover:bg-rose/30",
  danger: "border border-danger/40 text-danger hover:bg-danger hover:text-white",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  busy,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: "sm" | "md"; busy?: boolean }) {
  const sz = size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2.5 text-sm";
  return (
    <button
      {...rest}
      disabled={rest.disabled || busy}
      className={`inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-[3px] font-medium tracking-wide transition disabled:cursor-not-allowed disabled:opacity-45 ${sz} ${VARIANTS[variant]} ${className}`}
    >
      {busy && <span className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />}
      {children}
    </button>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: ReactNode; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.72rem] font-medium tracking-wider text-muted">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function PageHeader({
  eyebrow,
  title,
  sub,
  actions,
}: {
  eyebrow?: string;
  title: ReactNode;
  sub?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-col gap-4 border-b hairline pb-6 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h1 className="display text-4xl leading-tight text-navy md:text-5xl">{title}</h1>
        {sub && <p className="mt-2 max-w-2xl text-sm text-muted">{sub}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}

const STATUS_STYLE: Record<IdeaStatus, string> = {
  idea: "bg-cream text-muted",
  ai_planning: "bg-[#ece7f3] text-[#5a4f78]",
  ready: "bg-[#e6ecf3] text-navy-soft",
  in_production: "bg-[#e9efe6] text-[#4d6a4f]",
  in_review: "bg-rose-wash text-rose-deep",
  revising: "bg-[#f6e8d8] text-warn",
  approved: "bg-navy text-ivory",
};

export function StatusBadge({ status }: { status: IdeaStatus }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[0.68rem] font-medium tracking-wide ${STATUS_STYLE[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}

export function Chip({ children, tone = "plain" }: { children: ReactNode; tone?: "plain" | "rose" | "navy" | "warn" | "ok" }) {
  const t = {
    plain: "border-line text-muted",
    rose: "border-rose/60 text-rose-deep bg-rose-wash/60",
    navy: "border-navy/30 text-navy",
    warn: "border-warn/40 text-warn bg-[#f8eee2]",
    ok: "border-ok/40 text-ok bg-[#eef3ec]",
  }[tone];
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.68rem] ${t}`}>{children}</span>;
}

export function Avatar({ member, size = 22 }: { member?: Member | null; size?: number }) {
  const name = member?.display_name ?? "?";
  return (
    <span
      title={name}
      className="inline-flex shrink-0 items-center justify-center rounded-full text-[0.62rem] font-semibold text-white"
      style={{ width: size, height: size, background: member?.color ?? "#999" }}
    >
      {name.slice(0, 1)}
    </span>
  );
}

export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="card flex flex-col items-center justify-center px-6 py-14 text-center">
      <p className="display text-2xl text-navy">{title}</p>
      {children && <div className="mt-2 max-w-md text-sm text-muted">{children}</div>}
    </div>
  );
}

export function Loading() {
  return (
    <div className="flex items-center gap-2 py-16 text-sm text-muted">
      <span className="h-3 w-3 animate-spin rounded-full border border-muted border-t-transparent" /> 불러오는 중…
    </div>
  );
}

export function ErrorNote({ error }: { error: string | null | undefined }) {
  if (!error) return null;
  return <p className="rounded-[3px] border border-danger/30 bg-[#fbeeee] px-3 py-2 text-sm text-danger">{error}</p>;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy/40 backdrop-blur-[2px] md:items-center" onClick={onClose}>
      <div
        role="dialog"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className={`max-h-[92dvh] w-full overflow-y-auto rounded-t-lg bg-ivory p-5 shadow-2xl md:rounded-md md:p-7 ${wide ? "md:max-w-4xl" : "md:max-w-xl"}`}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 className="display text-2xl text-navy">{title}</h2>
          <button onClick={onClose} className="text-xl leading-none text-muted hover:text-navy" aria-label="닫기">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Tabs<T extends string>({
  value,
  onChange,
  items,
}: {
  value: T;
  onChange: (v: T) => void;
  items: { value: T; label: ReactNode }[];
}) {
  return (
    <div className="scrollbar-none -mx-4 flex gap-6 overflow-x-auto border-b hairline px-4 md:mx-0 md:px-0">
      {items.map((it) => (
        <button
          key={it.value}
          onClick={() => onChange(it.value)}
          className={`shrink-0 border-b-2 pb-2.5 pt-1 text-sm tracking-wide transition ${
            value === it.value ? "border-navy text-navy" : "border-transparent text-muted hover:text-navy"
          }`}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}

/** 쉼표·엔터로 구분하는 태그 입력 */
export function TagInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");
  const commit = () => {
    const parts = draft
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length) onChange([...new Set([...value, ...parts])]);
    setDraft("");
  };
  return (
    <div className="input flex flex-wrap items-center gap-1.5 !py-1.5">
      {value.map((t) => (
        <span key={t} className="inline-flex items-center gap-1 rounded-full bg-cream px-2 py-0.5 text-xs">
          {t}
          <button type="button" className="text-muted hover:text-danger" onClick={() => onChange(value.filter((x) => x !== t))}>
            ×
          </button>
        </span>
      ))}
      <input
        className="min-w-[8rem] flex-1 bg-transparent py-1 outline-none"
        value={draft}
        placeholder={value.length ? "" : placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            commit();
          } else if (e.key === "Backspace" && !draft && value.length) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={commit}
      />
    </div>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <h2 className="display text-2xl text-navy">{children}</h2>
      {action}
    </div>
  );
}

export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="text-xs tracking-wider text-navy underline-offset-4 hover:underline">
      {children}
    </Link>
  );
}

/** AI 등 외부 연동이 없을 때 '작동하는 척' 하지 않고 명확히 표시 */
export function NotConnected({ what, detail }: { what: string; detail?: ReactNode }) {
  return (
    <div className="rounded-[3px] border border-dashed border-muted/50 bg-cream/50 px-4 py-3 text-sm text-muted">
      <span className="mr-2 inline-block rounded-full bg-sand px-2 py-0.5 text-[0.68rem] font-medium tracking-wider text-navy-soft">
        연동 준비 중
      </span>
      {what}
      {detail && <div className="mt-1 text-xs">{detail}</div>}
    </div>
  );
}
