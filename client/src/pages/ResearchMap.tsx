/**
 * Research → Product Map
 * Links academic research to practical poker tools
 */

import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ExternalLink, BookOpen, Lightbulb, Wrench } from "lucide-react";

const FEATURE_PATHS: Record<string, string> = {
  'hand-strength': '/tools/hand-strength',
  'pot-odds': '/tools/pot-odds',
  'push-fold': '/tools/push-fold',
  'position': '/tools/position',
  'research-map': '/research-map',
};

const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  'Mathematics': { bg: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-700' },
  'Game Theory': { bg: 'bg-purple-50', border: 'border-purple-500', text: 'text-purple-700' },
  'Behavioral Economics': { bg: 'bg-orange-50', border: 'border-orange-500', text: 'text-orange-700' },
  'AI/ML': { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-700' },
  'AI Philosophy': { bg: 'bg-gray-50', border: 'border-gray-500', text: 'text-gray-700' },
};

export default function ResearchMap() {
  const [, navigate] = useLocation();

  // Fetch research concepts from database
  const conceptsQuery = trpc.research.getConcepts.useQuery();

  // Group concepts by category
  const groupedConcepts = conceptsQuery.data?.reduce((acc, concept) => {
    const category = concept.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(concept);
    return acc;
  }, {} as Record<string, typeof conceptsQuery.data>);

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="border-b-4 border-black">
        <div className="container py-6">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate("/tools")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tools
          </Button>
          <h1 className="text-5xl md:text-6xl font-bold">Research → Product Map</h1>
          <p className="text-xl text-gray-600 mt-2">
            Tracing the intellectual lineage from academic breakthroughs to practical poker tools
          </p>
        </div>
      </header>

      <main className="container py-12">
        {/* Timeline Introduction */}
        <div className="mb-12 p-8 bg-gray-50 rounded-lg border-2 border-black">
          <h2 className="text-3xl font-bold mb-4">A Century of Strategic Intelligence</h2>
          <p className="text-lg text-gray-700 mb-4">
            This map traces the evolution of ideas from pure mathematics (1933) through game theory (1950s) 
            to modern AI systems (2020s). Each research breakthrough is linked to a specific feature in our 
            poker decision tools, demonstrating how academic insights translate into practical applications.
          </p>
          <div className="flex flex-wrap gap-4">
            {Object.entries(CATEGORY_COLORS).map(([category, colors]) => (
              <span 
                key={category}
                className={`px-3 py-1 rounded-full text-sm font-medium ${colors.bg} ${colors.text} border ${colors.border}`}
              >
                {category}
              </span>
            ))}
          </div>
        </div>

        {/* Research Concepts */}
        {conceptsQuery.isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-64 bg-gray-200 rounded-lg" />
              </div>
            ))}
          </div>
        ) : groupedConcepts ? (
          <div className="space-y-12">
            {Object.entries(groupedConcepts).map(([category, concepts]) => {
              const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS['AI Philosophy'];
              
              return (
                <section key={category}>
                  <h2 className={`text-3xl font-bold mb-6 ${colors.text}`}>{category}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {concepts?.map((concept) => (
                      <Card 
                        key={concept.id}
                        className={`border-2 ${colors.border} ${colors.bg}`}
                      >
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-xl">{concept.name}</CardTitle>
                              <CardDescription className="text-base">
                                {concept.author} ({concept.year})
                              </CardDescription>
                            </div>
                            <BookOpen className={`w-6 h-6 ${colors.text}`} />
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Description */}
                          <div>
                            <p className="text-gray-700">{concept.description}</p>
                          </div>

                          {/* Key Insight */}
                          {concept.keyInsight && (
                            <div className="p-3 bg-white rounded border">
                              <div className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1">
                                <Lightbulb className="w-4 h-4" />
                                Key Insight
                              </div>
                              <p className="text-sm">{concept.keyInsight}</p>
                            </div>
                          )}

                          {/* Linked Feature */}
                          {concept.linkedFeature && (
                            <div className="p-3 bg-white rounded border">
                              <div className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1">
                                <Wrench className="w-4 h-4" />
                                Linked Feature
                              </div>
                              <p className="text-sm mb-2">{concept.featureDescription}</p>
                              {FEATURE_PATHS[concept.linkedFeature] && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => navigate(FEATURE_PATHS[concept.linkedFeature!])}
                                >
                                  Open Tool <ExternalLink className="w-3 h-3 ml-1" />
                                </Button>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No research concepts found. Run the preprocessing script to populate the database.
            </p>
            <pre className="mt-4 p-4 bg-gray-100 rounded text-sm text-left max-w-xl mx-auto">
              node scripts/preprocess-poker-data.mjs
            </pre>
          </div>
        )}

        {/* Timeline Visualization */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8">Historical Timeline</h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-black" />
            
            {/* Timeline events */}
            <div className="space-y-8">
              {[
                { year: 1933, title: 'Kolmogorov Axioms', desc: 'Probability theory formalized', side: 'left' },
                { year: 1950, title: 'Nash Equilibrium', desc: 'Game theory foundation', side: 'right' },
                { year: 1953, title: 'Martingale Theory', desc: 'Stochastic processes', side: 'left' },
                { year: 1967, title: 'Harsanyi Transformation', desc: 'Incomplete → imperfect info', side: 'right' },
                { year: 1979, title: 'Prospect Theory', desc: 'Behavioral economics', side: 'left' },
                { year: 2007, title: 'CFR Algorithm', desc: 'Regret minimization', side: 'right' },
                { year: 2017, title: 'DeepStack', desc: 'First superhuman poker AI', side: 'left' },
                { year: 2019, title: 'The Bitter Lesson', desc: 'Compute beats expertise', side: 'right' },
                { year: 2020, title: 'ReBeL', desc: 'General imperfect info AI', side: 'left' },
                { year: 2024, title: 'DeepSeek-R1', desc: 'Reasoning AI systems', side: 'right' },
              ].map((event, i) => (
                <div 
                  key={event.year}
                  className={`flex items-center ${event.side === 'left' ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`w-5/12 ${event.side === 'left' ? 'text-right pr-8' : 'text-left pl-8'}`}>
                    <div className="font-bold text-2xl">{event.year}</div>
                    <div className="font-medium text-lg">{event.title}</div>
                    <div className="text-gray-600">{event.desc}</div>
                  </div>
                  <div className="w-2/12 flex justify-center">
                    <div className="w-4 h-4 bg-black rounded-full border-4 border-white shadow" />
                  </div>
                  <div className="w-5/12" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* The Bitter Lesson */}
        <div className="mt-16 p-8 bg-black text-white rounded-lg">
          <h2 className="text-3xl font-bold mb-4">The Unifying Theme: The Bitter Lesson</h2>
          <blockquote className="text-xl italic text-gray-300 mb-6 border-l-4 border-white pl-4">
            "The biggest lesson that can be read from 70 years of AI research is that general methods 
            that leverage computation are ultimately the most effective, and by a large margin. 
            The ultimate reason for this is Moore's law."
          </blockquote>
          <p className="text-gray-400 mb-6">— Richard Sutton, "The Bitter Lesson" (2019)</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-800 rounded">
              <h3 className="font-bold text-lg mb-2">Search</h3>
              <p className="text-gray-300 text-sm">
                Monte Carlo Tree Search, CFR, and game tree exploration scale with compute to find optimal strategies.
              </p>
            </div>
            <div className="p-4 bg-gray-800 rounded">
              <h3 className="font-bold text-lg mb-2">Learning</h3>
              <p className="text-gray-300 text-sm">
                Neural networks learn from millions of self-play games, discovering strategies humans never imagined.
              </p>
            </div>
            <div className="p-4 bg-gray-800 rounded">
              <h3 className="font-bold text-lg mb-2">Data</h3>
              <p className="text-gray-300 text-sm">
                Empirical probabilities from 100,000+ hands outperform hand-crafted heuristics and human intuition.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
