import { eq, like, sql, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, handOutcomes, handStrengthStats, positionRanges, researchConcepts } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============================================
// POKER DECISION SYSTEM QUERIES
// ============================================

/**
 * Get hand strength statistics for a given hand type
 */
export async function getHandStrengthStats(handType?: string) {
  const db = await getDb();
  if (!db) return [];
  
  if (handType) {
    return db.select().from(handStrengthStats).where(eq(handStrengthStats.handType, handType));
  }
  return db.select().from(handStrengthStats);
}

/**
 * Query hand outcomes by hole cards pattern
 */
export async function queryHandOutcomes(holeCards: string, limit = 100) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(handOutcomes)
    .where(like(handOutcomes.holeCards, `%${holeCards}%`))
    .limit(limit);
}

/**
 * Get improvement probability from current strength to next street
 */
export async function getImprovementProbability(currentStrength: string) {
  const db = await getDb();
  if (!db) return null;
  
  const stats = await db.select()
    .from(handStrengthStats)
    .where(eq(handStrengthStats.handType, currentStrength))
    .limit(1);
  
  if (stats.length === 0) return null;
  
  return {
    handType: stats[0].handType,
    totalSamples: stats[0].totalCount,
    improvementToTurnPct: stats[0].improvementToTurnPct,
    improvementToRiverPct: stats[0].improvementToRiverPct,
  };
}

/**
 * Get position-based push/fold recommendations
 */
export async function getPositionRanges(position: string, opponentType: string) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(positionRanges)
    .where(
      and(
        eq(positionRanges.position, position),
        eq(positionRanges.opponentType, opponentType)
      )
    );
}

/**
 * Get all position ranges for a given position
 */
export async function getAllPositionRanges(position: string) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(positionRanges)
    .where(eq(positionRanges.position, position));
}

/**
 * Get all research concepts
 */
export async function getResearchConcepts() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(researchConcepts);
}

/**
 * Get research concept by linked feature
 */
export async function getResearchConceptByFeature(feature: string) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(researchConcepts)
    .where(eq(researchConcepts.linkedFeature, feature));
}

/**
 * Calculate pot odds and recommendation
 */
export function calculatePotOdds(potSize: number, betSize: number, outs: number) {
  // Breakeven equity = bet / (pot + bet)
  const breakevenEquity = betSize / (potSize + betSize);
  
  // Approximate equity from outs (Rule of 2 and 4)
  // On flop: outs * 4, on turn: outs * 2
  const equityOnFlop = Math.min(outs * 4, 100) / 100;
  const equityOnTurn = Math.min(outs * 2, 100) / 100;
  
  // More precise equity using binomial probability
  const cardsRemaining = 47; // After flop
  const preciseEquity = 1 - (
    (cardsRemaining - outs) / cardsRemaining *
    (cardsRemaining - 1 - outs) / (cardsRemaining - 1)
  );
  
  // Recommendation
  let recommendation: 'CALL' | 'FOLD' | 'MARGINAL';
  if (preciseEquity > breakevenEquity * 1.1) {
    recommendation = 'CALL';
  } else if (preciseEquity < breakevenEquity * 0.9) {
    recommendation = 'FOLD';
  } else {
    recommendation = 'MARGINAL';
  }
  
  return {
    potSize,
    betSize,
    outs,
    breakevenEquity: Math.round(breakevenEquity * 1000) / 10, // percentage
    equityOnFlop: Math.round(equityOnFlop * 1000) / 10,
    equityOnTurn: Math.round(equityOnTurn * 1000) / 10,
    preciseEquity: Math.round(preciseEquity * 1000) / 10,
    recommendation,
    potOdds: `${potSize + betSize}:${betSize}`,
    impliedOdds: potSize > 0 ? Math.round((betSize / potSize) * 100) / 100 : 0,
  };
}

/**
 * Get push/fold recommendation based on stack size and position
 */
export async function getPushFoldRecommendation(
  stackBB: number,
  position: string,
  opponentType: string,
  handCategory: string
) {
  const db = await getDb();
  if (!db) return null;
  
  const ranges = await db.select()
    .from(positionRanges)
    .where(
      and(
        eq(positionRanges.position, position),
        eq(positionRanges.opponentType, opponentType),
        eq(positionRanges.handCategory, handCategory)
      )
    )
    .limit(1);
  
  if (ranges.length === 0) return null;
  
  const range = ranges[0];
  const freq = range.frequency ?? 0;
  const equity = range.pushFoldEquity ?? 0.5;
  
  // Heuristic-based recommendation
  let action: 'PUSH' | 'FOLD' | 'RAISE' | 'LIMP';
  let confidence: number;
  
  if (stackBB <= 10) {
    // Short stack: push or fold
    if (freq >= 0.5) {
      action = 'PUSH';
      confidence = freq;
    } else {
      action = 'FOLD';
      confidence = 1 - freq;
    }
  } else if (stackBB <= 20) {
    // Medium stack: consider raise
    if (freq >= 0.7) {
      action = 'RAISE';
      confidence = freq;
    } else if (freq >= 0.3) {
      action = 'RAISE';
      confidence = freq * 0.8;
    } else {
      action = 'FOLD';
      confidence = 1 - freq;
    }
  } else {
    // Deep stack: standard play
    if (freq >= 0.6) {
      action = 'RAISE';
      confidence = freq;
    } else if (freq >= 0.2) {
      action = 'LIMP';
      confidence = freq;
    } else {
      action = 'FOLD';
      confidence = 1 - freq;
    }
  }
  
  return {
    stackBB,
    position,
    opponentType,
    handCategory,
    action,
    confidence: Math.round(confidence * 100),
    frequency: Math.round(freq * 100),
    pushFoldEquity: Math.round(equity * 100),
    heuristic: `Based on ${position} vs ${opponentType} opponent with ${handCategory} hand at ${stackBB}BB`,
  };
}
