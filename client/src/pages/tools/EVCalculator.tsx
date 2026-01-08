/**
 * EV Calculator - Expected Value Analysis Tool
 * Inspired by Preflop+ and GTO Wizard
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Calculator, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useLocation } from "wouter";

interface EVResult {
  foldEV: number;
  callEV: number;
  raiseEV: number;
  bestAction: 'FOLD' | 'CALL' | 'RAISE';
  explanation: string;
}

export default function EVCalculator() {
  const [, navigate] = useLocation();
  
  // Input state
  const [potSize, setPotSize] = useState<string>("100");
  const [betToCall, setBetToCall] = useState<string>("50");
  const [equity, setEquity] = useState<string>("35");
  const [raiseSize, setRaiseSize] = useState<string>("150");
  const [foldEquity, setFoldEquity] = useState<string>("30");
  
  const [result, setResult] = useState<EVResult | null>(null);

  const calculateEV = () => {
    const pot = parseFloat(potSize) || 0;
    const bet = parseFloat(betToCall) || 0;
    const eq = (parseFloat(equity) || 0) / 100;
    const raise = parseFloat(raiseSize) || 0;
    const foldEq = (parseFloat(foldEquity) || 0) / 100;

    // Fold EV is always 0 (you lose nothing more)
    const foldEV = 0;

    // Call EV = (equity * pot after call) - ((1 - equity) * bet)
    const potAfterCall = pot + bet + bet; // pot + villain bet + hero call
    const callEV = (eq * (pot + bet)) - ((1 - eq) * bet);

    // Raise EV = (fold equity * pot) + ((1 - fold equity) * (equity * pot after raise - (1 - equity) * raise))
    const potAfterRaise = pot + bet + raise;
    const raiseEVWhenCalled = (eq * potAfterRaise) - ((1 - eq) * raise);
    const raiseEV = (foldEq * (pot + bet)) + ((1 - foldEq) * raiseEVWhenCalled);

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
      explanation = `With ${equity}% equity against villain's range, folding minimizes losses. Your call EV is ${callEV.toFixed(2)} BB which is negative.`;
    } else if (bestAction === 'CALL') {
      explanation = `With ${equity}% equity, calling is profitable. You gain ${callEV.toFixed(2)} BB on average. Raising would require more fold equity.`;
    } else {
      explanation = `With ${foldEquity}% fold equity and ${equity}% equity when called, raising maximizes EV at ${raiseEV.toFixed(2)} BB.`;
    }

    setResult({
      foldEV,
      callEV,
      raiseEV,
      bestAction,
      explanation
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container py-4">
          <Button variant="ghost" onClick={() => navigate("/tools")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tools
          </Button>
          <h1 className="text-4xl font-bold">EV Calculator</h1>
          <p className="text-gray-600 mt-2">Calculate expected value for different poker actions</p>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Scenario Parameters
              </CardTitle>
              <CardDescription>
                Enter the current situation to calculate EV for each action
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
                <Label htmlFor="equity">Your Equity vs Villain Range (%)</Label>
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
                <h4 className="font-medium mb-3">Raise Parameters (Optional)</h4>
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

              <Button onClick={calculateEV} className="w-full" size="lg">
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
                      <div className={`flex items-center justify-between p-4 rounded-lg ${result.bestAction === 'FOLD' ? 'bg-blue-50 border-2 border-blue-500' : 'bg-gray-50'}`}>
                        <div className="flex items-center gap-3">
                          <Minus className="w-5 h-5 text-gray-500" />
                          <span className="font-medium">FOLD</span>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{result.foldEV.toFixed(2)} BB</div>
                          {result.bestAction === 'FOLD' && (
                            <span className="text-xs text-blue-600 font-medium">BEST ACTION</span>
                          )}
                        </div>
                      </div>

                      {/* Call */}
                      <div className={`flex items-center justify-between p-4 rounded-lg ${result.bestAction === 'CALL' ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50'}`}>
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
                            <span className="text-xs text-green-600 font-medium">BEST ACTION</span>
                          )}
                        </div>
                      </div>

                      {/* Raise */}
                      <div className={`flex items-center justify-between p-4 rounded-lg ${result.bestAction === 'RAISE' ? 'bg-purple-50 border-2 border-purple-500' : 'bg-gray-50'}`}>
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
                            <span className="text-xs text-purple-600 font-medium">BEST ACTION</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Explanation */}
                <Card>
                  <CardHeader>
                    <CardTitle>Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{result.explanation}</p>
                    
                    <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                      <h4 className="font-medium text-yellow-800 mb-2">💡 GTO Insight</h4>
                      <p className="text-sm text-yellow-700">
                        In GTO play, we often mix actions to remain unexploitable. 
                        This calculator shows the pure EV of each action, but optimal play 
                        may involve mixing frequencies based on board texture and opponent tendencies.
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
                <CardTitle>EV Formulas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm font-mono bg-gray-50 p-4 rounded">
                <div>
                  <span className="text-gray-500">Call EV =</span>
                  <span className="ml-2">(Equity × Pot) - ((1 - Equity) × Bet)</span>
                </div>
                <div>
                  <span className="text-gray-500">Raise EV =</span>
                  <span className="ml-2">(FoldEq × Pot) + ((1 - FoldEq) × EV when called)</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
