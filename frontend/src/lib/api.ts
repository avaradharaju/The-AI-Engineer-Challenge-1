import type { ApiError, ChatResponse, CoachCharacterId } from "./types";

interface SendChatMessageOptions {
  message: string;
  creativity: number;
  character: CoachCharacterId;
}

/**
 * Sends a user message to the FastAPI /api/chat endpoint.
 * Uses a relative URL so it works with Next.js dev rewrites and Vercel routing.
 */
export async function sendChatMessage({
  message,
  creativity,
  character,
}: SendChatMessageOptions): Promise<string> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, creativity, character }),
  });

  if (!response.ok) {
    let errorMessage = `Request failed (${response.status})`;

    try {
      const errorBody = (await response.json()) as ApiError;
      if (errorBody.detail) {
        errorMessage = errorBody.detail;
      }
    } catch {
      // Keep the generic message if the body is not JSON.
    }

    throw new Error(errorMessage);
  }

  const data = (await response.json()) as ChatResponse;
  return data.reply;
}
