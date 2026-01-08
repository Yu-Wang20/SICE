/**
 * Pot Odds Decision Engine
 * Input: pot size, bet size, outs
 * Output: breakeven equity, call/fold recommendation
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Calculator, TrendingUp, AlertTriangle, CheckCircle, XCircle, Info } from "lucide-react";

export default function PotOdds() {
  const [, navigate] = useLocation();
  const [potSize, setPotSize] = useState(100);
  const [betSize, setBetSize] = useState(50);
  const [outs, setOuts] = useState(9);

  // Calculate pot odds
  const potOddsQuery = trpc.poker.potOdds.calculate.useQuery(
    { potSize, betSize, outs },
    { enabled: potSize > 0 && betSize > 0 }
  );

  const result = potOddsQuery.data;

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
          <h1 className="text-4xl md:text-5xl font-bold">Pot Odds Decision Engine</h1>
          <p className="text-xl text-gray-600 mt-2">
            Calculate breakeven equity and get call/fold recommendations
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
                  <Calculator className="w-5 h-5" />
                  Input Parameters
                </CardTitle>
                <CardDescription>
                  Enter the current pot size, facing bet, and your outs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Pot Size */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label htmlFor="potSize">Pot Size (BB)</Label>
                    <span className="font-mono font-bold">{potSize} BB</span>
                  </div>
                  <Slider
                    id="potSize"
                    min={10}
                    max={500}
                    step={10}
                    value={[potSize]}
                    onValueChange={([v]) => setPotSize(v)}
                    className="w-full"
                  />
                  <Input
                    type="number"
                    value={potSize}
                    onChange={(e) => setPotSize(Number(e.target.value))}
                    className="border-2 border-black"
                  />
                </div>

                {/* Bet Size */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label htmlFor="betSize">Facing Bet (BB)</Label>
                    <span className="font-mono font-bold">{betSize} BB</span>
                  </div>
                  <Slider
                    id="betSize"
                    min={5}
                    max={200}
                    step={5}
                    value={[betSize]}
                    onValueChange={([v]) => setBetSize(v)}
                    className="w-full"
                  />
                  <Input
                    type="number"
                    value={betSize}
                    onChange={(e) => setBetSize(Number(e.target.value))}
                    className="border-2 border-black"
                  />
                </div>

                {/* Outs */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label htmlFor="outs">Number of Outs</Label>
                    <span className="font-mono font-bold">{outs} outs</span>
                  </div>
                  <Slider
                    id="outs"
                    min={0}
                    max={20}
                    step={1}
                    value={[outs]}
                    onValueChange={([v]) => setOuts(v)}
                    className="w-full"
                  />
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <button
                      onClick={() => setOuts(4)}
                      className="p-2 border border-gray-300 rounded hover:bg-gray-100"
                    >
                      Gutshot (4)
                    </button>
                    <button
                      onClick={() => setOuts(8)}
                      className="p-2 border border-gray-300 rounded hover:bg-gray-100"
                    >
                      OESD (8)
                    </button>
                    <button
                      onClick={() => setOuts(9)}
                      className="p-2 border border-gray-300 rounded hover:bg-gray-100"
                    >
                      Flush (9)
                    </button>
                    <button
                      onClick={() => setOuts(15)}
                      className="p-2 border border-gray-300 rounded hover:bg-gray-100"
                    >
                      Combo (15)
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Theory Card */}
            <Card className="border-2 border-purple-500 bg-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <Info className="w-5 h-5" />
                  Doob's Martingale Connection
                </CardTitle>
              </CardHeader>
              <CardContent className="text-purple-800">
                <p className="mb-2">
                  Pot odds connect to <strong>Doob's Martingale Theory</strong> (1953):
                </p>
                <div className="bg-white p-3 rounded font-mono text-sm space-y-1">
                  <div>E[X_n+1 | X_1, ..., X_n] = X_n</div>
                  <div className="text-xs text-gray-600">Expected future value equals current value</div>
                </div>
                <p className="mt-2 text-sm">
                  Optimal betting ensures your EV trajectory is a martingale - no systematic drift.
                  Call when equity {">"} breakeven equity.
                </p>
              </CardContent>
            </Card>

            {/* Prospect Theory Warning */}
            <Card className="border-2 border-orange-500 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <AlertTriangle className="w-5 h-5" />
                  Behavioral Bias Warning
                </CardTitle>
              </CardHeader>
              <CardContent className="text-orange-800">
                <p className="mb-2">
                  <strong>Tversky & Kahneman's Prospect Theory</strong> (1979) shows humans:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Overweight losses vs gains (loss aversion)</li>
                  <li>Fold too often when facing large bets</li>
                  <li>Distort probabilities near 0% and 100%</li>
                </ul>
                <p className="mt-2 text-sm font-medium">
                  Trust the math, not your gut feeling!
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Main Result */}
            <Card className={`border-4 ${
              result?.recommendation === 'CALL' ? 'border-green-500 bg-green-50' :
              result?.recommendation === 'FOLD' ? 'border-red-500 bg-red-50' :
              'border-yellow-500 bg-yellow-50'
            }`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  {result?.recommendation === 'CALL' && <CheckCircle className="w-8 h-8 text-green-600" />}
                  {result?.recommendation === 'FOLD' && <XCircle className="w-8 h-8 text-red-600" />}
                  {result?.recommendation === 'MARGINAL' && <AlertTriangle className="w-8 h-8 text-yellow-600" />}
                  Recommendation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-6xl font-bold text-center py-4 ${
                  result?.recommendation === 'CALL' ? 'text-green-600' :
                  result?.recommendation === 'FOLD' ? 'text-red-600' :
                  'text-yellow-600'
                }`}>
                  {result?.recommendation || '---'}
                </div>
              </CardContent>
            </Card>

            {/* Detailed Calculations */}
            <Card className="border-2 border-black">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Detailed Calculations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded">
                        <div className="text-sm text-gray-600">Pot Odds</div>
                        <div className="text-2xl font-bold font-mono">{result.potOdds}</div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded">
                        <div className="text-sm text-gray-600">Implied Odds</div>
                        <div className="text-2xl font-bold font-mono">{result.impliedOdds}x</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                        <span>Breakeven Equity</span>
                        <span className="text-xl font-bold text-red-600">{result.breakevenEquity}%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                        <span>Your Equity (Flop)</span>
                        <span className="text-xl font-bold text-blue-600">{result.equityOnFlop}%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                        <span>Your Equity (Turn)</span>
                        <span className="text-xl font-bold text-green-600">{result.equityOnTurn}%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                        <span>Precise Equity (2 cards)</span>
                        <span className="text-xl font-bold text-purple-600">{result.preciseEquity}%</span>
                      </div>
                    </div>

                    {/* Visual Comparison */}
                    <div className="mt-6">
                      <div className="text-sm text-gray-600 mb-2">Equity vs Breakeven</div>
                      <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="absolute h-full bg-red-400"
                          style={{ width: `${result.breakevenEquity}%` }}
                        />
                        <div
                          className="absolute h-full bg-green-500 opacity-70"
                          style={{ width: `${result.preciseEquity}%` }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                          {result.preciseEquity > result.breakevenEquity ? 'POSITIVE EV' : 'NEGATIVE EV'}
                        </div>
                      </div>
                      <div className="flex justify-between text-xs mt-1">
                        <span className="text-red-600">Breakeven: {result.breakevenEquity}%</span>
                        <span className="text-green-600">Your Equity: {result.preciseEquity}%</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    Enter values to see calculations
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Formula Reference */}
            <Card className="border-2 border-black">
              <CardHeader>
                <CardTitle>Formula Reference</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 font-mono text-sm">
                <div className="p-2 bg-gray-50 rounded">
                  <div className="text-gray-600">Breakeven Equity:</div>
                  <div>BE = Bet / (Pot + Bet)</div>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <div className="text-gray-600">Rule of 4 (Flop):</div>
                  <div>Equity ≈ Outs × 4</div>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <div className="text-gray-600">Rule of 2 (Turn):</div>
                  <div>Equity ≈ Outs × 2</div>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <div className="text-gray-600">Decision Rule:</div>
                  <div>CALL if Equity {">"} BE, else FOLD</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
