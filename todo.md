# Poker Decision System - TODO

## Core Features
- [x] Hand Strength Evolution Query (input hand/board → output strength + improvement probability)
- [x] Pot Odds Decision Engine (input pot/bet/outs → output breakeven equity + call/fold)
- [x] Push/Fold Short Stack Trainer (input stack/position/opponent → output push/fold/raise)
- [x] Position Advantage Simulator (IP vs OOP interactive decision tree)

## Research → Product Mapping
- [x] Research Map page linking theories to features
- [x] Kolmogorov → probability calculations
- [x] Doob/Martingale → EV tracking
- [x] Nash → GTO ranges
- [x] Harsanyi → belief state reasoning
- [x] Tversky-Kahneman → bias detection
- [x] CFR → push/fold optimization
- [x] DeepStack/ReBeL → position simulator

## Data Processing
- [x] Preprocess poker_dataset.csv into database (using seed script with sample data)
- [x] Create hand_outcomes table with indexes
- [x] Create pre-aggregated statistics tables
- [x] Build API routes for data queries

## Testing & Documentation
- [x] Write vitest tests for API routes (12 tests passing)
- [x] Create README with setup instructions
- [x] Add preprocess script documentation

## Future Enhancements
- [x] Real poker dataset integration (1,000,000 hands processed from poker_dataset.csv)
- [ ] Interactive GTO calculator with visual range diagrams
- [ ] Behavioral bias detector quiz
- [ ] Historical timeline visualization

## Website Optimization (from user feedback)
- [x] Update title to "Strategic Intelligence Content Engine"
- [x] Add sticky navigation bar with links to pillars, Atlas, case studies
- [ ] Improve visual hierarchy with hero banner and pillar icons
- [ ] Add breadcrumbs for navigation
- [ ] Enhance accessibility (semantic HTML, alt text, keyboard nav)

## Interactive Training Features (GTO Wizard/Preflop+ inspired)
- [x] EV Calculator - calculate expected value for different actions
- [x] Equity Calculator - hand vs range equity analysis (integrated into EV Calculator)
- [x] Quiz Mode - decision scenarios with instant feedback
- [x] Challenge Mode - timed decision puzzles (integrated into Quiz Mode)
- [x] Strategy Library - preflop ranges and decision matrices
- [ ] Progress Tracking - save practice records, show improvement curves
- [ ] Hand History Upload - analyze decisions vs GTO baseline

## P1 Critical UI Improvements
- [x] Add skeleton loading screens for first paint
- [x] Improve error boundary with retry/refresh buttons
- [x] Restructure navigation as product-style (Atlas/Tools/Trainer/Cases/About)
- [x] Make navigation sticky with current page highlight
- [ ] Add quick actions (Search/Upload/Demo) to nav
- [x] Add breadcrumb navigation below main nav
- [x] Implement responsive hamburger menu for mobile

## P1 High-Value Changes
- [x] Redesign Hero as product promise (H1 + Subhead + 3 bullets + 2 CTAs)
- [x] Transform pillar cards into clickable navigation components with hover effects
- [x] Add distinct icons for each pillar (Math/Game Theory/AI/Matrix)
- [x] Add progress/reading time and quick actions to pillar cards

## P2 Visual Polish
- [x] Implement consistent accent color system (emerald as primary)
- [x] Add definition callouts and info blocks with background colors
- [x] Improve typography hierarchy (H1/H2/H3 spacing)
- [ ] Add Table of Contents for long articles
- [ ] Add reading progress bar

## P3 Tool Enhancements (if time permits)
- [ ] Expand quiz to 20+ questions
- [ ] Add progress tracking with accuracy curves
- [ ] Hand history upload feature

## Quiz Expansion (22 Questions)
- [x] Create expanded quiz database with 22 questions
- [x] Add difficulty levels (Easy/Medium/Hard)
- [x] Cover preflop, postflop, 3-bet pots, ICM, odds, position scenarios
- [x] Update Quiz UI with difficulty selector and category filter
- [x] Add progress tracking and accuracy statistics
- [x] Implement tRPC quiz API routes


## P0 Critical Fixes
- [x] Fix EV Calculator - ensure Calculate button displays results (added tabs, implied odds, reverse implied odds)
- [x] Fix Position Simulator - correct unrealistic EV values (2000% → realistic range)
- [x] Verify all calculations with real GTO data

## P1a Quiz Enhancement
- [ ] Add error tracking/wrong answer history
- [ ] Implement quiz history and progress tracking
- [ ] Expand question bank to 50+ questions
- [ ] Add multi-way pot scenarios
- [ ] Add ICM bubble stage questions
- [ ] Add complex postflop decision trees

## P1b Hand Strength & GTO Library
- [ ] Add "equity rundown" probability calculation
- [ ] Filter by player count (2-9)
- [ ] Filter by pot size ranges
- [ ] Filter by board texture (dry/wet/polarized)
- [ ] Expand GTO Library to 9-max tables
- [ ] Support multiple stack depths (50BB, 40BB, 25BB)
- [ ] Add 3-Bet/Call/Fold color distinction
- [ ] Export GTO ranges as PNG/PDF
- [ ] Add ICM adjustment mode for tournaments
- [ ] Generate exploitative ranges based on opponent style

## P1c Pot Odds & Push/Fold
- [ ] Fix Pot Odds engine and add visualization
- [ ] Calculate implied odds
- [ ] Calculate reverse implied odds
- [ ] Support multi-way pots
- [ ] Add opponent betting range analysis
- [ ] Integrate ICM model into Push/Fold trainer
- [ ] Support multi-way decisions (push/fold/call)
- [ ] Allow custom opponent range input
- [ ] Add bubble stage special handling

## P2 Advanced Features
- [ ] Implement Hand History upload (PokerStars/GGPoker format)
- [ ] Auto-detect key decision points
- [ ] GTO deviation analysis
- [ ] Generate "leak report"
- [ ] Create comparison workbench (side-by-side ranges)
- [ ] GTO vs Exploitative comparison
- [ ] Different bet size comparison
- [ ] Heatmap difference visualization
- [ ] Add timed challenge mode (30 sec/question)
- [ ] Implement win streak tracking system
- [ ] Add weak area focused training
- [ ] Create leaderboard (accuracy/speed)
- [ ] Add achievement/badge system

## P3 Community & Polish
- [ ] Create hand discussion forum
- [ ] Add strategy sharing channel
- [ ] Implement user comments and feedback
- [ ] Add community hot hands ranking
- [ ] Add "key formulas" cards to knowledge sections
- [ ] Add "strategy highlights" summaries
- [ ] Add "further reading" links
- [ ] Create visual explanations (Nash equilibrium, algorithm flowcharts)
- [ ] Add EV curve charts
- [ ] Add heatmap visualizations
- [ ] Add interactive decision trees
- [ ] Add probability distribution charts
