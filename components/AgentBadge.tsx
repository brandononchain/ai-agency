"use client";

interface AgentBadgeProps {
  name: string;
  emoji: string;
  color: string;
  vibe?: string;
}

export default function AgentBadge({ name, emoji, color }: AgentBadgeProps) {
  return (
    <div
      className="inline-flex items-center gap-1.5 px-2 py-1 border-2 border-brutal-black text-xs font-mono font-bold"
      style={{ backgroundColor: (color || "#888") + "22" }}
    >
      <span className="text-sm">{emoji}</span>
      <span className="uppercase text-[10px] tracking-wider truncate max-w-[140px] sm:max-w-none">{name}</span>
    </div>
  );
}
