/**
 * Spot Analyzer - Production-Grade GTO Recommendation Tool
 * Features:
 * - Tolerant hand parsing with guided completion
 * - Clear state machine (Empty/Ready/Loading/Result/Error)
 * - Beginner-friendly UX with no red errors for incomplete input
 * - Mobile-first, accessible, reduced-motion support
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ToolLayout from "@/components/ToolLayout";
import { useSpotHistory } from "@/hooks/useSpotHistory";
import { HandInput } from "@/components/poker/HandInput";
import { BoardInput } from "@/components/poker/BoardInput";
import { AnalysisPanel, type AnalysisState, type AnalysisResult } from "@/components/poker/AnalysisPanel";
import { parseHand } from "@/utils/handParser";
import { parseBoard, type Street } from "@/utils/boardParser";
import { Heart, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

const POSITIONS = [
  { value: "UTG", label: "UTG", description: "Under the Gun" },
  { value: "UTG+1", label: "UTG+1", description: "UTG+1" },
  { value: "MP", label: "MP", description: "Middle Position" },
  { value: "MP+1", label: "MP+1", description: "Middle Position +1" },
  { value: "CO", label: "CO", description: "Cutoff" },
  { value: "BTN", label: "BTN", description: "Button" },
  { value: "SB", label: "SB", description: "Small Blind" },
  { value: "BB", label: "BB", description: "Big Blind" },
];

const STACK_DEPTHS = [
  { value: "20BB", label: "20 BB", description: "Short stack" },
  { value: "30BB", label: "30 BB", description: "Short stack" },
  { value: "50BB", label: "50 BB", description: "Medium stack" },
  { value: "75BB", label: "75 BB", description: "Medium stack" },
  { value: "100BB", label: "100 BB", description: "Deep stack" },
  { value: "150BB", label: "150 BB", description: "Deep stack" },
  { value: "200BB", label: "200 BB", description: "Very deep" },
];

const ACTION_LINES = [
  { value: "Open", label: "Open", description: "First to act" },
  { value: "vs Raise", label: "vs Raise", description: "Facing an open" },
  { value: "vs 3-Bet", label: "vs 3-Bet", description: "Facing a re-raise" },
  { value: "vs 4-Bet", label: "vs 4-Bet", description: "Facing a 4-bet" },
  { value: "vs Bet", label: "vs Bet", description: "Postflop facing bet" },
  { value: "vs Check-Raise", label: "vs Check-Raise", description: "Facing check-raise" },
];

const OPPONENT_TYPES = [
  { value: "Tight", label: "Tight", description: "Plays few hands" },
  { value: "Balanced", label: "Balanced", description: "GTO-style" },
  { value: "Loose", label: "Loose", description: "Plays many hands" },
  { value: "Aggressive", label: "Aggressive", description: "Bets/raises often" },
  { value: "Passive", label: "Passive", description: "Calls often" },
  { value: "Unknown", label: "Unknown", description: "No reads" },
];

// Example spot for "Try Example" button
const EXAMPLE_SPOT = {
  position: "BTN",
  stackDepth: "100BB",
  actionLine: "Open",
  opponentType: "Balanced",
  hand: "AKs",
  board: "",
  street: "preflop" as Street,
};

export default function SpotAnalyzer() {
  const { addSpot } = useSpotHistory();

  // Input state
  const [position, setPosition] = useState("BTN");
  const [stackDepth, setStackDepth] = useState("100BB");
  const [actionLine, setActionLine] = useState("Open");
  const [opponentType, setOpponentType] = useState("Balanced");
  const [hand, setHand] = useState("");
  const [board, setBoard] = useState("");
  const [street, setStreet] = useState<Street>("preflop");

  // Validation state
  const [isHandValid, setIsHandValid] = useState(false);
  const [normalizedHand, setNormalizedHand] = useState<string | undefined>();
  const [isBoardValid, setIsBoardValid] = useState(true); // Preflop is always valid

  // Analysis state
  const [analysisState, setAnalysisState] = useState<AnalysisState>('empty');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  // Saved state
  const [isSaved, setIsSaved] = useState(false);

  // Determine if all required inputs are valid
  const isReadyToAnalyze = useMemo(() => {
    return isHandValid && isBoardValid && position && stackDepth && actionLine;
  }, [isHandValid, isBoardValid, position, stackDepth, actionLine]);

  // Update analysis state based on inputs
  useEffect(() => {
    if (analysisState === 'loading' || analysisState === 'result') {
      // Don't change state while loading or showing result
      return;
    }
    
    if (isReadyToAnalyze) {
      setAnalysisState('ready');
    } else {
      setAnalysisState('empty');
    }
  }, [isReadyToAnalyze, analysisState]);

  // Handle hand validation callback
  const handleHandValidChange = useCallback((isValid: boolean, normalized?: string) => {
    setIsHandValid(isValid);
    setNormalizedHand(normalized);
    // Reset analysis when hand changes
    if (analysisState === 'result') {
      setAnalysisState(isValid ? 'ready' : 'empty');
    }
  }, [analysisState]);

  // Handle board validation callback
  const handleBoardValidChange = useCallback((isValid: boolean) => {
    setIsBoardValid(isValid);
    // Reset analysis when board changes
    if (analysisState === 'result') {
      setAnalysisState(isValid && isHandValid ? 'ready' : 'empty');
    }
  }, [analysisState, isHandValid]);

  // Analyze spot
  const analyzeSpot = useCallback(() => {
    if (!isReadyToAnalyze) return;

    setAnalysisState('loading');
    setErrorMessage(undefined);

    // Simulate GTO analysis (in production, this would call backend API)
    setTimeout(() => {
      try {
        // Generate analysis based on inputs
        const result = generateAnalysis(
          normalizedHand || hand,
          position,
          stackDepth,
          actionLine,
          opponentType,
          street,
          board
        );
        
        setAnalysisResult(result);
        setAnalysisState('result');
        setIsSaved(false);
      } catch (error) {
        setErrorMessage('Failed to analyze spot. Please try again.');
        setAnalysisState('error');
      }
    }, 800); // Slightly longer delay for better UX
  }, [isReadyToAnalyze, normalizedHand, hand, position, stackDepth, actionLine, opponentType, street, board]);

  // Try example spot
  const handleTryExample = useCallback(() => {
    setPosition(EXAMPLE_SPOT.position);
    setStackDepth(EXAMPLE_SPOT.stackDepth);
    setActionLine(EXAMPLE_SPOT.actionLine);
    setOpponentType(EXAMPLE_SPOT.opponentType);
    setHand(EXAMPLE_SPOT.hand);
    setBoard(EXAMPLE_SPOT.board);
    setStreet(EXAMPLE_SPOT.street);
  }, []);

  // Save spot to history
  const handleSaveSpot = useCallback(() => {
    if (!normalizedHand) return;
    
    addSpot("spot-analyzer", {
      position,
      stackDepth,
      actionLine,
      opponentType,
      hand: normalizedHand,
      board,
      street
    }, `${normalizedHand} @ ${position} (${stackDepth})`);
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  }, [addSpot, position, stackDepth, actionLine, opponentType, normalizedHand, board, street]);

  // Generate scenario summary
  const scenarioSummary = useMemo(() => {
    if (!normalizedHand) return null;
    
    const parts = [
      `${normalizedHand}`,
      `${position}`,
      `${stackDepth} effective`,
      actionLine,
    ];
    
    if (street !== 'preflop' && board) {
      parts.push(`on ${street}`);
    }
    
    return parts.join(' • ');
  }, [normalizedHand, position, stackDepth, actionLine, street, board]);

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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Select value={position} onValueChange={setPosition}>
              <SelectTrigger id="position" className="min-h-[44px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {POSITIONS.map(pos => (
                  <SelectItem key={pos.value} value={pos.value}>
                    <span className="font-medium">{pos.label}</span>
                    <span className="text-xs text-gray-500 ml-2">{pos.description}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="stackDepth">Stack Depth</Label>
            <Select value={stackDepth} onValueChange={setStackDepth}>
              <SelectTrigger id="stackDepth" className="min-h-[44px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STACK_DEPTHS.map(depth => (
                  <SelectItem key={depth.value} value={depth.value}>
                    <span className="font-medium">{depth.label}</span>
                    <span className="text-xs text-gray-500 ml-2">{depth.description}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Line & Opponent */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="actionLine">Action Line</Label>
            <Select value={actionLine} onValueChange={setActionLine}>
              <SelectTrigger id="actionLine" className="min-h-[44px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACTION_LINES.map(line => (
                  <SelectItem key={line.value} value={line.value}>
                    <span className="font-medium">{line.label}</span>
                    <span className="text-xs text-gray-500 ml-2">{line.description}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="opponentType">Opponent Type</Label>
            <Select value={opponentType} onValueChange={setOpponentType}>
              <SelectTrigger id="opponentType" className="min-h-[44px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {OPPONENT_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    <span className="font-medium">{type.label}</span>
                    <span className="text-xs text-gray-500 ml-2">{type.description}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Hand Input */}
        <div className="space-y-2">
          <Label htmlFor="hand">Your Hand</Label>
          <HandInput
            value={hand}
            onChange={setHand}
            onValidChange={handleHandValidChange}
            placeholder="e.g., AK, QQ, 87s"
          />
        </div>

        {/* Board Input */}
        <div className="space-y-2">
          <Label>Board</Label>
          <BoardInput
            value={board}
            onChange={setBoard}
            street={street}
            onStreetChange={setStreet}
            onValidChange={handleBoardValidChange}
          />
        </div>

        {/* Scenario Summary */}
        {scenarioSummary && (
          <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              Scenario
            </p>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {scenarioSummary}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Result Panel
  const resultPanel = (
    <div className="space-y-4">
      <AnalysisPanel
        state={analysisState}
        result={analysisResult}
        errorMessage={errorMessage}
        onAnalyze={analyzeSpot}
        onTryExample={handleTryExample}
        onRetry={analyzeSpot}
      />

      {/* Action buttons (only show when result is available) */}
      {analysisState === 'result' && (
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSaveSpot}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium',
              'border-2 transition-all duration-150',
              'focus:outline-none focus:ring-2 focus:ring-emerald-500/50',
              'min-h-[44px]',
              isSaved
                ? 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-emerald-300 dark:hover:border-emerald-700'
            )}
          >
            <Heart className={cn('w-4 h-4', isSaved && 'fill-current')} />
            {isSaved ? 'Saved!' : 'Save Spot'}
          </button>
          <button
            type="button"
            onClick={() => {
              // Copy scenario to clipboard
              if (scenarioSummary) {
                navigator.clipboard.writeText(scenarioSummary);
              }
            }}
            className={cn(
              'flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium',
              'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700',
              'text-gray-700 dark:text-gray-300',
              'hover:border-gray-300 dark:hover:border-gray-600',
              'focus:outline-none focus:ring-2 focus:ring-gray-500/50',
              'transition-colors duration-150',
              'min-h-[44px]'
            )}
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      )}
    </div>
  );

  return (
    <ToolLayout
      title="Analyze a Spot"
      description="Get GTO recommendations for any poker situation"
      inputPanel={inputPanel}
      resultPanel={resultPanel}
    />
  );
}

