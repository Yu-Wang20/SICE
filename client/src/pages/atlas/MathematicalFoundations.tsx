/**
 * Design Philosophy: Swiss Brutalism meets Digital Minimalism
 * Chapter 1: Mathematical Foundations
 * Color: Electric Blue (#0066FF)
 */

import { useLocation } from "wouter";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MathematicalFoundations() {
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
            <div className="text-8xl font-bold outline-text mb-6" style={{ color: "#0066FF" }}>
              01
            </div>
            <h1 className="text-6xl md:text-7xl font-bold leading-tight mb-4">
              Mathematical Foundations
            </h1>
            <p className="text-lg font-mono" style={{ color: "#0066FF" }}>
              1933 - 1970s: The Axiomatic Revolution
            </p>
          </div>
        </div>
      </header>

      {/* Intro Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container">
          <div className="max-w-4xl space-y-6">
            <blockquote className="text-2xl font-bold italic leading-relaxed border-l-4 border-[#0066FF] pl-8">
              "上帝不掷骰子，但他构建了骰子的规则。"
            </blockquote>
            <p className="text-lg text-gray-800 leading-relaxed">
              This chapter traces the mathematical revolution that transformed uncertainty from a philosophical puzzle into a rigorous scientific discipline. We begin with Kolmogorov's axiomatic framework, progress through Doob's theory of fair games, and culminate in Itô's stochastic calculus—the mathematical language that would later power modern AI's handling of uncertainty.
            </p>
          </div>
        </div>
      </section>

      {/* Section 1: Axiomatic Probability */}
      <section className="py-24 md:py-32">
        <div className="container">
          <div className="max-w-4xl space-y-8">
            <div>
              <h2 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
                Axiomatic Probability
              </h2>
              <div className="h-2 w-24 bg-[#0066FF]" />
            </div>

            <div className="space-y-6 text-lg leading-relaxed text-gray-800">
              <p>
                In 1933, <strong>Andrey Kolmogorov</strong> published his groundbreaking work establishing the axiomatic foundations of probability theory. Before this moment, probability was largely an empirical tool—a collection of heuristics used by gamblers and actuaries. After Kolmogorov, probability became a rigorous mathematical discipline grounded in measure theory.
              </p>

              <div className="bg-gray-50 border-l-4 border-[#0066FF] p-6 space-y-4">
                <h3 className="font-bold text-xl">Kolmogorov's Three Axioms</h3>
                <div className="space-y-3 font-mono text-base">
                  <div>
                    <strong>1. Non-negativity:</strong> P(A) ≥ 0 for all events A
                  </div>
                  <div>
                    <strong>2. Unitarity:</strong> P(Ω) = 1 for the sample space Ω
                  </div>
                  <div>
                    <strong>3. Countable Additivity:</strong> P(⋃ Aᵢ) = Σ P(Aᵢ) for disjoint events
                  </div>
                </div>
              </div>

              <p>
                These three simple axioms, grounded in measure theory, provided the foundation for all subsequent probability and statistics. More importantly, they established that probability is not about predicting the future with certainty—it's about quantifying our ignorance in a mathematically consistent way.
              </p>

              <p>
                This insight would prove crucial for AI. When modern machine learning systems handle uncertainty, they're ultimately implementing Kolmogorov's framework: assigning probabilities to events, computing conditional probabilities, and making decisions under incomplete information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Martingale Theory */}
      <section className="py-24 md:py-32 bg-gray-50">
        <div className="container">
          <div className="max-w-4xl space-y-8">
            <div>
              <h2 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
                Dynamics of Fair Games
              </h2>
              <div className="h-2 w-24 bg-[#0066FF]" />
            </div>

            <div className="space-y-6 text-lg leading-relaxed text-gray-800">
              <p>
                While Kolmogorov provided the static framework, <strong>Joseph Doob</strong> answered a dynamic question: how does a fair game evolve over time? His theory of <strong>martingales</strong> describes sequences of random variables where the expected future value equals the current value—the mathematical definition of fairness.
              </p>

              <div className="bg-white border-2 border-black p-6 space-y-4">
                <h3 className="font-bold text-xl">Martingale Property</h3>
                <p className="font-mono text-base">
                  E[Xₙ₊₁ | X₁, ..., Xₙ] = Xₙ
                </p>
                <p className="text-sm">
                  The expected value at the next step, given all past information, equals the current value. No strategy can beat a fair game.
                </p>
              </div>

              <p>
                This concept is fundamental to modern reinforcement learning. The "value function" in RL—which estimates the expected cumulative reward from a state—is essentially a martingale. When we train an AI agent, we're ensuring that its value estimates converge to a martingale, guaranteeing that the agent has learned a consistent evaluation of the world.
              </p>

              <p>
                Doob's theory also provides the mathematical foundation for understanding why certain strategies work and others fail. In a fair game, no amount of cleverness can generate positive expected value—you can only optimize your strategy relative to your opponent's weaknesses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Stochastic Calculus */}
      <section className="py-24 md:py-32">
        <div className="container">
          <div className="max-w-4xl space-y-8">
            <div>
              <h2 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
                Modeling Volatility
              </h2>
              <div className="h-2 w-24 bg-[#0066FF]" />
            </div>

            <div className="space-y-6 text-lg leading-relaxed text-gray-800">
              <p>
                The final piece of our mathematical foundation comes from <strong>Kiyosi Itô</strong>, who developed stochastic calculus—the calculus of randomness. His work, particularly <strong>Itô's Lemma</strong>, extended classical calculus to handle continuous random processes.
              </p>

              <div className="bg-gray-50 border-l-4 border-[#0066FF] p-6 space-y-4">
                <h3 className="font-bold text-xl">Itô's Lemma (Simplified)</h3>
                <p className="font-mono text-base">
                  For a function f(X) where X follows a stochastic differential equation:
                </p>
                <p className="font-mono text-base">
                  df = (∂f/∂x)dX + (1/2)(∂²f/∂x²)(dX)²
                </p>
                <p className="text-sm">
                  This accounts for the fact that in stochastic processes, (dX)² ≠ 0, unlike classical calculus.
                </p>
              </div>

              <p>
                Why does this matter for AI? Modern diffusion models—the technology behind image generation systems like DALL-E and Stable Diffusion—are built on stochastic differential equations. When these models gradually add noise to an image and then learn to reverse the process, they're using Itô's framework to model the continuous transformation of data through random perturbations.
              </p>

              <p>
                Moreover, Itô's Lemma provides the theoretical foundation for understanding how uncertainty propagates through complex systems. In finance, it's used to price options. In AI, it's used to understand how noise affects learning dynamics and to design more robust training procedures.
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
            <div className="h-2 w-24 bg-[#0066FF]" />

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-3">1. Uncertainty is Quantifiable</h3>
                <p className="text-gray-300 leading-relaxed">
                  Kolmogorov showed that randomness isn't chaos—it's a measurable, structured phenomenon that can be analyzed mathematically. This opened the door to AI systems that can reason about uncertainty.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-3">2. Fairness Has a Mathematical Definition</h3>
                <p className="text-gray-300 leading-relaxed">
                  Doob's martingales teach us that in a fair game, the best you can do is not lose. This principle underlies why certain AI strategies are optimal—they're fundamentally fair responses to the environment.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-3">3. Continuous Randomness Requires New Mathematics</h3>
                <p className="text-gray-300 leading-relaxed">
                  Itô's calculus revealed that randomness at continuous scales behaves differently from discrete randomness. This insight powers modern generative models and uncertainty quantification in deep learning.
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
              onClick={() => navigate("/atlas")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Atlas
            </Button>
            <Button
              className="bg-black text-white hover:bg-gray-800"
              onClick={() => navigate("/atlas/game-theory-evolution")}
            >
              Next: Game Theory Evolution
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
