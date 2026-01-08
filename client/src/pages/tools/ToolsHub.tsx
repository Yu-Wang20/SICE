/**
 * Poker Decision Tools Hub
 * Main navigation page for all poker analysis tools
 */

import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calculator, TrendingUp, Target, GitBranch, BookOpen, Brain, Grid3X3, Zap } from "lucide-react";

const TOOLS = [
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
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="border-b-4 border-black">
        <div className="container py-6">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-5xl md:text-6xl font-bold">Poker Decision Tools</h1>
          <p className="text-xl text-gray-600 mt-2">
            Data-driven decision engines powered by game theory and AI research
          </p>
        </div>
      </header>

      <main className="container py-12">
        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            const colorMap: Record<string, { border: string; hover: string; icon: string }> = {
              blue: { border: 'border-blue-500', hover: 'hover:bg-blue-50', icon: 'text-blue-500' },
              green: { border: 'border-green-500', hover: 'hover:bg-green-50', icon: 'text-green-500' },
              yellow: { border: 'border-yellow-500', hover: 'hover:bg-yellow-50', icon: 'text-yellow-500' },
              orange: { border: 'border-orange-500', hover: 'hover:bg-orange-50', icon: 'text-orange-500' },
              purple: { border: 'border-purple-500', hover: 'hover:bg-purple-50', icon: 'text-purple-500' },
              red: { border: 'border-red-500', hover: 'hover:bg-red-50', icon: 'text-red-500' },
              indigo: { border: 'border-indigo-500', hover: 'hover:bg-indigo-50', icon: 'text-indigo-500' },
            };
            const colors = colorMap[tool.color] || colorMap.blue;

            return (
              <Card 
                key={tool.id}
                className={`border-2 cursor-pointer transition-all ${colors.border} ${colors.hover}`}
                onClick={() => navigate(tool.path)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <Icon className={`w-8 h-8 ${colors.icon}`} />
                    <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {tool.theory}
                    </span>
                  </div>
                  <CardTitle className="text-xl mt-3">{tool.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline" size="sm">
                    Open Tool →
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Research Map Link */}
        <Card className="border-4 border-black">
          <CardHeader>
            <div className="flex items-center gap-4">
              <BookOpen className="w-12 h-12" />
              <div>
                <CardTitle className="text-3xl">Research → Product Map</CardTitle>
                <CardDescription className="text-lg">
                  Explore how academic research connects to practical poker tools
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              From Kolmogorov's probability axioms (1933) to DeepSeek-R1 (2024), trace the intellectual lineage 
              that powers modern poker AI. Each research breakthrough is linked to a specific feature in our tools.
            </p>
            <Button 
              size="lg" 
              className="bg-black text-white hover:bg-gray-800"
              onClick={() => navigate("/research-map")}
            >
              Explore Research Map →
            </Button>
          </CardContent>
        </Card>

        {/* The Bitter Lesson */}
        <div className="mt-12 p-8 bg-black text-white rounded-lg">
          <h2 className="text-3xl font-bold mb-4">The Bitter Lesson</h2>
          <blockquote className="text-xl italic text-gray-300 mb-4">
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
      </main>
    </div>
  );
}
