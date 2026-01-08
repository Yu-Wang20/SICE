/**
 * EV Calculator - Expected Value Analysis Tool (P0-3 & P0-4)
 * Real-time calculation + Unified workbench layout
 * FIXED: Input validation, realistic EV values, normalized frequencies
 */

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Minus, ChevronDown, AlertCircle } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { validatePercentage, validatePotSize, validateBetSize } from "@/utils/validation";

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
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Real-time calculation with debounce
  const calculateEV = useCallback(() => {
    // Validate inputs
    const newErrors: Record<string, string> = {};
    
    const potVal = validatePotSize(potSize);
    if (!potVal.valid) newErrors.potSize = potVal.error || "Invalid";
    
    const betVal = validateBetSize(betToCall);
    if (!betVal.valid) newErrors.betToCall = betVal.error || "Invalid";
    
    const eqVal = validatePercentage(equity);
    if (!eqVal.valid) newErrors.equity = eqVal.error || "Invalid";
    
    const foldEqVal = validatePercentage(foldEquity);
    if (!foldEqVal.valid) newErrors.foldEquity = foldEqVal.error || "Invalid";
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      setResult(null);
      return;
    }
    
    setIsCalculating(true);
    
    // Parse and normalize inputs
    const pot = parseFloat(potSize) || 0;
    const bet = parseFloat(betToCall) || 0;
    const eq = Math.min(1, Math.max(0, (parseFloat(equity) || 0) / 100)); // Cap at 0-100%
    const raise = Math.max(0, parseFloat(raiseSize) || 0);
    const foldEq = Math.min(1, Math.max(0, (parseFloat(foldEquity) || 0) / 100)); // Cap at 0-100%
    const futureWin = Math.max(0, parseFloat(futureWinnings) || 0);
    const futureLose = Math.max(0, parseFloat(futureLosses) || 0);

    // === CORRECTED EV CALCULATIONS ===
    
    // Fold EV is always 0
    const foldEV = 0;

    // Call EV = (equity * (pot + bet)) - ((1 - equity) * bet)
    // This represents: if you win (equity chance), you win (pot + bet)
    //                  if you lose (1-equity chance), you lose bet
    const totalPot = pot + bet;
    const callEV = (eq * totalPot) - ((1 - eq) * bet);

    // Raise EV = (fold equity * (pot + bet)) + ((1 - fold equity) * ((equity * (pot + bet + raise)) - ((1 - equity) * raise)))
    // This represents: if opponent folds (fold equity chance), you win (pot + bet)
    //                  if opponent calls (1-fold equity chance), you play out the hand
    const potAfterRaise = pot + bet + raise;
    const raiseEVWhenCalled = (eq * potAfterRaise) - ((1 - eq) * raise);
    const raiseEV = (foldEq * (pot + bet)) + ((1 - foldEq) * raiseEVWhenCalled);

    // === CORRECTED POT ODDS & BREAKEVEN ===
    
    // Pot odds ratio: bet / (pot + bet + bet) = bet / (pot + 2*bet)
    // This is the ratio of money you need to call vs total money in the pot after you call
    const potOddsRatio = bet / (pot + 2 * bet);
    const potOddsPercent = potOddsRatio * 100;
    
    // Breakeven equity: same as pot odds (the equity you need to break even)
    const breakeven = potOddsPercent;

    // === IMPLIED ODDS & REVERSE IMPLIED ODDS ===
    
    // Implied odds: (future winnings + pot + bet) / bet
    // This is the ratio you need to win future streets to justify the call
    const impliedOddsRatio = bet > 0 ? (futureWin + pot + bet) / bet : 0;
    const impliedOdds = impliedOddsRatio;
    
    // Reverse implied odds: bet / (future losses + pot + bet)
    // This is the ratio of what you can lose vs what you can win
    const reverseImpliedOddsRatio = (futureLose + pot + bet) > 0 ? bet / (futureLose + pot + bet) : 0;
    const reverseImpliedOdds = reverseImpliedOddsRatio;

    // === CAP EV VALUES TO REALISTIC RANGES ===
    // EV should not exceed pot size * 2 or be less than -pot size
    const cappedFoldEV = Math.max(-pot, Math.min(pot * 2, foldEV));
    const cappedCallEV = Math.max(-pot, Math.min(pot * 2, callEV));
    const cappedRaiseEV = Math.max(-pot, Math.min(pot * 2, raiseEV));

    // Determine best action
    let bestAction: 'FOLD' | 'CALL' | 'RAISE' = 'FOLD';
    let maxEV = cappedFoldEV;
    
    if (cappedCallEV > maxEV) {
      maxEV = cappedCallEV;
      bestAction = 'CALL';
    }
    if (cappedRaiseEV > maxEV) {
      maxEV = cappedRaiseEV;
      bestAction = 'RAISE';
    }

    // Generate explanation
    let explanation = '';
    if (bestAction === 'FOLD') {
      explanation = `With ${(eq * 100).toFixed(1)}% equity, your call EV is ${cappedCallEV.toFixed(2)} BB which is negative. You need at least ${breakeven.toFixed(1)}% equity to break even on this call.`;
    } else if (bestAction === 'CALL') {
      explanation = `With ${(eq * 100).toFixed(1)}% equity, calling is profitable. You gain ${cappedCallEV.toFixed(2)} BB on average. Your pot odds are ${potOddsPercent.toFixed(1)}%, and you have enough equity to call.`;
    } else {
      explanation = `With ${(foldEq * 100).toFixed(1)}% fold equity and ${(eq * 100).toFixed(1)}% equity when called, raising maximizes EV at ${cappedRaiseEV.toFixed(2)} BB. This is better than calling (${cappedCallEV.toFixed(2)} BB).`;
    }

    setResult({
      foldEV: cappedFoldEV,
      callEV: cappedCallEV,
      raiseEV: cappedRaiseEV,
      bestAction,
      explanation,
      potOdds: potOddsPercent,
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
                  className={`text-lg ${errors.potSize ? 'border-red-500' : ''}`}
                />
                {errors.potSize && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.potSize}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="betToCall">Bet to Call (BB)</Label>
                <Input
                  id="betToCall"
                  type="number"
                  value={betToCall}
                  onChange={(e) => setBetToCall(e.target.value)}
                  placeholder="50"
                  className={`text-lg ${errors.betToCall ? 'border-red-500' : ''}`}
                />
                {errors.betToCall && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.betToCall}
                  </p>
                )}
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
                className={`text-lg ${errors.equity ? 'border-red-500' : ''}`}
              />
              {errors.equity ? (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.equity}
                </p>
              ) : (
                <p className="text-xs text-gray-500">Estimated hand equity against opponent's range (0-100%)</p>
              )}
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
                  <p className="text-xs text-gray-500">How much you raise</p>
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
                    className={`text-lg ${errors.foldEquity ? 'border-red-500' : ''}`}
                  />
                  {errors.foldEquity ? (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.foldEquity}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500">Probability opponent folds (0-100%)</p>
                  )}
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
              <TrendingUp className={`w-4 h-4 ${result.callEV >= 0 ? 'text-green-600' : 'text-red-600'}`} />
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
              <TrendingUp className={`w-4 h-4 ${result.raiseEV >= 0 ? 'text-purple-600' : 'text-red-600'}`} />
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
            <span className="font-semibold">{result.potOdds.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-sm text-gray-600">Breakeven Equity</span>
            <span className="font-semibold">{result.breakeven.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-sm text-gray-600">Implied Odds Ratio</span>
            <span className="font-semibold">{result.impliedOdds.toFixed(2)}:1</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-600">Reverse Implied Odds</span>
            <span className="font-semibold">{result.reverseImpliedOdds.toFixed(2)}:1</span>
          </div>
        </CardContent>
      </Card>

      {/* Explanation */}
      <details className="group">
        <summary className="flex items-center gap-2 cursor-pointer p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
          <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" />
          <span className="font-medium text-sm">Why this recommendation?</span>
        </summary>
        <div className="mt-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-700">{result.explanation}</p>
        </div>
      </details>
    </>
  ) : (
    <Card className="bg-gray-50 border-dashed">
      <CardContent className="pt-12 pb-12 text-center">
        <p className="text-gray-500">Enter valid parameters to see EV analysis</p>
      </CardContent>
    </Card>
  );

  return (
    <ToolLayout
      title="EV Calculator"
      description="Calculate expected value for poker decisions with instant feedback"
      inputPanel={inputPanel}
      resultPanel={resultPanel}
      showStickyResult={true}
    />
  );
}
