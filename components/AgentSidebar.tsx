"use client";

import { useState, useEffect } from "react";
import { CATEGORIES } from "@/lib/constants";

interface AgentListing {
  slug: string;
  name: string;
  emoji: string;
  color: string;
  category: string;
  vibe: string;
}

interface AgentSidebarProps {
  selectedSlug?: string;
  onSelect: (slug: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function AgentSidebar({
  selectedSlug,
  onSelect,
  isOpen,
  onToggle,
}: AgentSidebarProps) {
  const [agents, setAgents] = useState<AgentListing[]>([]);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/agents")
      .then((r) => r.json())
      .then(setAgents)
      .catch(() => {});
  }, []);

  // Lock body scroll when sidebar open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const activeCats = CATEGORIES.filter((c) =>
    agents.some((a) => a.category === c.name)
  );

  return (
    <>
      {/* Toggle tab */}
      <button
        onClick={onToggle}
        className="fixed top-[4.5rem] left-0 z-40 bg-brutal-black text-white px-1.5 py-2 font-mono text-[10px] uppercase tracking-wider border-r-2 border-y-2 border-brutal-black hover:bg-brutal-yellow hover:text-brutal-black transition-colors"
        style={{ writingMode: "vertical-lr" }}
      >
        {isOpen ? "✕" : "Agents"}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 backdrop-blur-sm"
          onClick={onToggle}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-[280px] max-w-[85vw] bg-white border-r-3 border-brutal-black z-40 flex flex-col transition-transform duration-200 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b-2 border-brutal-black bg-gray-50 shrink-0">
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider">
            Select Agent
          </h2>
          <button
            onClick={onToggle}
            className="font-mono text-xs font-bold px-2 py-1 border-2 border-brutal-black hover:bg-brutal-black hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Scrollable list */}
        <div
          className="flex-1 overflow-y-auto overscroll-contain px-3 py-3"
          style={{ WebkitOverflowScrolling: "touch" } as React.CSSProperties}
        >
          <button
            onClick={() => { onSelect(""); onToggle(); }}
            className={`w-full text-left px-3 py-2.5 mb-3 text-xs font-mono border-2 transition-all ${
              !selectedSlug
                ? "bg-brutal-yellow border-brutal-black font-bold"
                : "border-gray-300 hover:border-brutal-black"
            }`}
          >
            🎯 AUTO-ROUTE (Let AI choose)
          </button>

          {activeCats.map((cat) => {
            const catAgents = agents.filter((a) => a.category === cat.name);
            const isExpanded = expandedCat === cat.name;

            return (
              <div key={cat.name} className="mb-1.5">
                <button
                  onClick={() => setExpandedCat(isExpanded ? null : cat.name)}
                  className="w-full text-left px-3 py-2.5 text-xs font-mono font-bold uppercase tracking-wider border-2 border-gray-200 hover:border-brutal-black transition-colors flex items-center justify-between active:bg-gray-100"
                >
                  <span>{cat.emoji} {cat.label}</span>
                  <span className="text-gray-400 text-[10px]">
                    {isExpanded ? "−" : "+"} {catAgents.length}
                  </span>
                </button>

                {isExpanded && (
                  <div className="ml-2 mt-0.5 border-l-2 border-gray-200">
                    {catAgents.map((agent) => (
                      <button
                        key={agent.slug}
                        onClick={() => { onSelect(agent.slug); onToggle(); }}
                        className={`w-full text-left px-3 py-2 text-xs font-mono transition-colors flex items-center gap-2 active:bg-gray-100 ${
                          selectedSlug === agent.slug
                            ? "bg-brutal-yellow font-bold"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <span className="shrink-0">{agent.emoji}</span>
                        <span className="truncate">{agent.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <div className="h-8" />
        </div>
      </div>
    </>
  );
}
