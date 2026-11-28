"use client";

import { useEffect, useState } from "react";

export type RankEntry = { name: string; score: number };

const NAME_KEY = "ear-game-name";

function readName() {
  try {
    return localStorage.getItem(NAME_KEY) ?? "";
  } catch {
    return "";
  }
}

function saveName(name: string) {
  try {
    localStorage.setItem(NAME_KEY, name);
  } catch {
    // 무시
  }
}

/** 친구 랭킹 상위 10명 */
export function Leaderboard({
  ranking,
  error,
  highlight,
}: {
  ranking: RankEntry[] | null;
  error: string | null;
  highlight: string | null;
}) {
  return (
    <section className="mt-3 rounded-xl bg-white p-4 shadow-sm dark:bg-zinc-900">
      <h2 className="mb-2 text-sm font-bold text-zinc-800 dark:text-zinc-100">🏅 친구 랭킹 TOP 10</h2>
      {error ? (
        <p className="text-sm text-zinc-500">{error}</p>
      ) : ranking === null ? (
        <p className="text-sm text-zinc-500">불러오는 중…</p>
      ) : ranking.length === 0 ? (
        <p className="text-sm text-zinc-500">아직 기록이 없어요. 첫 번째 주인공이 되어 보세요!</p>
      ) : (
        <ol className="space-y-1">
          {ranking.map((r, i) => (
            <li
              key={r.name}
              className={`flex items-center justify-between rounded-lg px-2 py-1 text-sm ${
                r.name === highlight ? "bg-pink-100 font-bold dark:bg-pink-950" : ""
              }`}
            >
              <span className="text-zinc-800 dark:text-zinc-100">
                <span className="inline-block w-7">{["🥇", "🥈", "🥉"][i] ?? `${i + 1}.`}</span>
                {r.name}
              </span>
              <span className="tabular-nums text-zinc-600 dark:text-zinc-300">{r.score}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

/** 게임 오버 화면의 이름 입력 + 랭킹 등록 */
export function SubmitScore({ score, onSubmitted }: { score: number; onSubmitted: (ranking: RankEntry[] | null, name: string) => void }) {
  const [name, setName] = useState(readName);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  if (score <= 0) return null;
  if (status === "done") return <p className="text-sm font-semibold text-pink-200">랭킹에 등록했어요! 🎉</p>;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("이름을 적어 주세요.");
      return;
    }
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/ear-game/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed, score }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "등록하지 못했어요.");
      saveName(trimmed);
      setStatus("done");
      onSubmitted(body.ranking ?? null, trimmed);
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error ? err.message : "등록하지 못했어요.");
    }
  };

  return (
    <form onSubmit={submit} className="flex w-full max-w-xs flex-col items-center gap-2">
      <div className="flex w-full gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={12}
          placeholder="내 이름"
          className="min-w-0 flex-1 rounded-full bg-white px-4 py-2 text-zinc-900 outline-none"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-full bg-amber-400 px-4 py-2 font-bold text-zinc-900 disabled:opacity-60"
        >
          {status === "sending" ? "등록 중…" : "랭킹 등록"}
        </button>
      </div>
      {error && <p className="text-xs text-red-200">{error}</p>}
    </form>
  );
}

/** 랭킹 목록 불러오기 */
export function useRanking() {
  const [ranking, setRanking] = useState<RankEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/ear-game/scores")
      .then(async (res) => {
        if (!res.ok) throw new Error("랭킹을 불러오지 못했어요.");
        return (await res.json()) as { ranking: RankEntry[] };
      })
      .then((body) => {
        if (!cancelled) setRanking(body.ranking);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "랭킹을 불러오지 못했어요.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { ranking, error, setRanking };
}
