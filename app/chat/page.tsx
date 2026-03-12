"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import ChatInterface from "@/components/ChatInterface";

function ChatContent() {
  const searchParams = useSearchParams();
  const agentSlug = searchParams.get("agent") || undefined;

  return <ChatInterface initialAgentSlug={agentSlug} />;
}

export default function ChatPage() {
  return (
    <div className="h-screen h-[100dvh] flex flex-col overflow-hidden">
      {/* Minimal chat header — fixed in the chat page only */}
      <header className="shrink-0 border-b-3 border-brutal-black bg-white flex items-center justify-between px-3 h-12">
        <Link href="/" className="flex items-center gap-1.5">
          <span className="font-mono text-sm font-extrabold uppercase tracking-tighter">
            THE AGENCY
          </span>
        </Link>
        <Link
          href="/"
          className="font-mono text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-brutal-black transition-colors"
        >
          ← Agents
        </Link>
      </header>

      {/* Chat takes remaining space */}
      <div className="flex-1 min-h-0">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-full">
              <span className="font-mono text-xs uppercase animate-pulse">
                Loading...
              </span>
            </div>
          }
        >
          <ChatContent />
        </Suspense>
      </div>
    </div>
  );
}
