#!/usr/bin/env node

/**
 * Pre-build script: parses all agent .md files and generates a static JSON
 * registry that gets bundled into the Next.js build. This ensures agents
 * are available on Vercel without runtime filesystem access.
 *
 * Usage: node scripts/build-registry.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const AGENT_DIRS = [
  "design",
  "engineering",
  "game-development",
  "marketing",
  "paid-media",
  "sales",
  "product",
  "project-management",
  "testing",
  "support",
  "spatial-computing",
  "specialized",
  "web3",
  "ai-ops",
  "data-science",
];

function findMarkdownFiles(dir) {
  const results = [];
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

const agents = [];

for (const dir of AGENT_DIRS) {
  const dirPath = path.join(ROOT, dir);
  const files = findMarkdownFiles(dirPath);

  for (const file of files) {
    try {
      const content = fs.readFileSync(file, "utf-8");
      if (!content.startsWith("---")) continue;

      const { data, content: body } = matter(content);
      if (!data.name || !data.description) continue;

      agents.push({
        slug: path.basename(file, ".md"),
        name: data.name,
        description: data.description,
        color: data.color || "gray",
        emoji: data.emoji || "🤖",
        vibe: data.vibe || "",
        category: dir,
        body: body.trim(),
      });
    } catch (e) {
      console.warn(`Skipping ${file}: ${e.message}`);
    }
  }
}

agents.sort((a, b) => a.name.localeCompare(b.name));

const outPath = path.join(ROOT, "lib", "agent-data.json");
fs.writeFileSync(outPath, JSON.stringify(agents, null, 2));

console.log(`✓ Built agent registry: ${agents.length} agents → lib/agent-data.json`);
