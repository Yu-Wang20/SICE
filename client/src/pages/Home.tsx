/**
 * Home Page - Three-Entry-Point Hub with Quick Spot Bar
 * Design: Minimize Time-to-First-Value (10 seconds to actionable insight)
 * P0-1 Redesign: Focus on poker tools as primary entry, research as secondary
 */

import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { 
  ArrowRight, Play, Zap, Target, Brain, Lightbulb,
  ChevronDown, Copy, Share2
} from "lucide-react";
import Navigation from "@/components/Navigation";
import TextFX from "@/components/effects/TextFX";
import CountUp from "@/components/effects/CountUp";

// Three main entry points
const ENTRY_POINTS = [
  {
    id: "analyze",
    title: "Analyze a Spot",
    description: "Get instant GTO recommendation for your poker situation",
    icon: Target,
    color: "bg-emerald-600",
    href: "/tools/spot-analyzer",
    cta: "Start Analyzing",
    subtitle: "Real-time decision support"
  },
  {
    id: "train",
    title: "Start Training",
    description: "Master decision-making with 22+ scenarios and instant feedback",
    icon: Brain,
    color: "bg-blue-600",
    href: "/trainer",
    cta: "Begin Training",
    subtitle: "Build muscle memory"
  },
  {
    id: "ranges",
    title: "Open Ranges",
    description: "Browse preflop ranges by position, stack depth, and situation",
    icon: Lightbulb,
    color: "bg-purple-600",
    href: "/tools/strategy-library",
    cta: "View Ranges",
    subtitle: "GTO reference"
  }
];

