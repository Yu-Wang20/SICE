/**
 * Home Page - OpenAI-inspired Clean Design with Animations
 * Features: BlurText, FadeIn animations, elegant typography, generous whitespace
 */

import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import BlurText from "@/components/effects/BlurText";
import FadeIn from "@/components/effects/FadeIn";
import CountUp from "@/components/effects/CountUp";

// Research articles data
const RESEARCH_ARTICLES = [
  {
    id: "mathematical-foundations",
    title: "Mathematical Foundations",
    description: "Probability theory, martingale convergence, and stochastic calculus—the mathematical bedrock of optimal decision-making.",
    href: "/atlas/mathematical-foundations",
    date: "1933 - 1970s"
  },
  {
    id: "game-theory-evolution",
    title: "Game Theory & GTO",
    description: "Nash equilibrium, Harsanyi transformation, and exploitative strategies—the science of strategic interaction.",
    href: "/atlas/game-theory-evolution",
    date: "1944 - 2000s"
  },
  {
    id: "ai-algorithm-analysis",
    title: "AI & Algorithms",
    description: "AlphaZero, ReBeL, Pluribus, and the future of strategic AI—where human intuition meets machine precision.",
    href: "/atlas/ai-algorithm-analysis",
    date: "2017 - Present"
  },
  {
    id: "decision-matrix",
    title: "Decision Framework",
    description: "Map your environment to the optimal algorithm for maximum edge—a practical guide to strategic thinking.",
    href: "/atlas/decision-matrix",
    date: "Applied Theory"
  }
];

