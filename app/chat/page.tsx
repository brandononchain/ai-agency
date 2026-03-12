"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Header from "@/components/Header";
import ChatInterface from "@/components/ChatInterface";

function ChatContent() {
  const searchParams = useSearchParams();
  const agentSlug = searchParams.get("agent") || undefined;

  return <ChatInterface initialAgentSlug={agentSlug} />;
}

export default function ChatPage() {
  return (
    <>
      <Header />
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
            <span className="font-mono text-sm uppercase animate-pulse">
              Loading...
            </span>
          </div>
        }
      >
        <ChatContent />
      </Suspense>
    </>
  );
}