// Quick Spot Bar component
function QuickSpotBar() {
  const [, navigate] = useLocation();
  const [position, setPosition] = useState("BTN");
  const [stacks, setStacks] = useState("30");
  const [action, setAction] = useState("open");
  const [opponent, setOpponent] = useState("balanced");

  const handleQuickAnalyze = () => {
    // Navigate with preset parameters
    navigate(`/tools/spot-analyzer?position=${position}&stacks=${stacks}&action=${action}&opponent=${opponent}`);
  };

  return (
    <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-6 border border-emerald-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Zap className="h-4 w-4 text-emerald-600" />
          Quick Spot Analysis
        </h3>
        <span className="text-xs text-emerald-600 font-medium">Fill 3 fields → Get recommendation</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {/* Position */}
        <div>
          <label className="text-xs font-medium text-gray-700 block mb-1">Position</label>
          <select 
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="UTG">UTG</option>
            <option value="CO">CO</option>
            <option value="BTN">BTN</option>
            <option value="SB">SB</option>
            <option value="BB">BB</option>
          </select>
        </div>

        {/* Stack Depth */}
        <div>
          <label className="text-xs font-medium text-gray-700 block mb-1">Stack (BB)</label>
          <input 
            type="number"
            value={stacks}
            onChange={(e) => setStacks(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="30"
            min="5"
            max="200"
          />
        </div>

        {/* Action Line */}
        <div>
          <label className="text-xs font-medium text-gray-700 block mb-1">Action</label>
          <select 
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="open">Open</option>
            <option value="vs3bet">vs 3-Bet</option>
            <option value="postflop">Postflop</option>
            <option value="allin">All-In</option>
          </select>
        </div>

        {/* Opponent Type */}
        <div>
          <label className="text-xs font-medium text-gray-700 block mb-1">Opponent</label>
          <select 
            value={opponent}
            onChange={(e) => setOpponent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="balanced">Balanced</option>
            <option value="tight">Tight</option>
            <option value="loose">Loose</option>
            <option value="aggressive">Aggressive</option>
          </select>
        </div>
      </div>

      <Button
        onClick={handleQuickAnalyze}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
      >
        <Zap className="h-4 w-4 mr-2" />
        Analyze Now (10 sec)
      </Button>
    </div>
  );
}

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section - Three Entry Points */}
      <section className="pt-16 pb-12 md:pt-24 md:pb-16 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium mb-4">
              <Zap className="h-3.5 w-3.5" />
              Poker Decision Engine
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 mb-4">
              <TextFX variant="hero" effect="auto">
                Strategic Decision-Making in 10 Seconds
              </TextFX>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get instant GTO recommendations, train your instincts, or reference optimal ranges. No fluff, just actionable insights.
            </p>
          </div>

          {/* Three Entry Points Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {ENTRY_POINTS.map((entry) => {
              const Icon = entry.icon;
              return (
                <div
                  key={entry.id}
                  className="group relative bg-white rounded-xl border-2 border-gray-200 p-8 hover:border-emerald-300 hover:shadow-lg transition-all duration-200 cursor-pointer"
                  onClick={() => navigate(entry.href)}
                >
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl ${entry.color} bg-opacity-10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`h-7 w-7 ${entry.color.replace('bg-', 'text-')}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {entry.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {entry.description}
                  </p>
                  <p className="text-xs text-gray-500 font-medium mb-6">
                    {entry.subtitle}
                  </p>

                  {/* CTA */}
                  <Button
                    className={`w-full ${entry.color} hover:opacity-90 text-white`}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(entry.href);
                    }}
                  >
                    {entry.cta}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              );
            })}
          </div>

          {/* Quick Spot Bar */}
          <QuickSpotBar />
        </div>
      </section>

      {/* Key Stats Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-emerald-600">
                <CountUp end={7} duration={1500} suffix="+" />
              </div>
              <div className="text-sm text-gray-600 mt-1">Decision Tools</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-purple-600">
                <CountUp end={1} duration={2000} suffix="M" />
              </div>
              <div className="text-sm text-gray-600 mt-1">Hands Analyzed</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600">
                <CountUp end={22} duration={1800} suffix="+" />
              </div>
              <div className="text-sm text-gray-600 mt-1">Training Scenarios</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-orange-600">
                <CountUp end={90} duration={2200} suffix="+" />
              </div>
              <div className="text-sm text-gray-600 mt-1">Years of Theory</div>
            </div>
          </div>
        </div>
      </section>

      {/* Research Section - Secondary */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Backed by Research
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From Kolmogorov's probability axioms to modern AI—understand the theory behind every recommendation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mathematical Foundations */}
            <div className="group p-8 rounded-2xl border border-gray-200 hover:border-emerald-300 hover:shadow-lg transition-all bg-white">
              <div className="flex items-start gap-6">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Mathematical Foundations</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    Probability theory, martingale convergence, and stochastic calculus—the mathematical bedrock of optimal decision-making.
                  </p>
                  <Button variant="ghost" className="text-emerald-600 p-0 h-auto font-medium group-hover:translate-x-1 transition-transform">
                    Read Article →
                  </Button>
                </div>
                <div className="hidden md:block w-32 h-32 flex-shrink-0">
                  <img 
                    src="/illustrations/thinking.svg" 
                    alt="Thinking illustration" 
                    className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>
            </div>

            {/* Game Theory & GTO */}
            <div className="group p-8 rounded-2xl border border-gray-200 hover:border-emerald-300 hover:shadow-lg transition-all bg-white">
              <div className="flex items-start gap-6">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Game Theory & GTO</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    Nash equilibrium, Harsanyi transformation, and exploitative strategies—the science of strategic interaction.
                  </p>
                  <Button variant="ghost" className="text-emerald-600 p-0 h-auto font-medium group-hover:translate-x-1 transition-transform">
                    Read Article →
                  </Button>
                </div>
                <div className="hidden md:block w-32 h-32 flex-shrink-0">
                  <img 
                    src="/illustrations/dancing.svg" 
                    alt="Interaction illustration" 
                    className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>
            </div>

            {/* AI & Algorithms */}
            <div className="group p-8 rounded-2xl border border-gray-200 hover:border-emerald-300 hover:shadow-lg transition-all bg-white">
              <div className="flex items-start gap-6">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">AI & Algorithms</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    AlphaZero, ReBeL, Pluribus, and the future of strategic AI—where human intuition meets machine precision.
                  </p>
                  <Button variant="ghost" className="text-emerald-600 p-0 h-auto font-medium group-hover:translate-x-1 transition-transform">
                    Read Article →
                  </Button>
                </div>
                <div className="hidden md:block w-32 h-32 flex-shrink-0">
                  <img 
                    src="/illustrations/selfie.svg" 
                    alt="Technology illustration" 
                    className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>
            </div>

            {/* Decision Framework */}
            <div className="group p-8 rounded-2xl border border-gray-200 hover:border-emerald-300 hover:shadow-lg transition-all bg-white">
              <div className="flex items-start gap-6">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Decision Framework</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    Map your environment to the optimal algorithm for maximum edge—a practical guide to strategic thinking.
                  </p>
                  <Button variant="ghost" className="text-emerald-600 p-0 h-auto font-medium group-hover:translate-x-1 transition-transform">
                    Read Article →
                  </Button>
                </div>
                <div className="hidden md:block w-32 h-32 flex-shrink-0">
                  <img 
                    src="/illustrations/reading.svg" 
                    alt="Reading illustration" 
                    className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-16 md:py-24 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Improve Your Game?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Start with Analyze a Spot to see instant GTO recommendations, then progress to training and deeper study.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => navigate("/tools/spot-analyzer")}
            >
              <Target className="h-4 w-4 mr-2" />
              Analyze a Spot
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-gray-900"
              onClick={() => navigate("/trainer")}
            >
              <Brain className="h-4 w-4 mr-2" />
              Start Training
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
