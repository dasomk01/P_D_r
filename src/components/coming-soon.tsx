import Link from "next/link";

export function ComingSoon({
  emoji,
  title,
  phase,
  backHref = "/",
  backLabel = "홈으로",
}: {
  emoji: string;
  title: string;
  phase: string;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <span className="text-5xl" aria-hidden>
        {emoji}
      </span>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{title}</h1>
      <p className="text-zinc-500 dark:text-zinc-400">{phase}</p>
      <Link
        href={backHref}
        className="mt-4 rounded-full border border-zinc-200 px-5 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
      >
        {backLabel}
      </Link>
    </div>
  );
}
