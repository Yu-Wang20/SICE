/**
 * Design Philosophy: Swiss Brutalism meets Digital Minimalism
 * Atlas Hub - Main navigation and conceptual overview
 * Color: Neutral black/white with accent colors for each chapter
 */

import { useLocation } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChapterCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  icon: string;
  path: string;
  year?: string;
}

const chapters: ChapterCard[] = [
  {
    id: "math",
    title: "Mathematical Foundations",
    subtitle: "1933 - 1970s",
    description: "From Kolmogorov's probability axioms through Doob's martingale theory to Itô's stochastic calculus—the mathematical bedrock of decision-making under uncertainty.",
    color: "#0066FF",
    icon: "∫",
    path: "/atlas/mathematical-foundations",
    year: "1933",
  },
  {
    id: "game",
    title: "Game Theory Evolution",
    subtitle: "1950 - 2000s",
    description: "Nash equilibrium, Harsanyi transformation, and the spectrum from GTO to exploitative strategies—how mathematics models strategic interaction.",
    color: "#6B46C1",
    icon: "♟",
    path: "/atlas/game-theory-evolution",
    year: "1950",
  },
  {
    id: "ai",
    title: "AI & Algorithm Analysis",
    subtitle: "2010s - 2024+",
    description: "AlphaZero, ReBeL, Pluribus, and DeepSeek-R1—how compute and search transcend human expertise across perfect and imperfect information domains.",
    color: "#FF6B35",
    icon: "⚡",
    path: "/atlas/ai-algorithm-analysis",
    year: "2016",
  },
  {
    id: "decision",
    title: "Decision Matrix",
    subtitle: "Strategic Framework",
    description: "A unified decision-making matrix mapping environment types to optimal algorithms—your practical guide to choosing the right strategy.",
    color: "#10B981",
    icon: "⊞",
    path: "/atlas/decision-matrix",
  },
];

export default function AtlasHub() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="border-b-8 border-black py-12">
        <div className="container">
          <div className="max-w-4xl">
            <h1 className="text-7xl md:text-8xl font-bold leading-tight mb-6">
              Strategic Intelligence Atlas
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed max-w-3xl">
              A comprehensive knowledge system tracing the evolution from pure mathematical axioms through game theory to superhuman AI decision-making.
            </p>
          </div>
        </div>
      </header>

      {/* Timeline Introduction */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container">
          <div className="max-w-4xl">
            <h2 className="text-4xl font-bold mb-8">The Evolution of Strategic Intelligence</h2>
            <p className="text-lg text-gray-800 leading-relaxed mb-8">
              This atlas maps a century-long journey: from Kolmogorov's 1933 probability axioms to modern AI systems that rival and exceed human strategic thinking. Each chapter builds upon the previous, revealing how mathematical rigor, game-theoretic insights, and computational power converge to create superhuman decision-making systems.
            </p>
            <div className="flex gap-4 text-sm font-mono text-gray-600">
              <span>1933</span>
              <span>→</span>
              <span>1950</span>
              <span>→</span>
              <span>2016</span>
              <span>→</span>
              <span>2024+</span>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter Grid */}
      <section className="py-24 md:py-32">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {chapters.map((chapter, index) => (
              <div
                key={chapter.id}
                className="group cursor-pointer transition-all duration-300 hover:scale-105"
                onClick={() => navigate(chapter.path)}
              >
                {/* Card */}
                <div className="border-2 border-black p-8 md:p-10 h-full flex flex-col justify-between hover:shadow-lg transition-shadow">
                  {/* Top Section */}
                  <div>
                    {/* Icon & Number */}
                    <div className="flex items-baseline gap-4 mb-6">
                      <span
                        className="text-5xl font-bold opacity-20"
                        style={{ color: chapter.color }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-4xl">{chapter.icon}</span>
                    </div>

                    {/* Title & Subtitle */}
                    <h3 className="text-3xl md:text-4xl font-bold mb-2 leading-tight">
                      {chapter.title}
                    </h3>
                    <p
                      className="text-sm font-mono mb-6"
                      style={{ color: chapter.color }}
                    >
                      {chapter.subtitle}
                    </p>

                    {/* Description */}
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                      {chapter.description}
                    </p>
                  </div>

                  {/* Bottom Section */}
                  <div className="mt-8 flex items-center gap-3 text-sm font-mono">
                    <span
                      className="w-2 h-2"
                      style={{ backgroundColor: chapter.color }}
                    />
                    <span>Explore Chapter</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Thesis */}
      <section className="py-24 md:py-32 bg-black text-white">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-5xl md:text-6xl font-bold leading-tight">
              The Bitter Lesson
            </h2>
            <div className="h-2 w-24 bg-white mx-auto" />
            <p className="text-xl md:text-2xl leading-relaxed text-gray-300">
              Richard Sutton's insight rings true: in the long run, general-purpose search and learning algorithms powered by massive compute consistently outperform human-designed domain expertise. This atlas traces how this principle manifests across mathematics, strategy, and artificial intelligence.
            </p>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black text-lg px-8 py-6 mt-8"
              onClick={() => navigate("/atlas/ai-algorithm-analysis")}
            >
              Read the Full Analysis
            </Button>
          </div>
        </div>
      </section>

      {/* Navigation Footer */}
      <section className="py-16 bg-white border-t-8 border-black">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <p className="text-sm font-mono text-gray-600 mb-2">Ready to explore?</p>
              <p className="text-lg font-bold">Start with Chapter 1 or jump to any chapter below.</p>
            </div>
            <div className="flex gap-4 flex-wrap justify-end">
              {chapters.map((chapter) => (
                <Button
                  key={chapter.id}
                  variant="outline"
                  className="border-2 border-black text-black hover:bg-black hover:text-white transition-all"
                  onClick={() => navigate(chapter.path)}
                >
                  {chapter.title.split(" ")[0]}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
