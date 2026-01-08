/**
 * Home Page - Product-style landing with clear value proposition
 * Design: Clean, professional, action-oriented
 */

import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, Play, Target, CheckCircle2,
  Calculator, Sigma, Gamepad2, Brain, Grid3X3,
  Clock, Zap, TrendingUp
} from "lucide-react";
import Navigation from "@/components/Navigation";

// Pillar data with icons and metadata
const PILLARS = [
  {
    id: 1,
    title: "Mathematical Foundations",
    description: "Probability axioms, martingale theory, and stochastic calculus—the mathematical language of uncertainty.",
    href: "/atlas/mathematical-foundations",
    color: "#0066FF",
    bgColor: "bg-blue-50",
    icon: Sigma,
    readTime: "15 min",
    tools: ["Probability Calculator"],
    example: "Kolmogorov's 1933 axioms"
  },
  {
    id: 2,
    title: "Game Theory Evolution",
    description: "Nash equilibrium, Harsanyi transformation, GTO vs exploitative strategies.",
    href: "/atlas/game-theory-evolution",
    color: "#6B46C1",
    bgColor: "bg-purple-50",
    icon: Gamepad2,
    readTime: "20 min",
    tools: ["GTO Analyzer", "Strategy Library"],
    example: "Mixed strategy equilibria"
  },
  {
    id: 3,
    title: "AI & Algorithm Analysis",
    description: "AlphaZero, ReBeL, Pluribus—how compute transcends human expertise.",
    href: "/atlas/ai-algorithm-analysis",
    color: "#FF6B35",
    bgColor: "bg-orange-50",
    icon: Brain,
    readTime: "25 min",
    tools: ["EV Calculator", "Decision Trainer"],
    example: "The Bitter Lesson in action"
  },
  {
    id: 4,
    title: "Decision Matrix",
    description: "A unified framework mapping environments to optimal algorithms.",
    href: "/atlas/decision-matrix",
    color: "#10B981",
    bgColor: "bg-emerald-50",
    icon: Grid3X3,
    readTime: "10 min",
    tools: ["Interactive Matrix"],
    example: "When to use CFR vs MCTS"
  }
];

