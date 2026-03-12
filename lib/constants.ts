import { AgentCategory } from "./types";

export const AGENT_DIRS = [
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

export const CATEGORIES: AgentCategory[] = [
  { name: "engineering", label: "Engineering", emoji: "💻" },
  { name: "design", label: "Design", emoji: "🎨" },
  { name: "web3", label: "Web3 & Blockchain", emoji: "⛓️" },
  { name: "ai-ops", label: "AI Operations", emoji: "🤖" },
  { name: "data-science", label: "Data Science", emoji: "📊" },
  { name: "marketing", label: "Marketing", emoji: "📢" },
  { name: "paid-media", label: "Paid Media", emoji: "💰" },
  { name: "sales", label: "Sales", emoji: "💼" },
  { name: "product", label: "Product", emoji: "📊" },
  { name: "project-management", label: "Project Management", emoji: "🎬" },
  { name: "testing", label: "Testing", emoji: "🧪" },
  { name: "support", label: "Support", emoji: "🛟" },
  { name: "spatial-computing", label: "Spatial Computing", emoji: "🥽" },
  { name: "specialized", label: "Specialized", emoji: "🎯" },
  { name: "game-development", label: "Game Development", emoji: "🎮" },
];

export const NAMED_COLORS: Record<string, string> = {
  red: "#FF3333",
  blue: "#3344FF",
  green: "#00CC55",
  yellow: "#FAFF00",
  orange: "#FF8800",
  purple: "#AA33FF",
  pink: "#FF33AA",
  cyan: "#00CCCC",
  teal: "#00AA88",
  indigo: "#4400CC",
  lime: "#88FF00",
  amber: "#FFBB00",
  emerald: "#00CC77",
  violet: "#7700FF",
  rose: "#FF3366",
  sky: "#0088FF",
  slate: "#556677",
  gray: "#888888",
  grey: "#888888",
  white: "#FAFAFA",
  black: "#0A0A0A",
  gold: "#FFD700",
  coral: "#FF6655",
  navy: "#001166",
  maroon: "#880022",
  olive: "#888800",
  crimson: "#CC1133",
  tomato: "#FF5544",
  salmon: "#FF8877",
  steel: "#446688",
  charcoal: "#333333",
  midnight: "#112244",
};

export function resolveColor(color: string): string {
  if (!color) return "#888888";
  if (color.startsWith("#")) return color;
  return NAMED_COLORS[color.toLowerCase()] || "#888888";
}

export const DEFAULT_AGENT_SLUG = "engineering-senior-developer";
