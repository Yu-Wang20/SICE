/**
 * Expanded Quiz Question Bank - 20+ scenarios covering Preflop, Postflop, 3-bet, ICM
 */

export type QuizDifficulty = "easy" | "medium" | "hard";
export type QuizCategory = "preflop" | "postflop" | "3bet" | "icm" | "odds" | "position";

export interface QuizQuestion {
  id: number;
  category: QuizCategory;
  difficulty: QuizDifficulty;
  scenario: string;
  position: string;
  stackBB: number;
  action: string;
  options: Array<{
    text: string;
    isCorrect: boolean;
    explanation: string;
  }>;
  concept: string;
  readTime: number; // in seconds
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // ============ PREFLOP (Easy) ============
  {
    id: 1,
    category: "preflop",
    difficulty: "easy",
    scenario: "You're on the button with AK. Everyone folds to you. Blinds are 1-2. Stack is 100BB.",
    position: "BTN",
    stackBB: 100,
    action: "Raise to 6",
    options: [
      { text: "Fold", isCorrect: false, explanation: "AK is too strong to fold from BTN" },
      { text: "Raise to 6", isCorrect: true, explanation: "Standard raise with premium hand from BTN" },
      { text: "Limp", isCorrect: false, explanation: "Limping weakens your hand value" },
      { text: "All-in", isCorrect: false, explanation: "No need to overcommit with 100BB" }
    ],
    concept: "Premium hand play from position",
    readTime: 45
  },
  {
    id: 2,
    category: "preflop",
    difficulty: "easy",
    scenario: "You're in the SB with 22. UTG raises to 3BB. 3 callers. Stack is 50BB.",
    position: "SB",
    stackBB: 50,
    action: "Call",
    options: [
      { text: "Fold", isCorrect: false, explanation: "Pocket pair has set mining value with odds" },
      { text: "Call", isCorrect: true, explanation: "Good odds for set mining with 4 players" },
      { text: "Raise", isCorrect: false, explanation: "Too weak to 3-bet from SB" },
      { text: "All-in", isCorrect: false, explanation: "Unnecessary with 50BB" }
    ],
    concept: "Set mining from weak position",
    readTime: 50
  },

  // ============ PREFLOP (Medium) ============
  {
    id: 3,
    category: "preflop",
    difficulty: "medium",
    scenario: "CO raises to 2.5BB. You're on BTN with QJ. Stack is 80BB. Blinds fold.",
    position: "BTN",
    stackBB: 80,
    action: "3-bet to 8",
    options: [
      { text: "Fold", isCorrect: false, explanation: "QJ is strong enough to 3-bet from BTN vs CO" },
      { text: "Call", isCorrect: false, explanation: "3-betting is more profitable with position" },
      { text: "3-bet to 8", isCorrect: true, explanation: "Profitable 3-bet with good hand and position" },
      { text: "All-in", isCorrect: false, explanation: "Too aggressive with 80BB" }
    ],
    concept: "3-betting from position with broadway cards",
    readTime: 60
  },
  {
    id: 4,
    category: "preflop",
    difficulty: "medium",
    scenario: "You raise UTG with 99. MP 3-bets to 12BB. Stack is 100BB.",
    position: "UTG",
    stackBB: 100,
    action: "Call",
    options: [
      { text: "Fold", isCorrect: false, explanation: "99 has decent equity vs 3-bet range" },
      { text: "Call", isCorrect: true, explanation: "Call to play in position postflop" },
      { text: "4-bet", isCorrect: false, explanation: "99 is too weak for 4-bet from UTG" },
      { text: "All-in", isCorrect: false, explanation: "Unnecessary commitment" }
    ],
    concept: "Mid-pair response to 3-bet",
    readTime: 55
  },

  // ============ PREFLOP (Hard) ============
  {
    id: 5,
    category: "preflop",
    difficulty: "hard",
    scenario: "HJ raises 2.5BB. You 3-bet to 8BB from CO with AJ. HJ 4-bets to 20BB. Stack is 100BB.",
    position: "CO",
    stackBB: 100,
    action: "Call",
    options: [
      { text: "Fold", isCorrect: false, explanation: "AJ has 45%+ equity vs 4-bet range" },
      { text: "Call", isCorrect: true, explanation: "AJ is strong enough to call 4-bet" },
      { text: "5-bet all-in", isCorrect: false, explanation: "Too aggressive without premium hand" },
      { text: "5-bet to 45", isCorrect: false, explanation: "Commits too much with marginal equity" }
    ],
    concept: "4-bet calling with broadway cards",
    readTime: 70
  },

