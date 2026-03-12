export interface Agent {
  slug: string;
  name: string;
  description: string;
  color: string;
  emoji: string;
  vibe: string;
  category: string;
  body: string;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
  agentSlug?: string;
  agentName?: string;
  agentEmoji?: string;
  timestamp?: number;
}

export interface ChatSession {
  id: string;
  title: string;
  agentSlug?: string;
  agentName?: string;
  agentEmoji?: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface TaskStep {
  label: string;
  status: "pending" | "active" | "done";
}

export interface ChatRequest {
  messages: Message[];
  agentSlug?: string;
}

export interface RouterResult {
  slug: string;
  reasoning: string;
}

export interface AgentCategory {
  name: string;
  label: string;
  emoji: string;
}
