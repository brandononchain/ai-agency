"use client";

import { useState } from "react";
import { setApiKey } from "@/lib/api-key-store";

interface ApiKeyGateProps {
  onKeySet: () => void;
}

export default function ApiKeyGate({ onKeySet }: ApiKeyGateProps) {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const trimmed = key.trim();
    if (!trimmed) {
      setError("Please enter your API key");
      return;
    }
    if (!trimmed.startsWith("sk-ant-")) {
      setError("Invalid key format. Anthropic keys start with sk-ant-");
      return;
    }
    setApiKey(trimmed);
    onKeySet();
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🔑</div>
          <h2 className="font-mono text-lg font-extrabold uppercase tracking-tight mb-1">
            Enter Your API Key
          </h2>
          <p className="font-mono text-[11px] text-gray-500 leading-relaxed">
            The Agency uses your Anthropic API key to power 135+ specialist agents.
            Your key stays in your browser.
          </p>
        </div>

        <div className="space-y-3">
          <input
            type="password"
            value={key}
            onChange={(e) => {
              setKey(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            placeholder="sk-ant-api03-..."
            className="w-full px-3 py-3 bg-white text-brutal-black font-mono text-sm
              border-3 border-brutal-black shadow-[3px_3px_0_0_rgba(0,0,0,1)]
              focus:outline-none focus:ring-0
              placeholder:text-gray-300 placeholder:text-xs"
          />
          {error && (
            <p className="font-mono text-[10px] text-red-500">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={!key.trim()}
            className="w-full px-4 py-3 bg-brutal-black text-white font-mono text-xs font-bold uppercase tracking-wider
              border-3 border-brutal-black shadow-[3px_3px_0_0_rgba(0,0,0,0.3)]
              hover:bg-brutal-yellow hover:text-brutal-black hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all
              active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
              disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Start Using The Agency →
          </button>

          <a
            href="https://console.anthropic.com/settings/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center font-mono text-[10px] text-gray-400 hover:text-brutal-black underline transition-colors mt-2"
          >
            Get an API key from Anthropic →
          </a>
        </div>
      </div>
    </div>
  );
}
