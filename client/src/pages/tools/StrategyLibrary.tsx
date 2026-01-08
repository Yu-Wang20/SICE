/**
 * Strategy Library - Preflop Ranges and Decision Matrices
 * Inspired by GTO Ranges+ and Preflop+
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Download, BookOpen, Grid3X3 } from "lucide-react";
import { useLocation } from "wouter";

// Hand matrix data
const HANDS = [
  ['AA', 'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s'],
  ['AKo', 'KK', 'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'K7s', 'K6s', 'K5s', 'K4s', 'K3s', 'K2s'],
  ['AQo', 'KQo', 'QQ', 'QJs', 'QTs', 'Q9s', 'Q8s', 'Q7s', 'Q6s', 'Q5s', 'Q4s', 'Q3s', 'Q2s'],
  ['AJo', 'KJo', 'QJo', 'JJ', 'JTs', 'J9s', 'J8s', 'J7s', 'J6s', 'J5s', 'J4s', 'J3s', 'J2s'],
  ['ATo', 'KTo', 'QTo', 'JTo', 'TT', 'T9s', 'T8s', 'T7s', 'T6s', 'T5s', 'T4s', 'T3s', 'T2s'],
  ['A9o', 'K9o', 'Q9o', 'J9o', 'T9o', '99', '98s', '97s', '96s', '95s', '94s', '93s', '92s'],
  ['A8o', 'K8o', 'Q8o', 'J8o', 'T8o', '98o', '88', '87s', '86s', '85s', '84s', '83s', '82s'],
  ['A7o', 'K7o', 'Q7o', 'J7o', 'T7o', '97o', '87o', '77', '76s', '75s', '74s', '73s', '72s'],
  ['A6o', 'K6o', 'Q6o', 'J6o', 'T6o', '96o', '86o', '76o', '66', '65s', '64s', '63s', '62s'],
  ['A5o', 'K5o', 'Q5o', 'J5o', 'T5o', '95o', '85o', '75o', '65o', '55', '54s', '53s', '52s'],
  ['A4o', 'K4o', 'Q4o', 'J4o', 'T4o', '94o', '84o', '74o', '64o', '54o', '44', '43s', '42s'],
  ['A3o', 'K3o', 'Q3o', 'J3o', 'T3o', '93o', '83o', '73o', '63o', '53o', '43o', '33', '32s'],
  ['A2o', 'K2o', 'Q2o', 'J2o', 'T2o', '92o', '82o', '72o', '62o', '52o', '42o', '32o', '22']
];

// Range definitions by position
const RANGES: Record<string, Record<string, Set<string>>> = {
  'UTG': {
    'raise': new Set(['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', 'AKs', 'AQs', 'AJs', 'ATs', 'KQs', 'KJs', 'QJs', 'JTs', 'AKo', 'AQo']),
    'call': new Set([]),
  },
  'MP': {
    'raise': new Set(['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', 'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'KQs', 'KJs', 'KTs', 'QJs', 'QTs', 'JTs', 'T9s', 'AKo', 'AQo', 'AJo', 'KQo']),
    'call': new Set([]),
  },
  'CO': {
    'raise': new Set(['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', 'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s', 'KQs', 'KJs', 'KTs', 'K9s', 'QJs', 'QTs', 'Q9s', 'JTs', 'J9s', 'T9s', 'T8s', '98s', '87s', '76s', '65s', 'AKo', 'AQo', 'AJo', 'ATo', 'KQo', 'KJo', 'QJo']),
    'call': new Set([]),
  },
  'BTN': {
    'raise': new Set(['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', '33', '22', 'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s', 'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'K7s', 'K6s', 'K5s', 'K4s', 'K3s', 'K2s', 'QJs', 'QTs', 'Q9s', 'Q8s', 'Q7s', 'Q6s', 'JTs', 'J9s', 'J8s', 'J7s', 'T9s', 'T8s', 'T7s', '98s', '97s', '96s', '87s', '86s', '85s', '76s', '75s', '65s', '64s', '54s', '53s', '43s', 'AKo', 'AQo', 'AJo', 'ATo', 'A9o', 'A8o', 'A7o', 'A6o', 'A5o', 'A4o', 'KQo', 'KJo', 'KTo', 'K9o', 'QJo', 'QTo', 'JTo', 'J9o', 'T9o']),
    'call': new Set([]),
  },
  'SB': {
    'raise': new Set(['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', 'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s', 'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'QJs', 'QTs', 'Q9s', 'JTs', 'J9s', 'T9s', '98s', '87s', '76s', '65s', '54s', 'AKo', 'AQo', 'AJo', 'ATo', 'A9o', 'KQo', 'KJo', 'KTo', 'QJo']),
    'call': new Set(['33', '22', 'K7s', 'K6s', 'K5s', 'K4s', 'Q8s', 'Q7s', 'J8s', 'T8s', '97s', '86s', '75s', '64s', '53s', 'A8o', 'A7o', 'A6o', 'A5o', 'K9o', 'QTo', 'JTo']),
  },
  'BB': {
    'raise': new Set(['AA', 'KK', 'QQ', 'JJ', 'TT', 'AKs', 'AQs', 'AJs', 'AKo']),
    'call': new Set(['99', '88', '77', '66', '55', '44', '33', '22', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s', 'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'K7s', 'K6s', 'K5s', 'K4s', 'K3s', 'K2s', 'QJs', 'QTs', 'Q9s', 'Q8s', 'Q7s', 'Q6s', 'Q5s', 'JTs', 'J9s', 'J8s', 'J7s', 'J6s', 'T9s', 'T8s', 'T7s', 'T6s', '98s', '97s', '96s', '87s', '86s', '85s', '76s', '75s', '74s', '65s', '64s', '54s', '53s', '43s', 'AQo', 'AJo', 'ATo', 'A9o', 'A8o', 'A7o', 'A6o', 'A5o', 'A4o', 'A3o', 'A2o', 'KQo', 'KJo', 'KTo', 'K9o', 'K8o', 'QJo', 'QTo', 'Q9o', 'JTo', 'J9o', 'T9o', '98o', '87o', '76o']),
  }
};

export default function StrategyLibrary() {
  const [, navigate] = useLocation();
  const [selectedPosition, setSelectedPosition] = useState('BTN');

  const getHandColor = (hand: string) => {
    const range = RANGES[selectedPosition];
    if (range.raise.has(hand)) return 'bg-green-500 text-white';
    if (range.call.has(hand)) return 'bg-yellow-400 text-black';
    return 'bg-gray-100 text-gray-600';
  };

  const getRangeStats = () => {
    const range = RANGES[selectedPosition];
    const raiseCount = range.raise.size;
    const callCount = range.call.size;
    const totalHands = 169;
    return {
      raisePercent: ((raiseCount / totalHands) * 100).toFixed(1),
      callPercent: ((callCount / totalHands) * 100).toFixed(1),
      totalPercent: (((raiseCount + callCount) / totalHands) * 100).toFixed(1)
    };
  };

  const stats = getRangeStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container py-4">
          <Button variant="ghost" onClick={() => navigate("/tools")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tools
          </Button>
          <h1 className="text-4xl font-bold">Strategy Library</h1>
          <p className="text-gray-600 mt-2">GTO preflop ranges and decision matrices</p>
        </div>
      </div>

      <div className="container py-8">
        <Tabs defaultValue="ranges">
          <TabsList className="mb-6">
            <TabsTrigger value="ranges" className="flex items-center gap-2">
              <Grid3X3 className="w-4 h-4" /> Preflop Ranges
            </TabsTrigger>
            <TabsTrigger value="matrix" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Decision Matrix
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ranges">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Controls */}
              <Card>
                <CardHeader>
                  <CardTitle>Position Select</CardTitle>
                  <CardDescription>Choose position to view opening range</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTG">UTG (Under the Gun)</SelectItem>
                      <SelectItem value="MP">MP (Middle Position)</SelectItem>
                      <SelectItem value="CO">CO (Cutoff)</SelectItem>
                      <SelectItem value="BTN">BTN (Button)</SelectItem>
                      <SelectItem value="SB">SB (Small Blind)</SelectItem>
                      <SelectItem value="BB">BB (Big Blind vs Open)</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="space-y-2 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded" />
                        <span className="text-sm">Raise</span>
                      </div>
                      <span className="font-mono">{stats.raisePercent}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-yellow-400 rounded" />
                        <span className="text-sm">Call</span>
                      </div>
                      <span className="font-mono">{stats.callPercent}%</span>
                    </div>
                    <div className="flex items-center justify-between border-t pt-2">
                      <span className="text-sm font-medium">Total VPIP</span>
                      <span className="font-mono font-bold">{stats.totalPercent}%</span>
                    </div>
                  </div>

                  <Button className="w-full mt-4" variant="outline">
                    <Download className="w-4 h-4 mr-2" /> Export Range
                  </Button>
                </CardContent>
              </Card>

              {/* Hand Matrix */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>{selectedPosition} Opening Range</CardTitle>
                  <CardDescription>6-max cash game, 100BB deep</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-13 gap-0.5 text-xs">
                    {HANDS.map((row, i) => (
                      row.map((hand, j) => (
                        <div
                          key={`${i}-${j}`}
                          className={`aspect-square flex items-center justify-center rounded-sm font-mono font-medium ${getHandColor(hand)}`}
                          title={hand}
                        >
                          {hand.length <= 3 ? hand : hand.slice(0, 2)}
                        </div>
                      ))
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="matrix">
            <Card>
              <CardHeader>
                <CardTitle>Strategic Decision Matrix</CardTitle>
                <CardDescription>Algorithm selection based on environment characteristics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium">Environment</th>
                        <th className="text-left p-3 font-medium">Information</th>
                        <th className="text-left p-3 font-medium">Optimal Algorithm</th>
                        <th className="text-left p-3 font-medium">Key Technique</th>
                        <th className="text-left p-3 font-medium">Example</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="p-3">Deterministic</td>
                        <td className="p-3">Perfect</td>
                        <td className="p-3 font-medium text-blue-600">Minimax + α-β</td>
                        <td className="p-3">Tree Search</td>
                        <td className="p-3">Chess, Go</td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="p-3">Stochastic</td>
                        <td className="p-3">Perfect</td>
                        <td className="p-3 font-medium text-green-600">Expectimax</td>
                        <td className="p-3">Probability Weighting</td>
                        <td className="p-3">Backgammon</td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="p-3">Deterministic</td>
                        <td className="p-3">Imperfect</td>
                        <td className="p-3 font-medium text-purple-600">CFR / CFR+</td>
                        <td className="p-3">Regret Minimization</td>
                        <td className="p-3">Poker (Heads-up)</td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="p-3">Stochastic</td>
                        <td className="p-3">Imperfect</td>
                        <td className="p-3 font-medium text-orange-600">ReBeL / MCCFR</td>
                        <td className="p-3">Belief State + Search</td>
                        <td className="p-3">Poker (Multi-way)</td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="p-3">Sequential</td>
                        <td className="p-3">Partial Observable</td>
                        <td className="p-3 font-medium text-red-600">POMDP / RL</td>
                        <td className="p-3">Policy Gradient</td>
                        <td className="p-3">Real-time Strategy</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="p-3">Continuous</td>
                        <td className="p-3">Noisy</td>
                        <td className="p-3 font-medium text-indigo-600">Deep RL + MCTS</td>
                        <td className="p-3">Neural Network + Search</td>
                        <td className="p-3">Robotics, Trading</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">💡 The Bitter Lesson Connection</h4>
                  <p className="text-sm text-blue-700">
                    As Richard Sutton observed, general-purpose algorithms (search + learning) consistently 
                    outperform hand-crafted domain knowledge as compute scales. This matrix shows how 
                    the same core techniques (tree search, regret minimization, neural networks) 
                    adapt to different information structures.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