// Tools data
const TOOLS = [
  {
    step: "Step 1",
    title: "Analyze a Spot",
    description: "Get instant GTO recommendation for your poker situation with real-time decision support.",
    href: "/tools/spot-analyzer"
  },
  {
    step: "Step 2",
    title: "Train Your Instincts",
    description: "Master decision-making with 22+ scenarios and instant feedback to build muscle memory.",
    href: "/tools/quiz"
  },
  {
    step: "Step 3",
    title: "Reference Ranges",
    description: "Browse preflop ranges by position, stack depth, and situation for GTO reference.",
    href: "/tools/strategy-library"
  }
];

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section - OpenAI Style */}
      <section className="pt-32 pb-20 md:pt-44 md:pb-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          {/* Date/Category Tag */}
          <FadeIn delay={0} duration={0.5}>
            <p className="text-sm text-gray-500 mb-8 tracking-wide">
              Poker Decision Engine
            </p>
          </FadeIn>
          
          {/* Main Title with BlurText Animation */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-normal leading-[1.1] text-gray-900 mb-10">
            <BlurText 
              text="Introducing SICE"
              delay={80}
              animateBy="words"
              direction="top"
              className="justify-center"
            />
          </h1>

          {/* CTA Buttons */}
          <FadeIn delay={0.4} duration={0.6}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate("/tools/spot-analyzer")}
                className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-6 text-base rounded-full transition-all hover:scale-[1.02]"
              >
                Try SICE
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/atlas")}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-6 text-base rounded-full transition-all hover:scale-[1.02]"
              >
                Read Research
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-16 md:py-24 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn delay={0.1} duration={0.7}>
            <div className="space-y-8">
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                We've built a decision engine called SICE which provides instant GTO recommendations for poker situations. The system makes it possible for players to get real-time analysis, train their instincts, and reference optimal ranges.
              </p>
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                SICE is powered by analysis of over 1 million hands, combining probability theory, game theory, and modern AI algorithms to deliver actionable insights in under 10 seconds.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Three Tools Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-200 rounded-2xl overflow-hidden shadow-sm">
            {TOOLS.map((tool, index) => (
              <FadeIn key={tool.step} delay={0.1 * index} duration={0.5}>
                <Link href={tool.href} className="block h-full">
                  <div className="bg-white p-8 md:p-10 hover:bg-gray-50 transition-all h-full cursor-pointer group">
                    <div className="text-sm text-gray-400 mb-4 font-medium">{tool.step}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-[15px]">
                      {tool.description}
                    </p>
                    <div className="mt-6 flex items-center text-sm text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      Get started <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Research Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-6">
          <FadeIn delay={0} duration={0.5}>
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-2xl font-semibold text-gray-900">Research</h2>
              <Link href="/atlas" className="text-sm text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1">
                View all research <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {RESEARCH_ARTICLES.map((article, index) => (
              <FadeIn key={article.id} delay={0.1 * index} duration={0.5}>
                <Link href={article.href} className="block group">
                  <article className="border-t border-gray-200 pt-6 hover:border-gray-400 transition-colors">
                    <div className="text-sm text-gray-400 mb-3 font-medium">{article.date}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-[15px]">
                      {article.description}
                    </p>
                  </article>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 md:py-28 bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-6">
          <FadeIn delay={0} duration={0.6}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-light mb-2">
                  <CountUp end={7} duration={1500} suffix="+" />
                </div>
                <div className="text-sm text-gray-400">Decision Tools</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-light mb-2">
                  <CountUp end={1} duration={2000} suffix="M" />
                </div>
                <div className="text-sm text-gray-400">Hands Analyzed</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-light mb-2">
                  <CountUp end={22} duration={1800} suffix="+" />
                </div>
                <div className="text-sm text-gray-400">Training Scenarios</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-light mb-2">
                  <CountUp end={90} duration={2200} suffix="+" />
                </div>
                <div className="text-sm text-gray-400">Years of Theory</div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn delay={0} duration={0.6}>
            <h2 className="text-3xl md:text-4xl font-serif font-normal text-gray-900 mb-6">
              Ready to improve your game?
            </h2>
            <p className="text-lg text-gray-600 mb-10">
              Start with Analyze a Spot to see instant GTO recommendations, then progress to training and deeper study.
            </p>
            <Button
              onClick={() => navigate("/tools/spot-analyzer")}
              className="bg-gray-900 hover:bg-gray-800 text-white px-10 py-6 text-base rounded-full transition-all hover:scale-[1.02]"
            >
              Get Started
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Tools</h4>
              <ul className="space-y-3 text-gray-500">
                <li><Link href="/tools/spot-analyzer" className="hover:text-gray-900 transition-colors">Analyze a Spot</Link></li>
                <li><Link href="/tools/quiz" className="hover:text-gray-900 transition-colors">Trainer</Link></li>
                <li><Link href="/tools/strategy-library" className="hover:text-gray-900 transition-colors">Ranges</Link></li>
                <li><Link href="/tools/hand-simulator" className="hover:text-gray-900 transition-colors">Hand Simulator</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Research</h4>
              <ul className="space-y-3 text-gray-500">
                <li><Link href="/atlas" className="hover:text-gray-900 transition-colors">Atlas</Link></li>
                <li><Link href="/atlas/mathematical-foundations" className="hover:text-gray-900 transition-colors">Math Foundations</Link></li>
                <li><Link href="/atlas/game-theory-evolution" className="hover:text-gray-900 transition-colors">Game Theory</Link></li>
                <li><Link href="/atlas/ai-algorithm-analysis" className="hover:text-gray-900 transition-colors">AI & Algorithms</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Resources</h4>
              <ul className="space-y-3 text-gray-500">
                <li><Link href="/research" className="hover:text-gray-900 transition-colors">Case Studies</Link></li>
                <li><Link href="/research-map" className="hover:text-gray-900 transition-colors">About</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">SICE</h4>
              <p className="text-gray-500 leading-relaxed">
                Strategic Intelligence Content Engine for poker decision-making.
              </p>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-gray-100 text-center text-sm text-gray-400">
            © 2024 SICE. Built with research from 90+ years of game theory.
          </div>
        </div>
      </footer>
    </div>
  );
}
