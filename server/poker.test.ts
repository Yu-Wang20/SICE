import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Create a mock context for testing
function createMockContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("poker.handStrength", () => {
  it("returns improvement stats for a given hand type", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.poker.handStrength.getImprovementProbability({
      currentStrength: "PAIR",
    });

    expect(result).toBeDefined();
    expect(result?.handType).toBe("PAIR");
    expect(typeof result?.totalSamples).toBe("number");
    expect(typeof result?.improvementToTurnPct).toBe("number");
    expect(typeof result?.improvementToRiverPct).toBe("number");
  });

  it("returns all hand type statistics", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.poker.handStrength.getStats();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    
    // Check structure of first item
    if (result.length > 0) {
      const firstItem = result[0];
      expect(firstItem).toHaveProperty("handType");
      expect(firstItem).toHaveProperty("totalCount");
      expect(firstItem).toHaveProperty("improvementToTurnPct");
      expect(firstItem).toHaveProperty("improvementToRiverPct");
    }
  });
});

describe("poker.potOdds", () => {
  it("calculates pot odds correctly", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.poker.potOdds.calculate({
      potSize: 100,
      betSize: 50,
      outs: 9,
    });

    expect(result).toBeDefined();
    expect(result.potOdds).toBe("150:50");
    expect(result.breakevenEquity).toBeCloseTo(33.33, 1);
    expect(result.equityOnFlop).toBe(36); // 9 outs * 4
    expect(result.equityOnTurn).toBe(18); // 9 outs * 2
    expect(typeof result.recommendation).toBe("string");
    expect(["CALL", "FOLD", "MARGINAL"]).toContain(result.recommendation);
  });

  it("recommends FOLD when equity is below breakeven", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.poker.potOdds.calculate({
      potSize: 50,
      betSize: 100,
      outs: 4, // Gutshot - only 16% equity
    });

    expect(result.recommendation).toBe("FOLD");
  });

  it("recommends CALL when equity is above breakeven", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.poker.potOdds.calculate({
      potSize: 200,
      betSize: 50,
      outs: 9, // Flush draw
    });

    expect(result.recommendation).toBe("CALL");
  });
});

describe("poker.pushFold", () => {
  it("returns ranges for a given position", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.poker.pushFold.getPositionRanges({
      position: "BTN",
      opponentType: "normal",
    });

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("returns all ranges for a position", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.poker.pushFold.getAllRanges({
      position: "BTN",
    });

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });
});

describe("poker.position", () => {
  it("returns decision tree for IP player", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.poker.position.getDecisionTree({
      isIP: true,
      street: "flop",
      potSize: 100,
      stackSize: 300,
    });

    expect(result).toBeDefined();
    expect(result.spr).toBe(3);
    expect(result.positionAdvantage).toContain("position advantage");
    expect(result.isIP).toBe(true);
    expect(Array.isArray(result.nodes)).toBe(true);
    expect(result.nodes.length).toBeGreaterThan(0);
  });

  it("returns decision tree for OOP player", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.poker.position.getDecisionTree({
      isIP: false,
      street: "river",
      potSize: 200,
      stackSize: 400,
    });

    expect(result).toBeDefined();
    expect(result.spr).toBe(2);
    expect(result.positionAdvantage).toContain("position advantage");
    expect(result.isIP).toBe(false);
    expect(Array.isArray(result.nodes)).toBe(true);
  });
});

describe("research.getConcepts", () => {
  it("returns research concepts from database", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.research.getConcepts();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    
    // Check structure of first item
    const firstConcept = result[0];
    expect(firstConcept).toHaveProperty("name");
    expect(firstConcept).toHaveProperty("author");
    expect(firstConcept).toHaveProperty("year");
    expect(firstConcept).toHaveProperty("category");
    expect(firstConcept).toHaveProperty("description");
  });

  it("includes linked features for concepts", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.research.getConcepts();

    // Find a concept with a linked feature
    const conceptWithFeature = result.find(c => c.linkedFeature);
    
    if (conceptWithFeature) {
      expect(conceptWithFeature.linkedFeature).toBeDefined();
      expect(conceptWithFeature.featureDescription).toBeDefined();
    }
  });
});
