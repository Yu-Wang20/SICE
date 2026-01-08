/**
 * EV Calculator - Expected Value Analysis Tool (P0-3 & P0-4)
 * Real-time calculation + Unified workbench layout
 */

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Minus, ChevronDown } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

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
  // Input state
  const [potSize, setPotSize] = useState<string>("100");
  const [betToCall, setBetToCall] = useState<string>("50");
  const [equity, setEquity] = useState<string>("35");
  const [raiseSize, setRaiseSize] = useState<string>("150");
  const [foldEquity, setFoldEquity] = useState<string>("30");
  const [futureWinnings, setFutureWinnings] = useState<string>("100");
  const [futureLosses, setFutureLosses] = useState<string>("50");
  
  const [result, setResult] = useState<EVResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Real-time calculation with debounce
  const calculateEV = useCallback(() => {
    setIsCalculating(true);
    
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

    setIsCalculating(false);
  }, [potSize, betToCall, equity, raiseSize, foldEquity, futureWinnings, futureLosses]);

  // Auto-calculate on input change (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      calculateEV();
    }, 200);
    return () => clearTimeout(timer);
  }, [calculateEV]);

  // Input Panel
  const inputPanel = (
    <Card>
      <CardHeader>
        <CardTitle>Scenario Parameters</CardTitle>
        <CardDescription>
          Adjust values to see results update instantly
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="potSize">Pot Size (BB)</Label>
                <Input
                  id="potSize"
                  type="number"
                  value={potSize}
                  onChange={(e) => setPotSize(e.target.value)}
                  placeholder="100"
                  className="text-lg"
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
                  className="text-lg"
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
                className="text-lg"
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
                    className="text-lg"
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
                    className="text-lg"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="futureWinnings">Future Winnings (BB)</Label>
              <Input
                id="futureWinnings"
                type="number"
                value={futureWinnings}
                onChange={(e) => setFutureWinnings(e.target.value)}
                placeholder="100"
                className="text-lg"
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
                className="text-lg"
              />
              <p className="text-xs text-gray-500">Additional chips you expect to lose if you miss</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Status indicator */}
        <div className="text-xs text-gray-500 flex items-center gap-1">
          {isCalculating && (
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          )}
          {isCalculating ? "Calculating..." : "Live calculation"}
        </div>
      </CardContent>
    </Card>
  );

  // Result Panel
  const resultPanel = result ? (
    <>
      {/* Recommended Action - Huge */}
      <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">RECOMMENDED ACTION</p>
            <div className={`text-5xl font-bold mb-2 ${
              result.bestAction === 'FOLD' ? 'text-gray-700' :
              result.bestAction === 'CALL' ? 'text-green-600' :
              'text-purple-600'
            }`}>
              {result.bestAction}
            </div>
            <p className="text-sm text-gray-600">
              {result.bestAction === 'FOLD' && 'Fold to preserve chips'}
              {result.bestAction === 'CALL' && 'Call for value'}
              {result.bestAction === 'RAISE' && 'Raise to maximize EV'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* EV Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">EV Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Fold */}
          <div className={`flex items-center justify-between p-3 rounded-lg transition-all ${result.bestAction === 'FOLD' ? 'bg-blue-50 border-2 border-blue-500' : 'bg-gray-50 border border-gray-200'}`}>
            <div className="flex items-center gap-2">
              <Minus className="w-4 h-4 text-gray-500" />
              <span className="font-medium text-sm">FOLD</span>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold">{result.foldEV.toFixed(2)} BB</div>
              {result.bestAction === 'FOLD' && (
                <span className="text-xs text-blue-600 font-medium">✓ BEST</span>
              )}
            </div>
          </div>

          {/* Call */}
          <div className={`flex items-center justify-between p-3 rounded-lg transition-all ${result.bestAction === 'CALL' ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50 border border-gray-200'}`}>
            <div className="flex items-center gap-2">
              {result.callEV >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className="font-medium text-sm">CALL</span>
            </div>
            <div className="text-right">
              <div className={`text-xl font-bold ${result.callEV >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {result.callEV >= 0 ? '+' : ''}{result.callEV.toFixed(2)} BB
              </div>
              {result.bestAction === 'CALL' && (
                <span className="text-xs text-green-600 font-medium">✓ BEST</span>
              )}
            </div>
          </div>

          {/* Raise */}
          <div className={`flex items-center justify-between p-3 rounded-lg transition-all ${result.bestAction === 'RAISE' ? 'bg-purple-50 border-2 border-purple-500' : 'bg-gray-50 border border-gray-200'}`}>
            <div className="flex items-center gap-2">
              {result.raiseEV >= 0 ? (
                <TrendingUp className="w-4 h-4 text-purple-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className="font-medium text-sm">RAISE</span>
            </div>
            <div className="text-right">
              <div className={`text-xl font-bold ${result.raiseEV >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                {result.raiseEV >= 0 ? '+' : ''}{result.raiseEV.toFixed(2)} BB
              </div>
              {result.bestAction === 'RAISE' && (
                <span className="text-xs text-purple-600 font-medium">✓ BEST</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Key Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-sm text-gray-600">Pot Odds</span>
            <span className="font-semibold">{result.potOdds.toFixed(1)}:1</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-sm text-gray-600">Breakeven Equity</span>
            <span className="font-semibold">{result.breakeven.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-sm text-gray-600">Implied Odds</span>
            <span className="font-semibold">{result.impliedOdds.toFixed(2)}:1</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-600">Reverse Implied Odds</span>
            <span className="font-semibold">{result.reverseImpliedOdds.toFixed(2)}:1</span>
          </div>
        </CardContent>
      </Card>

      {/* Explanation (Collapsible) */}
      <details className="group">
        <summary className="flex items-center gap-2 cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" />
          <span className="font-medium text-sm">Why this action?</span>
        </summary>
        <div className="mt-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-700">{result.explanation}</p>
        </div>
      </details>
    </>
  ) : (
    <Card className="bg-gray-50 border-dashed">
      <CardContent className="pt-12 pb-12 text-center">
        <p className="text-gray-500">Enter parameters to see real-time analysis</p>
      </CardContent>
    </Card>
  );

  return (
    <ToolLayout
      title="EV Calculator"
      description="Real-time expected value analysis for poker decisions"
      inputPanel={inputPanel}
      resultPanel={resultPanel}
      showStickyResult={true}
    />
  );
}
