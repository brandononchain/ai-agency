import { getClient } from "./claude";
import { buildAgentManifest, getAgent, loadAgents } from "./agents";
import { Agent, RouterResult } from "./types";
import { DEFAULT_AGENT_SLUG } from "./constants";

const ROUTER_SYSTEM_PROMPT = `You are the Agency Router — an expert at matching user requests to the perfect specialist agent.

You have access to the following agents (format: slug | name | category | description):

{{MANIFEST}}

INSTRUCTIONS:
- Analyze the user's request carefully
- Select the SINGLE best agent for the job
- If the request is ambiguous or general, prefer engineering-senior-developer
- For Web3/crypto/blockchain tasks, prefer web3 division agents
- For AI/ML tasks, prefer ai-ops or data-science agents
- For design tasks, prefer design agents
- Return ONLY valid JSON, no markdown fences

Respond with exactly this JSON format:
{"slug": "agent-slug-here", "reasoning": "One sentence explaining why this agent is the best match"}`;

export async function routeToAgent(userMessage: string): Promise<Agent> {
  const manifest = buildAgentManifest();
  const systemPrompt = ROUTER_SYSTEM_PROMPT.replace("{{MANIFEST}}", manifest);

  try {
    const client = getClient();
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 200,
      temperature: 0,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    // Parse JSON from response, handling potential markdown fences
    const jsonStr = text.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    const result: RouterResult = JSON.parse(jsonStr);

    const agent = getAgent(result.slug);
    if (agent) return agent;
  } catch (e) {
    console.error("Router failed, using default agent:", e);
  }

  // Fallback
  const fallback = getAgent(DEFAULT_AGENT_SLUG);
  if (fallback) return fallback;

  // Ultimate fallback — return first agent
  return loadAgents()[0];
}
