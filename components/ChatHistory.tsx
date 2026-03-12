"use client";

import { ChatSession } from "@/lib/types";
import { loadSessions, deleteSession } from "@/lib/chat-store";
import { useState, useEffect } from "react";

interface ChatHistoryProps {
  currentId?: string;
  onSelect: (session: ChatSession) => void;
  onNew: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function ChatHistory({
  currentId,
  onSelect,
  onNew,
  isOpen,
  onToggle,
}: ChatHistoryProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);

  useEffect(() => {
    setSessions(loadSessions());
  }, [currentId]);

  // Refresh when opened
  useEffect(() => {
    if (isOpen) setSessions(loadSessions());
  }, [isOpen]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteSession(id);
    setSessions(loadSessions());
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 backdrop-blur-sm"
          onClick={onToggle}
        />
      )}

      {/* Panel — slides from right */}
      <div
        className={`fixed top-0 right-0 h-full w-[280px] max-w-[85vw] bg-white border-l-3 border-brutal-black z-40 flex flex-col transition-transform duration-200 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b-2 border-brutal-black bg-gray-50 shrink-0">
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider">
            Chats
          </h2>
          <button
            onClick={onToggle}
            className="font-mono text-xs font-bold px-2 py-1 border-2 border-brutal-black hover:bg-brutal-black hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div
          className="flex-1 overflow-y-auto overscroll-contain px-3 py-3"
          style={{ WebkitOverflowScrolling: "touch" } as React.CSSProperties}
        >
          <button
            onClick={() => { onNew(); onToggle(); }}
            className="w-full text-left px-3 py-2.5 mb-3 text-xs font-mono font-bold border-2 border-brutal-black bg-brutal-yellow hover:bg-brutal-black hover:text-white transition-all"
          >
            + New Chat
          </button>

          {sessions.length === 0 && (
            <p className="text-xs font-mono text-gray-400 text-center py-6">
              No chat history yet
            </p>
          )}

          {sessions.map((s) => (
            <button
              key={s.id}
              onClick={() => { onSelect(s); onToggle(); }}
              className={`w-full text-left px-3 py-2.5 mb-1.5 text-xs font-mono border-2 transition-all flex items-center gap-2 group ${
                currentId === s.id
                  ? "border-brutal-black bg-gray-100 font-bold"
                  : "border-gray-200 hover:border-brutal-black"
              }`}
            >
              <span className="shrink-0">{s.agentEmoji || "🎯"}</span>
              <span className="truncate flex-1">{s.title}</span>
              <span
                onClick={(e) => handleDelete(s.id, e)}
                className="shrink-0 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity px-1"
              >
                ✕
              </span>
            </button>
          ))}
          <div className="h-8" />
        </div>
      </div>
    </>
  );
}
