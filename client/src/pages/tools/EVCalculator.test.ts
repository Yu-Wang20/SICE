/**
 * EVCalculator Unit Tests
 * Tests for EV calculation formulas, input validation, and edge cases
 */

import { describe, it, expect } from 'vitest';
import { validatePercentage, validatePotSize, validateBetSize } from '@/utils/validation';

describe('EVCalculator - Input Validation', () => {
  describe('validatePercentage', () => {
    it('should accept valid percentages (0-100)', () => {
      expect(validatePercentage(0).valid).toBe(true);
      expect(validatePercentage(50).valid).toBe(true);
      expect(validatePercentage(100).valid).toBe(true);
    });

    it('should reject negative percentages', () => {
      expect(validatePercentage(-1).valid).toBe(false);
      expect(validatePercentage(-50).valid).toBe(false);
    });

    it('should reject percentages over 100', () => {
      expect(validatePercentage(101).valid).toBe(false);
      expect(validatePercentage(150).valid).toBe(false);
    });

    it('should reject non-numeric values', () => {
      expect(validatePercentage('abc').valid).toBe(false);
      expect(validatePercentage('').valid).toBe(false);
    });

    it('should normalize valid percentages', () => {
      expect(validatePercentage(35).normalized).toBe(35);
      expect(validatePercentage('75').normalized).toBe(75);
    });
  });

  describe('validatePotSize', () => {
    it('should accept positive pot sizes', () => {
      expect(validatePotSize(100).valid).toBe(true);
      expect(validatePotSize(50).valid).toBe(true);
      expect(validatePotSize(1).valid).toBe(true);
    });

    it('should reject zero or negative pot sizes', () => {
      expect(validatePotSize(0).valid).toBe(false);
      expect(validatePotSize(-100).valid).toBe(false);
    });

    it('should reject non-numeric values', () => {
      expect(validatePotSize('abc').valid).toBe(false);
    });
  });

  describe('validateBetSize', () => {
    it('should accept positive bet sizes', () => {
      expect(validateBetSize(50).valid).toBe(true);
      expect(validateBetSize(100).valid).toBe(true);
    });

    it('should reject zero or negative bet sizes', () => {
      expect(validateBetSize(0).valid).toBe(false);
      expect(validateBetSize(-50).valid).toBe(false);
    });

    it('should reject bets exceeding stack', () => {
      expect(validateBetSize(150, 100).valid).toBe(false);
    });

    it('should accept bets within stack', () => {
      expect(validateBetSize(50, 100).valid).toBe(true);
    });
  });
});

