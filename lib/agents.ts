import { Agent } from "./types";
import agentData from "./agent-data.json";

const agents: Agent[] = agentData as Agent[];

export function loadAgents(): Agent[] {
  return agents;
}

export function getAgent(slug: string): Agent | undefined {
  return agents.find((a) => a.slug === slug);
}

export function getAgentsByCategory(category: string): Agent[] {
  return agents.filter((a) => a.category === category);
}

export function buildAgentManifest(): string {
  const lines = agents.map(
    (a) => `${a.slug} | ${a.emoji} ${a.name} | ${a.category} | ${a.description}`
  );
  return lines.join("\n");
}