  // ============ POSTFLOP (Easy) ============
  {
    id: 6,
    category: "postflop",
    difficulty: "easy",
    scenario: "You raise BTN with AK. BB calls. Flop: AQ2r. BB checks. Pot is 6BB.",
    position: "BTN",
    stackBB: 100,
    action: "Bet 3BB",
    options: [
      { text: "Check", isCorrect: false, explanation: "Top pair should bet for value" },
      { text: "Bet 3BB", isCorrect: true, explanation: "Standard c-bet with top pair" },
      { text: "Bet 8BB", isCorrect: false, explanation: "Too large, doesn't balance range" },
      { text: "All-in", isCorrect: false, explanation: "Overkill with 100BB" }
    ],
    concept: "C-betting with top pair",
    readTime: 45
  },
  {
    id: 7,
    category: "postflop",
    difficulty: "easy",
    scenario: "You bet 3BB on AQ2r flop. Opponent raises to 9BB. Pot is 15BB.",
    position: "BTN",
    stackBB: 100,
    action: "Call",
    options: [
      { text: "Fold", isCorrect: false, explanation: "Top pair has too much equity to fold" },
      { text: "Call", isCorrect: true, explanation: "Call to see turn with top pair" },
      { text: "Raise", isCorrect: false, explanation: "Risky with uncertain equity" },
      { text: "All-in", isCorrect: false, explanation: "Premature commitment" }
    ],
    concept: "Responding to flop raise with top pair",
    readTime: 50
  },

  // ============ POSTFLOP (Medium) ============
  {
    id: 8,
    category: "postflop",
    difficulty: "medium",
    scenario: "You bet 3BB on K92r with KJ. Opponent calls. Turn is 4. You bet 6BB. Opponent raises to 18BB.",
    position: "BTN",
    stackBB: 100,
    action: "Call",
    options: [
      { text: "Fold", isCorrect: false, explanation: "Top pair has enough equity" },
      { text: "Call", isCorrect: true, explanation: "Call to see river with top pair" },
      { text: "Raise", isCorrect: false, explanation: "Risky without strong hand" },
      { text: "All-in", isCorrect: false, explanation: "Too much commitment" }
    ],
    concept: "Turn play with top pair",
    readTime: 60
  },
  {
    id: 9,
    category: "postflop",
    difficulty: "medium",
    scenario: "Flop: AK9r. You bet 3BB with QJ (open-ended straight draw). Opponent calls. Turn: 2.",
    position: "BTN",
    stackBB: 100,
    action: "Check",
    options: [
      { text: "Bet", isCorrect: false, explanation: "OESD should check and control pot" },
      { text: "Check", isCorrect: true, explanation: "Control pot with draw, check turn" },
      { text: "All-in", isCorrect: false, explanation: "Overcommit with draw" },
      { text: "Fold", isCorrect: false, explanation: "OESD has too much equity" }
    ],
    concept: "Drawing hand management",
    readTime: 55
  },

  // ============ POSTFLOP (Hard) ============
  {
    id: 10,
    category: "postflop",
    difficulty: "hard",
    scenario: "Flop: JT9r. You bet 3BB with 87 (open-ended straight draw). Opponent 3-bets to 9BB. Pot is 15BB.",
    position: "BTN",
    stackBB: 100,
    action: "Call",
    options: [
      { text: "Fold", isCorrect: false, explanation: "OESD has 32% equity, good odds to call" },
      { text: "Call", isCorrect: true, explanation: "Correct odds for OESD vs 3-bet" },
      { text: "Raise", isCorrect: false, explanation: "Too aggressive with draw" },
      { text: "All-in", isCorrect: false, explanation: "Unnecessary commitment" }
    ],
    concept: "Drawing hand equity vs pot odds",
    readTime: 65
  },

