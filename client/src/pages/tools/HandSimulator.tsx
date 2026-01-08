import { useState, useEffect, useMemo } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Play, 
  RotateCcw, 
  ChevronRight, 
  Info, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  User,
  Users,
  Target,
  Zap,
  HelpCircle
} from 'lucide-react';

// PHH Stats (will be loaded from data/phh_stats.json)
const PHH_STATS = {
  overall: { fold_to_cbet: 0.519, call_vs_cbet: 0.362, raise_vs_cbet: 0.119 },
  opponent_types: {
    Balanced: { fold_to_cbet: 0.519, call_vs_cbet: 0.362, raise_vs_cbet: 0.119, description: 'Uses PHH overall averages. Represents typical online player.' },
    Tight: { fold_to_cbet: 0.674, call_vs_cbet: 0.253, raise_vs_cbet: 0.095, description: 'Folds more often, calls less. Plays fewer hands postflop.' },
    Loose: { fold_to_cbet: 0.311, call_vs_cbet: 0.543, raise_vs_cbet: 0.107, description: 'Folds less, calls more. Sticky player who sees many showdowns.' },
    Aggressive: { fold_to_cbet: 0.415, call_vs_cbet: 0.217, raise_vs_cbet: 0.25, description: 'Raises frequently, calls less. Applies maximum pressure.' },
  },
  by_position: {
    BTN: { fold_to_cbet: 0.463, call_vs_cbet: 0.393, raise_vs_cbet: 0.144 },
    CO: { fold_to_cbet: 0.469, call_vs_cbet: 0.390, raise_vs_cbet: 0.142 },
    MP: { fold_to_cbet: 0.476, call_vs_cbet: 0.388, raise_vs_cbet: 0.137 },
    UTG: { fold_to_cbet: 0.480, call_vs_cbet: 0.391, raise_vs_cbet: 0.128 },
    SB: { fold_to_cbet: 0.541, call_vs_cbet: 0.358, raise_vs_cbet: 0.101 },
    BB: { fold_to_cbet: 0.564, call_vs_cbet: 0.330, raise_vs_cbet: 0.106 },
  }
};

// Card ranks and suits
const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
const SUITS = ['♠', '♥', '♦', '♣'];
const POSITIONS = ['BTN', 'CO', 'MP', 'UTG', 'SB', 'BB'];
const OPPONENT_TYPES = ['Balanced', 'Tight', 'Loose', 'Aggressive'] as const;
const STREETS = ['Preflop', 'Flop', 'Turn', 'River'] as const;

type OpponentType = typeof OPPONENT_TYPES[number];
type Street = typeof STREETS[number];

interface GameState {
  heroHand: [string, string];
  heroPosition: string;
  villainPosition: string;
  opponentType: OpponentType;
  stackDepth: number;
  potSize: number;
  board: string[];
  street: Street;
  actionHistory: string[];
  heroAction: string | null;
  villainResponse: string | null;
}

interface Recommendation {
  action: 'Bet' | 'Check' | 'Call' | 'Raise' | 'Fold';
  confidence: number;
  ev: number;
  reasoning: string[];
  alternatives: { action: string; ev: number }[];
}

// Hand classification
function classifyHand(hand: [string, string], board: string[]): string {
  // Simplified hand classification
  const [card1, card2] = hand;
  const rank1 = card1[0];
  const rank2 = card2[0];
  
  if (rank1 === rank2) return 'pair';
  if (['A', 'K'].includes(rank1) && ['A', 'K'].includes(rank2)) return 'premium';
  if (['A', 'K', 'Q'].includes(rank1) || ['A', 'K', 'Q'].includes(rank2)) return 'broadway';
  if (card1[1] === card2[1]) return 'suited';
  return 'offsuit';
}

// Calculate SPR
function calculateSPR(stack: number, pot: number): number {
  return pot > 0 ? stack / pot : 999;
}

