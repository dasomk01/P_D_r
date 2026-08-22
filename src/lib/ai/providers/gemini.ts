import "server-only";

import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AICompleteOptions, AIMessage, AIProvider } from "../types";

export class GeminiProvider implements AIProvider {
  private client: GoogleGenerativeAI;

  constructor(apiKey = process.env.GEMINI_API_KEY) {
    this.client = new GoogleGenerativeAI(apiKey!);
  }

  async complete(messages: AIMessage[], options?: AICompleteOptions): Promise<string> {
    const system = messages.find((m) => m.role === "system")?.content;
    const rest = messages.filter((m) => m.role !== "system");

    const model = this.client.getGenerativeModel({
      model: "gemini-2.5-pro",
      systemInstruction: system,
    });

    const result = await model.generateContent({
      contents: rest.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      generationConfig: {
        maxOutputTokens: options?.maxTokens,
        temperature: options?.temperature,
      },
    });

    return result.response.text();
  }
}
