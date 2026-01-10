# SICE — Poker Decision Engine (Strategic Intelligence Content Engine)

Live site: https://aishowcase-qu8phppe.manus.space/

SICE is a research-first showcase and interactive poker decision platform. It connects a century of ideas—probability theory, game theory (GTO), behavioral economics, and modern AI—to practical tools that help players analyze spots, train decision instincts, and reference optimal ranges.

---

## What’s inside

### Interactive Tools
- **Analyze a Spot**  
  Enter a poker situation (position, stack depth, action line, opponent type, hole cards, and board street) to get a fast, GTO-oriented recommendation and decision framing.

- **Trainer**  
  Scenario-based practice designed to build “decision muscle memory” with instant feedback.

- **Strategy Library (Ranges / Decision Matrices)**  
  Browse GTO-style preflop ranges and decision matrices by position and stack depth. Includes range export for study workflows.

- **Hand Simulator (PHH-backed stats)**  
  Play decision points against AI opponents with player-pool style tendencies. Configure hero/villain positions, stack depth, pot size, and opponent archetypes (e.g., Balanced / Tight / Loose / Aggressive), then:
  - see recommended actions (with confidence),
  - estimate EV / BB impact,
  - and get an explainable “Why this action?” breakdown,
  including opponent response branches (fold/call/raise).

---

## Research → Product Map (the core narrative)

SICE is built around a “research to tooling” philosophy: each major breakthrough maps to a concrete feature in the product.

- **Mathematical Foundations (1933–1970s)**  
  The bedrock of decision-making under uncertainty (axioms of probability, stochastic processes, martingales).

- **Game Theory & GTO (1940s–2000s)**  
  Strategic interaction and equilibrium thinking for imperfect-information games; regret minimization and CFR-style ideas for robust baselines.

- **AI & Algorithms (2017–present)**  
  Modern systems that scale computation (self-play, game tree exploration, neural approximations) to reach superhuman performance in complex strategic domains.

- **Behavioral Economics**  
  How predictable human biases (loss aversion, framing, anchoring) shape real-world decision-making—and how that differs from pure equilibrium play.

A unifying theme is the “compute + general methods” perspective: scalable computation tends to outperform handcrafted heuristics as data and compute increase.

---

## Case Studies (bridging theory to real play)

The Case Studies section connects theory to concrete poker decisions (e.g., light 3-bets, river all-ins, nut advantage and sizing), emphasizing:
1. **GTO is a baseline, not the destination** — adjustments matter when opponent tendencies deviate.
2. **Human irrationality is structured** — biases are not noise; they are patterns.
3. **Advantage drives value extraction** — range/info advantages inform sizing and aggression.

---

## Suggested workflow

1. Start with **Analyze a Spot** to establish a clean baseline.
2. Use **Trainer** to internalize repeated decision patterns.
3. Build your study system with **Strategy Library** (ranges + matrices).
4. Validate lines and opponent responses in **Hand Simulator**.

---

## Status

**v1.0** — Research Showcase + Poker Decision Engine tools.