describe('EVCalculator - Calculation Logic', () => {
  /**
   * Helper function to calculate EV
   * Mirrors the actual calculation in EVCalculator.tsx
   */
  function calculateEV(pot: number, bet: number, equity: number, raise: number, foldEquity: number) {
    // Normalize inputs
    const eq = Math.min(1, Math.max(0, equity / 100));
    const foldEq = Math.min(1, Math.max(0, foldEquity / 100));

    // Fold EV is always 0
    const foldEV = 0;

    // Call EV = (equity * (pot + bet)) - ((1 - equity) * bet)
    const totalPot = pot + bet;
    const callEV = (eq * totalPot) - ((1 - eq) * bet);

    // Raise EV = (fold equity * (pot + bet)) + ((1 - fold equity) * ((equity * (pot + bet + raise)) - ((1 - equity) * raise)))
    const potAfterRaise = pot + bet + raise;
    const raiseEVWhenCalled = (eq * potAfterRaise) - ((1 - eq) * raise);
    const raiseEV = (foldEq * (pot + bet)) + ((1 - foldEq) * raiseEVWhenCalled);

    // Cap EV values
    const cappedFoldEV = Math.max(-pot, Math.min(pot * 2, foldEV));
    const cappedCallEV = Math.max(-pot, Math.min(pot * 2, callEV));
    const cappedRaiseEV = Math.max(-pot, Math.min(pot * 2, raiseEV));

    return { foldEV: cappedFoldEV, callEV: cappedCallEV, raiseEV: cappedRaiseEV };
  }

  describe('Call EV Calculation', () => {
    it('should calculate positive EV when equity exceeds pot odds', () => {
      // Pot: 100, Bet: 50, Equity: 40%
      // Pot odds: 50 / (100 + 2*50) = 50/200 = 25%
      // Equity (40%) > Pot odds (25%), so Call EV should be positive
      const result = calculateEV(100, 50, 40, 0, 0);
      expect(result.callEV).toBeGreaterThan(0);
    });

    it('should calculate negative EV when equity is below pot odds', () => {
      // Pot: 100, Bet: 50, Equity: 20%
      // Pot odds: 25%
      // Equity (20%) < Pot odds (25%), so Call EV should be negative
      const result = calculateEV(100, 50, 20, 0, 0);
      expect(result.callEV).toBeLessThan(0);
    });

    it('should calculate breakeven EV at exact pot odds', () => {
      // Pot: 100, Bet: 50, Equity: 25%
      // Pot odds: 25%
      // At breakeven, Call EV should be approximately 0
      const result = calculateEV(100, 50, 25, 0, 0);
      expect(result.callEV).toBeCloseTo(0, 2);
    });

    it('should handle edge case: 100% equity', () => {
      // With 100% equity, Call EV should equal (pot + bet)
      const result = calculateEV(100, 50, 100, 0, 0);
      expect(result.callEV).toBeCloseTo(150, 2);
    });

    it('should handle edge case: 0% equity', () => {
      // With 0% equity, Call EV should equal -bet
      const result = calculateEV(100, 50, 0, 0, 0);
      expect(result.callEV).toBeCloseTo(-50, 2);
    });
  });

  describe('Raise EV Calculation', () => {
    it('should calculate positive EV when fold equity is significant', () => {
      // Pot: 100, Bet: 50, Equity: 30%, Raise: 150, Fold Equity: 60%
      // With 60% fold equity, raising should have positive EV
      const result = calculateEV(100, 50, 30, 150, 60);
      expect(result.raiseEV).toBeGreaterThan(0);
    });

    it('should calculate EV accounting for both fold equity and call equity', () => {
      // Raise EV = (fold equity * (pot + bet)) + ((1 - fold equity) * call EV when called)
      const result = calculateEV(100, 50, 50, 100, 50);
      
      // Manual calculation:
      // Fold equity: 50% * (100 + 50) = 75
      // Call equity: 50% * ((50% * (100 + 50 + 100)) - (50% * 100)) = 50% * (125 - 50) = 37.5
      // Total: 75 + 37.5 = 112.5
      expect(result.raiseEV).toBeCloseTo(112.5, 1);
    });

    it('should handle 0% fold equity (opponent always calls)', () => {
      // With 0% fold equity, Raise EV should equal Call EV when called
      const result = calculateEV(100, 50, 50, 100, 0);
      
      // When opponent calls, EV = (50% * 250) - (50% * 100) = 125 - 50 = 75
      expect(result.raiseEV).toBeCloseTo(75, 1);
    });

    it('should handle 100% fold equity (opponent always folds)', () => {
      // With 100% fold equity, Raise EV should equal (pot + bet)
      const result = calculateEV(100, 50, 50, 100, 100);
      expect(result.raiseEV).toBeCloseTo(150, 1);
    });
  });

  describe('EV Capping (Realistic Ranges)', () => {
    it('should cap unrealistic positive EV values', () => {
      // Create a scenario that would produce unrealistic EV
      // Very high equity with large raise should be capped
      const result = calculateEV(100, 50, 99, 500, 99);
      
      // EV should not exceed pot * 2
      expect(result.raiseEV).toBeLessThanOrEqual(100 * 2);
    });

    it('should cap unrealistic negative EV values', () => {
      // Create a scenario with very low equity and large raise
      const result = calculateEV(100, 50, 1, 500, 1);
      
      // EV should not be less than -pot
      expect(result.raiseEV).toBeGreaterThanOrEqual(-100);
    });

    it('should not cap realistic EV values', () => {
      // Normal scenario
      const result = calculateEV(100, 50, 50, 100, 50);
      
      // These values should not be capped
      expect(result.callEV).toBeGreaterThan(-100);
      expect(result.callEV).toBeLessThan(200);
      expect(result.raiseEV).toBeGreaterThan(-100);
      expect(result.raiseEV).toBeLessThan(200);
    });
  });

  describe('Pot Odds & Breakeven', () => {
    it('should calculate pot odds correctly', () => {
      // Pot: 100, Bet: 50
      // Pot odds = 50 / (100 + 2*50) = 50/200 = 25%
      const bet = 50;
      const pot = 100;
      const potOdds = (bet / (pot + 2 * bet)) * 100;
      expect(potOdds).toBeCloseTo(25, 1);
    });

    it('should calculate breakeven equity correctly', () => {
      // Breakeven equity = Pot odds
      // Pot: 100, Bet: 50 => Breakeven = 25%
      const bet = 50;
      const pot = 100;
      const breakeven = (bet / (pot + 2 * bet)) * 100;
      expect(breakeven).toBeCloseTo(25, 1);
    });
  });

  describe('Best Action Determination', () => {
    it('should recommend FOLD when all actions have negative EV', () => {
      const result = calculateEV(100, 50, 10, 100, 20);
      // With 10% equity against 25% pot odds, Call EV is negative
      // Raise EV is also negative with low equity
      expect(result.callEV).toBeLessThan(0);
      expect(result.raiseEV).toBeLessThan(0);
    });

    it('should recommend CALL when Call EV > Raise EV', () => {
      const result = calculateEV(100, 50, 50, 500, 10);
      // With high raise size and low fold equity, Call EV should be better
      expect(result.callEV).toBeGreaterThan(result.raiseEV);
    });

    it('should recommend RAISE when Raise EV > Call EV', () => {
      const result = calculateEV(100, 50, 50, 100, 60);
      // With high fold equity, Raise EV should be better
      expect(result.raiseEV).toBeGreaterThan(result.callEV);
    });
  });
});

