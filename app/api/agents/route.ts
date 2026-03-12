import { NextResponse } from "next/server";
import { loadAgents } from "@/lib/agents";
import { resolveColor } from "@/lib/constants";

export async function GET() {
  const agents = loadAgents();

  // Return agents without the full body (too large for listing)
  const listing = agents.map((a) => ({
    slug: a.slug,
    name: a.name,
    description: a.description,
    color: resolveColor(a.color),
    emoji: a.emoji,
    vibe: a.vibe,
    category: a.category,
  }));

  return NextResponse.json(listing);
}
