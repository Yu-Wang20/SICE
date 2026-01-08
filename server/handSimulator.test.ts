import { describe, it, expect } from 'vitest';

/**
 * Hand Simulator Logic Tests
 * Tests the core logic functions used in the Hand Simulator feature
 */

// PHH Stats data (matching the component)
const PHH_STATS = {
  overall: { fold_to_cbet: 0.519, call_vs_cbet: 0.362, raise_vs_cbet: 0.119 },
  opponent_types: {
    Balanced: { fold_to_cbet: 0.519, call_vs_cbet: 0.362, raise_vs_cbet: 0.119 },
    Tight: { fold_to_cbet: 0.674, call_vs_cbet: 0.253, raise_vs_cbet: 0.095 },
    Loose: { fold_to_cbet: 0.311, call_vs_cbet: 0.543, raise_vs_cbet: 0.107 },
    Aggressive: { fold_to_cbet: 0.415, call_vs_cbet: 0.217, raise_vs_cbet: 0.25 },
  },
  by_position: {
    BTN: { fold_to_cbet: 0.463, call_vs_cbet: 0.393, raise_vs_cbet: 0.144 },
    CO: { fold_to_cbet: 0.469, call_vs_cbet: 0.390, raise_vs_cbet: 0.142 },
    MP: { fold_to_cbet: 0.476, call_vs_cbet: 0.388, raise_vs_cbet: 0.137 },
    UTG: { fold_to_cbet: 0.480, call_vs_cbet: 0.391, raise_vs_cbet: 0.128 },
    SB: { fold_to_cbet: 0.541, call_vs_cbet: 0.358, raise_vs_cbet: 0.101 },
    BB: { fold_to_cbet: 0.564, call_vs_cbet: 0.330, raise_vs_cbet: 0.106 },
  }
};

type OpponentType = 'Balanced' | 'Tight' | 'Loose' | 'Aggressive';

// Replicate the core logic functions from HandSimulator.tsx
function classifyHand(hand: [string, string], board: string[]): string {
  const [card1, card2] = hand;
  const rank1 = card1[0];
  const rank2 = card2[0];
  
  if (rank1 === rank2) return 'pair';
  if (['A', 'K'].includes(rank1) && ['A', 'K'].includes(rank2)) return 'premium';
  if (['A', 'K', 'Q'].includes(rank1) || ['A', 'K', 'Q'].includes(rank2)) return 'broadway';
  if (card1[1] === card2[1]) return 'suited';
  return 'offsuit';
}

function calculateSPR(stack: number, pot: number): number {
  return pot > 0 ? stack / pot : 999;
}

function getOpponentStats(opponentType: OpponentType, position: string) {
  const typeStats = PHH_STATS.opponent_types[opponentType];
  const posStats = PHH_STATS.by_position[position as keyof typeof PHH_STATS.by_position] || PHH_STATS.overall;
  
  return {
    fold: typeStats.fold_to_cbet * 0.6 + posStats.fold_to_cbet * 0.4,
    call: typeStats.call_vs_cbet * 0.6 + posStats.call_vs_cbet * 0.4,
    raise: typeStats.raise_vs_cbet * 0.6 + posStats.raise_vs_cbet * 0.4,
  };
}

describe('Hand Simulator - Hand Classification', () => {
  it('should classify pocket pairs correctly', () => {
    expect(classifyHand(['As', 'Ah'], [])).toBe('pair');
    expect(classifyHand(['7c', '7d'], [])).toBe('pair');
    expect(classifyHand(['2h', '2s'], [])).toBe('pair');
  });

  it('should classify premium hands correctly', () => {
    expect(classifyHand(['As', 'Kh'], [])).toBe('premium');
    expect(classifyHand(['Kc', 'Ad'], [])).toBe('premium');
  });

  it('should classify broadway hands correctly', () => {
    expect(classifyHand(['As', 'Qh'], [])).toBe('broadway');
    expect(classifyHand(['Kc', 'Jd'], [])).toBe('broadway');
    expect(classifyHand(['Qh', '9s'], [])).toBe('broadway');
  });

  it('should classify suited hands correctly', () => {
    expect(classifyHand(['8s', '7s'], [])).toBe('suited');
    expect(classifyHand(['Jh', '9h'], [])).toBe('suited');
  });

  it('should classify offsuit hands correctly', () => {
    expect(classifyHand(['8s', '7h'], [])).toBe('offsuit');
    expect(classifyHand(['9c', '6d'], [])).toBe('offsuit');
  });
});

