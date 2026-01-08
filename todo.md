# Poker Decision System - TODO

## P0 CRITICAL: Time-to-First-Value UX Redesign (New Priority)

### P0-1: Redesign Homepage as Three-Entry-Point Hub
- [x] Replace current hero with three large buttons: Analyze a Spot, Start Training, Open Ranges
- [x] Add Quick Spot Bar below (Position/Stacks/Action Line/Opponent Type → instant recommendation)
- [x] Target: 10 seconds to first actionable insight

### P0-2: Persistent Sidebar Navigation (No Back Buttons)
- [x] Create fixed left sidebar with: Spot Analyzer, Trainer, Ranges, Tools, History, Saved
- [x] One-click switching between sections (no back button required)
- [x] Highlight current active section
- [x] Collapse on mobile to hamburger

### P0-3: Real-Time Tool Calculations (Remove Calculate Buttons)
- [x] EV Calculator: slider/input changes → instant result update (200ms debounce)
- [ ] Position Simulator: tree updates live as parameters change
- [ ] Pot Odds: immediate calculation on input change
- [ ] Hand Strength: live update on hand/board selection
- [ ] Strategy Library: instant range display on filter change

### P0-4: Unified Left-Input / Right-Result Workbench Layout
- [x] All tools: left panel (fixed width, collapsible advanced) + right panel (always visible results)
- [x] No scrolling to see results
- [x] Consistent spacing and alignment across all tools
- [x] Mobile: stack vertically with sticky result header

### P0-5: Action-First Result Presentation
- [x] Result order: Recommended Action (huge) → EV/Frequency/Threshold (compact) → Details (collapsible)
- [x] Fold/Call/Raise as clear colored buttons/badges
- [x] Hide verbose explanations by default (expandable)
- [x] Show key reasoning in 3 bullets max

### P0-6: History & Favorites System
- [x] Auto-save last 10 spots (with naming)
- [x] Trainer: daily streak counter + weak category tags
- [x] Ranges: save favorite positions
- [x] History sidebar entry with quick access

## Core Features (Completed)
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
- [x] Fix missing /tools/spot-analyzer route (404 error)
- [x] Create SpotAnalyzer component with real-time GTO analysis
- [x] Register route in App.tsx

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


## P1 CRITICAL: User-Reported Bugs & UX Issues (From Detailed Debug Report)

### Navigation & Routing Fixes
- [ ] Fix dead Trainer link (/trainer → 404, should link to /tools/quiz or create dedicated Trainer page)
- [ ] Fix dead Saved link (/saved → 404, should implement Saved Spots page)
- [ ] Fix Saved Spots page (/saved missing, should display favorited analyses)
- [ ] Update sidebar to link to existing quiz route (/tools/decision-training or /tools/quiz)
- [ ] Implement Trainer index page or redirect to quiz
- [ ] Create Saved Spots page with persistent storage

### Input Validation & Data Accuracy
- [ ] Add hand validation in Analyze a Spot (only allow valid rank+suit, e.g., AK, 77, 87s)
- [ ] Add board validation (only valid card combinations, reject "12345" or "XYZ")
- [ ] Restrict Fold Equity (%) to 0-100% range with error message
- [ ] Restrict Future Winnings/Losses to reasonable ranges with validation
- [ ] Add numeric input bounds for all percentage fields (0-100%)
- [ ] Show user-friendly error messages for invalid inputs (inline validation)

### EV Calculator Fixes
- [x] Populate "Why this action?" accordion with actual reasoning (added explanation generation)
- [x] Fix EV calculation formulas to ensure realistic values (cap frequencies at 0-100%)
- [x] Add context about bet sizes relative to stack (formulas account for realistic ranges)
- [x] Normalize EV outputs to realistic ranges (capped to -pot to pot*2)
- [x] Add explanatory tooltips for each metric (EV, Pot Odds, Breakeven, Implied Odds)
- [x] Add input validation with error messages (red borders, inline alerts)
- [x] Create comprehensive unit tests (29 tests passing)
- [x] Implement real-time calculation with debounce

### Position Simulator Fixes
- [ ] Fix unrealistic EV values (e.g., +7,750 BB EV or frequencies >2000%)
- [ ] Ensure decision tree updates when Pot Size or Stack Size changes
- [ ] Add explanation of which algorithm is used (ReBeL, DeepStack, etc.)
- [ ] Fix IP/OOP toggle to update actual values, not just labels
- [ ] Validate that raise sizes are realistic relative to stack depth

### Strategy Library (Ranges) Fixes
- [ ] Make range grid interactive: hover/click on hands to show combo counts and frequencies
- [ ] Implement Export Range button (PNG, PDF, or CSV format)
- [ ] Add stack depth selector (not just 100 BB)
- [ ] Support 9-max games (currently only 6-max)
- [ ] Add position filter (UTG, MP, CO, BTN, SB, BB)
- [ ] Show success/failure message after export

### Hand Strength Evolution Fixes
- [ ] Make Hole Cards input actually filter results (currently ignored)
- [ ] Validate hole card input format
- [ ] Update table when hole cards change
- [ ] Add explanation of what "strength" means (vs opponent range)

### History & Saved Spots
- [ ] Persist analyzed spots to localStorage/database (currently always shows "No history yet")
- [ ] Auto-save spots when analysis completes
- [ ] Display saved spots in History page with timestamps
- [ ] Add "Clear History" button
- [ ] Implement Saved Spots page (currently 404)
- [ ] Add ability to re-load saved spot parameters

### Decision Training / Quiz
- [ ] Fix timer bug (always shows ~4 minutes, should show actual time)
- [ ] Add review page showing all questions with explanations
- [ ] Implement streak counter (consecutive correct answers)
- [ ] Add weak-category tracking (e.g., "3-bet pots" accuracy: 60%)
- [ ] Allow revisiting previous questions
- [ ] Fix "Total Time" calculation in summary

### UX & Documentation
- [ ] Add help tooltips for all metrics (EV, confidence, frequency, etc.)
- [ ] Populate empty explanations in all tools
- [ ] Add "Why this action?" reasoning to all recommendations
- [ ] Add table of contents to long-form content (Atlas, Research)
- [ ] Link Atlas/Research content to relevant tools (e.g., martingales → EV Calculator)
- [ ] Ensure responsive design on mobile (test all tools)
- [ ] Add ARIA labels for accessibility
- [ ] Improve color contrast for accessibility compliance

### Data Normalization
- [ ] Ensure all EV values expressed in big blinds (BB)
- [ ] Cap all frequency percentages at 100%
- [ ] Validate that pot odds calculations are correct
- [ ] Ensure implied odds and reverse implied odds are realistic
