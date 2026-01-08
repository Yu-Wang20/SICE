/**
 * Poker Decision Tools Hub
 * Main navigation page for all poker analysis tools
 * Updated with Open Doodles illustrations (Pablo Stanley style)
 */

import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calculator, TrendingUp, Target, GitBranch, BookOpen, Brain, Grid3X3, Zap, Crosshair } from "lucide-react";
import Navigation from "@/components/Navigation";

// Tool illustrations mapping (Open Doodles style)
const TOOL_ILLUSTRATIONS: Record<string, string> = {
  'hand-strength': '/illustrations/thinking.svg',
  'pot-odds': '/illustrations/reading.svg',
  'ev-calculator': '/illustrations/groovy.svg',
  'push-fold': '/illustrations/dancing.svg',
  'position': '/illustrations/messy.svg',
  'quiz': '/illustrations/selfie.svg',
  'strategy-library': '/illustrations/reading.svg',
  'spot-analyzer': '/illustrations/thinking.svg',
};

const TOOLS = [
  {
    id: 'spot-analyzer',
    title: 'Spot Analyzer',
    description: 'Get instant GTO recommendations for any poker situation. Real-time analysis with confidence scoring.',
    icon: Crosshair,
    path: '/tools/spot-analyzer',
    color: 'emerald',
    theory: 'GTO + AI Analysis',
  },
  {
    id: 'hand-strength',
    title: 'Hand Strength Evolution',
    description: 'Query improvement probabilities based on your current hand strength. Uses conditional probability from Kolmogorov axioms.',
    icon: TrendingUp,
    path: '/tools/hand-strength',
    color: 'blue',
    theory: 'Kolmogorov Axioms (1933)',
  },
  {
    id: 'pot-odds',
    title: 'Pot Odds Decision Engine',
    description: 'Calculate breakeven equity and get call/fold recommendations. Applies Doob\'s martingale theory for EV tracking.',
    icon: Calculator,
    path: '/tools/pot-odds',
    color: 'green',
    theory: 'Doob\'s Martingale (1953)',
  },
  {
    id: 'ev-calculator',
    title: 'EV Calculator',
    description: 'Calculate expected value for fold/call/raise decisions. Compare EV across different actions with detailed analysis.',
    icon: Zap,
    path: '/tools/ev-calculator',
    color: 'yellow',
    theory: 'Expected Value Theory',
  },
  {
    id: 'push-fold',
    title: 'Push/Fold Trainer',
    description: 'Short stack decision engine based on Nash equilibrium ranges. Computed using CFR algorithm.',
    icon: Target,
    path: '/tools/push-fold',
    color: 'orange',
    theory: 'Nash Equilibrium + CFR',
  },
  {
    id: 'position',
    title: 'Position Simulator',
    description: 'Explore IP vs OOP decision trees with interactive visualization. Inspired by DeepStack and ReBeL.',
    icon: GitBranch,
    path: '/tools/position',
    color: 'purple',
    theory: 'Harsanyi + DeepStack/ReBeL',
  },
  {
    id: 'quiz',
    title: 'Decision Training',
    description: 'Test your poker decision-making skills with timed scenarios. Get instant feedback and track your progress.',
    icon: Brain,
    path: '/tools/quiz',
    color: 'red',
    theory: 'GTO + Exploitative Play',
  },
  {
    id: 'strategy-library',
    title: 'Strategy Library',
    description: 'GTO preflop ranges by position and strategic decision matrices. Download and study optimal play.',
    icon: Grid3X3,
    path: '/tools/strategy-library',
    color: 'indigo',
    theory: 'GTO Ranges + CFR+',
  },
];

