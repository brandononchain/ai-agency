"use client";

import { useState, useEffect } from "react";
import AgentCard from "./AgentCard";
import { CATEGORIES } from "@/lib/constants";

interface AgentListing {
  slug: string;
  name: string;
  description: string;
  color: string;
  emoji: string;
  vibe: string;
  category: string;
}

export default function AgentGrid() {
  const [agents, setAgents] = useState<AgentListing[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/agents")
      .then((r) => r.json())
      .then((data) => {
        setAgents(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered =
    filter === "all" ? agents : agents.filter((a) => a.category === filter);

  const activeCats = CATEGORIES.filter((c) =>
    agents.some((a) => a.category === c.name)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="font-mono text-sm uppercase tracking-wider animate-pulse">
          Loading agents...
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider border-2 border-brutal-black transition-all ${
            filter === "all"
              ? "bg-brutal-black text-white"
              : "bg-white text-brutal-black hover:bg-gray-100"
          }`}
        >
          All ({agents.length})
        </button>
        {activeCats.map((cat) => {
          const count = agents.filter((a) => a.category === cat.name).length;
          return (
            <button
              key={cat.name}
              onClick={() => setFilter(cat.name)}
              className={`px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider border-2 border-brutal-black transition-all ${
                filter === cat.name
                  ? "bg-brutal-black text-white"
                  : "bg-white text-brutal-black hover:bg-gray-100"
              }`}
            >
              {cat.emoji} {cat.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Agent grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((agent) => (
          <AgentCard key={agent.slug} {...agent} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 font-mono text-sm text-gray-500 uppercase">
          No agents in this category
        </div>
      )}
    </div>
  );
}
