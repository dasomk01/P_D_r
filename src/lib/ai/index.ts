import "server-only";

import { ClaudeProvider } from "./providers/claude";
import { GeminiProvider } from "./providers/gemini";
import { OpenAIProvider } from "./providers/openai";
import type { AIProvider, AIRoleName, AIVendor } from "./types";

const VENDORS: Record<AIVendor, () => AIProvider> = {
  claude: () => new ClaudeProvider(),
  gemini: () => new GeminiProvider(),
  openai: () => new OpenAIProvider(),
};

const ROLE_ENV_VAR: Record<AIRoleName, string> = {
  summary: "SUMMARY_PROVIDER",
  question: "QUESTION_PROVIDER",
  tutor: "TUTOR_PROVIDER",
};

const ROLE_DEFAULT_VENDOR: Record<AIRoleName, AIVendor> = {
  summary: "claude",
  question: "gemini",
  tutor: "openai",
};

/**
 * Resolves which vendor backs a given app role (summary/question/tutor) from
 * env vars, so the vendor behind each role can be swapped without code changes.
 */
export function getProviderForRole(role: AIRoleName): AIProvider {
  const envVar = ROLE_ENV_VAR[role];
  const vendor = (process.env[envVar] as AIVendor | undefined) ?? ROLE_DEFAULT_VENDOR[role];

  const factory = VENDORS[vendor];
  if (!factory) {
    throw new Error(`Unknown AI vendor "${vendor}" configured for ${envVar}`);
  }

  return factory();
}

export type { AICompleteOptions, AIMessage, AIProvider, AIRoleName, AIVendor } from "./types";