// Get opponent response probabilities
function getOpponentStats(opponentType: OpponentType, position: string) {
  const typeStats = PHH_STATS.opponent_types[opponentType];
  const posStats = PHH_STATS.by_position[position as keyof typeof PHH_STATS.by_position] || PHH_STATS.overall;
  
  // Blend type and position stats (60% type, 40% position)
  return {
    fold: typeStats.fold_to_cbet * 0.6 + posStats.fold_to_cbet * 0.4,
    call: typeStats.call_vs_cbet * 0.6 + posStats.call_vs_cbet * 0.4,
    raise: typeStats.raise_vs_cbet * 0.6 + posStats.raise_vs_cbet * 0.4,
  };
}

// Generate recommendation
function generateRecommendation(state: GameState): Recommendation {
  const spr = calculateSPR(state.stackDepth, state.potSize);
  const handClass = classifyHand(state.heroHand, state.board);
  const oppStats = getOpponentStats(state.opponentType, state.villainPosition);
  
  // Calculate EV for different actions
  const betSize = state.potSize * 0.66; // 2/3 pot bet
  const foldEV = 0;
  const checkEV = state.potSize * 0.3; // Simplified
  const betEV = (oppStats.fold * state.potSize) + 
                (oppStats.call * (state.potSize * 0.4)) - 
                (oppStats.raise * betSize * 0.5);
  
  let action: Recommendation['action'] = 'Check';
  let confidence = 0.7;
  let ev = checkEV;
  const reasoning: string[] = [];
  const alternatives: { action: string; ev: number }[] = [];
  
  // Decision logic based on hand class and opponent type
  if (handClass === 'premium' || handClass === 'pair') {
    action = 'Bet';
    ev = betEV;
    confidence = 0.85;
    reasoning.push(`Strong hand (${handClass}) - value betting is profitable`);
    reasoning.push(`Villain folds ${(oppStats.fold * 100).toFixed(0)}% to cbets`);
    reasoning.push(`SPR of ${spr.toFixed(1)} allows for comfortable stack-off`);
  } else if (handClass === 'broadway') {
    if (oppStats.fold > 0.5) {
      action = 'Bet';
      ev = betEV;
      confidence = 0.75;
      reasoning.push(`Villain folds often (${(oppStats.fold * 100).toFixed(0)}%) - profitable bluff`);
      reasoning.push(`Broadway hands have good equity when called`);
    } else {
      action = 'Check';
      ev = checkEV;
      confidence = 0.65;
      reasoning.push(`Villain is sticky (${(oppStats.call * 100).toFixed(0)}% call) - check to control pot`);
    }
  } else {
    if (oppStats.fold > 0.55) {
      action = 'Bet';
      ev = betEV * 0.8;
      confidence = 0.6;
      reasoning.push(`High fold frequency makes bluffing profitable`);
    } else {
      action = 'Check';
      ev = checkEV;
      confidence = 0.7;
      reasoning.push(`Weak hand against sticky opponent - pot control`);
    }
  }
  
  // Add alternatives
  alternatives.push({ action: 'Bet', ev: betEV });
  alternatives.push({ action: 'Check', ev: checkEV });
  alternatives.push({ action: 'Fold', ev: foldEV });
  
  return { action, confidence, ev, reasoning, alternatives };
}

// Simulate villain response
function simulateVillainResponse(state: GameState, heroAction: string): string {
  const oppStats = getOpponentStats(state.opponentType, state.villainPosition);
  
  if (heroAction === 'Check') {
    // Villain can bet or check behind
    const betProb = oppStats.raise * 1.5; // Aggressive players bet more
    return Math.random() < betProb ? 'Bet' : 'Check';
  } else if (heroAction === 'Bet') {
    const rand = Math.random();
    if (rand < oppStats.fold) return 'Fold';
    if (rand < oppStats.fold + oppStats.call) return 'Call';
    return 'Raise';
  }
  return 'Check';
}