export default function ToolsHub() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section with Open Doodles */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
                <Zap className="w-4 h-4" />
                8 Decision Tools
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Poker Decision Tools
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl">
                Data-driven decision engines powered by game theory and AI research. 
                From probability calculations to GTO ranges—everything you need to make optimal decisions.
              </p>
            </div>
            
            {/* Hero Illustration */}
            <div className="flex-shrink-0 w-64 h-64 lg:w-80 lg:h-80">
              <img 
                src="/illustrations/groovy.svg" 
                alt="Poker tools illustration" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Tools Grid with Illustrations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            const colorMap: Record<string, { bg: string; border: string; hover: string; icon: string; badge: string }> = {
              emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', hover: 'hover:border-emerald-400 hover:shadow-lg', icon: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700' },
              blue: { bg: 'bg-blue-50', border: 'border-blue-200', hover: 'hover:border-blue-400 hover:shadow-lg', icon: 'text-blue-600', badge: 'bg-blue-100 text-blue-700' },
              green: { bg: 'bg-green-50', border: 'border-green-200', hover: 'hover:border-green-400 hover:shadow-lg', icon: 'text-green-600', badge: 'bg-green-100 text-green-700' },
              yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', hover: 'hover:border-yellow-400 hover:shadow-lg', icon: 'text-yellow-600', badge: 'bg-yellow-100 text-yellow-700' },
              orange: { bg: 'bg-orange-50', border: 'border-orange-200', hover: 'hover:border-orange-400 hover:shadow-lg', icon: 'text-orange-600', badge: 'bg-orange-100 text-orange-700' },
              purple: { bg: 'bg-purple-50', border: 'border-purple-200', hover: 'hover:border-purple-400 hover:shadow-lg', icon: 'text-purple-600', badge: 'bg-purple-100 text-purple-700' },
              red: { bg: 'bg-red-50', border: 'border-red-200', hover: 'hover:border-red-400 hover:shadow-lg', icon: 'text-red-600', badge: 'bg-red-100 text-red-700' },
              indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', hover: 'hover:border-indigo-400 hover:shadow-lg', icon: 'text-indigo-600', badge: 'bg-indigo-100 text-indigo-700' },
            };
            const colors = colorMap[tool.color] || colorMap.blue;
            const illustration = TOOL_ILLUSTRATIONS[tool.id];

            return (
              <Card 
                key={tool.id}
                className={`border-2 cursor-pointer transition-all duration-200 ${colors.border} ${colors.hover} bg-white overflow-hidden group`}
                onClick={() => navigate(tool.path)}
              >
                {/* Illustration Header */}
                <div className={`h-32 ${colors.bg} flex items-center justify-center overflow-hidden`}>
                  {illustration ? (
                    <img 
                      src={illustration} 
                      alt={tool.title}
                      className="h-28 w-auto object-contain opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                    />
                  ) : (
                    <Icon className={`w-16 h-16 ${colors.icon} opacity-50`} />
                  )}
                </div>
                
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <Icon className={`w-6 h-6 ${colors.icon} flex-shrink-0`} />
                    <span className={`text-xs font-mono px-2 py-1 rounded ${colors.badge}`}>
                      {tool.theory}
                    </span>
                  </div>
                  <CardTitle className="text-lg mt-2">{tool.title}</CardTitle>
                  <CardDescription className="text-sm line-clamp-2">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button className="w-full" variant="outline" size="sm">
                    Open Tool →
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Research Map Link with Illustration */}
        <Card className="border-2 border-gray-200 bg-white overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 bg-gray-50 flex items-center justify-center p-8">
              <img 
                src="/illustrations/reading.svg" 
                alt="Research illustration"
                className="h-48 w-auto object-contain"
              />
            </div>
            <div className="md:w-2/3 p-8">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-8 h-8 text-gray-700" />
                <h2 className="text-2xl font-bold text-gray-900">Research → Product Map</h2>
              </div>
              <p className="text-gray-600 mb-6">
                From Kolmogorov's probability axioms (1933) to DeepSeek-R1 (2024), trace the intellectual lineage 
                that powers modern poker AI. Each research breakthrough is linked to a specific feature in our tools.
              </p>
              <Button 
                size="lg" 
                className="bg-emerald-600 text-white hover:bg-emerald-700"
                onClick={() => navigate("/research-map")}
              >
                Explore Research Map →
              </Button>
            </div>
          </div>
        </Card>

        {/* The Bitter Lesson with Illustration */}
        <div className="mt-12 bg-gray-900 text-white rounded-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-2/3 p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-4">The Bitter Lesson</h2>
              <blockquote className="text-xl italic text-gray-300 mb-4 border-l-4 border-emerald-500 pl-4">
                "The biggest lesson that can be read from 70 years of AI research is that general methods 
                that leverage computation are ultimately the most effective, and by a large margin."
              </blockquote>
              <p className="text-gray-400 mb-4">— Richard Sutton, 2019</p>
              <p className="text-gray-300">
                These tools demonstrate Sutton's insight: rather than encoding hand-crafted poker rules, 
                we use data-driven analysis and game-theoretic algorithms that scale with compute. 
                The database contains 1,000,000+ hand outcomes, enabling empirical probability calculations 
                that outperform human intuition.
              </p>
            </div>
            <div className="md:w-1/3 bg-gray-800 flex items-center justify-center p-8">
              <img 
                src="/illustrations/messy.svg" 
                alt="AI research illustration"
                className="h-48 w-auto object-contain opacity-80"
                style={{ filter: 'brightness(1.2) contrast(0.9)' }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
