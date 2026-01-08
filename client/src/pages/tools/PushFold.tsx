/**
 * Push/Fold Short Stack Trainer
 * Input: stack (BB), position, opponent type
 * Output: push/fold/raise recommendation with heuristics
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Target, TrendingUp, Info, Zap } from "lucide-react";

const POSITIONS = ['UTG', 'MP', 'CO', 'BTN', 'SB', 'BB'] as const;
const OPPONENT_TYPES = ['tight', 'normal', 'loose', 'aggressive'] as const;
const HAND_CATEGORIES = ['premium', 'strong', 'medium', 'weak'] as const;

const HAND_EXAMPLES = {
  premium: 'AA, KK, QQ, AKs',
  strong: 'JJ, TT, AQs, AKo',
  medium: 'AJs, KQs, 99, 88',
  weak: 'A2s, K9s, 77, 66',
};

export default function PushFold() {
  const [, navigate] = useLocation();
  const [stackBB, setStackBB] = useState(15);
  const [position, setPosition] = useState<typeof POSITIONS[number]>('BTN');
  const [opponentType, setOpponentType] = useState<typeof OPPONENT_TYPES[number]>('normal');
  const [handCategory, setHandCategory] = useState<typeof HAND_CATEGORIES[number]>('strong');

  // Get recommendation
  const recommendationQuery = trpc.poker.pushFold.getRecommendation.useQuery({
    stackBB,
    position,
    opponentType,
    handCategory,
  });

  // Get all ranges for position
  const rangesQuery = trpc.poker.pushFold.getAllRanges.useQuery({ position });

  const result = recommendationQuery.data;

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
          <h1 className="text-4xl md:text-5xl font-bold">Push/Fold Trainer</h1>
          <p className="text-xl text-gray-600 mt-2">
            Short stack decision engine based on Nash equilibrium ranges
          </p>
        </div>
      </header>

      <main className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card className="border-2 border-black">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Scenario Parameters
                </CardTitle>
                <CardDescription>
                  Configure your stack, position, and opponent profile
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Stack Size */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Stack Size</Label>
                    <span className="font-mono font-bold">{stackBB} BB</span>
                  </div>
                  <Slider
                    min={1}
                    max={50}
                    step={1}
                    value={[stackBB]}
                    onValueChange={([v]) => setStackBB(v)}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Desperation (1-5)</span>
                    <span>Short (6-15)</span>
                    <span>Medium (16-30)</span>
                    <span>Deep (30+)</span>
                  </div>
                </div>

                {/* Position */}
                <div className="space-y-2">
                  <Label>Your Position</Label>
                  <div className="grid grid-cols-6 gap-2">
                    {POSITIONS.map((pos) => (
                      <button
                        key={pos}
                        onClick={() => setPosition(pos)}
                        className={`p-3 border-2 rounded font-bold transition-all ${
                          position === pos
                            ? 'border-black bg-black text-white'
                            : 'border-gray-300 hover:border-black'
                        }`}
                      >
                        {pos}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Opponent Type */}
                <div className="space-y-2">
                  <Label>Opponent Type</Label>
                  <Select value={opponentType} onValueChange={(v) => setOpponentType(v as typeof opponentType)}>
                    <SelectTrigger className="border-2 border-black">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tight">Tight (folds often)</SelectItem>
                      <SelectItem value="normal">Normal (balanced)</SelectItem>
                      <SelectItem value="loose">Loose (calls wide)</SelectItem>
                      <SelectItem value="aggressive">Aggressive (3-bets often)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Hand Category */}
                <div className="space-y-2">
                  <Label>Your Hand Category</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {HAND_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setHandCategory(cat)}
                        className={`p-3 border-2 rounded transition-all ${
                          handCategory === cat
                            ? 'border-black bg-black text-white'
                            : 'border-gray-300 hover:border-black'
                        }`}
                      >
                        <div className="font-bold capitalize">{cat}</div>
                        <div className="text-xs opacity-70">{HAND_EXAMPLES[cat]}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Theory Card */}
            <Card className="border-2 border-green-500 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <Info className="w-5 h-5" />
                  Nash Equilibrium Connection
                </CardTitle>
              </CardHeader>
              <CardContent className="text-green-800">
                <p className="mb-2">
                  Push/fold ranges are derived from <strong>Nash Equilibrium</strong> (1950):
                </p>
                <div className="bg-white p-3 rounded font-mono text-sm">
                  <div>σ* = argmax E[u(σ, σ_-i)]</div>
                  <div className="text-xs text-gray-600 mt-1">
                    No player benefits from unilateral deviation
                  </div>
                </div>
                <p className="mt-2 text-sm">
                  In heads-up push/fold, Nash equilibrium defines unexploitable ranges.
                  These ranges are computed using <strong>CFR algorithm</strong>.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Main Recommendation */}
            <Card className={`border-4 ${
              result?.action === 'PUSH' ? 'border-red-500 bg-red-50' :
              result?.action === 'RAISE' ? 'border-orange-500 bg-orange-50' :
              result?.action === 'LIMP' ? 'border-yellow-500 bg-yellow-50' :
              'border-gray-500 bg-gray-50'
            }`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Zap className="w-8 h-8" />
                  Recommendation
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-4">
                    <div className={`text-6xl font-bold text-center py-4 ${
                      result.action === 'PUSH' ? 'text-red-600' :
                      result.action === 'RAISE' ? 'text-orange-600' :
                      result.action === 'LIMP' ? 'text-yellow-600' :
                      'text-gray-600'
                    }`}>
                      {result.action}
                    </div>
                    <div className="text-center text-gray-600">
                      Confidence: <span className="font-bold">{result.confidence}%</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Loading recommendation...
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Detailed Analysis */}
            <Card className="border-2 border-black">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Detailed Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded">
                        <div className="text-sm text-gray-600">Frequency</div>
                        <div className="text-2xl font-bold">{result.frequency}%</div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded">
                        <div className="text-sm text-gray-600">Push/Fold Equity</div>
                        <div className="text-2xl font-bold">{result.pushFoldEquity}%</div>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded">
                      <div className="text-sm text-blue-600 font-medium mb-1">Heuristic</div>
                      <div className="text-blue-800">{result.heuristic}</div>
                    </div>

                    {/* Stack Size Context */}
                    <div className="p-4 bg-gray-50 rounded">
                      <div className="text-sm text-gray-600 mb-2">Stack Size Context</div>
                      <div className="text-sm">
                        {stackBB <= 10 && (
                          <span className="text-red-600 font-medium">
                            ⚠️ Short stack mode: Push or fold only. No room for post-flop play.
                          </span>
                        )}
                        {stackBB > 10 && stackBB <= 20 && (
                          <span className="text-orange-600 font-medium">
                            📊 Medium stack: Consider raise/fold strategy. Limited post-flop flexibility.
                          </span>
                        )}
                        {stackBB > 20 && (
                          <span className="text-green-600 font-medium">
                            ✅ Deep stack: Full range of actions available. Play post-flop poker.
                          </span>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Configure parameters to see analysis
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Position Ranges Table */}
            <Card className="border-2 border-black">
              <CardHeader>
                <CardTitle>All Ranges for {position}</CardTitle>
                <CardDescription>
                  Frequency by hand category and opponent type
                </CardDescription>
              </CardHeader>
              <CardContent>
                {rangesQuery.isLoading ? (
                  <div className="animate-pulse space-y-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-6 bg-gray-200 rounded" />
                    ))}
                  </div>
                ) : rangesQuery.data && rangesQuery.data.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-black">
                          <th className="text-left py-2">Hand</th>
                          <th className="text-right py-2">vs Tight</th>
                          <th className="text-right py-2">vs Normal</th>
                          <th className="text-right py-2">vs Loose</th>
                          <th className="text-right py-2">vs Aggro</th>
                        </tr>
                      </thead>
                      <tbody>
                        {HAND_CATEGORIES.map((cat) => {
                          const ranges = rangesQuery.data.filter(r => r.handCategory === cat);
                          return (
                            <tr key={cat} className="border-b border-gray-200">
                              <td className="py-2 font-medium capitalize">{cat}</td>
                              {OPPONENT_TYPES.map((opp) => {
                                const range = ranges.find(r => r.opponentType === opp);
                                const freq = range?.frequency ?? 0;
                                return (
                                  <td key={opp} className="text-right py-2">
                                    <span className={`font-mono ${
                                      freq >= 0.7 ? 'text-green-600' :
                                      freq >= 0.4 ? 'text-yellow-600' :
                                      'text-red-600'
                                    }`}>
                                      {(freq * 100).toFixed(0)}%
                                    </span>
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500">No range data available. Run preprocessing script first.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
