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

  const activeCats = CATEGORIES.filter((c) =>
    agents.some((a) => a.category === c.name)
  );

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="fixed top-20 left-0 z-40 bg-brutal-black text-white px-2 py-3 font-mono text-xs uppercase tracking-wider border-r-3 border-y-3 border-brutal-black hover:bg-brutal-yellow hover:text-brutal-black transition-colors"
        style={{ writingMode: "vertical-lr" }}
      >
        {isOpen ? "Close" : "Agents"}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-72 bg-white border-r-3 border-brutal-black z-30 overflow-y-auto transition-transform duration-200 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4">
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider mb-4 pb-2 border-b-2 border-brutal-black">
            Select Agent
          </h2>

          {/* Auto-route option */}
          <button
            onClick={() => onSelect("")}
            className={`w-full text-left px-3 py-2 mb-3 text-xs font-mono border-2 transition-all ${
              !selectedSlug
                ? "bg-brutal-yellow border-brutal-black font-bold"
                : "border-gray-300 hover:border-brutal-black"
            }`}
          >
            🎯 AUTO-ROUTE (Let the AI choose)
          </button>

          {/* Categories */}
          {activeCats.map((cat) => {
            const catAgents = agents.filter((a) => a.category === cat.name);
            const isExpanded = expandedCat === cat.name;

            return (
              <div key={cat.name} className="mb-2">
                <button
                  onClick={() =>
                    setExpandedCat(isExpanded ? null : cat.name)
                  }
                  className="w-full text-left px-3 py-2 text-xs font-mono font-bold uppercase tracking-wider border-2 border-gray-200 hover:border-brutal-black transition-colors flex items-center justify-between"
                >
                  <span>
                    {cat.emoji} {cat.label}
                  </span>
                  <span className="text-gray-400">
                    {isExpanded ? "−" : "+"} {catAgents.length}
                  </span>
                </button>

                {isExpanded && (
                  <div className="ml-2 mt-1 border-l-2 border-gray-200">
                    {catAgents.map((agent) => (
                      <button
                        key={agent.slug}
                        onClick={() => {
                          onSelect(agent.slug);
                          onToggle();
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs font-mono transition-colors flex items-center gap-2 ${
                          selectedSlug === agent.slug
                            ? "bg-brutal-yellow font-bold"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <span>{agent.emoji}</span>
                        <span className="truncate">{agent.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
