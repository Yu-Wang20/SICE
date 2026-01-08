/**
 * EV Calculator - Expected Value Analysis Tool
 * Inspired by Preflop+ and GTO Wizard
 * Fixed: Correct EV formulas, added implied odds, reverse implied odds
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calculator, TrendingUp, TrendingDown, Minus, Info } from "lucide-react";
import { useLocation } from "wouter";

interface EVResult {
  foldEV: number;
  callEV: number;
  raiseEV: number;
  bestAction: 'FOLD' | 'CALL' | 'RAISE';
  explanation: string;
  potOdds: number;
  breakeven: number;
  impliedOdds: number;
  reverseImpliedOdds: number;
}

export default function EVCalculator() {
  const [, navigate] = useLocation();
  
  // Input state
  const [potSize, setPotSize] = useState<string>("100");
  const [betToCall, setBetToCall] = useState<string>("50");
  const [equity, setEquity] = useState<string>("35");
  const [raiseSize, setRaiseSize] = useState<string>("150");
  const [foldEquity, setFoldEquity] = useState<string>("30");
  const [futureWinnings, setFutureWinnings] = useState<string>("100");
  const [futureLosses, setFutureLosses] = useState<string>("50");
  
  const [result, setResult] = useState<EVResult | null>(null);
  const [activeTab, setActiveTab] = useState("basic");

  const calculateEV = () => {
    const pot = parseFloat(potSize) || 0;
    const bet = parseFloat(betToCall) || 0;
    const eq = (parseFloat(equity) || 0) / 100;
    const raise = parseFloat(raiseSize) || 0;
    const foldEq = (parseFloat(foldEquity) || 0) / 100;
    const futureWin = parseFloat(futureWinnings) || 0;
    const futureLose = parseFloat(futureLosses) || 0;

    // Fold EV is always 0
    const foldEV = 0;

    // Call EV = (equity * (pot + bet)) - ((1 - equity) * bet)
    // This represents: win the whole pot if we win, lose our bet if we lose
    const totalPot = pot + bet;
    const callEV = (eq * totalPot) - ((1 - eq) * bet);

    // Raise EV = (fold equity * (pot + bet)) + ((1 - fold equity) * ((equity * (pot + bet + raise)) - ((1 - equity) * raise)))
    const potAfterRaise = pot + bet + raise;
    const raiseEVWhenCalled = (eq * potAfterRaise) - ((1 - eq) * raise);
    const raiseEV = (foldEq * (pot + bet)) + ((1 - foldEq) * raiseEVWhenCalled);

    // Pot odds: bet / (pot + bet + bet) = bet / (pot + 2*bet)
    const potOdds = bet / (pot + bet + bet);
    
    // Breakeven equity: bet / (pot + 2*bet)
    const breakeven = potOdds * 100;

    // Implied odds: (future winnings + pot + bet) / bet
    const impliedOdds = (futureWin + pot + bet) / bet;
    
    // Reverse implied odds: bet / (future losses + pot + bet)
    const reverseImpliedOdds = bet / (futureLose + pot + bet);

    // Determine best action
    let bestAction: 'FOLD' | 'CALL' | 'RAISE' = 'FOLD';
    let maxEV = foldEV;
    
    if (callEV > maxEV) {
      maxEV = callEV;
      bestAction = 'CALL';
    }
    if (raiseEV > maxEV) {
      maxEV = raiseEV;
      bestAction = 'RAISE';
    }

    // Generate explanation
    let explanation = '';
    if (bestAction === 'FOLD') {
      explanation = `With ${equity}% equity, your call EV is ${callEV.toFixed(2)} BB which is negative. You need at least ${breakeven.toFixed(1)}% equity to break even on this call.`;
    } else if (bestAction === 'CALL') {
      explanation = `With ${equity}% equity, calling is profitable. You gain ${callEV.toFixed(2)} BB on average. Your pot odds are ${(potOdds * 100).toFixed(1)}:1, and you have enough equity to call.`;
    } else {
      explanation = `With ${foldEquity}% fold equity and ${equity}% equity when called, raising maximizes EV at ${raiseEV.toFixed(2)} BB. This is better than calling (${callEV.toFixed(2)} BB).`;
    }

    setResult({
      foldEV,
      callEV,
      raiseEV,
      bestAction,
      explanation,
      potOdds: potOdds * 100,
      breakeven,
      impliedOdds,
      reverseImpliedOdds
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container py-4">
          <Button variant="ghost" onClick={() => navigate("/tools")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tools
          </Button>
          <h1 className="text-4xl font-bold">EV Calculator</h1>
          <p className="text-gray-600 mt-2">Calculate expected value, pot odds, and implied odds for poker decisions</p>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Scenario Parameters
              </CardTitle>
              <CardDescription>
                Enter the current situation to calculate EV
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">Basic</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="potSize">Pot Size (BB)</Label>
                      <Input
                        id="potSize"
                        type="number"
                        value={potSize}
                        onChange={(e) => setPotSize(e.target.value)}
                        placeholder="100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="betToCall">Bet to Call (BB)</Label>
                      <Input
                        id="betToCall"
                        type="number"
                        value={betToCall}
                        onChange={(e) => setBetToCall(e.target.value)}
                        placeholder="50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="equity">Your Equity vs Villain (%)</Label>
                    <Input
                      id="equity"
                      type="number"
                      min="0"
                      max="100"
                      value={equity}
                      onChange={(e) => setEquity(e.target.value)}
                      placeholder="35"
                    />
                    <p className="text-xs text-gray-500">Estimated hand equity against opponent's range</p>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Raise Parameters</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="raiseSize">Raise Size (BB)</Label>
                        <Input
                          id="raiseSize"
                          type="number"
                          value={raiseSize}
                          onChange={(e) => setRaiseSize(e.target.value)}
                          placeholder="150"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="foldEquity">Fold Equity (%)</Label>
                        <Input
                          id="foldEquity"
                          type="number"
                          min="0"
                          max="100"
                          value={foldEquity}
                          onChange={(e) => setFoldEquity(e.target.value)}
                          placeholder="30"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="futureWinnings">Future Winnings (BB)</Label>
                    <Input
                      id="futureWinnings"
                      type="number"
                      value={futureWinnings}
                      onChange={(e) => setFutureWinnings(e.target.value)}
                      placeholder="100"
                    />
                    <p className="text-xs text-gray-500">Additional chips you expect to win if you hit</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="futureLosses">Future Losses (BB)</Label>
                    <Input
                      id="futureLosses"
                      type="number"
                      value={futureLosses}
                      onChange={(e) => setFutureLosses(e.target.value)}
                      placeholder="50"
                    />
                    <p className="text-xs text-gray-500">Additional chips you expect to lose if you miss</p>
                  </div>
                </TabsContent>
              </Tabs>

              <Button onClick={calculateEV} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" size="lg">
                Calculate EV
              </Button>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <div className="space-y-6">
            {result ? (
              <>
                {/* EV Comparison */}
                <Card>
                  <CardHeader>
                    <CardTitle>EV Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Fold */}
                      <div className={`flex items-center justify-between p-4 rounded-lg transition-all ${result.bestAction === 'FOLD' ? 'bg-blue-50 border-2 border-blue-500' : 'bg-gray-50 border border-gray-200'}`}>
                        <div className="flex items-center gap-3">
                          <Minus className="w-5 h-5 text-gray-500" />
                          <span className="font-medium">FOLD</span>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{result.foldEV.toFixed(2)} BB</div>
                          {result.bestAction === 'FOLD' && (
                            <span className="text-xs text-blue-600 font-medium">✓ BEST</span>
                          )}
                        </div>
                      </div>

                      {/* Call */}
                      <div className={`flex items-center justify-between p-4 rounded-lg transition-all ${result.bestAction === 'CALL' ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50 border border-gray-200'}`}>
                        <div className="flex items-center gap-3">
                          {result.callEV >= 0 ? (
                            <TrendingUp className="w-5 h-5 text-green-500" />
                          ) : (
                            <TrendingDown className="w-5 h-5 text-red-500" />
                          )}
                          <span className="font-medium">CALL</span>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${result.callEV >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {result.callEV >= 0 ? '+' : ''}{result.callEV.toFixed(2)} BB
                          </div>
                          {result.bestAction === 'CALL' && (
                            <span className="text-xs text-green-600 font-medium">✓ BEST</span>
                          )}
                        </div>
                      </div>

                      {/* Raise */}
                      <div className={`flex items-center justify-between p-4 rounded-lg transition-all ${result.bestAction === 'RAISE' ? 'bg-purple-50 border-2 border-purple-500' : 'bg-gray-50 border border-gray-200'}`}>
                        <div className="flex items-center gap-3">
                          {result.raiseEV >= 0 ? (
                            <TrendingUp className="w-5 h-5 text-purple-500" />
                          ) : (
                            <TrendingDown className="w-5 h-5 text-red-500" />
                          )}
                          <span className="font-medium">RAISE</span>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${result.raiseEV >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                            {result.raiseEV >= 0 ? '+' : ''}{result.raiseEV.toFixed(2)} BB
                          </div>
                          {result.bestAction === 'RAISE' && (
                            <span className="text-xs text-purple-600 font-medium">✓ BEST</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Odds Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="w-5 h-5" />
                      Odds & Breakeven
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-blue-50 rounded">
                        <div className="text-sm text-gray-600">Pot Odds</div>
                        <div className="text-2xl font-bold text-blue-600">{result.potOdds.toFixed(1)}%</div>
                      </div>
                      <div className="p-3 bg-emerald-50 rounded">
                        <div className="text-sm text-gray-600">Breakeven Equity</div>
                        <div className="text-2xl font-bold text-emerald-600">{result.breakeven.toFixed(1)}%</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-orange-50 rounded">
                        <div className="text-sm text-gray-600">Implied Odds</div>
                        <div className="text-2xl font-bold text-orange-600">{result.impliedOdds.toFixed(2)}:1</div>
                      </div>
                      <div className="p-3 bg-red-50 rounded">
                        <div className="text-sm text-gray-600">Reverse Implied</div>
                        <div className="text-2xl font-bold text-red-600">{result.reverseImpliedOdds.toFixed(2)}:1</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Explanation */}
                <Card>
                  <CardHeader>
                    <CardTitle>Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700">{result.explanation}</p>
                    
                    <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                      <h4 className="font-medium text-yellow-800 mb-2">💡 GTO Insight</h4>
                      <p className="text-sm text-yellow-700">
                        In GTO play, we mix actions to remain unexploitable. This calculator shows pure EV, 
                        but optimal play may involve mixing frequencies based on board texture and opponent tendencies.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-gray-500">
                  <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Enter scenario parameters and click Calculate to see EV analysis</p>
                </CardContent>
              </Card>
            )}

            {/* Formula Reference */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">EV Formulas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm font-mono bg-gray-50 p-4 rounded">
                <div>
                  <span className="text-gray-600">Call EV =</span>
                  <span className="ml-2 text-gray-800">(Equity × Total Pot) - ((1 - Equity) × Bet)</span>
                </div>
                <div>
                  <span className="text-gray-600">Raise EV =</span>
                  <span className="ml-2 text-gray-800">(Fold Eq × Pot) + ((1 - Fold Eq) × EV when called)</span>
                </div>
                <div>
                  <span className="text-gray-600">Pot Odds =</span>
                  <span className="ml-2 text-gray-800">Bet / (Pot + 2 × Bet)</span>
                </div>
                <div>
                  <span className="text-gray-600">Implied Odds =</span>
                  <span className="ml-2 text-gray-800">(Future Win + Pot + Bet) / Bet</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
