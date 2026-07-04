import type { ChatMessage } from "@/lib/types";

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-[15px] leading-relaxed sm:max-w-[75%] ${
          isUser
            ? "rounded-br-md bg-user-bubble text-user-bubble-foreground"
            : "rounded-bl-md bg-assistant-bubble text-foreground"
        }`}
      >
        {!isUser && (
          <span className="mb-1 block text-xs font-medium text-accent">
            Coach
          </span>
        )}
        {message.content}
      </div>
    </div>
  );
}
