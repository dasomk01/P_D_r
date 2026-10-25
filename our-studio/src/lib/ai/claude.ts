import "server-only";

import Anthropic from "@anthropic-ai/sdk";
import { AI_MODEL } from "./config";

// 서버 측 폴백(거절 시 다른 모델로 재시도)을 지원하는 모델에만 fallbacks 를 붙입니다.
const FALLBACK_MODELS = new Set(["claude-opus-5-5", "claude-opus-5", "claude-fable-5-1", "claude-sonnet-5-5"]);

let _client: Anthropic | null = null;
function client() {
  if (!_client) _client = new Anthropic();
  return _client;
}

export class AiError extends Error {}

type Effort = "low" | "medium" | "high";

function baseParams(effort: Effort) {
  const fb = FALLBACK_MODELS.has(AI_MODEL);
  return {
    model: AI_MODEL,
    ...(fb ? { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const } : {}),
    thinking: { type: "adaptive" as const },
    output_config: { effort },
  };
}

function textOf(msg: Anthropic.Beta.BetaMessage): string {
  return msg.content
    .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");
}

function checkStop(msg: Anthropic.Beta.BetaMessage) {
  if (msg.stop_reason === "refusal") throw new AiError("AI 가 이 요청을 처리하지 않았습니다 (안전 정책).");
  if (msg.stop_reason === "max_tokens") throw new AiError("AI 응답이 너무 길어 중간에 끊겼습니다. 다시 시도해 주세요.");
}

/** JSON 스키마로 출력 형식을 강제하는 단일 호출 */
export async function jsonCall<T>(opts: {
  system: string;
  content: Anthropic.Beta.BetaContentBlockParam[] | string;
  schema: Record<string, unknown>;
  effort?: Effort;
  maxTokens?: number;
}): Promise<{ data: T; model: string }> {
  const p = baseParams(opts.effort ?? "medium");
  const stream = client().beta.messages.stream({
    ...p,
    max_tokens: opts.maxTokens ?? 32000,
    system: opts.system,
    output_config: { ...p.output_config, format: { type: "json_schema", schema: opts.schema } },
    messages: [{ role: "user", content: opts.content }],
  });
  const msg = await stream.finalMessage();
  checkStop(msg);
  try {
    return { data: JSON.parse(textOf(msg)) as T, model: msg.model };
  } catch {
    throw new AiError("AI 응답을 해석하지 못했습니다.");
  }
}

/**
 * 웹 검색을 쓰는 호출. 최종 답을 ```json 블록으로 받고,
 * 실제 검색 결과에 등장한 URL 목록을 함께 돌려줘 출처를 검증할 수 있게 합니다.
 */
export async function researchCall<T>(opts: {
  system: string;
  prompt: string;
  maxSearches?: number;
  effort?: Effort;
}): Promise<{ data: T; model: string; seenUrls: Set<string> }> {
  const p = baseParams(opts.effort ?? "medium");
  const messages: Anthropic.Beta.BetaMessageParam[] = [{ role: "user", content: opts.prompt }];
  const seenUrls = new Set<string>();
  let last: Anthropic.Beta.BetaMessage | null = null;
  for (let turn = 0; turn < 5; turn++) {
    const stream = client().beta.messages.stream({
      ...p,
      max_tokens: 32000,
      system: opts.system,
      tools: [
        {
          type: "web_search_20260209",
          name: "web_search",
          max_uses: opts.maxSearches ?? 8,
          user_location: { type: "approximate", country: "KR", timezone: "Asia/Seoul" },
        },
      ],
      messages,
    });
    last = await stream.finalMessage();
    for (const b of last.content) {
      if (b.type === "web_search_tool_result" && Array.isArray(b.content)) {
        for (const r of b.content) if (r.type === "web_search_result") seenUrls.add(normalizeUrl(r.url));
      }
    }
    if (last.stop_reason !== "pause_turn") break;
    messages.push({ role: "assistant", content: last.content });
  }
  if (!last) throw new AiError("AI 응답이 없습니다.");
  checkStop(last);
  const text = textOf(last);
  const m = text.match(/```json\s*([\s\S]*?)```/) ?? text.match(/(\{[\s\S]*\})\s*$/);
  if (!m) throw new AiError("AI 조사 결과를 해석하지 못했습니다.");
  try {
    return { data: JSON.parse(m[1]) as T, model: last.model, seenUrls };
  } catch {
    throw new AiError("AI 조사 결과 JSON 이 올바르지 않습니다.");
  }
}

export function normalizeUrl(u: string): string {
  try {
    const x = new URL(u);
    return `${x.hostname.replace(/^www\./, "")}${x.pathname.replace(/\/$/, "")}`;
  } catch {
    return u;
  }
}

export function aiErrorMessage(e: unknown): string {
  if (e instanceof AiError) return e.message;
  if (e instanceof Anthropic.AuthenticationError) return "AI API 키가 올바르지 않습니다.";
  if (e instanceof Anthropic.RateLimitError) return "AI 사용량 한도에 걸렸습니다. 잠시 후 다시 시도하세요.";
  if (e instanceof Anthropic.BadRequestError) return `AI 요청 오류: ${e.message}`;
  if (e instanceof Anthropic.APIError) return `AI 서버 오류 (${e.status}): ${e.message}`;
  return e instanceof Error ? e.message : String(e);
}
