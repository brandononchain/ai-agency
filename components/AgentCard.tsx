"use client";

import Link from "next/link";

interface AgentCardProps {
  slug: string;
  name: string;
  description: string;
  color: string;
  emoji: string;
  vibe: string;
  category: string;
}

export default function AgentCard({
  slug,
  name,
  emoji,
  vibe,
  color,
  category,
}: AgentCardProps) {
  return (
    <Link href={`/chat?agent=${slug}`} className="block group">
      <div className="brutal-card p-4 h-full flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <span className="text-3xl">{emoji}</span>
          <span
            className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase border-2 border-brutal-black"
            style={{ backgroundColor: color + "33" }}
          >
            {category}
          </span>
        </div>
        <h3 className="font-mono font-bold text-sm uppercase tracking-tight mb-2 leading-tight">
          {name}
        </h3>
        <p className="text-xs text-gray-600 leading-relaxed flex-1">{vibe}</p>
        <div className="mt-3 pt-3 border-t-2 border-gray-200">
          <span className="text-[10px] font-mono font-bold uppercase text-brutal-blue group-hover:text-brutal-black transition-colors">
            Launch Agent →
          </span>
        </div>
      </div>
    </Link>
  );
}
