"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";

type Side = "L" | "R";
type Vec = { x: number; y: number };
type EarState = "idle" | "drag" | "spring" | "torn";

type Ear = {
  tip: Vec;
  vel: Vec;
  state: EarState;
  threshold: number; // 찢어지는 한계 길이 (숨겨진 값)
  tornAt: number;
  piece: { pos: Vec; vel: Vec; rot: number; vrot: number } | null;
  pointerId: number | null;
};

type Popup = { id: number; x: number; y: number; text: string; color: string; born: number };
type Phase = "ready" | "playing" | "over";

const BASE: Record<Side, Vec> = { L: { x: 118, y: 200 }, R: { x: 282, y: 200 } };
const REST: Record<Side, Vec> = { L: { x: 62, y: 158 }, R: { x: 338, y: 158 } };
const REST_LEN = Math.hypot(REST.L.x - BASE.L.x, REST.L.y - BASE.L.y);
const MAX_LEN = 330;
const MAX_LIVES = 3;
const REGROW_MS = 1000;
const BEST_KEY = "ear-game-best";

const sub = (a: Vec, b: Vec): Vec => ({ x: a.x - b.x, y: a.y - b.y });
const add = (a: Vec, b: Vec): Vec => ({ x: a.x + b.x, y: a.y + b.y });
const mul = (a: Vec, s: number): Vec => ({ x: a.x * s, y: a.y * s });
const len = (a: Vec) => Math.hypot(a.x, a.y);
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
type EarView = {
  tip: Vec;
  state: EarState;
  ratio: number;
  stretch: number;
  tornAge: number;
  piece: Ear["piece"];
  jitter: Vec;
};
type Scene = { now: number; ears: Record<Side, EarView>; popups: Popup[]; head: Vec };

function randJitter(amount: number): Vec {
  return amount ? { x: (Math.random() - 0.5) * amount, y: (Math.random() - 0.5) * amount } : { x: 0, y: 0 };
}

function buildScene(ears: Record<Side, Ear>, popups: Popup[], now: number): Scene {
  const view = (side: Side): EarView => {
    const ear = ears[side];
    const stretch = stretchOf(side, ear.tip);
    const ratio = ear.state === "drag" ? stretch / ear.threshold : 0;
    return {
      tip: { ...ear.tip },
      state: ear.state,
      ratio,
      stretch,
      tornAge: now - ear.tornAt,
      piece: ear.piece ? { ...ear.piece, pos: { ...ear.piece.pos } } : null,
      jitter: randJitter(ratio > 0.8 ? (ratio - 0.8) * 18 : 0),
    };
  };
  const L = view("L");
  const R = view("R");
  const maxRatio = Math.max(L.ratio, R.ratio);
  return {
    now,
    ears: { L, R },
    popups: popups.map((p) => ({ ...p })),
    head: randJitter(maxRatio > 0.75 ? (maxRatio - 0.75) * 14 : 0),
  };
}

const bestListeners = new Set<() => void>();
function readBest() {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
}
function writeBest(v: number) {
  try {
    localStorage.setItem(BEST_KEY, String(v));
  } catch {
    // 저장소 접근 불가 시 무시
  }
  bestListeners.forEach((l) => l());
}
function subscribeBest(l: () => void) {
  bestListeners.add(l);
  return () => {
    bestListeners.delete(l);
  };
}

const pt = (v: Vec) => `${v.x.toFixed(1)} ${v.y.toFixed(1)}`;

function newThreshold(score: number) {
  // 점수가 오를수록 한계가 들쭉날쭉해져서 더 어려워짐
  const spread = clamp(140 + score / 20, 140, 220);
  return 60 + Math.random() * spread;
}

function makeEar(side: Side, score = 0): Ear {
  return {
    tip: { ...REST[side] },
    vel: { x: 0, y: 0 },
    state: "idle",
    threshold: newThreshold(score),
    tornAt: 0,
    piece: null,
    pointerId: null,
  };
}

function stretchOf(side: Side, tip: Vec) {
  return Math.max(0, len(sub(tip, BASE[side])) - REST_LEN);
}

