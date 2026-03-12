"use client";

import ReactMarkdown from "react-markdown";
import { Message, TaskStep } from "@/lib/types";
import TaskSteps from "./TaskSteps";

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
  taskSteps?: TaskStep[];
}

export default function ChatMessage({ message, isStreaming, taskSteps }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-[90%] sm:max-w-[80%] lg:max-w-[75%] ${
          isUser
            ? "bg-brutal-black text-white border-2 border-brutal-black"
            : "bg-white border-2 border-brutal-black shadow-[3px_3px_0_0_#e5e5e5]"
        }`}
      >
        {/* Agent header */}
        {!isUser && message.agentName && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-gray-200 bg-gray-50">
            <span className="text-sm">{message.agentEmoji || "🤖"}</span>
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-gray-600">
              {message.agentName}
            </span>
          </div>
        )}

        {/* Task steps */}
        {!isUser && taskSteps && taskSteps.length > 0 && (
          <div className="px-3 pt-2">
            <TaskSteps steps={taskSteps} />
          </div>
        )}

        {/* Content */}
        <div className={`px-3 py-2 ${isUser ? "" : "chat-markdown"}`}>
          {isUser ? (
            <p className="font-mono text-sm leading-relaxed">
              {message.content}
            </p>
          ) : (
            <div className="text-sm leading-relaxed">
              {message.content ? (
                <ReactMarkdown>{message.content}</ReactMarkdown>
              ) : isStreaming ? (
                <span className="text-gray-400 font-mono text-xs">Thinking...</span>
              ) : null}
              {isStreaming && message.content && <span className="cursor-blink" />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