describe('Hand Simulator - SPR Calculation', () => {
  it('should calculate SPR correctly', () => {
    expect(calculateSPR(100, 10)).toBe(10);
    expect(calculateSPR(50, 25)).toBe(2);
    expect(calculateSPR(200, 20)).toBe(10);
  });

  it('should handle edge cases', () => {
    expect(calculateSPR(100, 0)).toBe(999);
    expect(calculateSPR(0, 10)).toBe(0);
  });

  it('should return decimal values', () => {
    expect(calculateSPR(100, 15)).toBeCloseTo(6.67, 1);
    expect(calculateSPR(75, 12)).toBeCloseTo(6.25, 2);
  });
});

describe('Hand Simulator - Opponent Stats', () => {
  it('should return blended stats for Balanced opponent', () => {
    const stats = getOpponentStats('Balanced', 'BB');
    // 60% type + 40% position
    // fold: 0.519 * 0.6 + 0.564 * 0.4 = 0.3114 + 0.2256 = 0.537
    expect(stats.fold).toBeCloseTo(0.537, 2);
    expect(stats.call).toBeGreaterThan(0);
    expect(stats.raise).toBeGreaterThan(0);
  });

  it('should return higher fold rate for Tight opponent', () => {
    const tightStats = getOpponentStats('Tight', 'BB');
    const balancedStats = getOpponentStats('Balanced', 'BB');
    expect(tightStats.fold).toBeGreaterThan(balancedStats.fold);
  });

  it('should return lower fold rate for Loose opponent', () => {
    const looseStats = getOpponentStats('Loose', 'BB');
    const balancedStats = getOpponentStats('Balanced', 'BB');
    expect(looseStats.fold).toBeLessThan(balancedStats.fold);
  });

  it('should return higher raise rate for Aggressive opponent', () => {
    const aggressiveStats = getOpponentStats('Aggressive', 'BB');
    const balancedStats = getOpponentStats('Balanced', 'BB');
    expect(aggressiveStats.raise).toBeGreaterThan(balancedStats.raise);
  });

  it('should use overall stats for unknown position', () => {
    const stats = getOpponentStats('Balanced', 'UNKNOWN');
    // Should fall back to overall stats
    expect(stats.fold).toBeCloseTo(0.519, 2);
  });

  it('should ensure probabilities sum to approximately 1', () => {
    const positions = ['BTN', 'CO', 'MP', 'UTG', 'SB', 'BB'];
    const types: OpponentType[] = ['Balanced', 'Tight', 'Loose', 'Aggressive'];
    
    for (const type of types) {
      for (const pos of positions) {
        const stats = getOpponentStats(type, pos);
        const sum = stats.fold + stats.call + stats.raise;
        // Sum should be close to 1 (within 0.1 tolerance due to blending)
        expect(sum).toBeGreaterThan(0.9);
        expect(sum).toBeLessThan(1.1);
      }
    }
  });
});

describe('Hand Simulator - Position Effects', () => {
  it('should show BB folds more than BTN', () => {
    const bbStats = getOpponentStats('Balanced', 'BB');
    const btnStats = getOpponentStats('Balanced', 'BTN');
    // BB should fold more often (out of position)
    expect(bbStats.fold).toBeGreaterThan(btnStats.fold);
  });

  it('should show BTN raises more than BB', () => {
    const bbStats = getOpponentStats('Balanced', 'BB');
    const btnStats = getOpponentStats('Balanced', 'BTN');
    // BTN should raise more (in position)
    expect(btnStats.raise).toBeGreaterThan(bbStats.raise);
  });
});

describe('Hand Simulator - PHH Data Integrity', () => {
  it('should have all opponent types defined', () => {
    expect(PHH_STATS.opponent_types.Balanced).toBeDefined();
    expect(PHH_STATS.opponent_types.Tight).toBeDefined();
    expect(PHH_STATS.opponent_types.Loose).toBeDefined();
    expect(PHH_STATS.opponent_types.Aggressive).toBeDefined();
  });

  it('should have all positions defined', () => {
    expect(PHH_STATS.by_position.BTN).toBeDefined();
    expect(PHH_STATS.by_position.CO).toBeDefined();
    expect(PHH_STATS.by_position.MP).toBeDefined();
    expect(PHH_STATS.by_position.UTG).toBeDefined();
    expect(PHH_STATS.by_position.SB).toBeDefined();
    expect(PHH_STATS.by_position.BB).toBeDefined();
  });

  it('should have valid probability values (0-1)', () => {
    for (const [, stats] of Object.entries(PHH_STATS.opponent_types)) {
      expect(stats.fold_to_cbet).toBeGreaterThanOrEqual(0);
      expect(stats.fold_to_cbet).toBeLessThanOrEqual(1);
      expect(stats.call_vs_cbet).toBeGreaterThanOrEqual(0);
      expect(stats.call_vs_cbet).toBeLessThanOrEqual(1);
      expect(stats.raise_vs_cbet).toBeGreaterThanOrEqual(0);
      expect(stats.raise_vs_cbet).toBeLessThanOrEqual(1);
    }
  });
});
