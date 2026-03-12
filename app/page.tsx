import Header from "@/components/Header";
import AgentGrid from "@/components/AgentGrid";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b-3 border-brutal-black bg-brutal-black text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
            <div className="max-w-3xl">
              <h1 className="font-mono text-4xl sm:text-6xl lg:text-8xl font-extrabold uppercase tracking-tighter leading-[0.85] mb-5">
                The
                <br />
                <span className="text-brutal-yellow">Agency</span>
              </h1>
              <p className="text-base sm:text-lg text-gray-300 max-w-xl mb-6 leading-relaxed">
                135+ specialized AI agents across 15 divisions. Tell it what you
                need — the right specialist handles it.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/chat"
                  className="inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 bg-brutal-yellow text-brutal-black font-mono text-sm font-bold uppercase tracking-wider border-3 border-brutal-yellow transition-all active:translate-x-0.5 active:translate-y-0.5 hover:bg-white hover:border-white"
                >
                  Start Chatting →
                </Link>
                <Link
                  href="#agents"
                  className="inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 bg-transparent text-white font-mono text-sm font-bold uppercase tracking-wider border-3 border-white/60 transition-all active:translate-x-0.5 active:translate-y-0.5 hover:bg-white hover:text-brutal-black hover:border-white"
                >
                  Browse Agents
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-b-3 border-brutal-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  step: "01",
                  title: "Describe Your Task",
                  desc: "Tell the Agency what you need — from building a React component to designing a token economy.",
                },
                {
                  step: "02",
                  title: "Auto-Routed",
                  desc: "The master AI analyzes your request and activates the perfect specialist from 135+ agents.",
                },
                {
                  step: "03",
                  title: "Expert Execution",
                  desc: "Your specialist handles it with deep domain knowledge and production-ready output.",
                },
              ].map((item) => (
                <div key={item.step} className="brutal-card p-5">
                  <div className="font-mono text-3xl font-extrabold text-brutal-yellow mb-2">
                    {item.step}
                  </div>
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Divisions overview */}
        <section className="border-b-3 border-brutal-black bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h2 className="font-mono text-lg sm:text-2xl font-extrabold uppercase tracking-tight mb-6">
              15 Divisions
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
              {[
                { emoji: "💻", name: "Engineering", count: 16 },
                { emoji: "🎨", name: "Design", count: 8 },
                { emoji: "⛓️", name: "Web3", count: 6 },
                { emoji: "🤖", name: "AI Ops", count: 4 },
                { emoji: "📊", name: "Data Sci", count: 3 },
                { emoji: "📢", name: "Marketing", count: 18 },
                { emoji: "💰", name: "Paid Media", count: 7 },
                { emoji: "💼", name: "Sales", count: 8 },
                { emoji: "📋", name: "Product", count: 4 },
                { emoji: "🎬", name: "PM", count: 6 },
                { emoji: "🧪", name: "Testing", count: 8 },
                { emoji: "🛟", name: "Support", count: 6 },
                { emoji: "🥽", name: "Spatial", count: 6 },
                { emoji: "🎮", name: "Game Dev", count: 19 },
                { emoji: "🎯", name: "Special", count: 15 },
              ].map((div) => (
                <Link
                  key={div.name}
                  href="/chat"
                  className="border-2 border-brutal-black bg-white p-2.5 text-center hover:bg-brutal-yellow transition-colors active:bg-brutal-yellow"
                >
                  <div className="text-xl mb-0.5">{div.emoji}</div>
                  <div className="font-mono text-[9px] font-bold uppercase tracking-wider leading-tight">
                    {div.name}
                  </div>
                  <div className="font-mono text-[10px] text-gray-400">
                    {div.count}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Agent grid */}
        <section id="agents" className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-mono text-lg sm:text-2xl font-extrabold uppercase tracking-tight mb-6">
              All Agents
            </h2>
            <AgentGrid />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t-3 border-brutal-black bg-brutal-black text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="font-mono text-xs font-bold uppercase tracking-wider">
              The Agency — 135+ AI Specialists
            </div>
            <div className="font-mono text-[10px] text-gray-400">
              Built on{" "}
              <a
                href="https://github.com/msitarzewski/agency-agents"
                className="text-brutal-yellow hover:underline"
                target="_blank"
                rel="noopener"
              >
                agency-agents
              </a>{" "}
              — MIT License
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
