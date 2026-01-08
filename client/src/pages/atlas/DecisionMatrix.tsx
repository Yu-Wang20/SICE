/**
 * Design Philosophy: Swiss Brutalism meets Digital Minimalism
 * Chapter 4: Decision Matrix
 * Color: Emerald Green (#10B981)
 */

import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DecisionMatrix() {
  const [, navigate] = useLocation();

  const matrixRows = [
    {
      environment: "Transparent Environment",
      subtitle: "(e.g., Chess, Go, Programming)",
      information: "Perfect Information",
      algorithm: "MCTS + Deep Neural Networks",
      paradigm: "AlphaZero Paradigm",
      rationale: "Rules are certain and complete. The challenge is computational depth and value function accuracy.",
      color: "#0066FF",
    },
    {
      environment: "Fog Environment",
      subtitle: "(e.g., Poker, Negotiations)",
      information: "Imperfect Information",
      algorithm: "CFR+ / Nested Sub-game Solving",
      paradigm: "Libratus/ReBeL Style",
      rationale: "Information is hidden. Core challenge is recursive reasoning about opponent's unknown state.",
      color: "#6B46C1",
    },
    {
      environment: "Human Opponent",
      subtitle: "(e.g., Market Trading, Negotiations)",
      information: "Non-stationary Environment",
      algorithm: "Exploitative Model / Restricted Nash Response",
      paradigm: "RNR / Behavioral Economics",
      rationale: "Opponent is non-rational. Leverage behavioral economics (prospect theory, loss aversion) to predict deviations.",
      color: "#FF6B35",
    },
    {
      environment: "Universal Complex Task",
      subtitle: "(e.g., LLM Reasoning, Multi-domain)",
      information: "High-dimensional Latent Space",
      algorithm: "RLHF + Search / Reasoning Traces",
      paradigm: "PPO / Reasoning Traces",
      rationale: "Task goal is ambiguous. Align values via RLHF, use CoT search for long-horizon reasoning.",
      color: "#10B981",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="border-b-8 border-black py-12">
        <div className="container">
          <button
            onClick={() => navigate("/atlas")}
            className="flex items-center gap-2 text-sm font-mono mb-8 hover:opacity-60 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Atlas
          </button>
          <div className="max-w-4xl">
            <div className="text-8xl font-bold outline-text mb-6" style={{ color: "#10B981" }}>
              04
            </div>
            <h1 className="text-6xl md:text-7xl font-bold leading-tight mb-4">
              Decision Matrix
            </h1>
            <p className="text-lg font-mono" style={{ color: "#10B981" }}>
              Strategic Framework for Algorithm Selection
            </p>
          </div>
        </div>
      </header>

      {/* Intro Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container">
          <div className="max-w-4xl space-y-6">
            <p className="text-lg text-gray-800 leading-relaxed">
              The Strategic Intelligence Atlas provides a comprehensive knowledge system, but in practice, you need a decision framework: given a specific strategic problem, which algorithm should you use? This chapter synthesizes all previous insights into a unified decision matrix that maps environment types to optimal algorithms.
            </p>
          </div>
        </div>
      </section>

      {/* Matrix Section */}
      <section className="py-24 md:py-32">
        <div className="container">
          <div className="max-w-6xl space-y-8">
            <div>
              <h2 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
                The Strategic Decision Matrix
              </h2>
              <div className="h-2 w-24 bg-[#10B981]" />
            </div>

            <div className="space-y-6">
              {matrixRows.map((row, idx) => (
                <div
                  key={idx}
                  className="border-2 border-black p-6 md:p-8 space-y-4 hover:shadow-lg transition-shadow"
                >
                  {/* Header Row */}
                  <div className="flex items-start justify-between gap-4 pb-4 border-b-2 border-gray-200">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold">{row.environment}</h3>
                      <p className="text-sm font-mono text-gray-600 mt-1">{row.subtitle}</p>
                    </div>
                    <div
                      className="text-4xl font-bold opacity-20"
                      style={{ color: row.color }}
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </div>
                  </div>

                  {/* Content Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-mono text-gray-600 mb-2">Information Type</p>
                      <p className="text-lg font-bold">{row.information}</p>
                    </div>

                    <div>
                      <p className="text-sm font-mono text-gray-600 mb-2">Optimal Algorithm</p>
                      <p className="text-lg font-bold" style={{ color: row.color }}>
                        {row.algorithm}
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <p className="text-sm font-mono text-gray-600 mb-2">Paradigm</p>
                      <p className="text-base font-mono bg-gray-50 p-3 border-l-4" style={{ borderColor: row.color }}>
                        {row.paradigm}
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <p className="text-sm font-mono text-gray-600 mb-2">Strategic Rationale</p>
                      <p className="text-base leading-relaxed text-gray-800">{row.rationale}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Key Principles */}
      <section className="py-24 md:py-32 bg-gray-50">
        <div className="container">
          <div className="max-w-4xl space-y-8">
            <h2 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
              How to Use This Matrix
            </h2>
            <div className="h-2 w-24 bg-[#10B981]" />

            <div className="space-y-6">
              <div className="border-l-4 border-[#10B981] pl-6 py-2">
                <h3 className="text-2xl font-bold mb-2">Step 1: Identify Your Environment</h3>
                <p className="text-lg text-gray-800">
                  Is your problem domain characterized by perfect information (all facts known) or imperfect information (hidden facts)? Is your opponent rational or subject to cognitive biases?
                </p>
              </div>

              <div className="border-l-4 border-[#10B981] pl-6 py-2">
                <h3 className="text-2xl font-bold mb-2">Step 2: Determine Information Asymmetry</h3>
                <p className="text-lg text-gray-800">
                  How much uncertainty exists? Is it structural (inherent to the problem) or behavioral (opponent deviations from rationality)?
                </p>
              </div>

              <div className="border-l-4 border-[#10B981] pl-6 py-2">
                <h3 className="text-2xl font-bold mb-2">Step 3: Select Your Algorithm</h3>
                <p className="text-lg text-gray-800">
                  Use the matrix to identify the optimal algorithm class for your environment. Then implement the specific variant that matches your constraints.
                </p>
              </div>

              <div className="border-l-4 border-[#10B981] pl-6 py-2">
                <h3 className="text-2xl font-bold mb-2">Step 4: Balance Safety and Profit</h3>
                <p className="text-lg text-gray-800">
                  Against unknown opponents, lean toward GTO (game theory optimal). Against known opponents with exploitable patterns, use RNR (restricted Nash response) to balance safety with profit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Synthesis */}
      <section className="py-24 md:py-32 bg-black text-white">
        <div className="container">
          <div className="max-w-4xl space-y-8">
            <h2 className="text-5xl md:text-6xl font-bold leading-tight">
              Synthesis: From Theory to Practice
            </h2>
            <div className="h-2 w-24 bg-[#10B981]" />

            <div className="space-y-6 text-lg leading-relaxed text-gray-300">
              <p>
                The Strategic Intelligence Atlas traces a century-long journey from Kolmogorov's probability axioms to modern AI systems. But the ultimate value lies not in historical understanding—it lies in practical decision-making.
              </p>

              <p>
                This decision matrix synthesizes all previous chapters into a unified framework. Whether you're building a game-playing AI, designing a trading algorithm, or architecting a reasoning system, the matrix provides a principled way to choose your approach.
              </p>

              <p>
                The key insight is that no single algorithm dominates all domains. Perfect information games benefit from search-based approaches. Imperfect information games require belief state reasoning. Non-stationary environments with irrational opponents demand behavioral modeling. And high-dimensional reasoning tasks require alignment through human feedback combined with search.
              </p>

              <p className="text-xl font-bold pt-8">
                The future of strategic intelligence lies not in discovering new algorithms, but in understanding which algorithm matches which problem—and having the computational power to execute it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-16 bg-white border-t-8 border-black">
        <div className="container">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              className="border-2 border-black text-black hover:bg-black hover:text-white"
              onClick={() => navigate("/atlas/ai-algorithm-analysis")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous: AI & Algorithm Analysis
            </Button>
            <Button
              className="bg-black text-white hover:bg-gray-800"
              onClick={() => navigate("/atlas/insights")}
            >
              Next: Key Insights
              <ArrowLeft className="w-4 h-4 ml-2" style={{ transform: "rotate(180deg)" }} />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
