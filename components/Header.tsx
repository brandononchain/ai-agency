"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b-3 border-brutal-black bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="text-2xl font-mono font-extrabold uppercase tracking-tighter">
              THE AGENCY
            </span>
            <span className="hidden sm:inline-block bg-brutal-yellow px-2 py-0.5 text-xs font-mono font-bold uppercase border-2 border-brutal-black">
              135+ Agents
            </span>
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              href="/"
              className="font-mono text-sm font-bold uppercase tracking-wider hover:text-brutal-blue transition-colors"
            >
              Agents
            </Link>
            <Link href="/chat" className="brutal-btn text-sm py-2 px-4">
              Start Chat
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
