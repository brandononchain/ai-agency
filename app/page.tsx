import Header from "@/components/Header";
import AgentGrid from "@/components/AgentGrid";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="border-b-3 border-brutal-black bg-brutal-black text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="max-w-4xl">
              <h1 className="font-mono text-5xl sm:text-7xl lg:text-8xl font-extrabold uppercase tracking-tighter leading-[0.85] mb-6">
                The
                <br />
                <span className="text-brutal-yellow">Agency</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mb-8 leading-relaxed">
                135+ specialized AI agents across 15 divisions. Tell it what you
                need — the right specialist handles it. Engineering, Web3, AI
                Ops, Design, Marketing, and beyond.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/chat" className="brutal-btn bg-brutal-yellow text-brutal-black border-brutal-yellow hover:bg-white">
                  Start Chatting
                </Link>
                <Link
                  href="#agents"
                  className="brutal-btn-outline border-white text-white hover:bg-white hover:text-brutal-black"
                >
                  Browse Agents
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-b-3 border-brutal-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  step: "01",
                  title: "Describe Your Task",
                  desc: "Tell the Agency what you need — anything from building a React component to designing a token economy.",
                },
                {
                  step: "02",
                  title: "Auto-Routed",
                  desc: "The master AI analyzes your request and activates the perfect specialist agent from 135+ options.",
                },
                {
                  step: "03",
                  title: "Expert Execution",
                  desc: "Your specialist handles it with deep domain knowledge, proven workflows, and production-ready output.",
                },
              ].map((item) => (
                <div key={item.step} className="brutal-card p-6">
                  <div className="font-mono text-4xl font-extrabold text-brutal-yellow mb-3">
                    {item.step}
                  </div>
                  <h3 className="font-mono text-sm font-bold uppercase tracking-wider mb-2">
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="font-mono text-2xl font-extrabold uppercase tracking-tight mb-8">
              15 Specialized Divisions
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {[
                { emoji: "💻", name: "Engineering", count: 16 },
                { emoji: "🎨", name: "Design", count: 8 },
                { emoji: "⛓️", name: "Web3", count: 6 },
                { emoji: "🤖", name: "AI Ops", count: 4 },
                { emoji: "📊", name: "Data Science", count: 3 },
                { emoji: "📢", name: "Marketing", count: 18 },
                { emoji: "💰", name: "Paid Media", count: 7 },
                { emoji: "💼", name: "Sales", count: 8 },
                { emoji: "📋", name: "Product", count: 4 },
                { emoji: "🎬", name: "Project Mgmt", count: 6 },
                { emoji: "🧪", name: "Testing", count: 8 },
                { emoji: "🛟", name: "Support", count: 6 },
                { emoji: "🥽", name: "Spatial", count: 6 },
                { emoji: "🎮", name: "Game Dev", count: 19 },
                { emoji: "🎯", name: "Specialized", count: 15 },
              ].map((div) => (
                <div
                  key={div.name}
                  className="border-3 border-brutal-black bg-white p-3 text-center"
                >
                  <div className="text-2xl mb-1">{div.emoji}</div>
                  <div className="font-mono text-[10px] font-bold uppercase tracking-wider">
                    {div.name}
                  </div>
                  <div className="font-mono text-xs text-gray-500 mt-0.5">
                    {div.count} agents
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Agent grid */}
        <section id="agents" className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-mono text-2xl font-extrabold uppercase tracking-tight mb-8">
              All Agents
            </h2>
            <AgentGrid />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t-3 border-brutal-black bg-brutal-black text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="font-mono text-sm font-bold uppercase tracking-wider">
              The Agency — 135+ AI Specialists
            </div>
            <div className="font-mono text-xs text-gray-400">
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
    </>
  );
}
