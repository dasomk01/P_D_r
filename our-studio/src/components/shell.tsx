"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { useStudio } from "./studio-context";
import { Avatar } from "./ui";
import { SignOutButton } from "./sign-out";

const NAV = [
  { href: "/", label: "대시보드", en: "Overview" },
  { href: "/ideas", label: "아이디어 보드", en: "Ideas" },
  { href: "/archive", label: "여행 아카이브", en: "Travel Archive" },
  { href: "/studio", label: "제작실", en: "Studio" },
  { href: "/calendar", label: "캘린더", en: "Calendar" },
  { href: "/library", label: "자료 보관함", en: "Library" },
  { href: "/characters", label: "캐릭터 설정집", en: "Characters" },
  { href: "/settings", label: "설정·백업", en: "Settings" },
];

const MOBILE_TABS = ["/", "/ideas", "/archive", "/studio", "/calendar"];

function isActive(path: string, href: string) {
  return href === "/" ? path === "/" : path === href || path.startsWith(href + "/");
}

export function Shell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const { me, members } = useStudio();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-dvh md:grid md:grid-cols-[240px_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh self-start flex-col border-r hairline bg-ivory px-6 py-8 md:flex">
        <Link href="/" className="mb-10 block">
          <span className="display block text-3xl leading-none text-navy">OUR</span>
          <span className="display block text-3xl italic leading-none text-rose-deep">Studio</span>
        </Link>
        <nav className="flex-1 space-y-0.5">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`group flex items-baseline justify-between rounded-[3px] px-3 py-2 text-sm transition ${
                isActive(path, n.href) ? "bg-cream text-navy" : "text-muted hover:text-navy"
              }`}
            >
              <span className="whitespace-nowrap">{n.label}</span>
              <span className="hidden text-[0.6rem] tracking-[0.15em] text-muted/70 group-hover:inline">
                {n.en.toUpperCase()}
              </span>
            </Link>
          ))}
        </nav>
        <div className="space-y-3 border-t hairline pt-5">
          <div className="flex -space-x-1.5">
            {members.map((m) => (
              <Avatar key={m.user_id} member={m} size={26} />
            ))}
          </div>
          <p className="text-xs text-muted">
            <span className="text-navy">{me.display_name}</span> 님으로 로그인
          </p>
          <SignOutButton />
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b hairline bg-ivory/95 px-4 py-3 backdrop-blur md:hidden">
        <Link href="/" className="display text-xl text-navy">
          OUR <em className="text-rose-deep">Studio</em>
        </Link>
        <button onClick={() => setOpen((v) => !v)} className="text-xs tracking-[0.2em] text-navy" aria-expanded={open}>
          {open ? "CLOSE" : "MENU"}
        </button>
      </header>
      {open && (
        <div className="fixed inset-x-0 top-[49px] z-30 border-b hairline bg-ivory px-4 pb-5 shadow-lg md:hidden">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className={`flex justify-between border-b hairline py-3 text-sm ${isActive(path, n.href) ? "text-navy" : "text-muted"}`}
            >
              {n.label}
              <span className="text-[0.62rem] tracking-[0.15em]">{n.en.toUpperCase()}</span>
            </Link>
          ))}
          <div className="flex items-center justify-between pt-4">
            <span className="text-xs text-muted">{me.display_name}</span>
            <SignOutButton />
          </div>
        </div>
      )}

      <main className="min-w-0 px-4 pb-28 pt-6 md:px-12 md:pb-16 md:pt-12">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>

      {/* Mobile bottom tabs */}
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t hairline bg-ivory/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        {MOBILE_TABS.map((href) => {
          const n = NAV.find((x) => x.href === href)!;
          return (
            <Link
              key={href}
              href={href}
              className={`py-3 text-center text-[0.68rem] tracking-wide ${isActive(path, href) ? "text-navy" : "text-muted"}`}
            >
              <span className={`mx-auto mb-1 block h-[2px] w-5 ${isActive(path, href) ? "bg-rose-deep" : "bg-transparent"}`} />
              {n.label.replace(" 보드", "").replace("여행 ", "")}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
