export type AIRole = "system" | "user" | "assistant";

export interface AIMessage {
  role: AIRole;
  content: string;
}

export interface AICompleteOptions {
  maxTokens?: number;
  temperature?: number;
}

export interface AIProvider {
  complete(messages: AIMessage[], options?: AICompleteOptions): Promise<string>;
}

export type AIVendor = "claude" | "gemini" | "openai";

export type AIRoleName = "summary" | "question" | "tutor";
