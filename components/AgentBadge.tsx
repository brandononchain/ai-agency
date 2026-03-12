"use client";

interface AgentBadgeProps {
  name: string;
  emoji: string;
  color: string;
  vibe?: string;
}

export default function AgentBadge({ name, emoji, color, vibe }: AgentBadgeProps) {
  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1.5 border-2 border-brutal-black text-sm font-mono font-bold"
      style={{ backgroundColor: color + "22" }}
    >
      <span>{emoji}</span>
      <span className="uppercase text-xs tracking-wider">{name}</span>
      {vibe && (
        <span className="text-[10px] text-gray-500 normal-case font-normal hidden sm:inline">
          — {vibe}
        </span>
      )}
    </div>
  );
}
