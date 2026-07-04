import type { ApiError, ChatResponse } from "./types";

/**
 * Sends a user message to the FastAPI /api/chat endpoint.
 * Uses a relative URL so it works with Next.js dev rewrites and Vercel routing.
 */
export async function sendChatMessage(message: string): Promise<string> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
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
