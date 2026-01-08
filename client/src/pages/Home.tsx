/**
 * Design Philosophy: Swiss Brutalism meets Digital Minimalism
 * Home Page - Main entry point with hero and navigation to Atlas
 */

import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center border-b-8 border-black">
        <div className="container">
          <div className="max-w-5xl space-y-8">
            <div className="space-y-6">
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold leading-tight">
                The Fusion Reactor Run by AI, the Grandmaster Beaten by a Novice, and the Flaw in Your Own Brain
              </h1>
            </div>

            <p className="text-2xl md:text-3xl text-gray-700 leading-relaxed max-w-3xl">
              An exploration of how artificial intelligence, game theory, and human cognition intersect at the frontier of strategic decision-making.
            </p>

            <div className="flex flex-col md:flex-row gap-4 pt-8">
              <Button
                size="lg"
                className="bg-black text-white hover:bg-gray-800 text-lg px-8 py-6"
                onClick={() => navigate("/atlas")}
              >
                Explore the Strategic Intelligence Atlas
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                className="bg-green-600 text-white hover:bg-green-700 text-lg px-8 py-6"
                onClick={() => navigate("/tools")}
              >
                Poker Decision Tools
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-black text-black hover:bg-black hover:text-white text-lg px-8 py-6"
                onClick={() => navigate("/research")}
              >
                View Research Case Studies
              </Button>
            </div>

            <div className="pt-12 text-sm font-mono text-gray-600">
              <p>Scroll to discover the intersection of mathematics, strategy, and AI</p>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-24 md:py-32 bg-gray-50">
        <div className="container">
          <div className="max-w-4xl space-y-8">
            <h2 className="text-5xl md:text-6xl font-bold leading-tight">
              What Is Strategic Intelligence?
            </h2>
            <div className="h-2 w-24 bg-black" />

            <div className="space-y-6 text-lg leading-relaxed text-gray-800">
              <p>
                Strategic intelligence is the art and science of making optimal decisions in complex, uncertain environments. It spans from the pure mathematics of probability theory to the practical realities of competitive advantage.
              </p>

              <p>
                This website traces a century-long journey: from Kolmogorov's 1933 probability axioms through Nash's game theory to modern AI systems that rival and exceed human strategic thinking. Each layer builds upon the previous, revealing how mathematical rigor, game-theoretic insights, and computational power converge to create superhuman decision-making systems.
              </p>

              <p>
                But there's a twist. As machines become more intelligent, we're simultaneously discovering that human intelligence—despite its brilliance—is riddled with predictable flaws. Understanding both the power of AI and the limits of human cognition is essential for navigating the future.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Four Pillars */}
      <section className="py-24 md:py-32">
        <div className="container">
          <h2 className="text-5xl md:text-6xl font-bold mb-16 leading-tight">
            The Four Pillars of Strategic Intelligence
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Pillar 1 */}
            <div className="border-2 border-black p-8 md:p-10 space-y-6 hover:shadow-lg transition-shadow">
              <div className="text-6xl font-bold" style={{ color: "#0066FF" }}>
                01
              </div>
              <h3 className="text-3xl font-bold">Mathematical Foundations</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                From Kolmogorov's probability axioms to Itô's stochastic calculus—the mathematical language of uncertainty that powers modern AI.
              </p>
              <Button
                variant="ghost"
                className="text-[#0066FF] font-mono text-sm p-0 hover:opacity-60"
                onClick={() => navigate("/atlas/mathematical-foundations")}
              >
                Learn more →
              </Button>
            </div>

            {/* Pillar 2 */}
            <div className="border-2 border-black p-8 md:p-10 space-y-6 hover:shadow-lg transition-shadow">
              <div className="text-6xl font-bold" style={{ color: "#6B46C1" }}>
                02
              </div>
              <h3 className="text-3xl font-bold">Game Theory Evolution</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Nash equilibrium, Harsanyi transformation, and the spectrum from GTO to exploitative strategies—how mathematics models competition.
              </p>
              <Button
                variant="ghost"
                className="text-[#6B46C1] font-mono text-sm p-0 hover:opacity-60"
                onClick={() => navigate("/atlas/game-theory-evolution")}
              >
                Learn more →
              </Button>
            </div>

            {/* Pillar 3 */}
            <div className="border-2 border-black p-8 md:p-10 space-y-6 hover:shadow-lg transition-shadow">
              <div className="text-6xl font-bold" style={{ color: "#FF6B35" }}>
                03
              </div>
              <h3 className="text-3xl font-bold">AI & Algorithm Analysis</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                AlphaZero, ReBeL, Pluribus, and DeepSeek-R1—how compute and search transcend human expertise across perfect and imperfect information domains.
              </p>
              <Button
                variant="ghost"
                className="text-[#FF6B35] font-mono text-sm p-0 hover:opacity-60"
                onClick={() => navigate("/atlas/ai-algorithm-analysis")}
              >
                Learn more →
              </Button>
            </div>

            {/* Pillar 4 */}
            <div className="border-2 border-black p-8 md:p-10 space-y-6 hover:shadow-lg transition-shadow">
              <div className="text-6xl font-bold" style={{ color: "#10B981" }}>
                04
              </div>
              <h3 className="text-3xl font-bold">Decision Matrix</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                A unified framework mapping environment types to optimal algorithms—your practical guide to strategic decision-making.
              </p>
              <Button
                variant="ghost"
                className="text-[#10B981] font-mono text-sm p-0 hover:opacity-60"
                onClick={() => navigate("/atlas/decision-matrix")}
              >
                Learn more →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* The Bitter Lesson */}
      <section className="py-24 md:py-32 bg-black text-white">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-5xl md:text-6xl font-bold leading-tight">
              The Bitter Lesson
            </h2>
            <div className="h-2 w-24 bg-white" />

            <blockquote className="text-2xl md:text-3xl leading-relaxed italic text-gray-300">
              "The biggest lesson that can be read from 70 years of AI research is that the general methods that leverage computation are ultimately the most effective, and by a large margin. The ultimate reason for this is Moore's law."
            </blockquote>

            <p className="text-lg leading-relaxed text-gray-400">
              — Richard Sutton, "The Bitter Lesson" (2019)
            </p>

            <p className="text-lg leading-relaxed text-gray-300 pt-8">
              Richard Sutton's insight rings true: in the long run, general-purpose search and learning algorithms powered by massive compute consistently outperform human-designed domain expertise. This website explores how this principle manifests across mathematics, strategy, and artificial intelligence—and what it means for the future of human decision-making.
            </p>

            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black mt-8"
              onClick={() => navigate("/atlas/ai-algorithm-analysis")}
            >
              Read the Full Analysis
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-white">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-5xl md:text-6xl font-bold leading-tight">
              Ready to Explore?
            </h2>
            <p className="text-xl text-gray-700">
              Dive into the Strategic Intelligence Atlas to understand how mathematics, strategy, and AI converge to shape the future.
            </p>

            <div className="flex flex-col md:flex-row gap-4 justify-center pt-8">
              <Button
                size="lg"
                className="bg-black text-white hover:bg-gray-800"
                onClick={() => navigate("/atlas")}
              >
                Start with the Atlas
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-black"
                onClick={() => navigate("/research")}
              >
                View Case Studies
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white border-t-8 border-gray-800 py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm font-mono">
              © 2026 AI & Strategic Decision-Making Research Showcase
            </p>
            <p className="text-sm font-mono text-gray-500">
              Exploring the intersection of artificial intelligence, game theory, and human cognition
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
