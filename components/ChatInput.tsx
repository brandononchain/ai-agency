"use client";

import { useState, useRef, useEffect } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({ onSend, disabled, placeholder }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!disabled && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [disabled]);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  return (
    <div className="shrink-0 border-t-3 border-brutal-black bg-white px-3 py-2 safe-area-bottom">
      <div className="max-w-4xl mx-auto flex gap-2 items-end">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder || "Tell the agency what you need..."}
          rows={1}
          className="flex-1 px-3 py-2.5 bg-white text-brutal-black font-mono text-sm
            border-2 border-brutal-black resize-none
            focus:outline-none focus:ring-0
            placeholder:text-gray-400 placeholder:text-xs"
        />
        <button
          onClick={handleSubmit}
          disabled={disabled || !input.trim()}
          className="shrink-0 px-4 py-2.5 bg-brutal-black text-white font-mono text-xs font-bold uppercase tracking-wider
            border-2 border-brutal-black
            disabled:opacity-30 disabled:cursor-not-allowed
            active:bg-brutal-yellow active:text-brutal-black transition-colors"
        >
          {disabled ? "..." : "→"}
        </button>
      </div>
    </div>
  );
}