/** 밑동(base)에서 끝(tip)으로 뻗은 둥근 귀 모양 경로 */
function earPath(base: Vec, tip: Vec, w: number) {
  const d = sub(tip, base);
  const L = Math.max(len(d), 1);
  const dir = mul(d, 1 / L);
  const perp = { x: -dir.y, y: dir.x };
  const tw = w * 0.85;
  const p1 = add(base, mul(perp, w));
  const p2 = add(base, mul(perp, -w));
  const a = add(tip, mul(perp, tw));
  const b = add(tip, mul(perp, -tw));
  const c1 = add(add(base, mul(dir, L * 0.5)), mul(perp, w * 1.15));
  const c2 = add(add(base, mul(dir, L * 0.5)), mul(perp, -w * 1.15));
  return `M ${pt(p1)} Q ${pt(c1)} ${pt(a)} A ${tw} ${tw} 0 0 0 ${pt(b)} Q ${pt(c2)} ${pt(p2)} Z`;
}

function mixColor(a: [number, number, number], b: [number, number, number], t: number) {
  const k = clamp(t, 0, 1);
  return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(",")})`;
}

let audioCtx: AudioContext | null = null;
function beep(kind: "boing" | "pop" | "over") {
  try {
    audioCtx ??= new AudioContext();
    const ctx = audioCtx;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    const t = ctx.currentTime;
    if (kind === "boing") {
      o.type = "sine";
      o.frequency.setValueAtTime(520, t);
      o.frequency.exponentialRampToValueAtTime(180, t + 0.25);
      g.gain.setValueAtTime(0.15, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      o.start(t);
      o.stop(t + 0.3);
    } else if (kind === "pop") {
      o.type = "square";
      o.frequency.setValueAtTime(900, t);
      o.frequency.exponentialRampToValueAtTime(60, t + 0.18);
      g.gain.setValueAtTime(0.18, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      o.start(t);
      o.stop(t + 0.2);
    } else {
      o.type = "triangle";
      o.frequency.setValueAtTime(400, t);
      o.frequency.linearRampToValueAtTime(120, t + 0.8);
      g.gain.setValueAtTime(0.15, t);
      g.gain.linearRampToValueAtTime(0.001, t + 0.8);
      o.start(t);
      o.stop(t + 0.8);
    }
  } catch {
    // 소리 재생 불가 환경은 무시
  }
}

export function EarGame() {
  const svgRef = useRef<SVGSVGElement>(null);
  const ears = useRef<Record<Side, Ear>>({ L: makeEar("L"), R: makeEar("R") });
  const popups = useRef<Popup[]>([]);
  const popupId = useRef(0);
  const scoreRef = useRef(0);
  const livesRef = useRef(MAX_LIVES);
  const phaseRef = useRef<Phase>("ready");

  const [scene, setScene] = useState<Scene>(() => buildScene({ L: makeEar("L"), R: makeEar("R") }, [], 0));
  const [phase, setPhase] = useState<Phase>("ready");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [combo, setCombo] = useState(0);
  const comboRef = useRef(0);
  const best = useSyncExternalStore(subscribeBest, readBest, () => 0);

  const pushPopup = useCallback((x: number, y: number, text: string, color: string) => {
    popups.current.push({ id: popupId.current++, x, y, text, color, born: performance.now() });
  }, []);

  const setComboBoth = (v: number) => {
    comboRef.current = v;
    setCombo(v);
  };

  const endGame = useCallback(() => {
    phaseRef.current = "over";
    setPhase("over");
    beep("over");
    const final = scoreRef.current;
    if (final > readBest()) writeBest(final);
  }, []);

  const tear = useCallback(
    (side: Side) => {
      const ear = ears.current[side];
      const d = sub(ear.tip, BASE[side]);
      const dir = mul(d, 1 / Math.max(len(d), 1));
      ear.state = "torn";
      ear.tornAt = performance.now();
      ear.pointerId = null;
      ear.piece = {
        pos: { ...ear.tip },
        vel: add(mul(dir, 6), { x: 0, y: -4 }),
        rot: 0,
        vrot: (side === "L" ? -1 : 1) * 12,
      };
      beep("pop");
      navigator.vibrate?.(120);
      pushPopup(ear.tip.x, ear.tip.y - 20, "뿅!! 찢어졌다", "#e5484d");
      setComboBoth(0);
      livesRef.current -= 1;
      setLives(livesRef.current);
      if (livesRef.current <= 0) {
        setTimeout(endGame, 700);
      }
    },
    [endGame, pushPopup],
  );

  const release = useCallback(
    (side: Side) => {
      const ear = ears.current[side];
      if (ear.state !== "drag") return;
      const s = stretchOf(side, ear.tip);
      const ratio = s / ear.threshold;
      ear.state = "spring";
      ear.pointerId = null;
      if (s < 15) return;
      const c = comboRef.current;
      let pts = Math.round(s * (1 + c * 0.2));
      let label = `+${pts}`;
      let color = "#16a34a";
      if (ratio > 0.92) {
        pts *= 3;
        label = `아슬아슬!! +${pts}`;
        color = "#d97706";
      } else if (ratio > 0.8) {
        pts *= 2;
        label = `대담해! +${pts}`;
        color = "#2563eb";
      }
      scoreRef.current += pts;
      setScore(scoreRef.current);
      setComboBoth(c + 1);
      pushPopup(ear.tip.x, ear.tip.y - 20, label, color);
      beep("boing");
      ear.threshold = newThreshold(scoreRef.current);
    },
    [pushPopup],
  );

  // 애니메이션 루프
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = clamp((now - last) / 16.67, 0, 3);
      last = now;
      (["L", "R"] as Side[]).forEach((side) => {
        const ear = ears.current[side];
        if (ear.state === "spring") {
          const disp = sub(ear.tip, REST[side]);
          const acc = add(mul(disp, -0.22), mul(ear.vel, -0.16));
          ear.vel = add(ear.vel, mul(acc, dt));
          ear.tip = add(ear.tip, mul(ear.vel, dt));
          if (len(disp) < 0.5 && len(ear.vel) < 0.5) {
            ear.tip = { ...REST[side] };
            ear.vel = { x: 0, y: 0 };
            ear.state = "idle";
          }
        } else if (ear.state === "torn") {
          if (ear.piece) {
            const p = ear.piece;
            p.vel = add(p.vel, { x: 0, y: 0.45 * dt });
            p.pos = add(p.pos, mul(p.vel, dt));
            p.rot += p.vrot * dt;
          }
          if (now - ear.tornAt > REGROW_MS && phaseRef.current === "playing") {
            ears.current[side] = makeEar(side, scoreRef.current);
            pushPopup(REST[side].x, REST[side].y - 10, "쑥~ 새 귀!", "#db2777");
          }
        }
      });
      popups.current = popups.current.filter((p) => now - p.born < 1000);
      setScene(buildScene(ears.current, popups.current, now));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [pushPopup]);

  const toSvg = (e: React.PointerEvent): Vec | null => {
    const svg = svgRef.current;
    const m = svg?.getScreenCTM();
    if (!svg || !m) return null;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    return { x: p.x, y: p.y };
  };

  const onEarDown = (side: Side) => (e: React.PointerEvent) => {
    if (phaseRef.current !== "playing") return;
    const ear = ears.current[side];
    if (ear.state === "torn" || ear.pointerId !== null) return;
    e.preventDefault();
    svgRef.current?.setPointerCapture(e.pointerId);
    ear.state = "drag";
    ear.vel = { x: 0, y: 0 };
    ear.pointerId = e.pointerId;
  };

  const onMove = (e: React.PointerEvent) => {
    const p = toSvg(e);
    if (!p) return;
    (["L", "R"] as Side[]).forEach((side) => {
      const ear = ears.current[side];
      if (ear.state !== "drag" || ear.pointerId !== e.pointerId) return;
      const d = sub(p, BASE[side]);
      const L = len(d);
      ear.tip = L > MAX_LEN ? add(BASE[side], mul(d, MAX_LEN / L)) : p;
      if (stretchOf(side, ear.tip) >= ear.threshold) tear(side);
    });
  };

  const onUp = (e: React.PointerEvent) => {
    (["L", "R"] as Side[]).forEach((side) => {
      if (ears.current[side].pointerId === e.pointerId) release(side);
    });
  };

  const start = () => {
    ears.current = { L: makeEar("L"), R: makeEar("R") };
    popups.current = [];
    scoreRef.current = 0;
    livesRef.current = MAX_LIVES;
    setScore(0);
    setLives(MAX_LIVES);
    setComboBoth(0);
    phaseRef.current = "playing";
    setPhase("playing");
  };

  // ---------- 렌더링 ----------
  const { now } = scene;
  const maxRatio = Math.max(scene.ears.L.ratio, scene.ears.R.ratio);
  const anyTorn = scene.ears.L.state === "torn" || scene.ears.R.state === "torn";
  const headJitter = scene.head;
  const faceColor = mixColor([255, 224, 189], [255, 176, 160], maxRatio);

  const renderEar = (side: Side) => {
    const ear = scene.ears[side];
    const base = BASE[side];
    if (ear.state === "torn") {
      const dir = mul(sub(REST[side], base), 1 / REST_LEN);
      const stub = add(base, mul(dir, 18));
      const p = ear.piece;
      return (
        <g key={side}>
          <path d={earPath(base, stub, 22)} fill="#f4a3a3" stroke="#7c2d12" strokeWidth={3} />
          {p && (
            <g transform={`translate(${p.pos.x} ${p.pos.y}) rotate(${p.rot})`}>
              <ellipse rx={26} ry={20} fill="#ffcdb2" stroke="#7c2d12" strokeWidth={3} />
              <ellipse rx={14} ry={10} fill="#f4a3a3" />
            </g>
          )}
          {[0, 1, 2].map((i) => {
            const a = (ear.tornAge / 150 + (i * Math.PI * 2) / 3) % (Math.PI * 2);
            return (
              <text
                key={i}
                x={stub.x + Math.cos(a) * 26}
                y={stub.y + Math.sin(a) * 14 - 20}
                fontSize={16}
                textAnchor="middle"
              >
                ⭐
              </text>
            );
          })}
        </g>
      );
    }
    const r = ear.ratio;
    const w = 28 * clamp(1 - ear.stretch / 380, 0.42, 1);
    const tip = add(ear.tip, ear.jitter);
    const d = sub(tip, base);
    const dir = mul(d, 1 / Math.max(len(d), 1));
    const innerTip = sub(tip, mul(dir, 12));
    const outer = mixColor([255, 205, 178], [239, 68, 68], r * r);
    const inner = mixColor([244, 163, 163], [185, 28, 28], r * r);
    return (
      <g
        key={side}
        onPointerDown={onEarDown(side)}
        style={{ cursor: phase === "playing" ? (ear.state === "drag" ? "grabbing" : "grab") : "default" }}
      >
        <path d={earPath(base, tip, w)} fill={outer} stroke="#7c2d12" strokeWidth={3} />
        <path d={earPath(base, innerTip, w * 0.5)} fill={inner} />
        {/* 잡기 쉽게 넉넉한 투명 히트 영역 */}
        <circle cx={tip.x} cy={tip.y} r={38} fill="transparent" />
        {r > 0.55 && (
          <g stroke="#7c2d12" strokeWidth={2} strokeLinecap="round" opacity={clamp((r - 0.55) * 3, 0, 1)}>
            {[0.35, 0.55, 0.75].map((t) => {
              const c = add(base, mul(d, t));
              const perp = { x: -dir.y, y: dir.x };
              const a = add(c, mul(perp, w * 0.35));
              const b = add(add(c, mul(perp, -w * 0.35)), mul(dir, 5));
              return <line key={t} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />;
            })}
          </g>
        )}
      </g>
    );
  };

  // 표정
  let eyes: React.ReactNode;
  let mouth: React.ReactNode;
  if (anyTorn) {
    eyes = (
      <g stroke="#1f2937" strokeWidth={5} strokeLinecap="round">
        <path d="M150 190 l20 12 M150 214 l20 -12" />
        <path d="M250 190 l-20 12 M250 214 l-20 -12" />
      </g>
    );
    mouth = <path d="M170 270 q30 -30 60 0" fill="none" stroke="#1f2937" strokeWidth={5} strokeLinecap="round" />;
  } else if (maxRatio > 0.75) {
    eyes = (
      <g stroke="#1f2937" strokeWidth={5} strokeLinecap="round" fill="none">
        <path d="M148 190 l22 12 l-22 12" />
        <path d="M252 190 l-22 12 l22 12" />
      </g>
    );
    mouth = (
      <g>
        <rect x={168} y={252} width={64} height={26} rx={8} fill="#fff" stroke="#1f2937" strokeWidth={4} />
        <path d="M184 252 v26 M200 252 v26 M216 252 v26" stroke="#1f2937" strokeWidth={3} />
      </g>
    );
  } else if (maxRatio > 0.35) {
    eyes = (
      <g fill="#1f2937">
        <circle cx={162} cy={200} r={9} />
        <circle cx={238} cy={200} r={9} />
      </g>
    );
    mouth = <ellipse cx={200} cy={265} rx={14} ry={18} fill="#7f1d1d" />;
  } else {
    eyes = (
      <g fill="#1f2937">
        <ellipse cx={162} cy={200} rx={8} ry={12} />
        <ellipse cx={238} cy={200} rx={8} ry={12} />
        <circle cx={165} cy={195} r={3} fill="#fff" />
        <circle cx={241} cy={195} r={3} fill="#fff" />
      </g>
    );
    mouth = <path d="M172 255 q28 28 56 0" fill="none" stroke="#1f2937" strokeWidth={5} strokeLinecap="round" />;
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 py-6 select-none">
      <div className="mb-3 flex items-center justify-between">
        <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200">
          ← 홈
        </Link>
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">👂 귀찢기 게임</h1>
        <span className="text-sm text-zinc-500">최고 {best}</span>
      </div>

      <div className="mb-2 flex items-center justify-between rounded-xl bg-white px-4 py-2 shadow-sm dark:bg-zinc-900">
        <span className="text-lg">
          {Array.from({ length: MAX_LIVES }, (_, i) => (i < lives ? "❤️" : "🤍")).join(" ")}
        </span>
        <span className="text-sm font-medium text-amber-600">{combo > 1 ? `🔥 ${combo} 콤보` : ""}</span>
        <span className="text-2xl font-extrabold tabular-nums text-zinc-900 dark:text-zinc-100">{score}</span>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-sky-100 shadow-inner dark:bg-sky-950">
        <svg
          ref={svgRef}
          viewBox="0 0 400 420"
          className="block w-full"
          style={{ touchAction: "none" }}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        >
          <g transform={`translate(${headJitter.x} ${headJitter.y})`}>
            {renderEar("L")}
            {renderEar("R")}
            <circle cx={200} cy={220} r={105} fill={faceColor} stroke="#7c2d12" strokeWidth={4} />
            <path d="M120 150 q80 -90 160 0 q-40 -30 -80 -20 q-40 -10 -80 20 z" fill="#3f2a1d" />
            {eyes}
            <ellipse cx={138} cy={238} rx={16} ry={9} fill="#fb7185" opacity={0.35 + maxRatio * 0.5} />
            <ellipse cx={262} cy={238} rx={16} ry={9} fill="#fb7185" opacity={0.35 + maxRatio * 0.5} />
            {mouth}
            {maxRatio > 0.55 && (
              <g fill="#38bdf8" opacity={clamp((maxRatio - 0.55) * 3, 0, 1)}>
                <path d="M290 150 q8 14 0 20 q-8 -6 0 -20 z" />
                <path d="M110 160 q8 14 0 20 q-8 -6 0 -20 z" />
              </g>
            )}
            {(anyTorn || maxRatio > 0.88) && (
              <g fill="#60a5fa">
                <path d="M158 218 q-6 20 0 34 q6 -14 0 -34 z" />
                <path d="M242 218 q-6 20 0 34 q6 -14 0 -34 z" />
              </g>
            )}
          </g>

          {scene.popups.map((p) => {
            const age = (now - p.born) / 1000;
            return (
              <text
                key={p.id}
                x={clamp(p.x, 70, 330)}
                y={p.y - age * 50}
                textAnchor="middle"
                fontSize={20}
                fontWeight={800}
                fill={p.color}
                stroke="#fff"
                strokeWidth={4}
                paintOrder="stroke"
                opacity={1 - age}
              >
                {p.text}
              </text>
            );
          })}
        </svg>

        {phase !== "playing" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/45 p-6 text-center text-white">
            {phase === "ready" ? (
              <>
                <p className="text-2xl font-extrabold">귀를 잡아당겨라!</p>
                <ul className="space-y-1 text-sm leading-relaxed">
                  <li>귀 끝을 잡고 쭉~ 늘린 뒤 손을 떼면 점수!</li>
                  <li>많이 늘릴수록 점수가 커지지만…</li>
                  <li>한계를 넘으면 <b>뿅!</b> 하고 찢어져요 (목숨 -1)</li>
                  <li>귀가 빨개지고 떨리면 위험 신호 🚨</li>
                  <li>한계 직전에 놓으면 보너스 ×2, ×3</li>
                </ul>
              </>
            ) : (
              <>
                <p className="text-2xl font-extrabold">귀가 남아나질 않네요 😭</p>
                <p className="text-lg">
                  점수 <b>{score}</b>
                  {score >= best && score > 0 ? " · 🎉 최고 기록!" : ` · 최고 ${best}`}
                </p>
              </>
            )}
            <button
              onClick={start}
              className="mt-2 rounded-full bg-pink-500 px-8 py-3 text-lg font-bold text-white shadow-lg active:scale-95"
            >
              {phase === "ready" ? "시작하기" : "다시 하기"}
            </button>
          </div>
        )}
      </div>

      <p className="mt-3 text-center text-xs text-zinc-500">
        양쪽 귀를 동시에 잡을 수도 있어요 (터치 두 손가락)
      </p>
    </main>
  );
}
