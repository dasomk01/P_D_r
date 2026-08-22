import "server-only";

import Anthropic from "@anthropic-ai/sdk";
import type { AICompleteOptions, AIMessage, AIProvider } from "../types";

export class ClaudeProvider implements AIProvider {
  private client: Anthropic;

  constructor(apiKey = process.env.ANTHROPIC_API_KEY) {
    this.client = new Anthropic({ apiKey });
  }

  async complete(messages: AIMessage[], options?: AICompleteOptions): Promise<string> {
    const system = messages.find((m) => m.role === "system")?.content;
    const rest = messages.filter((m) => m.role !== "system");

    const response = await this.client.messages.create({
      model: "claude-sonnet-5",
      max_tokens: options?.maxTokens ?? 4096,
      temperature: options?.temperature,
      system,
      messages: rest.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
    });

    return response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");
  }
}
