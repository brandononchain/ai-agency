"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="shrink-0 border-b-3 border-brutal-black bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg sm:text-2xl font-mono font-extrabold uppercase tracking-tighter">
              THE AGENCY
            </span>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/"
              className="font-mono text-[10px] sm:text-sm font-bold uppercase tracking-wider hover:text-brutal-blue transition-colors"
            >
              Agents
            </Link>
            <Link href="/chat" className="px-3 py-1.5 sm:px-4 sm:py-2 bg-brutal-black text-white font-mono text-[10px] sm:text-sm font-bold uppercase tracking-wider border-2 border-brutal-black active:bg-brutal-yellow active:text-brutal-black transition-colors">
              Chat
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
