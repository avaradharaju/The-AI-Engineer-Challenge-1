export type MessageRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
}

export interface ChatResponse {
  reply: string;
}

export interface ApiError {
  detail: string;
}
