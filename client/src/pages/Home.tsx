/**
 * Home Page - Bento Grid Layout with Training-First Design
 * Main focus: Get users into training immediately
 */

import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, Play, Target, Crosshair, 
  BookOpen, Layers, Zap, TrendingUp,
  Clock, Award, BarChart3
} from "lucide-react";
import BlurText from "@/components/effects/BlurText";
import FadeIn from "@/components/effects/FadeIn";
import { motion } from "motion/react";

// Tool cards data
const TOOL_CARDS = [
  {
    id: "analyze",
    title: "Analyze a Spot",
    description: "Get instant GTO recommendation for any poker situation",
    href: "/tools/spot-analyzer",
    icon: Crosshair,
    color: "emerald"
  },
  {
    id: "ranges",
    title: "Ranges",
    description: "Browse preflop ranges by position and stack depth",
    href: "/tools/strategy-library",
    icon: Layers,
    color: "blue"
  },
  {
    id: "trainer",
    title: "Trainer",
    description: "Practice decisions with instant feedback",
    href: "/tools/quiz",
    icon: Target,
    color: "purple"
  }
];

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Minimal Header for Home */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="font-bold text-xl text-emerald-600">
              SICE
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/atlas" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Research
              </Link>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => navigate("/tools")}
                className="text-sm"
              >
                All Tools
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Bento Grid */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Hero Section - Compact */}
        <FadeIn delay={0} duration={0.5}>
          <div className="text-center mb-8">
            <p className="text-sm text-gray-500 mb-2">Poker Decision Engine</p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              <BlurText 
                text="Train smarter, play better"
                delay={50}
                animateBy="words"
                direction="top"
                className="justify-center"
              />
            </h1>
          </div>
        </FadeIn>

        {/* Bento Grid - First Row */}
        <div className="grid grid-cols-12 gap-4 mb-4">
          {/* Main Card: Today's Training */}
          <FadeIn delay={0.1} duration={0.5} className="col-span-12 md:col-span-7">
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="h-full"
            >
              <Link href="/tools/quiz" className="block h-full">
                <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-8 h-full min-h-[280px] flex flex-col justify-between text-white cursor-pointer group shadow-lg hover:shadow-xl transition-shadow">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <Zap className="h-5 w-5" />
                      </div>
                      <span className="text-emerald-100 text-sm font-medium">Daily Training</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-3">
                      Today's 10 Hands
                    </h2>
                    <p className="text-emerald-100 text-lg max-w-md">
                      Build your poker instincts with daily decision practice. Track your progress and identify weak spots.
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center gap-6 text-sm text-emerald-100">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        ~5 min
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Award className="h-4 w-4" />
                        22 scenarios
                      </span>
                    </div>
                    <Button 
                      size="lg"
                      className="bg-white text-emerald-700 hover:bg-emerald-50 font-semibold group-hover:translate-x-1 transition-transform"
                    >
                      Start Training
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </Link>
            </motion.div>
          </FadeIn>

          {/* Secondary Card: Hand Simulator */}
          <FadeIn delay={0.2} duration={0.5} className="col-span-12 md:col-span-5">
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="h-full"
            >
              <Link href="/tools/hand-simulator" className="block h-full">
                <div className="bg-gray-900 rounded-2xl p-8 h-full min-h-[280px] flex flex-col justify-between text-white cursor-pointer group shadow-lg hover:shadow-xl transition-shadow">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                        <Play className="h-5 w-5" />
                      </div>
                      <span className="text-gray-400 text-sm font-medium">Interactive</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-3">
                      Hand Simulator
                    </h2>
                    <p className="text-gray-400">
                      Play out hands against AI opponents. See how different actions affect your EV.
                    </p>
                  </div>
                  <Button 
                    variant="outline"
                    className="w-fit border-gray-700 text-white hover:bg-gray-800 mt-4 group-hover:border-gray-500 transition-colors"
                  >
                    Play a Hand
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </Link>
            </motion.div>
          </FadeIn>
        </div>

        {/* Bento Grid - Second Row: Tool Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {TOOL_CARDS.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <FadeIn key={tool.id} delay={0.3 + index * 0.1} duration={0.5}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link href={tool.href} className="block">
                    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all cursor-pointer group h-full">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${
                        tool.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' :
                        tool.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {tool.description}
                      </p>
                      <div className="mt-4 flex items-center text-sm text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        Open tool <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </FadeIn>
            );
          })}
        </div>

        {/* Stats Row */}
        <FadeIn delay={0.6} duration={0.5}>
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">1M+</div>
                <div className="text-sm text-gray-500">Hands analyzed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">22</div>
                <div className="text-sm text-gray-500">Training scenarios</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">7+</div>
                <div className="text-sm text-gray-500">Decision tools</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">90+</div>
                <div className="text-sm text-gray-500">Years of theory</div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Research Section - Third Screen */}
        <FadeIn delay={0.7} duration={0.5}>
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Research & Theory</h2>
              <Link href="/atlas" className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/atlas/mathematical-foundations" className="block">
                <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer group">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 group-hover:text-emerald-600 transition-colors">
                        Mathematical Foundations
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Probability theory, martingales, and stochastic calculus
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
              <Link href="/atlas/game-theory-evolution" className="block">
                <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer group">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 group-hover:text-emerald-600 transition-colors">
                        Game Theory & GTO
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Nash equilibrium and exploitative strategies
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </FadeIn>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            SICE — Strategic Intelligence Content Engine
          </p>
        </footer>
      </main>
    </div>
  );
}
