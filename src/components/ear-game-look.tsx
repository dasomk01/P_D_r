"use client";

import { useSyncExternalStore } from "react";

export type HairStyle = "side" | "short" | "bob" | "curly";
export type Outfit = "hoodie" | "knit" | "tee";
export type GlassesKind = "none" | "round" | "square";

export type Look = {
  hair: HairStyle;
  hairColor: string;
  outfit: Outfit;
  outfitColor: string;
  glasses: GlassesKind;
};

export const HAIR_OPTIONS: { value: HairStyle; label: string }[] = [
  { value: "side", label: "옆으로 넘김" },
  { value: "short", label: "짧은 머리" },
  { value: "bob", label: "단발" },
  { value: "curly", label: "곱슬" },
];
export const HAIR_COLORS = ["#111111", "#5b3a29", "#c8a165", "#e879a9", "#94a3b8"];
export const OUTFIT_OPTIONS: { value: Outfit; label: string }[] = [
  { value: "hoodie", label: "후드티" },
  { value: "knit", label: "니트" },
  { value: "tee", label: "티셔츠" },
];
export const OUTFIT_COLORS = ["#9ca3af", "#1e3a8a", "#f5f5f4", "#16a34a", "#f59e0b", "#e11d48"];
export const GLASSES_OPTIONS: { value: GlassesKind; label: string }[] = [
  { value: "none", label: "없음" },
  { value: "round", label: "동그란 안경" },
  { value: "square", label: "네모 안경" },
];

const DEFAULT_LOOK: Look = {
  hair: "side",
  hairColor: "#111111",
  outfit: "hoodie",
  outfitColor: "#9ca3af",
  glasses: "none",
};

// ---------- 저장 (이 브라우저에만) ----------
const LOOK_KEY = "ear-game-look";
const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cachedLook: Look = DEFAULT_LOOK;

function readLook(): Look {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(LOOK_KEY);
  } catch {
    // 저장소 접근 불가 시 기본값
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedLook = raw ? { ...DEFAULT_LOOK, ...(JSON.parse(raw) as Partial<Look>) } : DEFAULT_LOOK;
    } catch {
      cachedLook = DEFAULT_LOOK;
    }
  }
  return cachedLook;
}