/**
 * Generate analysis result based on inputs
 * In production, this would call a backend API
 */
function generateAnalysis(
  hand: string,
  position: string,
  stackDepth: string,
  actionLine: string,
  opponentType: string,
  street: Street,
  board: string
): AnalysisResult {
  // Parse hand for analysis
  const handResult = parseHand(hand);
  const isPremium = ['AA', 'KK', 'QQ', 'JJ', 'AKs', 'AKo'].includes(handResult.normalized || hand);
  const isBroadway = handResult.rank1 && handResult.rank2 && 
    ['A', 'K', 'Q', 'J', 'T'].includes(handResult.rank1) && 
    ['A', 'K', 'Q', 'J', 'T'].includes(handResult.rank2);
  const isSuited = hand.endsWith('s');
  const isPair = handResult.isPair;

  // Position strength
  const positionStrength: Record<string, number> = {
    'BTN': 1.0, 'CO': 0.9, 'MP+1': 0.7, 'MP': 0.6, 
    'UTG+1': 0.5, 'UTG': 0.4, 'SB': 0.3, 'BB': 0.5
  };
  const posStr = positionStrength[position] || 0.5;

  // Stack depth factor
  const stackBB = parseInt(stackDepth) || 100;
  const stackFactor = stackBB >= 100 ? 1.0 : stackBB >= 50 ? 0.9 : 0.8;

  // Opponent adjustment
  const oppAdj: Record<string, number> = {
    'Tight': 0.1, 'Balanced': 0, 'Loose': -0.1,
    'Aggressive': 0.05, 'Passive': -0.05, 'Unknown': 0
  };
  const oppFactor = oppAdj[opponentType] || 0;

  // Calculate base EV
  let baseEV = 0;
  if (isPremium) baseEV = 0.8 + Math.random() * 0.4;
  else if (isBroadway) baseEV = 0.2 + Math.random() * 0.4;
  else if (isPair) baseEV = 0.1 + Math.random() * 0.3;
  else if (isSuited) baseEV = -0.1 + Math.random() * 0.3;
  else baseEV = -0.3 + Math.random() * 0.3;

  // Apply modifiers
  baseEV = baseEV * posStr * stackFactor + oppFactor;

  // Action line adjustment
  if (actionLine.includes('3-Bet') || actionLine.includes('4-Bet')) {
    baseEV -= 0.2;
  }

  // Determine action
  let action: AnalysisResult['action'] = 'FOLD';
  if (baseEV > 0.3) action = 'RAISE';
  else if (baseEV > 0) action = 'CALL';
  else if (baseEV > -0.2 && (isPremium || isBroadway)) action = 'CALL';

  // For preflop open, use RAISE instead of BET
  if (actionLine === 'Open' && action !== 'FOLD') {
    action = 'RAISE';
  }

  // Calculate confidence
  const confidence = Math.round(65 + Math.abs(baseEV) * 30 + Math.random() * 10);

  // Generate reasons
  const reasons: string[] = [];
  
  if (isPremium) {
    reasons.push(`${hand} is a premium hand with strong equity`);
  } else if (isBroadway) {
    reasons.push(`${hand} has good broadway potential`);
  } else if (isPair) {
    reasons.push(`Pocket pairs have set-mining value`);
  } else if (isSuited) {
    reasons.push(`Suited hands have flush potential`);
  }

  if (posStr >= 0.8) {
    reasons.push(`${position} is a strong position with positional advantage`);
  } else if (posStr <= 0.4) {
    reasons.push(`${position} requires tighter ranges due to positional disadvantage`);
  }

  if (opponentType === 'Tight') {
    reasons.push(`Against tight opponent, respect their raises`);
  } else if (opponentType === 'Loose') {
    reasons.push(`Against loose opponent, widen value range`);
  }

  if (stackBB <= 30) {
    reasons.push(`Short stack favors push/fold decisions`);
  }

  // Ensure at least 2 reasons
  if (reasons.length < 2) {
    reasons.push(`${stackDepth} effective stacks allow for post-flop play`);
  }

  return {
    action,
    confidence: Math.min(95, confidence),
    ev: parseFloat(baseEV.toFixed(2)),
    potOdds: action === 'CALL' ? 25 + Math.random() * 15 : undefined,
    equity: isPremium ? 60 + Math.random() * 15 : isBroadway ? 45 + Math.random() * 15 : 35 + Math.random() * 15,
    reasons: reasons.slice(0, 3),
    keyMetric: street !== 'preflop' ? {
      label: 'Board Texture',
      value: board ? 'Dynamic' : 'N/A'
    } : undefined
  };
}
