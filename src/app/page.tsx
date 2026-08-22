import Link from "next/link";

const CARDS = [
  {
    href: "/summary",
    emoji: "📚",
    title: "정리본",
    description: "야첵/강의록 + STT로 시험 대비 정리본을 만들고 봅니다.",
  },
  {
    href: "/questions",
    emoji: "🧠",
    title: "문제풀이",
    description: "야마 그대로 · 야마 변형 · 티야 · 탈야 문제를 풉니다.",
  },
  {
    href: "/tutor",
    emoji: "👩🏻‍🏫",
    title: "과외",
    description: "강의 자료를 컨텍스트로 1:1 AI 과외를 받습니다.",
  },
] as const;

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-3xl">
        <h1 className="text-center text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          SOM STUDY
        </h1>
        <p className="mt-2 text-center text-zinc-500 dark:text-zinc-400">
          정리본 · 문제풀이 · 과외 — 데이터를 공유하는 개인용 의대 공부 웹앱
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {CARDS.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="flex flex-col items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            >
              <span className="text-5xl" aria-hidden>
                {card.emoji}
              </span>
              <span className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                {card.title}
              </span>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {card.description}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
