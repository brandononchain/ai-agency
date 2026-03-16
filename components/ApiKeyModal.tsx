"use client";

import { useState, useEffect } from "react";
import { getApiKey, setApiKey, clearApiKey } from "@/lib/api-key-store";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved: () => void;
}

export default function ApiKeyModal({ isOpen, onClose, onKeySaved }: ApiKeyModalProps) {
  const [key, setKey] = useState("");
  const [existingKey, setExistingKey] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      const stored = getApiKey();
      setExistingKey(stored);
      setKey("");
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const maskKey = (k: string) => {
    if (k.length <= 12) return k;
    return k.slice(0, 7) + "..." + k.slice(-4);
  };

  const handleSave = () => {
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
    onKeySaved();
    onClose();
  };

  const handleRemove = () => {
    clearApiKey();
    setExistingKey(null);
    onKeySaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white border-3 border-brutal-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b-3 border-brutal-black bg-brutal-yellow">
          <h2 className="font-mono text-sm font-extrabold uppercase tracking-tight">
            API Key Settings
          </h2>
          <button
            onClick={onClose}
            className="font-mono text-lg font-bold leading-none hover:text-gray-600 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-4 space-y-4">
          <p className="font-mono text-xs text-gray-600 leading-relaxed">
            Enter your Anthropic API key to use The Agency. Your key is stored
            locally in your browser and never sent to our servers — it goes
            directly to the Anthropic API.
          </p>

          {existingKey && (
            <div className="flex items-center justify-between px-3 py-2 bg-green-50 border-2 border-green-300">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-green-700 font-bold">
                  Active Key
                </span>
                <p className="font-mono text-xs text-green-800 mt-0.5">
                  {maskKey(existingKey)}
                </p>
              </div>
              <button
                onClick={handleRemove}
                className="font-mono text-[10px] font-bold uppercase tracking-wider text-red-500 hover:text-red-700 transition-colors"
              >
                Remove
              </button>
            </div>
          )}

          <div>
            <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1.5">
              {existingKey ? "Replace Key" : "API Key"}
            </label>
            <input
              type="password"
              value={key}
              onChange={(e) => {
                setKey(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
              }}
              placeholder="sk-ant-api03-..."
              className="w-full px-3 py-2.5 bg-white text-brutal-black font-mono text-sm
                border-2 border-brutal-black
                focus:outline-none focus:ring-0
                placeholder:text-gray-300 placeholder:text-xs"
            />
            {error && (
              <p className="font-mono text-[10px] text-red-500 mt-1">{error}</p>
            )}
          </div>

          <a
            href="https://console.anthropic.com/settings/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] text-gray-400 hover:text-brutal-black underline transition-colors block"
          >
            Get an API key from Anthropic →
          </a>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t-2 border-gray-200 flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2.5 bg-brutal-black text-white font-mono text-xs font-bold uppercase tracking-wider
              border-2 border-brutal-black
              hover:bg-brutal-yellow hover:text-brutal-black transition-colors
              active:translate-x-[2px] active:translate-y-[2px]"
          >
            Save Key
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-white text-brutal-black font-mono text-xs font-bold uppercase tracking-wider
              border-2 border-brutal-black
              hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
