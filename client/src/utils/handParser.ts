/**
 * Hand Parser Utility
 * Tolerant parser that accepts natural inputs and guides users to completion
 */

export type HandParseStatus = 'valid' | 'needs_suitedness' | 'invalid' | 'empty';

export interface HandParseResult {
  status: HandParseStatus;
  normalized?: string;
  rank1?: string;
  rank2?: string;
  isPair?: boolean;
  message?: string;
  suggestions?: string[];
}

// Valid ranks in poker
const VALID_RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
const VALID_SUITS = ['s', 'h', 'd', 'c'];

// Rank order for sorting (A highest)
const RANK_ORDER: Record<string, number> = {
  'A': 14, 'K': 13, 'Q': 12, 'J': 11, 'T': 10,
  '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2
};

/**
 * Normalize input: trim, uppercase ranks, lowercase suits
 */
export function normalizeInput(input: string): string {
  return input
    .trim()
    .replace(/\s+/g, '') // Remove all whitespace
    .replace(/10/g, 'T') // Convert 10 to T
    .toUpperCase()
    .replace(/([AKQJT98765432])([SHDC])/gi, (_, rank, suit) => 
      rank.toUpperCase() + suit.toLowerCase()
    );
}

/**
 * Parse a hand input with tolerance for incomplete inputs
 */
export function parseHand(input: string): HandParseResult {
  // Empty input
  if (!input || input.trim() === '') {
    return {
      status: 'empty',
      message: 'Enter your hole cards (e.g., AKs, QQ, 87o)'
    };
  }

  const normalized = normalizeInput(input);

  // Check for explicit suits format: AsKd, AhKc, etc.
  const explicitSuitsMatch = normalized.match(/^([AKQJT98765432])([shdc])([AKQJT98765432])([shdc])$/i);
  if (explicitSuitsMatch) {
    const [, rank1, suit1, rank2, suit2] = explicitSuitsMatch;
    const r1 = rank1.toUpperCase();
    const r2 = rank2.toUpperCase();
    const s1 = suit1.toLowerCase();
    const s2 = suit2.toLowerCase();
    
    // Validate ranks
    if (!VALID_RANKS.includes(r1) || !VALID_RANKS.includes(r2)) {
      return {
        status: 'invalid',
        message: 'Invalid card rank',
        suggestions: ['Use A, K, Q, J, T, 9-2 for ranks']
      };
    }

    // Sort ranks (higher first)
    const [highRank, lowRank] = RANK_ORDER[r1] >= RANK_ORDER[r2] ? [r1, r2] : [r2, r1];
    const isPair = r1 === r2;
    const isSuited = s1 === s2;

    if (isPair) {
      return {
        status: 'valid',
        normalized: `${highRank}${lowRank}`,
        rank1: highRank,
        rank2: lowRank,
        isPair: true
      };
    }

    return {
      status: 'valid',
      normalized: `${highRank}${lowRank}${isSuited ? 's' : 'o'}`,
      rank1: highRank,
      rank2: lowRank,
      isPair: false
    };
  }

  // Check for standard format: AKs, AKo, QQ
  const standardMatch = normalized.match(/^([AKQJT98765432])([AKQJT98765432])([so])?$/i);
  if (standardMatch) {
    const [, r1, r2, suitedness] = standardMatch;
    const rank1 = r1.toUpperCase();
    const rank2 = r2.toUpperCase();

    // Validate ranks
    if (!VALID_RANKS.includes(rank1) || !VALID_RANKS.includes(rank2)) {
      return {
        status: 'invalid',
        message: 'Invalid card rank',
        suggestions: ['Use A, K, Q, J, T, 9-2 for ranks']
      };
    }

    // Sort ranks (higher first)
    const [highRank, lowRank] = RANK_ORDER[rank1] >= RANK_ORDER[rank2] ? [rank1, rank2] : [rank2, rank1];
    const isPair = rank1 === rank2;

    // Pairs don't need suitedness
    if (isPair) {
      return {
        status: 'valid',
        normalized: `${highRank}${lowRank}`,
        rank1: highRank,
        rank2: lowRank,
        isPair: true
      };
    }

    // Non-pairs need suitedness
    if (!suitedness) {
      return {
        status: 'needs_suitedness',
        normalized: `${highRank}${lowRank}`,
        rank1: highRank,
        rank2: lowRank,
        isPair: false,
        message: `${highRank}${lowRank} can be suited or offsuit. Which one is it?`,
        suggestions: [`${highRank}${lowRank}s (same suit)`, `${highRank}${lowRank}o (different suits)`]
      };
    }

    return {
      status: 'valid',
      normalized: `${highRank}${lowRank}${suitedness.toLowerCase()}`,
      rank1: highRank,
      rank2: lowRank,
      isPair: false
    };
  }

  // Single character - incomplete input
  if (normalized.length === 1 && VALID_RANKS.includes(normalized)) {
    return {
      status: 'invalid',
      message: 'Enter both cards',
      suggestions: [`${normalized}K`, `${normalized}${normalized}`, `${normalized}Qs`]
    };
  }

  // Invalid input
  return {
    status: 'invalid',
    message: 'Invalid hand format',
    suggestions: ['Examples: AKs, QQ, 87o, JTs']
  };
}

/**
 * Get display text for a hand
 */
export function getHandDisplay(hand: string): string {
  const result = parseHand(hand);
  if (result.status !== 'valid' || !result.normalized) return hand;
  
  if (result.isPair) {
    return `${result.normalized} - pocket pair`;
  }
  
  const suitedness = result.normalized.endsWith('s') ? 'suited' : 'offsuit';
  return `${result.normalized} - ${suitedness}`;
}

/**
 * Check if a hand is complete and valid
 */
export function isHandComplete(input: string): boolean {
  const result = parseHand(input);
  return result.status === 'valid';
}

/**
 * Get all valid hand combinations for autocomplete
 */
export function getHandSuggestions(partial: string): string[] {
  const normalized = normalizeInput(partial);
  const suggestions: string[] = [];

  if (normalized.length === 0) {
    return ['AA', 'KK', 'AKs', 'AKo', 'QQ', 'JJ'];
  }

  if (normalized.length === 1 && VALID_RANKS.includes(normalized)) {
    const rank = normalized;
    // Suggest pairs and common combos
    suggestions.push(`${rank}${rank}`);
    for (const r of VALID_RANKS) {
      if (r !== rank) {
        suggestions.push(`${rank}${r}s`);
        suggestions.push(`${rank}${r}o`);
      }
    }
    return suggestions.slice(0, 8);
  }

  if (normalized.length === 2) {
    const [r1, r2] = normalized.split('');
    if (VALID_RANKS.includes(r1) && VALID_RANKS.includes(r2)) {
      if (r1 === r2) {
        return [`${r1}${r2}`];
      }
      return [`${r1}${r2}s`, `${r1}${r2}o`];
    }
  }

  return suggestions;
}