export function setLook(patch: Partial<Look>) {
  const next = { ...readLook(), ...patch };
  try {
    localStorage.setItem(LOOK_KEY, JSON.stringify(next));
  } catch {
    // 저장 실패해도 이번 화면에서는 반영
    cachedRaw = JSON.stringify(next);
    cachedLook = next;
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export function useLook() {
  return useSyncExternalStore(subscribe, readLook, () => DEFAULT_LOOK);
}

// ---------- 그리기 ----------
function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(v + amt)));
  return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`;
}

export function CharacterBody({ look, skin }: { look: Look; skin: string }) {
  const c = look.outfitColor;
  const dark = shade(c, -40);
  const body = "M30 420 Q44 344 160 328 L240 328 Q356 344 370 420 Z";
  return (
    <g>
      <rect x={176} y={295} width={48} height={50} fill={skin} stroke="#7c2d12" strokeWidth={3} />
      <path d={body} fill={c} stroke={dark} strokeWidth={3} />
      {look.outfit === "hoodie" && (
        <g>
          <path d="M138 336 Q200 300 262 336 Q252 372 200 374 Q148 372 138 336 Z" fill={shade(c, -18)} stroke={dark} strokeWidth={3} />
          <path d="M160 338 Q200 322 240 338 Q230 358 200 360 Q170 358 160 338 Z" fill={shade(c, -55)} />
          <path d="M184 362 L180 402 M216 362 L220 402" stroke={shade(c, 60)} strokeWidth={4} strokeLinecap="round" />
          <path d="M140 420 Q200 396 260 420" fill="none" stroke={dark} strokeWidth={3} />
        </g>
      )}
      {look.outfit === "knit" && (
        <g>
          <path d="M168 330 Q200 356 232 330" fill="none" stroke={dark} strokeWidth={10} strokeLinecap="round" />
          <g stroke={shade(c, -25)} strokeWidth={2}>
            {[110, 150, 250, 290].map((x) => (
              <path key={x} d={`M${x} 370 v50`} />
            ))}
          </g>
          <g fill="none" stroke={shade(c, 40)} strokeWidth={3}>
            <path d="M190 380 l10 10 l10 -10 M190 400 l10 10 l10 -10" />
          </g>
        </g>
      )}
      {look.outfit === "tee" && (
        <g>
          <path d="M172 329 Q200 352 228 329" fill={skin} stroke={dark} strokeWidth={4} />
          <path d="M70 420 Q74 380 90 362 M330 420 Q326 380 310 362" fill="none" stroke={dark} strokeWidth={3} />
        </g>
      )}
    </g>
  );
}

const HAIR_PATHS: Record<HairStyle, string> = {
  side: "M100 214 C86 118 150 66 206 68 C276 70 322 120 304 214 L296 214 C294 186 288 166 272 156 C240 150 196 138 156 124 C140 140 122 168 112 214 Z",
  short: "M104 186 C100 110 150 82 200 82 C250 82 300 110 296 186 C288 150 262 128 200 126 C138 128 112 150 104 186 Z",
  bob: "M94 292 C76 120 140 62 200 62 C260 62 324 120 306 292 L284 292 C288 230 284 180 270 150 C240 140 160 140 130 150 C116 180 112 230 116 292 Z",
  curly: "M100 196 C88 110 150 70 200 70 C250 70 312 110 300 196 C290 160 270 140 200 138 C130 140 110 160 100 196 Z",
};

export function CharacterHair({ look }: { look: Look }) {
  const hi = shade(look.hairColor, 70);
  return (
    <g>
      <path d={HAIR_PATHS[look.hair]} fill={look.hairColor} />
      {look.hair === "curly" &&
        [
          [112, 160], [128, 120], [156, 94], [190, 80], [226, 82], [260, 98], [284, 128], [292, 166],
          [140, 140], [176, 128], [214, 128], [250, 138],
        ].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={20} fill={look.hairColor} />)}
      {look.hair === "side" && (
        <g stroke={hi} strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.6}>
          <path d="M150 92 q40 -14 90 4" />
          <path d="M170 110 q50 10 90 40" />
          <path d="M128 120 q-12 30 -16 60" />
        </g>
      )}
      {look.hair === "bob" && (
        <g stroke={hi} strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.6}>
          <path d="M140 84 q60 -20 120 0" />
          <path d="M104 200 q-4 40 0 80" />
          <path d="M296 200 q4 40 0 80" />
        </g>
      )}
      {look.hair === "short" && (
        <g stroke={hi} strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.5}>
          <path d="M160 96 q40 -10 80 0" />
        </g>
      )}
    </g>
  );
}

export function CharacterGlasses({ kind }: { kind: GlassesKind }) {
  if (kind === "none") return null;
  const lens = { fill: "rgba(255,255,255,0.15)", stroke: "#1f2937", strokeWidth: 4 };
  return (
    <g>
      {kind === "round" ? (
        <>
          <circle cx={163} cy={202} r={20} {...lens} />
          <circle cx={237} cy={202} r={20} {...lens} />
        </>
      ) : (
        <>
          <rect x={139} y={186} width={48} height={32} rx={6} {...lens} />
          <rect x={213} y={186} width={48} height={32} rx={6} {...lens} />
        </>
      )}
      <path d="M183 200 q17 -8 34 0 M143 198 L104 192 M257 198 L296 192" fill="none" stroke="#1f2937" strokeWidth={4} />
    </g>
  );
}

// ---------- 꾸미기 패널 ----------
function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-sm ${
        active
          ? "border-pink-500 bg-pink-500 text-white"
          : "border-zinc-300 bg-white text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
      }`}
    >
      {children}
    </button>
  );
}

function Swatches({ colors, value, onPick }: { colors: string[]; value: string; onPick: (c: string) => void }) {
  return (
    <div className="flex gap-2">
      {colors.map((c) => (
        <button
          key={c}
          type="button"
          aria-label={c}
          onClick={() => onPick(c)}
          className={`h-7 w-7 rounded-full border-2 ${value === c ? "border-pink-500 ring-2 ring-pink-300" : "border-zinc-300"}`}
          style={{ background: c }}
        />
      ))}
    </div>
  );
}

export function LookPicker({ look }: { look: Look }) {
  const row = "flex flex-wrap items-center gap-2";
  const label = "w-14 shrink-0 text-xs font-semibold text-zinc-500";
  return (
    <section className="mt-3 space-y-3 rounded-xl bg-white p-4 shadow-sm dark:bg-zinc-900">
      <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">🎨 캐릭터 꾸미기</h2>
      <div className={row}>
        <span className={label}>머리</span>
        {HAIR_OPTIONS.map((o) => (
          <Chip key={o.value} active={look.hair === o.value} onClick={() => setLook({ hair: o.value })}>
            {o.label}
          </Chip>
        ))}
      </div>
      <div className={row}>
        <span className={label}>머리색</span>
        <Swatches colors={HAIR_COLORS} value={look.hairColor} onPick={(c) => setLook({ hairColor: c })} />
      </div>
      <div className={row}>
        <span className={label}>옷</span>
        {OUTFIT_OPTIONS.map((o) => (
          <Chip key={o.value} active={look.outfit === o.value} onClick={() => setLook({ outfit: o.value })}>
            {o.label}
          </Chip>
        ))}
      </div>
      <div className={row}>
        <span className={label}>옷 색</span>
        <Swatches colors={OUTFIT_COLORS} value={look.outfitColor} onPick={(c) => setLook({ outfitColor: c })} />
      </div>
      <div className={row}>
        <span className={label}>안경</span>
        {GLASSES_OPTIONS.map((o) => (
          <Chip key={o.value} active={look.glasses === o.value} onClick={() => setLook({ glasses: o.value })}>
            {o.label}
          </Chip>
        ))}
      </div>
    </section>
  );
}
