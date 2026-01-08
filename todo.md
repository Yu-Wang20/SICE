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
