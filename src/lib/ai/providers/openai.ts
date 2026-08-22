import "server-only";

import OpenAI from "openai";
import type { AICompleteOptions, AIMessage, AIProvider } from "../types";

export class OpenAIProvider implements AIProvider {
  private client: OpenAI;

  constructor(apiKey = process.env.OPENAI_API_KEY) {
    this.client = new OpenAI({ apiKey });
  }

  async complete(messages: AIMessage[], options?: AICompleteOptions): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: "gpt-5",
      max_completion_tokens: options?.maxTokens,
      temperature: options?.temperature,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    return response.choices[0]?.message?.content ?? "";
  }
}