// Key features for hero
const KEY_FEATURES = [
  { icon: Calculator, text: "Decision matrix for algorithm selection" },
  { icon: Target, text: "Poker spot analyzer with GTO baselines" },
  { icon: TrendingUp, text: "Training drills with instant feedback" }
];

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section - Product Promise */}
      <section className="pt-16 pb-20 md:pt-24 md:pb-28 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Value Proposition */}
            <div className="space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                <Zap className="h-3.5 w-3.5" />
                Research + Tools
              </div>

              {/* H1: What we provide */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                Strategic Decision-Making Toolkit
              </h1>

              {/* Subhead: Use cases */}
              <p className="text-xl text-gray-600 leading-relaxed">
                Master optimal decision-making for <span className="text-emerald-600 font-medium">poker</span>, 
                {" "}<span className="text-purple-600 font-medium">negotiations</span>, 
                {" "}<span className="text-blue-600 font-medium">auctions</span>, and 
                {" "}<span className="text-orange-600 font-medium">competitive strategy</span>.
              </p>

              {/* 3 Bullets: What you get */}
              <ul className="space-y-3 pt-2">
                {KEY_FEATURES.map((feature, i) => {
                  const Icon = feature.icon;
                  return (
                    <li key={i} className="flex items-center gap-3 text-gray-700">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Icon className="h-4 w-4 text-gray-600" />
                      </div>
                      <span>{feature.text}</span>
                    </li>
                  );
                })}
              </ul>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6"
                  onClick={() => navigate("/atlas")}
                >
                  Start with Atlas
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-300 hover:bg-gray-50"
                  onClick={() => navigate("/tools/ev-calculator")}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Try Poker Tool
                </Button>
              </div>
            </div>

            {/* Right: Quick Stats / Visual */}
            <div className="hidden lg:block">
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4">
                    <div className="text-4xl font-bold text-emerald-600">7+</div>
                    <div className="text-sm text-gray-600 mt-1">Decision Tools</div>
                  </div>
                  <div className="text-center p-4">
                    <div className="text-4xl font-bold text-purple-600">1M</div>
                    <div className="text-sm text-gray-600 mt-1">Hands Analyzed</div>
                  </div>
                  <div className="text-center p-4">
                    <div className="text-4xl font-bold text-blue-600">4</div>
                    <div className="text-sm text-gray-600 mt-1">Knowledge Pillars</div>
                  </div>
                  <div className="text-center p-4">
                    <div className="text-4xl font-bold text-orange-600">90+</div>
                    <div className="text-sm text-gray-600 mt-1">Years of Theory</div>
                  </div>
                </div>
                
                {/* Mini preview */}
                <div className="mt-6 p-4 bg-white rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Quick EV Check</span>
                    <span className="text-xs text-emerald-600 font-medium">+50.25 BB</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full">
                      <div className="h-full w-1/4 bg-red-400 rounded-full" />
                    </div>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full">
                      <div className="h-full w-1/2 bg-yellow-400 rounded-full" />
                    </div>
                    <div className="flex-1 h-2 bg-emerald-500 rounded-full" />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Fold</span>
                    <span>Call</span>
                    <span className="text-emerald-600 font-medium">Raise ✓</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Four Pillars - Clickable Navigation Cards */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The Four Pillars of Strategic Intelligence
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A structured journey from mathematical foundations to practical AI applications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <Link
                  key={pillar.id}
                  href={pillar.href}
                  className="group block"
                >
                  <div className={`h-full p-6 md:p-8 rounded-xl border-2 border-gray-200 bg-white 
                    hover:border-gray-300 hover:shadow-lg transition-all duration-200
                    group-hover:translate-y-[-2px]`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div 
                        className={`w-12 h-12 rounded-xl ${pillar.bgColor} flex items-center justify-center`}
                      >
                        <Icon className="h-6 w-6" style={{ color: pillar.color }} />
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="h-3.5 w-3.5" />
                        {pillar.readTime}
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {pillar.description}
                    </p>

                    {/* Tools included */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {pillar.tools.map((tool) => (
                        <span 
                          key={tool}
                          className="px-2 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-600"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>

                    {/* Example & CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-sm text-gray-500">
                        e.g., {pillar.example}
                      </span>
                      <span 
                        className="text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all"
                        style={{ color: pillar.color }}
                      >
                        Explore
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tools Preview Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Decision Tools
            </h2>
            <p className="text-lg text-gray-600">
              Practical calculators and trainers powered by game theory
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "EV Calculator", desc: "Expected value analysis", href: "/tools/ev-calculator", icon: Calculator },
              { name: "Decision Training", desc: "Quiz with instant feedback", href: "/tools/quiz", icon: Target },
              { name: "Strategy Library", desc: "GTO preflop ranges", href: "/tools/strategy-library", icon: Grid3X3 },
              { name: "Hand Strength", desc: "Equity evolution", href: "/tools/hand-strength", icon: TrendingUp },
              { name: "Pot Odds", desc: "Breakeven calculations", href: "/tools/pot-odds", icon: Calculator },
              { name: "Push/Fold", desc: "Short stack trainer", href: "/tools/push-fold", icon: Zap },
            ].map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.name}
                  href={tool.href}
                  className="group flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-emerald-100 flex items-center justify-center transition-colors">
                    <Icon className="h-5 w-5 text-gray-600 group-hover:text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 group-hover:text-emerald-700">{tool.name}</div>
                    <div className="text-sm text-gray-500">{tool.desc}</div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Button
              variant="outline"
              onClick={() => navigate("/tools")}
              className="border-gray-300"
            >
              View All Tools
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* The Bitter Lesson - Quote Section */}
      <section className="py-16 md:py-24 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <blockquote className="text-2xl md:text-3xl leading-relaxed italic text-gray-300 mb-6">
            "The biggest lesson that can be read from 70 years of AI research is that the general methods that leverage computation are ultimately the most effective."
          </blockquote>
          <p className="text-gray-500 mb-8">
            — Richard Sutton, "The Bitter Lesson" (2019)
          </p>
          <Button
            variant="outline"
            className="border-white/30 text-white hover:bg-white hover:text-gray-900"
            onClick={() => navigate("/atlas/ai-algorithm-analysis")}
          >
            Read the Full Analysis
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-emerald-600">SICE</span>
              <span className="text-gray-400">|</span>
              <span className="text-sm text-gray-500">Strategic Intelligence Content Engine</span>
            </div>
            <p className="text-sm text-gray-500">
              © 2026 AI & Strategic Decision-Making Research
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
