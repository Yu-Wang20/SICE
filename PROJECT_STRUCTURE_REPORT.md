# SICE Project Structure Check Report

## Executive Summary

This report documents the current project structure, identifies files to modify/add, and provides implementation priority breakdown for the Hand Simulator feature and product polish tasks.

## 1. Project Structure Analysis

### Framework & Build
| Item | Value |
|------|-------|
| Framework | React 18 + Vite |
| Routing | wouter (lightweight router) |
| State Management | React Query (@tanstack/react-query) + tRPC |
| UI Components | Radix UI + Tailwind CSS + shadcn/ui |
| Backend | Express + tRPC |
| Database | Drizzle ORM (PostgreSQL) |
| Testing | Vitest |

### Routing Structure
```
/                           → Home
/atlas                      → AtlasHub
/atlas/mathematical-foundations → MathematicalFoundations
/atlas/game-theory-evolution    → GameTheoryEvolution
/atlas/ai-algorithm-analysis    → AIAlgorithmAnalysis
/atlas/decision-matrix          → DecisionMatrix
/atlas/insights                 → Insights
/research                   → Research
/tools                      → ToolsHub
/tools/hand-strength        → HandStrength
/tools/pot-odds             → PotOdds
/tools/push-fold            → PushFold
/tools/position             → PositionSimulator
/tools/ev-calculator        → EVCalculator
/tools/quiz                 → QuizMode
/tools/strategy-library     → StrategyLibrary
/tools/spot-analyzer        → SpotAnalyzer
/trainer                    → Trainer
/saved                      → SavedSpots
/history                    → History
/research-map               → ResearchMap
```

### Data Storage
| Type | Location | Usage |
|------|----------|-------|
| localStorage | Client-side | History, Saved Spots, Animation Settings |
| PostgreSQL | Server-side | User data, persistent storage |
| Static JSON | server/quiz-questions.ts | Quiz questions |

### UI Style Guide
- **Primary Color**: Green (#22c55e / emerald-500)
- **Layout**: Left sidebar (fixed 256px) + Main content area
- **Card Style**: Rounded corners, subtle shadows, hover effects
- **Typography**: Inter font family

## 2. Files to Modify/Add

### New Files (Create)

| Path | Purpose |
|------|---------|
| `client/src/pages/tools/HandSimulator.tsx` | Main Hand Simulator page with table view |
| `client/src/components/TableView.tsx` | Poker table visualization component |
| `client/src/components/HandInput.tsx` | Structured hand input (Rank1 + Rank2 + suited) |
| `client/src/components/OpponentResponseEngine.tsx` | Opponent response logic component |
| `client/src/lib/pokerLogic.ts` | Hand classification, SPR, pot odds calculations |
| `client/src/lib/opponentModels.ts` | Opponent type definitions and response probabilities |
| `data/phh_stats.json` | PHH aggregated statistics for opponent responses |
| `scripts/build_phh_stats.py` | Script to generate phh_stats.json from PHH dataset |
| `client/src/components/NewbieGuide.tsx` | Reusable "This tool does / How to use / Try example" component |

### Files to Modify

| Path | Changes |
|------|---------|
| `client/src/App.tsx` | Add route for /tools/hand-simulator |
| `client/src/pages/tools/ToolsHub.tsx` | Add Hand Simulator card |
| `client/src/pages/tools/SpotAnalyzer.tsx` | Add structured input, Load Example, Open in Simulator |
| `client/src/pages/tools/StrategyLibrary.tsx` | Add legend, click explanation, Use in Simulator |
| `client/src/components/Sidebar.tsx` | Add Hand Simulator link |
| `README.md` | Add Hand Simulator docs, PHH stats generation |

## 3. Implementation Priority

### P0 (Must Have - MVP)

1. **PHH Stats Generation** (2-3 hours)
   - Parse PHH dataset for opponent response statistics
   - Generate `data/phh_stats.json` with fold/call/raise rates by position/stack/scenario
   - Create 4 opponent type profiles (Balanced/Tight/Loose/Aggressive)

2. **Hand Simulator Core** (4-6 hours)
   - Table view with Hero hand, board, position, stack, pot inputs
   - Opponent type selector with visible stats
   - Recommendation engine: Action + Why + If Villain...
   - Single hop: Flop → Turn transition after Hero action

3. **Analyze a Spot Polish** (2-3 hours)
   - Structured hand input (Rank dropdowns + suited toggle)
   - Load Example button with 3 presets
   - Skeleton screen for empty state
   - Open in Simulator button

4. **Ranges Polish** (1-2 hours)
   - Color legend (Raise/Call/Fold)
   - Usage explanation text
   - Click-to-explain sidebar
   - Use in Simulator button

### P1 (Enhancement)

5. **Multi-hop Simulation** (2-3 hours)
   - Turn → River transition
   - Full hand playthrough

6. **What-if Comparison** (1-2 hours)
   - Show alternative action outcomes
   - EV comparison table

7. **Advanced Opponent Modeling** (2-3 hours)
   - Custom parameter sliders
   - Donk bet, check-raise frequencies

### P2 (Optional)

8. **Table Background Image** (1 hour)
   - User upload for immersion
   - No OCR, purely decorative

9. **Preflop 3-bet Stats** (1-2 hours)
   - 3bet frequency by position
   - Fold to 3bet rates

## 4. Technical Considerations

### Opponent Response Engine
```typescript
interface OpponentStats {
  fold_to_cbet: number;  // 0-1
  call_vs_cbet: number;  // 0-1
  raise_vs_cbet: number; // 0-1
}

interface OpponentType {
  name: 'Balanced' | 'Tight' | 'Loose' | 'Aggressive';
  stats: OpponentStats;
}
```

### Hand Classification
```typescript
type HandClass = 
  | 'top_pair_plus'      // Value hands
  | 'middle_pair'        // Marginal
  | 'weak_pair'          // Marginal
  | 'strong_draw'        // Semi-bluff
  | 'weak_draw'          // Bluff candidate
  | 'air';               // Pure bluff
```

### Recommendation Logic
1. Calculate SPR (Stack-to-Pot Ratio)
2. Classify Hero hand
3. Get opponent fold/call/raise rates from PHH stats
4. Apply opponent type modifier
5. Generate recommendation based on EV calculation

## 5. Existing Components to Reuse

| Component | Location | Reuse For |
|-----------|----------|-----------|
| ToolLayout | components/ToolLayout.tsx | Hand Simulator layout |
| Sidebar | components/Sidebar.tsx | Navigation integration |
| Card components | components/ui/card.tsx | Result display |
| Select components | components/ui/select.tsx | Dropdowns |
| Slider components | components/ui/slider.tsx | Stack/pot inputs |
| Tabs components | components/ui/tabs.tsx | View switching |

## 6. Testing Requirements

| Test | File | Coverage |
|------|------|----------|
| Hand normalization | lib/pokerLogic.test.ts | AKs, AKo, 77 formats |
| Pot/SPR calculation | lib/pokerLogic.test.ts | Edge cases |
| Probability normalization | lib/opponentModels.test.ts | fold+call+raise=1 |
| Opponent response | components/OpponentResponseEngine.test.ts | All types |

---

*Report generated: 2026-01-08*
*Project: SICE / Poker Decision Engine*
