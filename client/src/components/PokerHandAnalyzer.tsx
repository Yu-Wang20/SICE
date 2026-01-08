import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

interface PokerCase {
  id: string;
  title: string;
  scenario: string;
  position: string;
  stackDepth: string;
  heroHand: string;
  villainAction: string;
  board: string;
  gtoAnalysis: string;
  humanFactor: string;
  decision: string;
  sizing: string;
  conceptLink: string;
  color: string;
}

const POKER_CASES: PokerCase[] = [
  {
    id: 'case1',
    title: 'Light 3-Bet with A5s',
    scenario: '6-Max Cash Game, 100BB Effective',
    position: 'Hero (BTN) vs. Villain (CO)',
    stackDepth: '100BB',
    heroHand: 'A♠ 5♠',
    villainAction: 'CO opens 2.5BB',
    board: 'Pre-flop',
    gtoAnalysis: 'A5s is a classic light 3-bet candidate. It contains an Ace (blocks AA/AK), retains nut flush potential, and can make straights. GTO frequency: 30% mixed strategy.',
    humanFactor: 'Typical CO players fold to 3-bet at 45-50% rate (vs. GTO ~35%). This creates an exploitative opportunity to increase 3-bet frequency by 10-15%.',
    decision: '3-Bet to 7.5BB',
    sizing: 'Creates a polarized range (premium hands + semi-bluffs) that\'s difficult to exploit',
    conceptLink: 'Demonstrates Restricted Nash Response (RNR) - balancing GTO safety with exploitative profit',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'case2',
    title: 'River All-In with KQ',
    scenario: 'River (Final Street), 50BB Pot',
    position: 'Hero (BB) vs. Villain (UTG)',
    stackDepth: '50BB',
    heroHand: 'K♥ Q♦',
    villainAction: 'Triple-barrel all-in (50BB)',
    board: 'A♠ K♦ 7♥ 3♣ 2♠',
    gtoAnalysis: 'MDF (Minimum Defense Frequency) suggests calling with top 50% of range. KQ has ~45% equity vs. Villain\'s range. GTO decision: pure call.',
    humanFactor: 'Real-world observation: Players under-bluff the river by 40-50%. Villain\'s actual range is 70% value hands (AA, KK, 77) with minimal bluffs. This violates GTO predictions due to risk aversion.',
    decision: 'Exploitative Fold',
    sizing: 'Despite MDF suggesting call, human risk aversion makes fold +2BB vs. call -1BB',
    conceptLink: 'Demonstrates behavioral economics - prospect theory shows humans are loss-averse, leading to under-bluffing patterns',
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: 'case3',
    title: 'Nut Straight All-In with T8s',
    scenario: 'Turn (4th Street), Hero in BB',
    position: 'Hero (BB) vs. Villain (BTN)',
    stackDepth: '80BB remaining',
    heroHand: 'T♠ 8♦',
    villainAction: 'BTN continuation bet',
    board: '4♦ 5♥ 6♠ 7♣',
    gtoAnalysis: 'Hero has nut advantage: 20 straight combos vs. Villain\'s 8. Nut advantage ratio 2.5:1. Optimal action: overbet all-in (80BB into 20BB = 4:1 odds).',
    humanFactor: 'Villain with overpairs (KK, QQ) faces 80% equity requirement but only has 45% equity. Forced to fold or lose. This is pure value extraction, not exploitation.',
    decision: 'All-in (80BB)',
    sizing: 'Geometric sizing: all-in creates 4:1 pot odds, forcing Villain\'s marginal hands into impossible decisions',
    conceptLink: 'Demonstrates nut advantage exploitation - core principle in Decision Matrix for imperfect information domains',
    color: 'from-emerald-500 to-emerald-600'
  }
];

