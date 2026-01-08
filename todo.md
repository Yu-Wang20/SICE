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
- [ ] Real poker dataset integration (when user provides poker_dataset.csv)
- [ ] Interactive GTO calculator with visual range diagrams
- [ ] Behavioral bias detector quiz
- [ ] Historical timeline visualization