  // ============ 3-BET POTS (Medium) ============
  {
    id: 11,
    category: "3bet",
    difficulty: "medium",
    scenario: "3-bet pot. Flop: AK9r. You have AQ. Opponent c-bets 5BB into 15BB pot.",
    position: "BTN",
    stackBB: 100,
    action: "Call",
    options: [
      { text: "Fold", isCorrect: false, explanation: "Top pair is strong in 3-bet pot" },
      { text: "Call", isCorrect: true, explanation: "Call to keep range balanced" },
      { text: "Raise", isCorrect: false, explanation: "Risky without stronger hand" },
      { text: "All-in", isCorrect: false, explanation: "Overcommit" }
    ],
    concept: "3-bet pot play with top pair",
    readTime: 60
  },
  {
    id: 12,
    category: "3bet",
    difficulty: "medium",
    scenario: "3-bet pot. You have KK. Flop: AK9r. Opponent checks. Pot is 15BB.",
    position: "BTN",
    stackBB: 100,
    action: "Bet 8BB",
    options: [
      { text: "Check", isCorrect: false, explanation: "Set should bet for value" },
      { text: "Bet 8BB", isCorrect: true, explanation: "Value bet with set" },
      { text: "Bet 15BB", isCorrect: false, explanation: "Too large" },
      { text: "All-in", isCorrect: false, explanation: "Unnecessary" }
    ],
    concept: "Set value betting in 3-bet pot",
    readTime: 55
  },

  // ============ 3-BET POTS (Hard) ============
  {
    id: 13,
    category: "3bet",
    difficulty: "hard",
    scenario: "3-bet pot. You have AJ. Flop: K92r. Opponent bets 5BB into 15BB. You call. Turn: Q. Opponent bets 12BB.",
    position: "BTN",
    stackBB: 100,
    action: "Call",
    options: [
      { text: "Fold", isCorrect: false, explanation: "You have a pair now, call to see river" },
      { text: "Call", isCorrect: true, explanation: "Pair of queens, call turn" },
      { text: "Raise", isCorrect: false, explanation: "Risky without stronger hand" },
      { text: "All-in", isCorrect: false, explanation: "Overcommit" }
    ],
    concept: "Turn play in 3-bet pot with pair",
    readTime: 70
  },

  // ============ ICM DECISIONS (Medium) ============
  {
    id: 14,
    category: "icm",
    difficulty: "medium",
    scenario: "Tournament bubble. Stacks: You 15BB, Opponent1 20BB, Opponent2 65BB. You're SB with 88.",
    position: "SB",
    stackBB: 15,
    action: "Push",
    options: [
      { text: "Fold", isCorrect: false, explanation: "88 is strong enough to push from SB on bubble" },
      { text: "Push", isCorrect: true, explanation: "Correct push with 15BB and decent hand" },
      { text: "Limp", isCorrect: false, explanation: "Too weak with short stack" },
      { text: "Raise to 4BB", isCorrect: false, explanation: "Commits most chips anyway" }
    ],
    concept: "ICM push/fold with medium pair",
    readTime: 60
  },
  {
    id: 15,
    category: "icm",
    difficulty: "medium",
    scenario: "Bubble. Stacks: You 8BB, Opponent1 25BB, Opponent2 67BB. You're UTG with J5.",
    position: "UTG",
    stackBB: 8,
    action: "Fold",
    options: [
      { text: "Fold", isCorrect: true, explanation: "J5 is too weak to push with 8BB from UTG" },
      { text: "Push", isCorrect: false, explanation: "J5 is below push range from UTG" },
      { text: "Limp", isCorrect: false, explanation: "Can't limp with 8BB" },
      { text: "Raise to 2BB", isCorrect: false, explanation: "Commits most chips" }
    ],
    concept: "ICM fold with weak hand and short stack",
    readTime: 55
  },

  // ============ ICM DECISIONS (Hard) ============
  {
    id: 16,
    category: "icm",
    difficulty: "hard",
    scenario: "Bubble. Stacks: You 12BB, Opponent1 30BB, Opponent2 58BB. You're CO with AJ. Opponent1 folds.",
    position: "CO",
    stackBB: 12,
    action: "Push",
    options: [
      { text: "Fold", isCorrect: false, explanation: "AJ is strong enough to push from CO" },
      { text: "Push", isCorrect: true, explanation: "AJ is in push range from CO with 12BB" },
      { text: "Raise to 3BB", isCorrect: false, explanation: "Commits most chips anyway" },
      { text: "All-in", isCorrect: true, explanation: "Same as push" }
    ],
    concept: "ICM push range with broadway cards",
    readTime: 65
  },

