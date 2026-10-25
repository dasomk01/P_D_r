import "server-only";

import { mcpConfigured } from "../mcp/oauth";

export const AI_MODEL = process.env.AI_MODEL || "claude-opus-5-5";

export function aiConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

/**
 * 실제로 구현·연결된 AI 기능만 true. 이미지 생성과 자동 예약 실행은
 * 아직 연결된 서비스가 없으므로 항상 false 입니다.
 */
export function aiStatus() {
  const on = aiConfigured();
  return {
    configured: on,
    model: on ? AI_MODEL : null,
    features: {
      idea_plan: on,
      travel_plan: on,
      toon_script: on,
      place_research: on,
      photo_tags: on,
      idea_suggest: on,
      anonymity_check: on,
      image_generation: false,
      scheduled_production: false,
      mcp: mcpConfigured(),
    },
  };
}
