/**
 * Input Validation Utilities
 * Validates poker-specific inputs (hands, boards, percentages, etc.)
 */

// Valid card ranks and suits
const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
const SUITS = ['s', 'h', 'd', 'c']; // suited, hearts, diamonds, clubs

/**
 * Validate poker hand notation (e.g., "AK", "77", "87s", "AKo")
 */
export function validateHand(hand: string): { valid: boolean; error?: string } {
  if (!hand || hand.length < 2) {
    return { valid: false, error: "Hand must be at least 2 characters" };
  }

  const normalized = hand.toUpperCase();
  
  // Check format: must be 2-3 characters
  if (normalized.length > 3) {
    return { valid: false, error: "Hand format: AK, 77, 87s, AKo" };
  }

  const rank1 = normalized[0];
  const rank2 = normalized[1];
  const modifier = normalized[2]; // 's' for suited, 'o' for offsuit

  // Validate ranks
  if (!RANKS.includes(rank1) || !RANKS.includes(rank2)) {
    return { valid: false, error: "Invalid rank. Use A,K,Q,J,T,9-2" };
  }

  // Validate modifier if present
  if (modifier && !['S', 'O'].includes(modifier)) {
    return { valid: false, error: "Use 's' for suited or 'o' for offsuit" };
  }

  // Pair notation: must be same rank
  if (rank1 === rank2 && modifier) {
    return { valid: false, error: "Pairs cannot be suited or offsuit" };
  }

  // Different ranks: can have modifier
  if (rank1 !== rank2 && !modifier) {
    return { valid: false, error: "Non-pairs need 's' (suited) or 'o' (offsuit)" };
  }

  return { valid: true };
}

/**
 * Validate board notation (e.g., "AK2", "KQJss", "AKQJTs")
 */
export function validateBoard(board: string): { valid: boolean; error?: string } {
  if (!board) {
    // Empty board is valid (preflop)
    return { valid: true };
  }

  const normalized = board.toUpperCase();

  // Board must be 3, 4, or 5 cards (6, 8, or 10 characters with suits)
  if (normalized.length < 3 || normalized.length > 10) {
    return { valid: false, error: "Board: 3-5 cards (e.g., AK2, KQJss)" };
  }

  // Parse cards from board string
  const cards: string[] = [];
  for (let i = 0; i < normalized.length; i += 2) {
    const rank = normalized[i];
    const suit = normalized[i + 1];

    if (!RANKS.includes(rank)) {
      return { valid: false, error: `Invalid rank: ${rank}` };
    }

    if (!SUITS.includes(suit.toLowerCase())) {
      return { valid: false, error: `Invalid suit: ${suit}` };
    }

    cards.push(rank + suit);
  }

  // Check for duplicate cards
  const uniqueCards = new Set(cards);
  if (uniqueCards.size !== cards.length) {
    return { valid: false, error: "Duplicate cards on board" };
  }

  // Validate board length
  if (cards.length < 3 || cards.length > 5) {
    return { valid: false, error: "Board must have 3-5 cards" };
  }

  return { valid: true };
}

/**
 * Validate percentage input (0-100%)
 */
export function validatePercentage(value: number | string): { valid: boolean; error?: string; normalized?: number } {
  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) {
    return { valid: false, error: "Must be a number" };
  }

  if (num < 0) {
    return { valid: false, error: "Cannot be negative" };
  }

  if (num > 100) {
    return { valid: false, error: "Cannot exceed 100%" };
  }

  return { valid: true, normalized: num };
}

/**
 * Validate equity input (0-100%)
 */
export function validateEquity(value: number | string): { valid: boolean; error?: string; normalized?: number } {
  return validatePercentage(value);
}

/**
 * Validate stack depth in big blinds
 */
export function validateStackDepth(value: number | string): { valid: boolean; error?: string; normalized?: number } {
  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) {
    return { valid: false, error: "Must be a number" };
  }

  if (num <= 0) {
    return { valid: false, error: "Stack depth must be positive" };
  }

  if (num > 1000) {
    return { valid: false, error: "Stack depth seems unrealistic (>1000 BB)" };
  }

  return { valid: true, normalized: num };
}

/**
 * Validate bet size in big blinds
 */
export function validateBetSize(value: number | string, maxStack?: number): { valid: boolean; error?: string; normalized?: number } {
  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) {
    return { valid: false, error: "Must be a number" };
  }

  if (num <= 0) {
    return { valid: false, error: "Bet size must be positive" };
  }

  if (maxStack && num > maxStack) {
    return { valid: false, error: `Bet cannot exceed stack (${maxStack} BB)` };
  }

  return { valid: true, normalized: num };
}

/**
 * Validate pot size in big blinds
 */
export function validatePotSize(value: number | string): { valid: boolean; error?: string; normalized?: number } {
  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) {
    return { valid: false, error: "Must be a number" };
  }

  if (num <= 0) {
    return { valid: false, error: "Pot size must be positive" };
  }

  return { valid: true, normalized: num };
}

/**
 * Validate number of outs (0-15)
 */
export function validateOuts(value: number | string): { valid: boolean; error?: string; normalized?: number } {
  const num = typeof value === 'string' ? parseInt(value) : value;

  if (isNaN(num)) {
    return { valid: false, error: "Must be a number" };
  }

  if (num < 0 || num > 15) {
    return { valid: false, error: "Outs must be 0-15" };
  }

  return { valid: true, normalized: num };
}

/**
 * Validate frequency (0-100%, cap at 100%)
 */
export function normalizeFrequency(value: number): number {
  if (value < 0) return 0;
  if (value > 100) return 100;
  return value;
}

/**
 * Validate EV value (should be reasonable relative to pot)
 */
export function validateEV(value: number, potSize: number): { valid: boolean; warning?: string } {
  // EV should generally not exceed pot size * 2 or be less than -pot size
  if (Math.abs(value) > potSize * 3) {
    return { valid: true, warning: "EV seems unrealistic relative to pot size" };
  }

  return { valid: true };
}
