/**
 * Spot Analyzer - Main GTO Recommendation Tool (P0-1 Primary Entry Point)
 * Quick spot analysis with real-time calculations
 * Inspired by Preflop+ and GTO Wizard
 */

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Heart, Share2, ChevronDown } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { useSpotHistory } from "@/hooks/useSpotHistory";

interface SpotAnalysis {
  action: 'FOLD' | 'CALL' | 'RAISE';
  confidence: number;
  ev: number;
  frequency: number;
  reasoning: string;
  alternatives: Array<{
    action: 'FOLD' | 'CALL' | 'RAISE';
    ev: number;
    frequency: number;
  }>;
}

const POSITIONS = [
  "UTG", "UTG+1", "MP", "MP+1", "CO", "BTN", "SB", "BB"
];

const STACK_DEPTHS = [
  "20BB", "30BB", "50BB", "75BB", "100BB", "150BB", "200BB"
];

const ACTION_LINES = [
  "Open", "vs Raise", "vs 3-Bet", "vs 4-Bet", "vs Bet", "vs Check-Raise"
];

const OPPONENT_TYPES = [
  "Tight", "Balanced", "Loose", "Aggressive", "Passive", "Unknown"
];

export default function SpotAnalyzer() {
  const { addSpot } = useSpotHistory();

  // Input state
  const [position, setPosition] = useState("BTN");
  const [stackDepth, setStackDepth] = useState("50BB");
  const [actionLine, setActionLine] = useState("Open");
  const [opponentType, setOpponentType] = useState("Balanced");
  const [hand, setHand] = useState("AK");
  const [board, setBoard] = useState("");

  const [analysis, setAnalysis] = useState<SpotAnalysis | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Real-time analysis calculation
  const analyzeSpot = useCallback(() => {
    setIsCalculating(true);

    // Simulate GTO analysis (in production, this would call backend API)
    setTimeout(() => {
      // Mock analysis based on inputs
      const baseEV = Math.random() * 2 - 1; // -1 to 1 BB
      const confidence = 0.7 + Math.random() * 0.25; // 70-95%
      
      let action: 'FOLD' | 'CALL' | 'RAISE' = 'FOLD';
      if (baseEV > 0.2) action = 'RAISE';
      else if (baseEV > -0.1) action = 'CALL';

      const analysis: SpotAnalysis = {
        action,
        confidence,
        ev: baseEV,
        frequency: action === 'FOLD' ? 0 : (action === 'RAISE' ? 0.6 + Math.random() * 0.3 : 0.4 + Math.random() * 0.3),
        reasoning: generateReasoning(action, position, stackDepth, opponentType),
        alternatives: [
          {
            action: 'FOLD',
            ev: baseEV - 0.3,
            frequency: 0
          },
          {
            action: 'CALL',
            ev: baseEV - 0.1,
            frequency: 0.3
          },
          {
            action: 'RAISE',
            ev: baseEV + 0.1,
            frequency: 0.7
          }
        ]
      };

      setAnalysis(analysis);
      setIsCalculating(false);
      setIsSaved(false);
    }, 300);
  }, [position, stackDepth, actionLine, opponentType, hand, board]);

  // Auto-calculate on input change
  useEffect(() => {
    const timer = setTimeout(() => {
      analyzeSpot();
    }, 200);
    return () => clearTimeout(timer);
  }, [analyzeSpot]);

  const handleSaveSpot = () => {
    addSpot("spot-analyzer", {
      position,
      stackDepth,
      actionLine,
      opponentType,
      hand,
      board
    }, `${hand} @ ${position} (${stackDepth})`);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  // Input Panel
  const inputPanel = (
    <Card>
      <CardHeader>
        <CardTitle>Spot Details</CardTitle>
        <CardDescription>
          Describe your poker situation for GTO recommendation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Position & Stack */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Select value={position} onValueChange={setPosition}>
              <SelectTrigger id="position">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {POSITIONS.map(pos => (
                  <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="stackDepth">Stack Depth</Label>
            <Select value={stackDepth} onValueChange={setStackDepth}>
              <SelectTrigger id="stackDepth">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STACK_DEPTHS.map(depth => (
                  <SelectItem key={depth} value={depth}>{depth}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Line & Opponent */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="actionLine">Action Line</Label>
            <Select value={actionLine} onValueChange={setActionLine}>
              <SelectTrigger id="actionLine">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACTION_LINES.map(line => (
                  <SelectItem key={line} value={line}>{line}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="opponentType">Opponent Type</Label>
            <Select value={opponentType} onValueChange={setOpponentType}>
              <SelectTrigger id="opponentType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {OPPONENT_TYPES.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Hand & Board */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="hand">Your Hand</Label>
            <Input
              id="hand"
              value={hand}
              onChange={(e) => setHand(e.target.value.toUpperCase())}
              placeholder="AK, 77, etc."
              maxLength={4}
              className="text-lg font-mono"
            />
            <p className="text-xs text-gray-500">e.g., AK, QQ, 87s</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="board">Board (optional)</Label>
            <Input
              id="board"
              value={board}
              onChange={(e) => setBoard(e.target.value.toUpperCase())}
              placeholder="AK2, empty for preflop"
              maxLength={6}
              className="text-lg font-mono"
            />
            <p className="text-xs text-gray-500">Preflop if empty</p>
          </div>
        </div>

        {/* Status */}
        <div className="text-xs text-gray-500 flex items-center gap-1">
          {isCalculating && (
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          )}
          {isCalculating ? "Analyzing..." : "Live analysis"}
        </div>
      </CardContent>
    </Card>
  );

  // Result Panel
  const resultPanel = analysis ? (
    <>
      {/* Recommended Action - Huge */}
      <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">GTO RECOMMENDATION</p>
            <div className={`text-6xl font-bold mb-3 ${
              analysis.action === 'FOLD' ? 'text-gray-700' :
              analysis.action === 'CALL' ? 'text-green-600' :
              'text-purple-600'
            }`}>
              {analysis.action}
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="text-2xl font-bold text-emerald-600">{(analysis.confidence * 100).toFixed(0)}%</div>
              <span className="text-sm text-gray-600">Confidence</span>
            </div>
            <div className="text-sm text-gray-600">
              {analysis.action === 'FOLD' && 'Fold to preserve chips'}
              {analysis.action === 'CALL' && 'Call for value'}
              {analysis.action === 'RAISE' && 'Raise to maximize EV'}
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
            <span className="text-sm text-gray-600">Expected Value</span>
            <span className={`font-semibold text-lg ${analysis.ev >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analysis.ev >= 0 ? '+' : ''}{analysis.ev.toFixed(2)} BB
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-sm text-gray-600">GTO Frequency</span>
            <span className="font-semibold">{(analysis.frequency * 100).toFixed(0)}%</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-600">Position</span>
            <span className="font-semibold">{position}</span>
          </div>
        </CardContent>
      </Card>

      {/* Action Alternatives */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Action Alternatives</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {analysis.alternatives.map((alt, idx) => (
            <div key={idx} className={`flex items-center justify-between p-3 rounded-lg ${
              alt.action === analysis.action
                ? 'bg-emerald-50 border-2 border-emerald-500'
                : 'bg-gray-50 border border-gray-200'
            }`}>
              <div className="flex items-center gap-2">
                {alt.ev >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className="font-medium text-sm">{alt.action}</span>
              </div>
              <div className="text-right">
                <div className={`text-sm font-semibold ${alt.ev >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {alt.ev >= 0 ? '+' : ''}{alt.ev.toFixed(2)} BB
                </div>
                <div className="text-xs text-gray-500">{(alt.frequency * 100).toFixed(0)}%</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Reasoning (Collapsible) */}
      <details className="group">
        <summary className="flex items-center gap-2 cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" />
          <span className="font-medium text-sm">Why this recommendation?</span>
        </summary>
        <div className="mt-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-700">{analysis.reasoning}</p>
        </div>
      </details>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={handleSaveSpot}
          variant={isSaved ? "default" : "outline"}
          className="flex-1"
        >
          <Heart className={`h-4 w-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
          {isSaved ? 'Saved!' : 'Save Spot'}
        </Button>
        <Button variant="outline" className="flex-1">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>
    </>
  ) : (
    <Card className="bg-gray-50 border-dashed">
      <CardContent className="pt-12 pb-12 text-center">
        <p className="text-gray-500">Enter spot details to see GTO recommendation</p>
      </CardContent>
    </Card>
  );

  return (
    <ToolLayout
      title="Analyze a Spot"
      description="Get instant GTO recommendations for your poker situations"
      inputPanel={inputPanel}
      resultPanel={resultPanel}
      showStickyResult={true}
    />
  );
}

function generateReasoning(action: string, position: string, stackDepth: string, opponentType: string): string {
  const reasons: Record<string, string> = {
    FOLD: `In ${position} with ${stackDepth} stacks against a ${opponentType} opponent, folding preserves your chips for better spots. The risk/reward ratio doesn't justify calling.`,
    CALL: `With ${stackDepth} stacks in ${position}, calling is profitable against this ${opponentType} opponent. You have sufficient equity and implied odds to continue.`,
    RAISE: `Raising in ${position} with ${stackDepth} stacks is optimal against a ${opponentType} opponent. This maximizes your EV through fold equity and position advantage.`
  };
  return reasons[action] || "Analyzing your spot...";
}
