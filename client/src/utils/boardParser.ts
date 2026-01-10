/**
 * Board Parser Utility
 * Tolerant parser for community cards with street detection
 */

export type Street = 'preflop' | 'flop' | 'turn' | 'river';

export interface BoardParseResult {
  status: 'valid' | 'invalid' | 'empty';
  cards: string[];
  street: Street;
  normalized?: string;
  message?: string;
  suggestions?: string[];
}

// Valid ranks and suits
const VALID_RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
const VALID_SUITS = ['s', 'h', 'd', 'c'];

/**
 * Parse a single card (e.g., "As", "Kd", "2c")
 */
function parseCard(card: string): { rank: string; suit: string } | null {
  const normalized = card.trim().replace(/10/g, 'T');
  
  // Format: Rank + Suit (e.g., As, Kd)
  const match = normalized.match(/^([AKQJT98765432])([shdc])$/i);
  if (match) {
    return {
      rank: match[1].toUpperCase(),
      suit: match[2].toLowerCase()
    };
  }
  
  return null;
}

/**
 * Normalize board input
 */
export function normalizeBoard(input: string): string {
  return input
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/10/g, 'T')
    .toUpperCase()
    .replace(/([AKQJT98765432])([SHDC])/gi, (_, rank, suit) => 
      rank.toUpperCase() + suit.toLowerCase()
    );
}

/**
 * Parse board input with tolerance for various formats
 */
export function parseBoard(input: string, expectedStreet?: Street): BoardParseResult {
  // Empty input
  if (!input || input.trim() === '') {
    return {
      status: 'empty',
      cards: [],
      street: expectedStreet || 'preflop',
      message: expectedStreet && expectedStreet !== 'preflop' 
        ? `Enter ${getExpectedCardCount(expectedStreet)} cards for the ${expectedStreet}`
        : undefined
    };
  }

  const normalized = normalizeBoard(input);
  const cards: string[] = [];

  // Try to parse as space-separated cards with suits (e.g., "As Kd 2c")
  const spaceSeparated = normalized.split(/\s+/);
  let allCardsValid = true;
  
  for (const cardStr of spaceSeparated) {
    if (cardStr.length === 0) continue;
    
    // Check for card with suit
    const card = parseCard(cardStr);
    if (card) {
      cards.push(`${card.rank}${card.suit}`);
    } else if (cardStr.length === 1 && VALID_RANKS.includes(cardStr)) {
      // Single rank without suit - we'll need to ask for suits
      cards.push(cardStr);
      allCardsValid = false;
    } else if (cardStr.length >= 2) {
      // Try to parse as consecutive cards without spaces (e.g., "AsKd2c")
      const consecutiveCards = cardStr.match(/[AKQJT98765432][shdc]/gi);
      if (consecutiveCards && consecutiveCards.length > 0) {
        for (const c of consecutiveCards) {
          cards.push(c[0].toUpperCase() + c[1].toLowerCase());
        }
      } else {
        // Try ranks only (e.g., "AK2")
        const ranksOnly = cardStr.match(/[AKQJT98765432]/gi);
        if (ranksOnly) {
          for (const r of ranksOnly) {
            cards.push(r.toUpperCase());
            allCardsValid = false;
          }
        }
      }
    }
  }

  // If no cards parsed, try ranks-only format (e.g., "AK2")
  if (cards.length === 0) {
    const ranksOnly = normalized.match(/[AKQJT98765432]/gi);
    if (ranksOnly) {
      for (const r of ranksOnly) {
        cards.push(r.toUpperCase());
        allCardsValid = false;
      }
    }
  }

  // Determine street based on card count
  const street = getStreetFromCardCount(cards.length);

  // Validate card count for expected street
  if (expectedStreet && expectedStreet !== 'preflop') {
    const expected = getExpectedCardCount(expectedStreet);
    if (cards.length !== expected) {
      return {
        status: 'invalid',
        cards,
        street,
        message: `${expectedStreet} needs exactly ${expected} cards, you entered ${cards.length}`,
        suggestions: getExampleBoard(expectedStreet)
      };
    }
  }

  // Check for duplicate cards
  const uniqueCards = new Set(cards.map(c => c.toLowerCase()));
  if (uniqueCards.size !== cards.length && allCardsValid) {
    return {
      status: 'invalid',
      cards,
      street,
      message: 'Duplicate cards detected',
      suggestions: ['Each card can only appear once on the board']
    };
  }

  // Valid board
  if (cards.length > 0) {
    return {
      status: 'valid',
      cards,
      street,
      normalized: cards.join(' '),
      message: !allCardsValid ? 'Add suits to complete (e.g., As Kd 2c)' : undefined
    };
  }

  return {
    status: 'invalid',
    cards: [],
    street: expectedStreet || 'preflop',
    message: 'Invalid board format',
    suggestions: ['Examples: As Kd 2c, Qh Jh Th 9s, Ac Kc Qc Jc Tc']
  };
}

/**
 * Get expected card count for a street
 */
export function getExpectedCardCount(street: Street): number {
  switch (street) {
    case 'preflop': return 0;
    case 'flop': return 3;
    case 'turn': return 4;
    case 'river': return 5;
  }
}

/**
 * Get street from card count
 */
export function getStreetFromCardCount(count: number): Street {
  if (count === 0) return 'preflop';
  if (count <= 3) return 'flop';
  if (count === 4) return 'turn';
  return 'river';
}

/**
 * Get example board for a street
 */
function getExampleBoard(street: Street): string[] {
  switch (street) {
    case 'flop': return ['As Kd 2c', 'Qh Jh Th'];
    case 'turn': return ['As Kd 2c 7h', 'Qh Jh Th 9s'];
    case 'river': return ['As Kd 2c 7h 3s', 'Qh Jh Th 9s 8d'];
    default: return [];
  }
}

/**
 * Check if board is complete for the given street
 */
export function isBoardComplete(input: string, street: Street): boolean {
  if (street === 'preflop') return true;
  const result = parseBoard(input, street);
  return result.status === 'valid' && result.cards.length === getExpectedCardCount(street);
}

/**
 * Get board texture description
 */
export function getBoardTexture(cards: string[]): string {
  if (cards.length < 3) return '';
  
  const suits = cards.map(c => c[1]?.toLowerCase()).filter(Boolean);
  const ranks = cards.map(c => c[0]);
  
  // Check for flush draw
  const suitCounts: Record<string, number> = {};
  for (const suit of suits) {
    suitCounts[suit] = (suitCounts[suit] || 0) + 1;
  }
  const maxSuitCount = Math.max(...Object.values(suitCounts));
  
  // Check for straight potential
  const rankValues = ranks.map(r => {
    const order: Record<string, number> = {
      'A': 14, 'K': 13, 'Q': 12, 'J': 11, 'T': 10,
      '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2
    };
    return order[r] || 0;
  }).sort((a, b) => b - a);
  
  const isConnected = rankValues.length >= 3 && 
    (rankValues[0] - rankValues[rankValues.length - 1]) <= 4;
  
  const textures: string[] = [];
  
  if (maxSuitCount >= 3) textures.push('monotone');
  else if (maxSuitCount === 2) textures.push('two-tone');
  else textures.push('rainbow');
  
  if (isConnected) textures.push('connected');
  else textures.push('disconnected');
  
  // Check for pairs on board
  const rankCounts: Record<string, number> = {};
  for (const rank of ranks) {
    rankCounts[rank] = (rankCounts[rank] || 0) + 1;
  }
  const hasPair = Object.values(rankCounts).some(c => c >= 2);
  if (hasPair) textures.push('paired');
  
  return textures.join(', ');
}