export default function HandSimulator() {
  const [gameState, setGameState] = useState<GameState>({
    heroHand: ['As', 'Kh'],
    heroPosition: 'BTN',
    villainPosition: 'BB',
    opponentType: 'Balanced',
    stackDepth: 100,
    potSize: 10,
    board: ['Qh', '7c', '2d'],
    street: 'Flop',
    actionHistory: ['Hero opens BTN', 'Villain calls BB'],
    heroAction: null,
    villainResponse: null,
  });
  
  const [showGuide, setShowGuide] = useState(true);
  const [selectedRank1, setSelectedRank1] = useState('A');
  const [selectedRank2, setSelectedRank2] = useState('K');
  const [isSuited, setIsSuited] = useState(false);
  
  const recommendation = useMemo(() => generateRecommendation(gameState), [gameState]);
  const oppStats = useMemo(() => getOpponentStats(gameState.opponentType, gameState.villainPosition), [gameState.opponentType, gameState.villainPosition]);
  
  // Update hero hand when rank/suited changes
  useEffect(() => {
    const suit1 = 's';
    const suit2 = isSuited ? 's' : 'h';
    setGameState(prev => ({
      ...prev,
      heroHand: [`${selectedRank1}${suit1}`, `${selectedRank2}${suit2}`]
    }));
  }, [selectedRank1, selectedRank2, isSuited]);
  
  const handleHeroAction = (action: string) => {
    const response = simulateVillainResponse(gameState, action);
    setGameState(prev => ({
      ...prev,
      heroAction: action,
      villainResponse: response,
      actionHistory: [...prev.actionHistory, `Hero ${action}s`, `Villain ${response}s`],
    }));
  };
  
  const handleReset = () => {
    setGameState(prev => ({
      ...prev,
      heroAction: null,
      villainResponse: null,
      actionHistory: ['Hero opens BTN', 'Villain calls BB'],
    }));
  };
  
  const handleNextStreet = () => {
    const nextStreet = gameState.street === 'Flop' ? 'Turn' : 
                       gameState.street === 'Turn' ? 'River' : 'River';
    const newCard = ['Jd', '5h', '9c'][Math.floor(Math.random() * 3)];
    
    setGameState(prev => ({
      ...prev,
      street: nextStreet,
      board: [...prev.board, newCard],
      heroAction: null,
      villainResponse: null,
      potSize: prev.potSize * 1.5,
    }));
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with Guide Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Hand Simulator</h1>
              <p className="text-slate-400">Play out hands against AI opponents with PHH-backed statistics</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Label htmlFor="guide-toggle" className="text-slate-400 text-sm">Show Guide</Label>
            <Switch id="guide-toggle" checked={showGuide} onCheckedChange={setShowGuide} />
          </div>
        </div>
        
        {/* Newbie Guide (P0 requirement) */}
        {showGuide && (
          <Card className="mb-6 bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">1</div>
                  <div>
                    <p className="text-white font-medium">Set Your Hand</p>
                    <p className="text-slate-400 text-sm">Choose your hole cards, position, and stack depth</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">2</div>
                  <div>
                    <p className="text-white font-medium">Choose Opponent</p>
                    <p className="text-slate-400 text-sm">Select opponent type to see their tendencies</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">3</div>
                  <div>
                    <p className="text-white font-medium">Act & See Response</p>
                    <p className="text-slate-400 text-sm">Make your decision and watch villain react</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel: Input Controls */}
          <div className="space-y-4">
            {/* Hero Hand Input (Structured) */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-400" />
                  Your Hand
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-slate-400 text-xs mb-1 block">Card 1</Label>
                    <Select value={selectedRank1} onValueChange={setSelectedRank1}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {RANKS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-slate-400 text-xs mb-1 block">Card 2</Label>
                    <Select value={selectedRank2} onValueChange={setSelectedRank2}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {RANKS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-slate-400">Suited</Label>
                  <Switch checked={isSuited} onCheckedChange={setIsSuited} />
                </div>
                
                <div className="flex items-center justify-center gap-2 py-2">
                  <div className="text-4xl font-bold text-white">
                    {selectedRank1}{selectedRank2}{isSuited ? 's' : 'o'}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Position & Stack */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg">Position & Stack</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-slate-400 text-xs mb-1 block">Hero Position</Label>
                    <Select value={gameState.heroPosition} onValueChange={v => setGameState(p => ({ ...p, heroPosition: v }))}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {POSITIONS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-slate-400 text-xs mb-1 block">Villain Position</Label>
                    <Select value={gameState.villainPosition} onValueChange={v => setGameState(p => ({ ...p, villainPosition: v }))}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {POSITIONS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <Label className="text-slate-400 text-xs">Stack Depth</Label>
                    <span className="text-emerald-400 font-mono">{gameState.stackDepth} BB</span>
                  </div>
                  <Slider 
                    value={[gameState.stackDepth]} 
                    onValueChange={v => setGameState(p => ({ ...p, stackDepth: v[0] }))}
                    min={20} max={200} step={5}
                    className="py-2"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <Label className="text-slate-400 text-xs">Pot Size</Label>
                    <span className="text-emerald-400 font-mono">{gameState.potSize} BB</span>
                  </div>
                  <Slider 
                    value={[gameState.potSize]} 
                    onValueChange={v => setGameState(p => ({ ...p, potSize: v[0] }))}
                    min={2} max={100} step={1}
                    className="py-2"
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Opponent Type Selector */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-red-400" />
                  Opponent Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {OPPONENT_TYPES.map(type => (
                    <button
                      key={type}
                      onClick={() => setGameState(p => ({ ...p, opponentType: type }))}
                      className={`p-3 rounded-lg border transition-all ${
                        gameState.opponentType === type 
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                          : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <div className="font-medium">{type}</div>
                      <div className="text-xs opacity-70 mt-1">
                        F:{(PHH_STATS.opponent_types[type].fold_to_cbet * 100).toFixed(0)}% 
                        C:{(PHH_STATS.opponent_types[type].call_vs_cbet * 100).toFixed(0)}%
                      </div>
                    </button>
                  ))}
                </div>
                
                <div className="mt-3 p-2 bg-slate-700/30 rounded text-xs text-slate-400">
                  <Info className="w-3 h-3 inline mr-1" />
                  {PHH_STATS.opponent_types[gameState.opponentType].description}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Center Panel: Table View */}
          <div className="space-y-4">
            {/* Board Display */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-lg">{gameState.street}</CardTitle>
                  <Badge variant="outline" className="text-emerald-400 border-emerald-400">
                    Pot: {gameState.potSize} BB
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Board Cards */}
                <div className="flex justify-center gap-2 mb-4">
                  {gameState.board.map((card, i) => (
                    <div key={i} className="w-14 h-20 bg-white rounded-lg flex items-center justify-center text-2xl font-bold shadow-lg">
                      <span className={card.includes('h') || card.includes('d') ? 'text-red-500' : 'text-black'}>
                        {card[0]}{card.includes('h') ? '♥' : card.includes('d') ? '♦' : card.includes('c') ? '♣' : '♠'}
                      </span>
                    </div>
                  ))}
                  {gameState.street !== 'River' && (
                    <div className="w-14 h-20 bg-slate-600 rounded-lg flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-500">
                      ?
                    </div>
                  )}
                </div>
                
                {/* Action History */}
                <div className="bg-slate-700/50 rounded-lg p-3 mb-4">
                  <div className="text-xs text-slate-400 mb-2">Action History</div>
                  <div className="flex flex-wrap gap-1">
                    {gameState.actionHistory.map((action, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {action}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Hero Action Buttons */}
                {!gameState.heroAction ? (
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      onClick={() => handleHeroAction('Check')}
                      variant="outline" 
                      className="bg-slate-700 border-slate-600 hover:bg-slate-600"
                    >
                      Check
                    </Button>
                    <Button 
                      onClick={() => handleHeroAction('Bet')}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      Bet
                    </Button>
                    <Button 
                      onClick={() => handleHeroAction('Fold')}
                      variant="outline" 
                      className="bg-red-900/30 border-red-700 hover:bg-red-900/50 text-red-400"
                    >
                      Fold
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Villain Response */}
                    <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                      <div className="text-slate-400 text-sm mb-1">Villain's Response</div>
                      <div className={`text-2xl font-bold ${
                        gameState.villainResponse === 'Fold' ? 'text-emerald-400' :
                        gameState.villainResponse === 'Raise' ? 'text-red-400' :
                        'text-yellow-400'
                      }`}>
                        {gameState.villainResponse}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Based on {gameState.opponentType} profile ({(oppStats.fold * 100).toFixed(0)}% fold rate)
                      </div>
                    </div>
                    
                    {/* Next Actions */}
                    <div className="flex gap-2">
                      <Button onClick={handleReset} variant="outline" className="flex-1 bg-slate-700 border-slate-600">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset
                      </Button>
                      {gameState.street !== 'River' && gameState.villainResponse !== 'Fold' && (
                        <Button onClick={handleNextStreet} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                          Next Street
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* SPR & Key Stats */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {calculateSPR(gameState.stackDepth, gameState.potSize).toFixed(1)}
                    </div>
                    <div className="text-xs text-slate-400">SPR</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-emerald-400">
                      {(oppStats.fold * 100).toFixed(0)}%
                    </div>
                    <div className="text-xs text-slate-400">Fold to Cbet</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-400">
                      {(oppStats.raise * 100).toFixed(0)}%
                    </div>
                    <div className="text-xs text-slate-400">Raise vs Cbet</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Panel: Recommendation */}
          <div className="space-y-4">
            {/* Recommended Action */}
            <Card className="bg-gradient-to-br from-emerald-900/50 to-slate-800/50 border-emerald-700/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5 text-emerald-400" />
                  Recommended Action
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className={`text-4xl font-bold ${
                    recommendation.action === 'Bet' || recommendation.action === 'Raise' ? 'text-emerald-400' :
                    recommendation.action === 'Fold' ? 'text-red-400' :
                    'text-yellow-400'
                  }`}>
                    {recommendation.action}
                  </div>
                  <div className="text-sm text-slate-400 mt-1">
                    {(recommendation.confidence * 100).toFixed(0)}% confidence
                  </div>
                </div>
                
                {/* EV Display */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  {recommendation.ev > 0 ? (
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                  ) : recommendation.ev < 0 ? (
                    <TrendingDown className="w-5 h-5 text-red-400" />
                  ) : (
                    <Minus className="w-5 h-5 text-yellow-400" />
                  )}
                  <span className={`text-xl font-mono ${
                    recommendation.ev > 0 ? 'text-emerald-400' : 
                    recommendation.ev < 0 ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {recommendation.ev > 0 ? '+' : ''}{recommendation.ev.toFixed(2)} BB
                  </span>
                </div>
                
                {/* Reasoning */}
                <div className="space-y-2">
                  <div className="text-sm text-slate-400 font-medium">Why this action?</div>
                  {recommendation.reasoning.map((reason, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="text-emerald-400 mt-0.5">•</span>
                      {reason}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* If Villain... */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg">If Villain...</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                  <span className="text-emerald-400">Folds ({(oppStats.fold * 100).toFixed(0)}%)</span>
                  <span className="text-white font-mono">+{gameState.potSize.toFixed(1)} BB</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                  <span className="text-yellow-400">Calls ({(oppStats.call * 100).toFixed(0)}%)</span>
                  <span className="text-white font-mono">See turn</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                  <span className="text-red-400">Raises ({(oppStats.raise * 100).toFixed(0)}%)</span>
                  <span className="text-white font-mono">Decision point</span>
                </div>
              </CardContent>
            </Card>
            
            {/* Alternative Actions */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg">Alternatives</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recommendation.alternatives.map((alt, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                      <span className="text-slate-300">{alt.action}</span>
                      <span className={`font-mono ${alt.ev > 0 ? 'text-emerald-400' : alt.ev < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                        {alt.ev > 0 ? '+' : ''}{alt.ev.toFixed(2)} BB
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