export default function PokerHandAnalyzer() {
  const [expandedCase, setExpandedCase] = useState<string | null>('case1');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-4xl font-black mb-4">Real Poker Hand Analysis</h2>
        <p className="text-lg text-gray-600 max-w-2xl">
          Bridge theory to practice. These three cases demonstrate how GTO principles, behavioral economics, and strategic decision-making converge in real poker scenarios.
        </p>
      </div>

      {/* Case Cards */}
      <div className="space-y-4">
        {POKER_CASES.map((pokerCase) => (
          <div
            key={pokerCase.id}
            className="border-2 border-black rounded-lg overflow-hidden transition-all"
          >
            {/* Header */}
            <button
              onClick={() => setExpandedCase(expandedCase === pokerCase.id ? null : pokerCase.id)}
              className={`w-full p-6 bg-gradient-to-r ${pokerCase.color} text-white flex items-center justify-between hover:shadow-lg transition-shadow`}
            >
              <div className="text-left">
                <h3 className="text-2xl font-black mb-2">{pokerCase.title}</h3>
                <p className="text-sm opacity-90">{pokerCase.scenario}</p>
              </div>
              <ChevronDown
                className={`w-6 h-6 transition-transform ${
                  expandedCase === pokerCase.id ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Expanded Content */}
            {expandedCase === pokerCase.id && (
              <div className="p-8 bg-white space-y-6 border-t-2 border-black">
                {/* Quick Facts */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded border border-gray-200">
                    <p className="text-sm font-bold text-gray-600 mb-1">POSITION</p>
                    <p className="font-bold">{pokerCase.position}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded border border-gray-200">
                    <p className="text-sm font-bold text-gray-600 mb-1">HERO HAND</p>
                    <p className="font-bold text-lg">{pokerCase.heroHand}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded border border-gray-200">
                    <p className="text-sm font-bold text-gray-600 mb-1">BOARD</p>
                    <p className="font-bold">{pokerCase.board}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded border border-gray-200">
                    <p className="text-sm font-bold text-gray-600 mb-1">VILLAIN ACTION</p>
                    <p className="font-bold text-sm">{pokerCase.villainAction}</p>
                  </div>
                </div>

                {/* Analysis Sections */}
                <div className="space-y-6 border-t-2 border-gray-200 pt-6">
                  {/* GTO Analysis */}
                  <div>
                    <h4 className="text-xl font-black mb-3 flex items-center gap-2">
                      <span className={`w-3 h-3 bg-gradient-to-r ${pokerCase.color} rounded-full`}></span>
                      GTO Baseline Analysis
                    </h4>
                    <p className="text-gray-700 leading-relaxed">{pokerCase.gtoAnalysis}</p>
                  </div>

                  {/* Human Factor */}
                  <div>
                    <h4 className="text-xl font-black mb-3 flex items-center gap-2">
                      <span className={`w-3 h-3 bg-gradient-to-r ${pokerCase.color} rounded-full`}></span>
                      Human Factor & Behavioral Adjustment
                    </h4>
                    <p className="text-gray-700 leading-relaxed">{pokerCase.humanFactor}</p>
                  </div>

                  {/* Decision */}
                  <div className="bg-black text-white p-6 rounded-lg">
                    <p className="text-sm font-bold text-gray-300 mb-2">FINAL DECISION</p>
                    <p className="text-3xl font-black mb-4">{pokerCase.decision}</p>
                    <p className="text-gray-200">{pokerCase.sizing}</p>
                  </div>

                  {/* Concept Link */}
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                    <p className="text-sm font-bold text-blue-900 mb-2">CONCEPT LINK</p>
                    <p className="text-gray-700">{pokerCase.conceptLink}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Key Insights */}
      <div className="mt-12 p-8 bg-gray-50 rounded-lg border-2 border-black">
        <h3 className="text-2xl font-black mb-4">Three Key Insights</h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-black flex-shrink-0">
              1
            </div>
            <div>
              <p className="font-bold mb-1">GTO is the Foundation, Not the Destination</p>
              <p className="text-gray-700">
                GTO provides the theoretical baseline, but real-world poker requires exploitative adjustments based on opponent tendencies and behavioral biases.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-black flex-shrink-0">
              2
            </div>
            <div>
              <p className="font-bold mb-1">Human Irrationality is Predictable</p>
              <p className="text-gray-700">
                Prospect theory reveals systematic biases: loss aversion, framing effects, anchoring. These aren't random—they're exploitable patterns.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-black flex-shrink-0">
              3
            </div>
            <div>
              <p className="font-bold mb-1">Nut Advantage Drives Maximum Value</p>
              <p className="text-gray-700">
                When you have information or range advantages, use geometric sizing to extract maximum value. This is how AI systems like Pluribus dominate.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Sources */}
      <div className="p-6 bg-white border-2 border-gray-300 rounded-lg">
        <p className="text-sm font-bold text-gray-600 mb-3">DATA SOURCES</p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>• GTO Wizard (Pre-solved Charts)</div>
          <div>• Upswing Poker (Range Theory)</div>
          <div>• Run It Once (Advanced Theory)</div>
          <div>• Mass Data Analysis (Player Pool Stats)</div>
          <div>• Prospect Theory (Behavioral Economics)</div>
          <div>• Pluribus/ReBeL Research Papers</div>
        </div>
      </div>
    </div>
  );
}