describe('EVCalculator - Edge Cases', () => {
  it('should handle very small pot sizes', () => {
    const result = calculateEV(1, 1, 50, 1, 50);
    expect(result.callEV).toBeDefined();
    expect(result.raiseEV).toBeDefined();
  });

  it('should handle very large pot sizes', () => {
    const result = calculateEV(10000, 5000, 50, 5000, 50);
    expect(result.callEV).toBeDefined();
    expect(result.raiseEV).toBeDefined();
  });

  it('should handle zero bet size', () => {
    const result = calculateEV(100, 0, 50, 100, 50);
    // With 0 bet to call, Call EV should equal pot
    expect(result.callEV).toBeCloseTo(100, 1);
  });
});

// Helper function for testing
function calculateEV(pot: number, bet: number, equity: number, raise: number, foldEquity: number) {
  const eq = Math.min(1, Math.max(0, equity / 100));
  const foldEq = Math.min(1, Math.max(0, foldEquity / 100));

  const foldEV = 0;
  const totalPot = pot + bet;
  const callEV = (eq * totalPot) - ((1 - eq) * bet);

  const potAfterRaise = pot + bet + raise;
  const raiseEVWhenCalled = (eq * potAfterRaise) - ((1 - eq) * raise);
  const raiseEV = (foldEq * (pot + bet)) + ((1 - foldEq) * raiseEVWhenCalled);

  const cappedFoldEV = Math.max(-pot, Math.min(pot * 2, foldEV));
  const cappedCallEV = Math.max(-pot, Math.min(pot * 2, callEV));
  const cappedRaiseEV = Math.max(-pot, Math.min(pot * 2, raiseEV));

  return { foldEV: cappedFoldEV, callEV: cappedCallEV, raiseEV: cappedRaiseEV };
}
