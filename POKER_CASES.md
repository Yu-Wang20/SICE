# Real Poker Hand Analysis Cases

## Case 1: Light 3-Bet with A5s (Range Coverage & Semi-Bluff)

**Scenario:** 6-Max Cash Game, 100BB Effective Stacks  
**Position:** Villain (CO) opens 2.5BB → Hero (BTN) with A5s

### GTO Baseline Analysis
- **Villain's Opening Range (CO):** ~22%, includes all pairs, broadway cards, and suited connectors
- **Hero's 3-Bet Range (BTN):** Polarized between premium hands (AA/KK/AK) and semi-bluff candidates
- **A5s Classification:** Light 3-Bet candidate because:
  - Contains an Ace (blocks Villain's AA/AK)
  - Retains nut flush potential
  - Can make straights (wheel: A-2-3-4-5)
  - Better than "dead hands" like 42o

### Optimal Action & Sizing
- **Decision:** 3-Bet to 7.5BB
- **Frequency:** 30% of A5s combos (mixed strategy)
- **Rationale:** Creates a polarized range that's difficult to exploit
- **Expected Value:** Wins pot immediately ~40% of time, reaches showdown with equity ~45% of time

### Range Morphology
| Category | Hands | Frequency |
|----------|-------|-----------|
| Premium (Value) | AA, KK, AK | 100% |
| Semi-Bluff | A5s, T9s, 98s | 30-50% |
| Trash | 42o, 73o | 0% |

### Human Factor (Behavioral Adjustment)
- **Typical CO player:** Folds to 3-bet at 45-50% rate (vs. GTO ~35%)
- **Adjustment:** Can increase 3-bet frequency by 10-15% to exploit over-folding
- **Concept Link:** This demonstrates **Restricted Nash Response (RNR)** - balancing GTO safety with exploitative profit

---

## Case 2: River All-In Decision with KQ (MDF & Under-Bluffing)

**Scenario:** River (Final Street), 50BB Pot  
**Board:** A♠ K♦ 7♥ 3♣ 2♠  
**Action:** Villain (UTG) triple-barrels (bets every street) → All-in 50BB  
**Hero Hand:** K♥ Q♦ (Top Pair, Good Kicker)

### GTO Baseline Analysis
- **Minimum Defense Frequency (MDF):** Hero needs to call with top 50% of calling range
- **KQ Equity vs. Villain's Range:** ~45% (vulnerable to two-pair, sets, better straights)
- **GTO Decision:** Pure call (indifferent between call/fold in equilibrium)

### Range Morphology - Villain's Triple-Barrel Range
| Hand Category | Combos | Frequency |
|---------------|--------|-----------|
| Value (AA, KK, 77, 33, 22) | 12 | 60% |
| Semi-Bluff (AQ, AJ, T9) | 8 | 20% |
| Pure Bluff (QJ, T8) | 4 | 20% |

### Human Factor (Behavioral Adjustment)
- **Real-world observation:** In cash games below $5/$10, players **under-bluff the river** by 40-50%
- **Actual Villain Range:** Mostly value hands (AA, KK, 77) with minimal bluffs
- **Adjustment:** **Exploitative Fold** despite MDF suggesting call
- **Concept Link:** This demonstrates **behavioral economics** - human risk aversion violates GTO predictions

### Decision Framework
```
GTO Says: Call (45% equity, positive EV)
Reality Says: Fold (Villain's actual range is 70% value)
Final Decision: Exploitative Fold
Expected Value Gain: +2BB vs. -1BB (call)
```

---

## Case 3: Nut Straight All-In with T8s (Nut Advantage & Geometric Sizing)

**Scenario:** Turn (4th Street), Hero in BB vs. BTN  
**Board:** 4♦ 5♥ 6♠ 7♣  
**Hero Hand:** T♠ 8♦ (Nut Straight - the best possible hand currently)  
**Stack Depth:** Hero 80BB remaining, Pot 20BB

### Range Advantage Analysis
**Hero's Range (BB Defense):** Contains all straights (89, 32, 53, 98, T8, T9)  
**Villain's Range (BTN Open):** Mostly high cards, few straights in this exact configuration

**Nut Advantage Calculation:**
- Hero's nut combos: 89 (4), 32 (4), 53 (4), 98 (4), T8 (4) = 20 combos
- Villain's nut combos: 89 (4), 32 (4) = 8 combos
- **Advantage Ratio:** 2.5:1 in Hero's favor

### GTO Optimal Strategy
- **Action:** Overbet All-in (80BB into 20BB pot = 4:1 odds)
- **Frequency:** 100% with nut straight
- **Rationale:** When you have absolute nut advantage, use maximum geometric sizing to force opponent's marginal hands (overpairs like KK, QQ) into difficult decisions

### Sizing Justification
| Bet Size | Pot Odds | Villain's Required Equity | Actual Equity (KK) | Decision |
|----------|----------|--------------------------|-------------------|----------|
| Check | - | - | 50% | Too passive |
| 1/2 pot (10BB) | 3:1 | 25% | 45% | Villain calls (bad for us) |
| Pot (20BB) | 1:1 | 50% | 45% | Close call |
| **2x Pot (40BB)** | **2:1** | **67%** | **45%** | Villain folds or loses |
| **All-in (80BB)** | **4:1** | **80%** | **45%** | Villain forced to fold |

### Concept Link
This demonstrates **Nut Advantage Exploitation** - a core principle in the Decision Matrix chapter where algorithm selection depends on information asymmetry.

---

## Integration with Website Chapters

### Game Theory Evolution Chapter
- Case 1 (A5s 3-Bet) → Demonstrates Nash Equilibrium and mixed strategies
- Case 2 (KQ River) → Demonstrates MDF and Harsanyi transformation (hidden information)

### AI & Algorithm Analysis Chapter
- Case 3 (T8s All-in) → Shows how Pluribus/ReBeL use nut advantage in imperfect information domains
- All cases → Show how CFR+ algorithms compute these decisions at scale

### Decision Matrix Chapter
- Real-world mapping: Perfect info (chess) vs. Imperfect info (poker)
- Behavioral economics overlay: GTO baseline + exploitative adjustments

---

## Data Sources Referenced

1. **GTO Wizard** - Pre-solved charts for 100BB 6-Max cash games
2. **Upswing Poker** - Range construction methodology
3. **Run It Once** - Advanced poker theory
4. **Mass Data Analysis (MDA)** - Player pool statistics showing under-bluffing patterns
5. **Prospect Theory (Kahneman & Tversky)** - Risk aversion bias in human decision-making