  // ============ POT ODDS (Easy) ============
  {
    id: 17,
    category: "odds",
    difficulty: "easy",
    scenario: "Pot is 10BB. Opponent bets 5BB. You have 8 outs (32% equity). What's your decision?",
    position: "BTN",
    stackBB: 100,
    action: "Call",
    options: [
      { text: "Fold", isCorrect: false, explanation: "Odds are favorable for call" },
      { text: "Call", isCorrect: true, explanation: "Breakeven equity is 25%, you have 32%" },
      { text: "Raise", isCorrect: false, explanation: "Not optimal with draw" },
      { text: "All-in", isCorrect: false, explanation: "Unnecessary" }
    ],
    concept: "Pot odds calculation for draws",
    readTime: 50
  },
  {
    id: 18,
    category: "odds",
    difficulty: "easy",
    scenario: "Pot is 8BB. Opponent bets 8BB. You have 4 outs (16% equity).",
    position: "BTN",
    stackBB: 100,
    action: "Fold",
    options: [
      { text: "Fold", isCorrect: true, explanation: "Breakeven is 50%, you have only 16%" },
      { text: "Call", isCorrect: false, explanation: "Bad odds for your equity" },
      { text: "Raise", isCorrect: false, explanation: "Worse than folding" },
      { text: "All-in", isCorrect: false, explanation: "Terrible with weak draw" }
    ],
    concept: "Negative pot odds recognition",
    readTime: 45
  },

  // ============ POT ODDS (Medium) ============
  {
    id: 19,
    category: "odds",
    difficulty: "medium",
    scenario: "Pot is 12BB. Opponent bets 6BB. You have 12 outs (48% equity). Stack is 50BB.",
    position: "BTN",
    stackBB: 50,
    action: "Call",
    options: [
      { text: "Fold", isCorrect: false, explanation: "Great odds with 48% equity" },
      { text: "Call", isCorrect: true, explanation: "Breakeven is 33%, you have 48%" },
      { text: "Raise to 18BB", isCorrect: false, explanation: "Call is better" },
      { text: "All-in", isCorrect: false, explanation: "Unnecessary commitment" }
    ],
    concept: "Strong draw pot odds",
    readTime: 55
  },

  // ============ POSITION (Medium) ============
  {
    id: 20,
    category: "position",
    difficulty: "medium",
    scenario: "You're OOP in a 3-bet pot. Opponent c-bets. You have a marginal hand (pair of 7s).",
    position: "BB",
    stackBB: 100,
    action: "Call",
    options: [
      { text: "Fold", isCorrect: false, explanation: "Pair has equity, call to see turn" },
      { text: "Call", isCorrect: true, explanation: "Call OOP with marginal hand" },
      { text: "Raise", isCorrect: false, explanation: "Risky OOP" },
      { text: "All-in", isCorrect: false, explanation: "Overcommit OOP" }
    ],
    concept: "OOP play with marginal hand",
    readTime: 60
  },

  // ============ POSITION (Hard) ============
  {
    id: 21,
    category: "position",
    difficulty: "hard",
    scenario: "You're IP on turn with position. Opponent checks. You have middle pair (88). Pot is 20BB.",
    position: "BTN",
    stackBB: 100,
    action: "Bet 10BB",
    options: [
      { text: "Check", isCorrect: false, explanation: "Bet for value with position advantage" },
      { text: "Bet 10BB", isCorrect: true, explanation: "Value bet with position and marginal hand" },
      { text: "Bet 20BB", isCorrect: false, explanation: "Too large" },
      { text: "All-in", isCorrect: false, explanation: "Unnecessary" }
    ],
    concept: "Position-based value betting",
    readTime: 65
  },

  // ============ ODDS (Hard) ============
  {
    id: 22,
    category: "odds",
    difficulty: "hard",
    scenario: "Pot is 15BB. Opponent bets 10BB. You have 9 outs (36% equity) with 2 cards to come.",
    position: "BTN",
    stackBB: 100,
    action: "Call",
    options: [
      { text: "Fold", isCorrect: false, explanation: "Good odds with 36% equity" },
      { text: "Call", isCorrect: true, explanation: "Breakeven is 40%, close but call is correct" },
      { text: "Raise", isCorrect: false, explanation: "Worse than calling" },
      { text: "All-in", isCorrect: false, explanation: "Unnecessary" }
    ],
    concept: "Close pot odds decisions",
    readTime: 70
  }
];

// Helper to get questions by category or difficulty
export function getQuestionsByCategory(category: QuizCategory): QuizQuestion[] {
  return QUIZ_QUESTIONS.filter(q => q.category === category);
}

export function getQuestionsByDifficulty(difficulty: QuizDifficulty): QuizQuestion[] {
  return QUIZ_QUESTIONS.filter(q => q.difficulty === difficulty);
}

export function getRandomQuestions(count: number, difficulty?: QuizDifficulty): QuizQuestion[] {
  let questions = QUIZ_QUESTIONS;
  if (difficulty) {
    questions = questions.filter(q => q.difficulty === difficulty);
  }
  
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
