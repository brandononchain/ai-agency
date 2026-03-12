import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Agent } from "./types";
import { AGENT_DIRS } from "./constants";

let cachedAgents: Agent[] | null = null;

function findMarkdownFiles(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      results.push(fullPath);
    }
  }
  return results;
}

function parseAgent(filePath: string, category: string): Agent | null {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const firstLine = content.split("\n")[0];
    if (firstLine !== "---") return null;

    const { data, content: body } = matter(content);
    if (!data.name || !data.description) return null;

    const slug = path.basename(filePath, ".md");

    return {
      slug,
      name: data.name,
      description: data.description,
      color: data.color || "gray",
      emoji: data.emoji || "🤖",
      vibe: data.vibe || "",
      category,
      body: body.trim(),
    };
  } catch {
    return null;
  }
}

export function loadAgents(): Agent[] {
  if (cachedAgents) return cachedAgents;

  const repoRoot = path.resolve(process.cwd());
  const agents: Agent[] = [];

  for (const dir of AGENT_DIRS) {
    const dirPath = path.join(repoRoot, dir);
    const files = findMarkdownFiles(dirPath);
    for (const file of files) {
      const agent = parseAgent(file, dir);
      if (agent) agents.push(agent);
    }
  }

  agents.sort((a, b) => a.name.localeCompare(b.name));
  cachedAgents = agents;
  return agents;
}

export function getAgent(slug: string): Agent | undefined {
  return loadAgents().find((a) => a.slug === slug);
}

export function getAgentsByCategory(category: string): Agent[] {
  return loadAgents().filter((a) => a.category === category);
}

export function buildAgentManifest(): string {
  const agents = loadAgents();
  const lines = agents.map(
    (a) => `${a.slug} | ${a.emoji} ${a.name} | ${a.category} | ${a.description}`
  );
  return lines.join("\n");
}
