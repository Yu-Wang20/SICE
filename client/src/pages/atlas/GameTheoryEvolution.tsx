/**
 * Design Philosophy: Swiss Brutalism meets Digital Minimalism
 * Chapter 2: Game Theory Evolution
 * Color: Deep Purple (#6B46C1)
 */

import { useLocation } from "wouter";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GameTheoryEvolution() {
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
            <div className="text-8xl font-bold outline-text mb-6" style={{ color: "#6B46C1" }}>
              02
            </div>
            <h1 className="text-6xl md:text-7xl font-bold leading-tight mb-4">
              Game Theory Evolution
            </h1>
            <p className="text-lg font-mono" style={{ color: "#6B46C1" }}>
              1950 - 2000s: Strategic Interaction
            </p>
          </div>
        </div>
      </header>

      {/* Intro Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container">
          <div className="max-w-4xl space-y-6">
            <blockquote className="text-2xl font-bold italic leading-relaxed border-l-4 border-[#6B46C1] pl-8">
              "不仅要计算牌局，还要计算对手眼中的牌局。"
            </blockquote>
            <p className="text-lg text-gray-800 leading-relaxed">
              While Kolmogorov and Doob provided the mathematical tools for understanding uncertainty and fairness, a new challenge emerged: how do we analyze situations where multiple rational agents compete with incomplete information? This chapter explores the evolution of game theory—from Nash's revolutionary equilibrium concept to Harsanyi's transformation that made imperfect information games solvable.
            </p>
          </div>
        </div>
      </section>

      {/* Section 1: Nash Equilibrium */}
      <section className="py-24 md:py-32">
        <div className="container">
          <div className="max-w-4xl space-y-8">
            <div>
              <h2 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
                Nash Equilibrium
              </h2>
              <div className="h-2 w-24 bg-[#6B46C1]" />
            </div>

            <div className="space-y-6 text-lg leading-relaxed text-gray-800">
              <p>
                In 1950, a Princeton graduate student named <strong>John Nash</strong> solved a problem that had vexed economists for a century. Traditional economic models assumed that competing firms made decisions as if their rivals' choices were fixed in stone. This made no sense—why would a rational competitor not adjust their strategy in response to what others were doing?
              </p>

              <p>
                Nash introduced the concept of <strong>noncooperative game theory</strong> and defined what became known as the <strong>Nash equilibrium</strong>: a state where each player's strategy is the best possible response to every other player's strategy. No player can improve their outcome by unilaterally changing their decision.
              </p>

              <div className="bg-gray-50 border-l-4 border-[#6B46C1] p-6 space-y-4">
                <h3 className="font-bold text-xl">Nash Equilibrium Definition</h3>
                <p className="text-base">
                  A strategy profile (s₁*, s₂*, ..., sₙ*) is a Nash equilibrium if for each player i:
                </p>
                <p className="font-mono text-base">
                  uᵢ(sᵢ*, s₋ᵢ*) ≥ uᵢ(sᵢ, s₋ᵢ*) for all sᵢ
                </p>
                <p className="text-sm">
                  No player can improve their utility by changing their strategy while others keep theirs fixed.
                </p>
              </div>

              <p>
                This concept revolutionized economics, political science, and biology. It provided a universal language for analyzing competition, cooperation, and conflict. More importantly, it established that in many situations, there exists a stable state where rational actors have no incentive to deviate—a mathematical anchor for understanding strategic behavior.
              </p>

              <p>
                For AI, Nash equilibrium is foundational. When we train game-playing AI systems, we're often searching for Nash equilibria. In perfect information games like chess or Go, there's typically a unique Nash equilibrium (or a set of equivalent ones). In imperfect information games like poker, finding the Nash equilibrium is far more complex—but it remains the theoretical ideal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Harsanyi Transformation */}
      <section className="py-24 md:py-32 bg-gray-50">
        <div className="container">
          <div className="max-w-4xl space-y-8">
            <div>
              <h2 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
                Harsanyi Transformation
              </h2>
              <div className="h-2 w-24 bg-[#6B46C1]" />
            </div>

            <div className="space-y-6 text-lg leading-relaxed text-gray-800">
              <p>
                Nash's equilibrium concept worked beautifully for games with perfect information—where all players know all relevant facts. But what about the real world, where information is hidden? How do you analyze a poker game where players don't know each other's cards? Or a negotiation where neither side knows the other's true reservation price?
              </p>

              <p>
                <strong>John Harsanyi</strong>, another game theory pioneer, solved this problem with an elegant mathematical trick. He showed that any game with incomplete information (where players don't know all the relevant facts) can be transformed into a game with imperfect information (where all facts are known, but players don't observe all moves).
              </p>

              <div className="bg-white border-2 border-black p-6 space-y-4">
                <h3 className="font-bold text-xl">The Harsanyi Transformation</h3>
                <div className="space-y-3 font-mono text-base">
                  <p>
                    <strong>Original Problem:</strong> Players have incomplete information about the game structure (e.g., don't know opponent's payoffs).
                  </p>
                  <p>
                    <strong>Solution:</strong> Introduce a "Nature" node at the start of the game that randomly determines each player's "type" according to a Bayesian prior.
                  </p>
                  <p>
                    <strong>Result:</strong> The game becomes one with imperfect information but complete knowledge of the structure—now solvable with standard game theory tools.
                  </p>
                </div>
              </div>

              <p>
                This transformation was revolutionary. It meant that any strategic situation with hidden information could be analyzed using the same mathematical framework. Without Harsanyi's insight, modern poker AI would be impossible—there would be no principled way to reason about opponents' unknown hands.
              </p>

              <p>
                Today, when AI systems play poker (like Libratus or Pluribus), they're implementing Harsanyi's framework. They maintain a probability distribution over possible opponent types (hand ranges), and they compute strategies that are robust against all possible opponent types weighted by their prior probability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Strategy Spectrum */}
      <section className="py-24 md:py-32">
        <div className="container">
          <div className="max-w-4xl space-y-8">
            <div>
              <h2 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
                The Strategy Spectrum
              </h2>
              <div className="h-2 w-24 bg-[#6B46C1]" />
            </div>

            <div className="space-y-6 text-lg leading-relaxed text-gray-800">
              <p>
                In practice, strategic decision-making rarely involves playing a pure Nash equilibrium. Instead, we operate along a spectrum, balancing between two extremes: defensive stability and aggressive exploitation.
              </p>

              {/* GTO */}
              <div className="bg-gray-50 border-l-4 border-[#6B46C1] p-6 space-y-3">
                <h3 className="font-bold text-2xl">GTO (Game Theory Optimal)</h3>
                <p className="text-base">
                  A strategy that cannot be exploited by any opponent strategy. It guarantees a minimum expected payoff regardless of what the opponent does.
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Advantage:</strong> Unbeatable in the long run. <br />
                  <strong>Disadvantage:</strong> May not maximize winnings against predictable opponents.
                </p>
              </div>

              {/* Exploitative */}
              <div className="bg-gray-50 border-l-4 border-[#6B46C1] p-6 space-y-3">
                <h3 className="font-bold text-2xl">Exploitative Strategy</h3>
                <p className="text-base">
                  A strategy that deliberately deviates from equilibrium to punish specific opponent weaknesses. It can generate higher expected value against flawed opponents but is vulnerable to counter-exploitation.
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Advantage:</strong> Maximizes winnings against predictable opponents. <br />
                  <strong>Disadvantage:</strong> Can be heavily exploited by sophisticated opponents.
                </p>
              </div>

              {/* RNR */}
              <div className="bg-gray-50 border-l-4 border-[#6B46C1] p-6 space-y-3">
                <h3 className="font-bold text-2xl">Restricted Nash Response (RNR)</h3>
                <p className="text-base">
                  A hybrid approach that maintains a safety margin (ensuring you can't be exploited too badly) while still exploiting opponent weaknesses within that margin.
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Advantage:</strong> Balances safety with profit. Optimal in most practical scenarios. <br />
                  <strong>Disadvantage:</strong> Requires accurate modeling of opponent tendencies.
                </p>
              </div>

              <p>
                The choice between these strategies depends on your knowledge of your opponent. Against an unknown opponent, GTO is safest. Against a known opponent with exploitable patterns, exploitative strategies can be more profitable. In practice, sophisticated agents use RNR—maintaining enough GTO-like behavior to avoid catastrophic exploitation while still punishing predictable mistakes.
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
            <div className="h-2 w-24 bg-[#6B46C1]" />

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-3">1. Strategic Stability Exists</h3>
                <p className="text-gray-300 leading-relaxed">
                  Nash equilibrium proved that in competitive situations, there exist stable states where no player wants to unilaterally deviate. This provides a theoretical anchor for understanding strategic behavior.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-3">2. Hidden Information is Tractable</h3>
                <p className="text-gray-300 leading-relaxed">
                  Harsanyi's transformation showed that games with hidden information can be analyzed using the same tools as games with complete information. This opened the door to analyzing real-world strategic situations.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-3">3. Strategy is Contextual</h3>
                <p className="text-gray-300 leading-relaxed">
                  The optimal strategy depends on your knowledge of your opponent. Against uncertainty, GTO is safest. Against known weaknesses, exploitation is more profitable. Sophisticated agents balance both.
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
              onClick={() => navigate("/atlas/mathematical-foundations")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous: Mathematical Foundations
            </Button>
            <Button
              className="bg-black text-white hover:bg-gray-800"
              onClick={() => navigate("/atlas/ai-algorithm-analysis")}
            >
              Next: AI & Algorithm Analysis
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
