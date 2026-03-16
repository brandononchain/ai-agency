"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import AgentBadge from "./AgentBadge";
import AgentSidebar from "./AgentSidebar";
import ChatHistory from "./ChatHistory";
import { Message, ChatSession, TaskStep } from "@/lib/types";
import { createSession, updateSession, getSession } from "@/lib/chat-store";

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
  const [historyOpen, setHistoryOpen] = useState(false);
  const [isRouting, setIsRouting] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [taskSteps, setTaskSteps] = useState<TaskStep[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Save messages to session whenever they change (debounced by streaming end)
  useEffect(() => {
    if (sessionId && !isStreaming && messages.length > 0) {
      updateSession(sessionId, {
        messages,
        agentSlug: currentAgent?.slug,
        agentName: currentAgent?.name,
        agentEmoji: currentAgent?.emoji,
      });
    }
  }, [isStreaming, sessionId, messages, currentAgent]);

  const handleSend = async (content: string) => {
    const userMessage: Message = { role: "user", content, timestamp: Date.now() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsStreaming(true);

    // Create session on first message
    let sid = sessionId;
    if (!sid) {
      const session = createSession(content);
      sid = session.id;
      setSessionId(sid);
    }

    // Set up task steps
    const steps: TaskStep[] = [
      { label: "Analyzing request", status: "active" },
      { label: "Selecting specialist", status: "pending" },
      { label: "Generating response", status: "pending" },
    ];
    setTaskSteps(steps);

    if (!currentAgent && !selectedSlug) {
      setIsRouting(true);
    }

    // Add placeholder assistant message
    const assistantMessage: Message = { role: "assistant", content: "", timestamp: Date.now() };
    setMessages([...newMessages, assistantMessage]);

    try {
      // Step 1 done
      setTaskSteps([
        { label: "Analyzing request", status: "done" },
        { label: "Selecting specialist", status: "active" },
        { label: "Generating response", status: "pending" },
      ]);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
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
              setCurrentAgent(parsed);
              setIsRouting(false);

              // Step 2 done
              setTaskSteps([
                { label: "Analyzing request", status: "done" },
                { label: `Routed → ${parsed.name}`, status: "done" },
                { label: "Generating response", status: "active" },
              ]);

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
            } else if (parsed.type === "done") {
              // All steps done
              setTaskSteps((prev) =>
                prev.map((s) => ({ ...s, status: "done" as const }))
              );
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
      const errMsg = error instanceof Error ? error.message : "Something went wrong";
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last.role === "assistant") {
          last.content = `**Error**: ${errMsg}`;
          last.agentName = "System";
          last.agentEmoji = "⚠️";
        }
        return [...updated];
      });
      setTaskSteps([]);
    } finally {
      setIsStreaming(false);
      setIsRouting(false);
      // Clear task steps after a short delay so user sees them complete
      setTimeout(() => setTaskSteps([]), 2000);
    }
  };

  const handleAgentSelect = (slug: string) => {
    setSelectedSlug(slug);
    if (!slug) setCurrentAgent(null);
  };

  const handleLoadSession = (session: ChatSession) => {
    setSessionId(session.id);
    setMessages(session.messages);
    setSelectedSlug(session.agentSlug || "");
    if (session.agentName) {
      setCurrentAgent({
        slug: session.agentSlug || "",
        name: session.agentName,
        emoji: session.agentEmoji || "🤖",
        color: "",
        vibe: "",
      });
    }
  };

  const handleNewChat = () => {
    setSessionId(undefined);
    setMessages([]);
    setCurrentAgent(null);
    setSelectedSlug(initialAgentSlug || "");
    setTaskSteps([]);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Sidebars */}
      <AgentSidebar
        selectedSlug={selectedSlug}
        onSelect={handleAgentSelect}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <ChatHistory
        currentId={sessionId}
        onSelect={handleLoadSession}
        onNew={handleNewChat}
        isOpen={historyOpen}
        onToggle={() => setHistoryOpen(!historyOpen)}
      />

      {/* Top bar */}
      <div className="shrink-0 border-b-2 border-brutal-black bg-gray-50 px-3 py-1.5 flex items-center justify-between gap-2 min-h-[2.5rem]">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {currentAgent ? (
            <AgentBadge
              name={currentAgent.name}
              emoji={currentAgent.emoji}
              color={currentAgent.color}
            />
          ) : isRouting ? (
            <span className="font-mono text-[10px] uppercase tracking-wider text-gray-500 animate-pulse">
              Routing to best agent...
            </span>
          ) : (
            <span className="font-mono text-[10px] uppercase tracking-wider text-gray-400 truncate">
              {selectedSlug ? selectedSlug : "Auto-route enabled"}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {messages.length > 0 && (
            <button
              onClick={handleNewChat}
              className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 hover:text-brutal-black transition-colors"
            >
              New
            </button>
          )}
          <button
            onClick={() => setHistoryOpen(true)}
            className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 hover:text-brutal-black transition-colors"
          >
            History
          </button>
        </div>
      </div>

      {/* Messages area — flex-1 with overflow scroll */}
      <div
        ref={scrollAreaRef}
        className="flex-1 overflow-y-auto overscroll-contain px-3 py-4"
        style={{ WebkitOverflowScrolling: "touch" } as React.CSSProperties}
      >
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center py-12 sm:py-20">
              <div className="text-5xl sm:text-6xl mb-4">🎯</div>
              <h2 className="font-mono text-xl sm:text-2xl font-extrabold uppercase tracking-tight mb-2">
                What do you need?
              </h2>
              <p className="text-xs text-gray-500 max-w-sm leading-relaxed mb-6">
                Describe your task. The best specialist handles it.
              </p>

              {/* Quick Action Categories */}
              <div className="w-full max-w-2xl space-y-3">
                {[
                  {
                    label: "🛠 Engineering",
                    actions: [
                      "Build a React component",
                      "Set up CI/CD pipeline",
                      "Review my API architecture",
                    ],
                  },
                  {
                    label: "📢 Marketing & Content",
                    actions: [
                      "TikTok growth strategy",
                      "Write landing page copy",
                      "Plan a podcast series",
                    ],
                  },
                  {
                    label: "💼 Business & Finance",
                    actions: [
                      "Build a financial model",
                      "Review this contract",
                      "Create a pitch deck outline",
                    ],
                  },
                  {
                    label: "👥 People & Ops",
                    actions: [
                      "Write a job description",
                      "Design onboarding flow",
                      "Automate a manual workflow",
                    ],
                  },
                  {
                    label: "🔒 Security & Compliance",
                    actions: [
                      "Audit my cloud security",
                      "SOC 2 readiness checklist",
                      "Penetration test plan",
                    ],
                  },
                  {
                    label: "📊 Data & Analytics",
                    actions: [
                      "Analyze A/B test results",
                      "Build a KPI dashboard",
                      "Customer churn analysis",
                    ],
                  },
                  {
                    label: "⛓️ Web3 & Spatial",
                    actions: [
                      "Audit my smart contract",
                      "Design token economics",
                      "Build a visionOS prototype",
                    ],
                  },
                  {
                    label: "🎓 Learning & Community",
                    actions: [
                      "Design a course curriculum",
                      "Write API documentation",
                      "Plan a developer hackathon",
                    ],
                  },
                ].map((category) => (
                  <div key={category.label}>
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 mb-1 text-left">
                      {category.label}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {category.actions.map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => handleSend(suggestion)}
                          className="px-2.5 py-1.5 text-[11px] font-mono border-2 border-gray-200 hover:border-brutal-black hover:bg-brutal-yellow transition-all active:bg-brutal-yellow"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <ChatMessage
              key={i}
              message={msg}
              isStreaming={isStreaming && i === messages.length - 1 && msg.role === "assistant"}
              taskSteps={
                isStreaming && i === messages.length - 1 && msg.role === "assistant"
                  ? taskSteps
                  : undefined
              }
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input — pinned to bottom */}
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
