"use client";

import { useCallback, useState } from "react";
import { sendChatMessage } from "@/lib/api";
import type { ChatMessage } from "@/lib/types";
import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { MessageList } from "./MessageList";

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi there — I'm your mindful coach. Whether you're dealing with stress, building habits, or need a confidence boost, I'm here to listen. What's on your mind today?",
};

function createMessage(role: ChatMessage["role"], content: string): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
  };
}

export function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMessage = createMessage("user", trimmed);
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const reply = await sendChatMessage(trimmed);
      setMessages((prev) => [...prev, createMessage("assistant", reply)]);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  return (
    <section
      className="flex h-[min(90vh,820px)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-surface/90 shadow-2xl shadow-black/10 backdrop-blur-sm dark:shadow-black/30"
      aria-label="Chat with mindful coach"
    >
      <ChatHeader />
      <MessageList messages={messages} isLoading={isLoading} />
      {error && (
        <div
          role="alert"
          className="mx-4 mb-2 rounded-lg border border-error/30 bg-error/10 px-4 py-2 text-sm text-error"
        >
          {error}
        </div>
      )}
      <ChatInput onSend={handleSend} disabled={isLoading} />
    </section>
  );
}
