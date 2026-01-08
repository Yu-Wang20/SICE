/**
 * Design Philosophy: Swiss Brutalism meets Digital Minimalism
 * Chapter 3: AI & Algorithm Analysis
 * Color: Vibrant Orange (#FF6B35)
 */

import { useLocation } from "wouter";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AIAlgorithmAnalysis() {
  const [, navigate] = useLocation();

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
            <div className="text-8xl font-bold outline-text mb-6" style={{ color: "#FF6B35" }}>
              03
            </div>
            <h1 className="text-6xl md:text-7xl font-bold leading-tight mb-4">
              AI & Algorithm Analysis
            </h1>
            <p className="text-lg font-mono" style={{ color: "#FF6B35" }}>
              2010s - 2024+: The Bitter Lesson
            </p>
          </div>
        </div>
      </header>

      {/* Intro Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container">
          <div className="max-w-4xl space-y-6">
            <blockquote className="text-2xl font-bold italic leading-relaxed border-l-4 border-[#FF6B35] pl-8">
              "计算即权力，搜索即智能。"
            </blockquote>
            <p className="text-lg text-gray-800 leading-relaxed">
              This chapter traces how the theoretical foundations of probability and game theory were finally unleashed by massive computational power. We explore Richard Sutton's "Bitter Lesson," examine the distinction between perfect and imperfect information domains, and analyze how modern AI systems like AlphaZero, ReBeL, and DeepSeek-R1 have transcended human expertise through brute-force search and learning.
            </p>
          </div>
        </div>
      </section>

      {/* Section 1: The Bitter Lesson */}
      <section className="py-24 md:py-32">
        <div className="container">
          <div className="max-w-4xl space-y-8">
            <div>
              <h2 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
                The Bitter Lesson
              </h2>
              <div className="h-2 w-24 bg-[#FF6B35]" />
            </div>

            <div className="space-y-6 text-lg leading-relaxed text-gray-800">
              <p>
                In 2019, <strong>Richard Sutton</strong>—one of the pioneers of reinforcement learning—published a short but profound essay titled "The Bitter Lesson." In it, he reflected on 70 years of AI research and identified a consistent pattern: the most effective approaches are those that leverage massive computation through general search and learning methods, not human-designed domain expertise.
              </p>

              <blockquote className="border-l-4 border-[#FF6B35] pl-6 py-4 bg-gray-50 font-mono text-base italic">
                "The biggest lesson that can be read from 70 years of AI research is that the general methods that leverage computation are ultimately the most effective, and by a large margin. The ultimate reason for this is Moore's law."
              </blockquote>

              <p>
                Sutton's insight is profound because it contradicts the intuition of many AI researchers. For decades, the dominant approach was to encode human expertise into systems—chess engines with hand-crafted evaluation functions, medical diagnosis systems with expert rules, language systems with carefully designed linguistic features. Yet time and again, these systems were eventually surpassed by approaches that simply scaled up computation and let the algorithm learn from data.
              </p>

              <div className="bg-gray-50 border-l-4 border-[#FF6B35] p-6 space-y-4">
                <h3 className="font-bold text-xl">The Bitter Lesson Manifesto</h3>
                <div className="space-y-3 text-base">
                  <p>
                    <strong>1. Search and Learning Beat Expertise</strong> <br />
                    General algorithms that search through possibilities and learn from outcomes consistently outperform systems built on human-designed domain knowledge.
                  </p>
                  <p>
                    <strong>2. Compute is the Limiting Factor</strong> <br />
                    The primary constraint is computational power, not algorithmic cleverness. As compute increases, general methods scale better than specialized ones.
                  </p>
                  <p>
                    <strong>3. Future Progress Depends on Compute</strong> <br />
                    The path to superhuman AI lies not in better algorithms but in better hardware and the ability to leverage it through general search and learning.
                  </p>
                </div>
              </div>

              <p>
                This lesson has been validated repeatedly. AlphaGo Zero, trained purely through self-play with no human knowledge, discovered strategies that violated decades of Go wisdom. GPT models, trained on raw text with no linguistic structure, developed language understanding that rivals human experts. The pattern is clear: give a general algorithm enough compute and data, and it will find solutions that humans never imagined.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Perfect vs Imperfect Information */}
      <section className="py-24 md:py-32 bg-gray-50">
        <div className="container">
          <div className="max-w-4xl space-y-8">
            <div>
              <h2 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
                Perfect vs. Imperfect Information Paradigms
              </h2>
              <div className="h-2 w-24 bg-[#FF6B35]" />
            </div>

            <div className="space-y-6 text-lg leading-relaxed text-gray-800">
              <p>
                While the Bitter Lesson applies broadly, the specific algorithms that work best depend critically on the information structure of the domain. We can divide strategic domains into two categories:
              </p>

              {/* Perfect Information */}
              <div className="bg-white border-2 border-black p-6 space-y-4">
                <h3 className="font-bold text-2xl">Perfect Information Domains</h3>
                <p className="text-base">
                  All players know all relevant facts. Examples: Chess, Go, Checkers, Video Games.
                </p>
                <div className="space-y-3 text-base">
                  <p>
                    <strong>Optimal Algorithm: MCTS + Deep Neural Networks</strong>
                  </p>
                  <p>
                    Monte Carlo Tree Search (MCTS) explores the game tree by simulating random playouts and backing up results. When combined with a deep neural network that learns to evaluate positions and suggest promising moves, this becomes incredibly powerful.
                  </p>
                  <p>
                    <strong>Example: AlphaZero</strong> <br />
                    Trained purely through self-play, AlphaZero achieved superhuman performance in chess, Go, and Shogi. It discovered strategies that violated centuries of human knowledge, proving that in perfect information domains, brute-force search combined with learned evaluation is unbeatable.
                  </p>
                </div>
              </div>

              {/* Imperfect Information */}
              <div className="bg-white border-2 border-black p-6 space-y-4">
                <h3 className="font-bold text-2xl">Imperfect Information Domains</h3>
                <p className="text-base">
                  Players don't observe all relevant information. Examples: Poker, Bridge, Negotiations, Real-world decision-making.
                </p>
                <div className="space-y-3 text-base">
                  <p>
                    <strong>Optimal Algorithm: CFR+ and Belief State Reasoning</strong>
                  </p>
                  <p>
                    Counterfactual Regret Minimization (CFR) is a fundamentally different approach. Instead of searching through a game tree, it computes the regret for not playing each action in each information set, then iteratively minimizes this regret.
                  </p>
                  <p>
                    <strong>Example: Pluribus and ReBeL</strong> <br />
                    Pluribus defeated world-class poker players by maintaining a public belief state (PBS) over possible game configurations and computing strategies robust against all possibilities. ReBeL extended this to nested sub-game solving, allowing real-time adaptation.
                  </p>

                  <div className="bg-orange-50 border-2 border-[#FF6B35] p-6 rounded mt-4">
                    <p className="font-bold mb-3">Real Poker Case: River All-In with KQ</p>
                    <p className="text-sm mb-2"><strong>Scenario:</strong> River (final street), 50BB pot. Villain triple-barrels all-in. Hero holds K♥Q♦ (top pair).</p>
                    <p className="text-sm mb-2"><strong>GTO Says:</strong> Call (Minimum Defense Frequency = 50% of calling range). KQ has ~45% equity.</p>
                    <p className="text-sm mb-2"><strong>Reality Says:</strong> Fold. Humans under-bluff the river by 40-50%, so Villain's actual range is 70% value.</p>
                    <p className="text-sm"><strong>AI Advantage:</strong> Pluribus computes belief states over all possible Villain ranges, then selects the action (call/fold) that maximizes expected value against the true distribution. This is why AI dominates: it doesn't rely on heuristics; it reasons about uncertainty.</p>
                  </div>
                  <p>
                    <strong>Example: DeepSeek-R1</strong> <br />
                    In the domain of language and reasoning, DeepSeek-R1 uses reasoning traces (similar to belief states) to explore multiple solution paths before committing to an answer. This mirrors the imperfect information paradigm: the model doesn't know which reasoning path is correct, so it explores multiple possibilities.
                  </p>
                </div>
              </div>

              <p>
                The key insight is that the algorithm must match the information structure. In perfect information domains, you can search deeply because you know everything. In imperfect information domains, you must reason about what you don't know, which requires different mathematical machinery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Micro-Strategy AI Reconstruction */}
      <section className="py-24 md:py-32">
        <div className="container">
          <div className="max-w-4xl space-y-8">
            <div>
              <h2 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
                Micro-Strategy: AI Reconstruction
              </h2>
              <div className="h-2 w-24 bg-[#FF6B35]" />
            </div>

            <div className="space-y-6 text-lg leading-relaxed text-gray-800">
              <p>
                Beyond the macro-level algorithm choice, modern AI systems also reconstruct the micro-level strategic decisions that humans make intuitively. In poker, for example, humans use rough heuristics; AI systems compute precise optimal strategies.
              </p>

              <div className="bg-gray-50 border-l-4 border-[#FF6B35] p-6 space-y-4">
                <h3 className="font-bold text-xl">Rule of 4-2 vs. Equity Sampling</h3>
                <p className="text-base">
                  <strong>Human Heuristic:</strong> The "Rule of 4-2" estimates winning probability by multiplying outs by 4 (on the flop) or 2 (on the turn). It's quick and reasonably accurate.
                </p>
                <p className="text-base">
                  <strong>AI Approach:</strong> Equity sampling using Beta distributions. AI systems compute the exact probability distribution of winning given the current hand and all possible opponent hands. This is far more precise than the Rule of 4-2.
                </p>
              </div>

              <div className="bg-orange-50 border-2 border-[#FF6B35] p-6 rounded mb-6">
                <p className="font-bold mb-2">Real Poker Case: Nut Straight All-In with T8s</p>
                <p className="text-sm mb-2"><strong>Scenario:</strong> Turn (4th street). Hero has T8s (nut straight on 4-5-6-7). 80BB remaining.</p>
                <p className="text-sm mb-2"><strong>Human Approach:</strong> Bet big to extract value from overpairs.</p>
                <p className="text-sm"><strong>AI Approach:</strong> Calculate exact geometric sizing (all-in = 4:1 pot odds) that forces KK/QQ into mathematically impossible decisions. This maximizes expected value by leveraging nut advantage.</p>
              </div>

              <div className="bg-gray-50 border-l-4 border-[#FF6B35] p-6 space-y-4">
                <h3 className="font-bold text-xl">MDF vs. ML-Optimized Defense</h3>
                <p className="text-base">
                  <strong>Human Heuristic:</strong> Minimum Defense Frequency (MDF) suggests defending at a frequency equal to 1/(bet size). It's a linear rule of thumb.
                </p>
                <p className="text-base">
                  <strong>AI Discovery:</strong> The "100-50-25 MIN Law" reveals that optimal defense frequency is non-linear. Against different bet sizes, the optimal defense frequency follows a different curve than MDF predicts. Machine learning discovered this by analyzing millions of game states.
                </p>
              </div>

              <p>
                These micro-strategic discoveries are profound because they show that even at the tactical level, human intuition, while useful, is suboptimal. AI systems don't just play better strategies—they've discovered that the strategic landscape is fundamentally different from what humans assumed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Insights */}
      <section className="py-24 md:py-32 bg-black text-white">
        <div className="container">
          <div className="max-w-4xl space-y-8">
            <h2 className="text-5xl md:text-6xl font-bold leading-tight">
              Key Insights
            </h2>
            <div className="h-2 w-24 bg-[#FF6B35]" />

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-3">1. Compute Trumps Expertise</h3>
                <p className="text-gray-300 leading-relaxed">
                  The Bitter Lesson teaches that general algorithms with sufficient compute consistently outperform human-designed domain expertise. This has profound implications for the future of AI.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-3">2. Algorithm Must Match Information Structure</h3>
                <p className="text-gray-300 leading-relaxed">
                  Perfect information domains benefit from search-based approaches (MCTS). Imperfect information domains require belief state reasoning (CFR+). Choosing the right algorithm is as important as having enough compute.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-3">3. AI Reconstructs Strategy from Scratch</h3>
                <p className="text-gray-300 leading-relaxed">
                  Modern AI systems don't just optimize human strategies—they reconstruct strategy from mathematical first principles. This often reveals that human intuition, while useful, is fundamentally suboptimal.
                </p>
              </div>
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
              onClick={() => navigate("/atlas/game-theory-evolution")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous: Game Theory Evolution
            </Button>
            <Button
              className="bg-black text-white hover:bg-gray-800"
              onClick={() => navigate("/atlas/decision-matrix")}
            >
              Next: Decision Matrix
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
