/**
 * Hand Strength Evolution Query Tool
 * Input: hole cards + community cards
 * Output: current hand type + improvement probability
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, TrendingUp, Calculator, Info } from "lucide-react";
import { toast } from "sonner";

const HAND_TYPES = [
  'NOTHING',
  'PAIR',
  'TWO PAIR',
  'THREE OF A KIND',
  'STRAIGHT',
  'FLUSH',
  'FULL HOUSE',
  'FOUR OF A KIND',
  'STRAIGHT FLUSH',
  'ROYAL FLUSH',
];

export default function HandStrength() {
  const [, navigate] = useLocation();
  const [holeCards, setHoleCards] = useState("");
  const [currentStrength, setCurrentStrength] = useState("PAIR");

  // Query for improvement probability
  const improvementQuery = trpc.poker.handStrength.getImprovementProbability.useQuery(
    { currentStrength },
    { enabled: !!currentStrength }
  );

  // Query for all stats
  const statsQuery = trpc.poker.handStrength.getStats.useQuery({});

  // Query for hand outcomes
  const outcomesQuery = trpc.poker.handStrength.queryOutcomes.useQuery(
    { holeCards, limit: 50 },
    { enabled: holeCards.length >= 2 }
  );

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
          <h1 className="text-4xl md:text-5xl font-bold">Hand Strength Evolution</h1>
          <p className="text-xl text-gray-600 mt-2">
            Query improvement probabilities based on your current hand strength
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
                  Query Parameters
                </CardTitle>
                <CardDescription>
                  Select your current hand strength to see improvement probabilities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="strength">Current Hand Strength</Label>
                  <Select value={currentStrength} onValueChange={setCurrentStrength}>
                    <SelectTrigger className="border-2 border-black">
                      <SelectValue placeholder="Select hand type" />
                    </SelectTrigger>
                    <SelectContent>
                      {HAND_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="holeCards">Hole Cards (optional)</Label>
                  <Input
                    id="holeCards"
                    placeholder="e.g., ♠A ♥K or AK"
                    value={holeCards}
                    onChange={(e) => setHoleCards(e.target.value)}
                    className="border-2 border-black"
                  />
                  <p className="text-sm text-gray-500">
                    Search for specific hole card patterns in the database
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Theory Card */}
            <Card className="border-2 border-blue-500 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Info className="w-5 h-5" />
                  Kolmogorov Axioms Connection
                </CardTitle>
              </CardHeader>
              <CardContent className="text-blue-800">
                <p className="mb-2">
                  This tool applies <strong>conditional probability</strong> from Kolmogorov's 1933 axioms:
                </p>
                <div className="bg-white p-3 rounded font-mono text-sm">
                  P(improvement | current_hand) = P(improvement ∩ current_hand) / P(current_hand)
                </div>
                <p className="mt-2 text-sm">
                  The database contains 100,000+ hand outcomes to compute these probabilities empirically.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Improvement Probability */}
            <Card className="border-2 border-black">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Improvement Probability
                </CardTitle>
              </CardHeader>
              <CardContent>
                {improvementQuery.isLoading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-3/4" />
                    <div className="h-8 bg-gray-200 rounded w-1/2" />
                  </div>
                ) : improvementQuery.data ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
                      <span className="font-medium">Current Hand</span>
                      <span className="text-2xl font-bold">{improvementQuery.data.handType}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-green-50 rounded">
                      <span className="font-medium">Improve on Turn</span>
                      <span className="text-2xl font-bold text-green-600">
                        {improvementQuery.data.improvementToTurnPct?.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-blue-50 rounded">
                      <span className="font-medium">Improve on River</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {improvementQuery.data.improvementToRiverPct?.toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 text-center">
                      Based on {improvementQuery.data.totalSamples?.toLocaleString()} samples
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Select a hand type to see probabilities</p>
                )}
              </CardContent>
            </Card>

            {/* All Stats Table */}
            <Card className="border-2 border-black">
              <CardHeader>
                <CardTitle>All Hand Type Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                {statsQuery.isLoading ? (
                  <div className="animate-pulse space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-6 bg-gray-200 rounded" />
                    ))}
                  </div>
                ) : statsQuery.data && statsQuery.data.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-black">
                          <th className="text-left py-2">Hand Type</th>
                          <th className="text-right py-2">Turn %</th>
                          <th className="text-right py-2">River %</th>
                          <th className="text-right py-2">Samples</th>
                        </tr>
                      </thead>
                      <tbody>
                        {statsQuery.data.map((stat) => (
                          <tr key={stat.handType} className="border-b border-gray-200">
                            <td className="py-2 font-medium">{stat.handType}</td>
                            <td className="text-right py-2">
                              {stat.improvementToTurnPct?.toFixed(1)}%
                            </td>
                            <td className="text-right py-2">
                              {stat.improvementToRiverPct?.toFixed(1)}%
                            </td>
                            <td className="text-right py-2 text-gray-500">
                              {stat.totalCount?.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500">No statistics available. Run the preprocessing script first.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Hand Outcomes Search Results */}
        {holeCards.length >= 2 && (
          <Card className="mt-8 border-2 border-black">
            <CardHeader>
              <CardTitle>Hand Outcomes for "{holeCards}"</CardTitle>
              <CardDescription>
                Showing up to 50 matching hands from the database
              </CardDescription>
            </CardHeader>
            <CardContent>
              {outcomesQuery.isLoading ? (
                <div className="animate-pulse space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-6 bg-gray-200 rounded" />
                  ))}
                </div>
              ) : outcomesQuery.data && outcomesQuery.data.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-black">
                        <th className="text-left py-2">Hole Cards</th>
                        <th className="text-left py-2">Flop</th>
                        <th className="text-left py-2">Flop Strength</th>
                        <th className="text-left py-2">Turn Strength</th>
                        <th className="text-left py-2">River Strength</th>
                      </tr>
                    </thead>
                    <tbody>
                      {outcomesQuery.data.slice(0, 20).map((outcome) => (
                        <tr key={outcome.id} className="border-b border-gray-200">
                          <td className="py-2 font-mono">{outcome.holeCards}</td>
                          <td className="py-2 font-mono text-xs">{outcome.flop}</td>
                          <td className="py-2">{outcome.flopStrength}</td>
                          <td className="py-2">{outcome.turnStrength}</td>
                          <td className="py-2">{outcome.riverStrength}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No matching hands found</p>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
