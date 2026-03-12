import { ChatSession, Message } from "./types";

const STORAGE_KEY = "agency-chats";

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function titleFromMessage(msg: string): string {
  const trimmed = msg.slice(0, 60);
  return trimmed.length < msg.length ? trimmed + "…" : trimmed;
}

export function loadSessions(): ChatSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ChatSession[];
  } catch {
    return [];
  }
}

function saveSessions(sessions: ChatSession[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function createSession(firstMessage: string): ChatSession {
  const session: ChatSession = {
    id: genId(),
    title: titleFromMessage(firstMessage),
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  const sessions = loadSessions();
  sessions.unshift(session);
  saveSessions(sessions);
  return session;
}

export function updateSession(
  id: string,
  patch: Partial<Pick<ChatSession, "messages" | "agentSlug" | "agentName" | "agentEmoji" | "title">>
) {
  const sessions = loadSessions();
  const idx = sessions.findIndex((s) => s.id === id);
  if (idx === -1) return;
  Object.assign(sessions[idx], patch, { updatedAt: Date.now() });
  saveSessions(sessions);
}

export function getSession(id: string): ChatSession | undefined {
  return loadSessions().find((s) => s.id === id);
}

export function deleteSession(id: string) {
  const sessions = loadSessions().filter((s) => s.id !== id);
  saveSessions(sessions);
}
