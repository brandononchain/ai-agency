"use client";

import ReactMarkdown from "react-markdown";
import { Message } from "@/lib/types";

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
}

export default function ChatMessage({ message, isStreaming }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[85%] lg:max-w-[75%] ${
          isUser
            ? "bg-brutal-black text-white border-3 border-brutal-black"
            : "bg-white border-3 border-brutal-black shadow-brutal-sm"
        }`}
      >
        {/* Agent header */}
        {!isUser && message.agentName && (
          <div className="flex items-center gap-2 px-4 py-2 border-b-2 border-brutal-black bg-gray-50">
            <span className="text-lg">{message.agentEmoji || "🤖"}</span>
            <span className="font-mono text-xs font-bold uppercase tracking-wider">
              {message.agentName}
            </span>
          </div>
        )}

        {/* Message content */}
        <div className={`px-4 py-3 ${isUser ? "" : "chat-markdown"}`}>
          {isUser ? (
            <p className="font-mono text-sm leading-relaxed">
              {message.content}
            </p>
          ) : (
            <div className="text-sm leading-relaxed">
              <ReactMarkdown>{message.content}</ReactMarkdown>
              {isStreaming && <span className="cursor-blink" />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
