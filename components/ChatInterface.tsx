"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import AgentBadge from "./AgentBadge";
import AgentSidebar from "./AgentSidebar";
import { Message } from "@/lib/types";

interface AgentMeta {
  slug: string;
  name: string;
  emoji: string;
  color: string;
  vibe: string;
}

interface ChatInterfaceProps {
  initialAgentSlug?: string;
}

export default function ChatInterface({ initialAgentSlug }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<AgentMeta | null>(null);
  const [selectedSlug, setSelectedSlug] = useState(initialAgentSlug || "");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isRouting, setIsRouting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = async (content: string) => {
    const userMessage: Message = { role: "user", content };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsStreaming(true);

    if (!currentAgent && !selectedSlug) {
      setIsRouting(true);
    }

    // Add placeholder assistant message
    const assistantMessage: Message = {
      role: "assistant",
      content: "",
    };
    setMessages([...newMessages, assistantMessage]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          agentSlug: selectedSlug || undefined,
        }),
      });

      if (!response.ok) {
        let errDetail = `API error: ${response.status}`;
        try {
          const errBody = await response.json();
          if (errBody.error) errDetail = errBody.error;
        } catch {}
        throw new Error(errDetail);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let fullContent = "";
      let agentMeta: AgentMeta | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);

          try {
            const parsed = JSON.parse(data);

            if (parsed.type === "agent") {
              agentMeta = parsed;
              setCurrentAgent(parsed);
              setIsRouting(false);

              // Update the assistant message with agent info
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last.role === "assistant") {
                  last.agentSlug = parsed.slug;
                  last.agentName = parsed.name;
                  last.agentEmoji = parsed.emoji;
                }
                return [...updated];
              });
            } else if (parsed.type === "text") {
              fullContent += parsed.text;
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last.role === "assistant") {
                  last.content = fullContent;
                }
                return [...updated];
              });
            } else if (parsed.type === "error") {
              fullContent += `\n\n**Error**: ${parsed.error}`;
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last.role === "assistant") {
                  last.content = fullContent;
                }
                return [...updated];
              });
            }
          } catch {
            // Skip malformed JSON
          }
        }
      }
    } catch (error) {
      const errMsg =
        error instanceof Error ? error.message : "Something went wrong";
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last.role === "assistant") {
          last.content = `**Error**: ${errMsg}. Make sure your ANTHROPIC_API_KEY is set in .env.local`;
          last.agentName = "System";
          last.agentEmoji = "⚠️";
        }
        return [...updated];
      });
    } finally {
      setIsStreaming(false);
      setIsRouting(false);
    }
  };

  const handleAgentSelect = (slug: string) => {
    setSelectedSlug(slug);
    if (!slug) {
      setCurrentAgent(null);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Agent sidebar */}
      <AgentSidebar
        selectedSlug={selectedSlug}
        onSelect={handleAgentSelect}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Top bar showing current agent */}
      <div className="border-b-3 border-brutal-black bg-gray-50 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {currentAgent ? (
            <AgentBadge
              name={currentAgent.name}
              emoji={currentAgent.emoji}
              color={currentAgent.color}
              vibe={currentAgent.vibe}
            />
          ) : isRouting ? (
            <span className="font-mono text-xs uppercase tracking-wider text-gray-500 animate-pulse">
              Routing to best agent...
            </span>
          ) : (
            <span className="font-mono text-xs uppercase tracking-wider text-gray-500">
              {selectedSlug
                ? `Agent: ${selectedSlug}`
                : "Auto-route — describe your task and the best agent will handle it"}
            </span>
          )}
        </div>

        {messages.length > 0 && (
          <button
            onClick={() => {
              setMessages([]);
              setCurrentAgent(null);
            }}
            className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400 hover:text-brutal-red transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="text-6xl mb-6">🎯</div>
              <h2 className="font-mono text-2xl font-extrabold uppercase tracking-tight mb-3">
                What do you need?
              </h2>
              <p className="text-sm text-gray-500 max-w-md leading-relaxed mb-8">
                Describe your task and the Agency will route you to the perfect
                specialist. Or select an agent from the sidebar.
              </p>
              <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                {[
                  "Build me a React component with dark mode",
                  "Audit my Solidity smart contract",
                  "Design a token economy for my protocol",
                  "Create a TikTok growth strategy",
                  "Set up a CI/CD pipeline",
                  "Analyze my A/B test results",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSend(suggestion)}
                    className="px-3 py-1.5 text-xs font-mono border-2 border-gray-300 hover:border-brutal-black hover:bg-brutal-yellow transition-all"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <ChatMessage
              key={i}
              message={msg}
              isStreaming={
                isStreaming && i === messages.length - 1 && msg.role === "assistant"
              }
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <ChatInput
        onSend={handleSend}
        disabled={isStreaming}
        placeholder={
          currentAgent
            ? `Message ${currentAgent.name}...`
            : "Tell the agency what you need..."
        }
      />
    </div>
  );
}
