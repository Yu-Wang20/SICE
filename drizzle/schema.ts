import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, float, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ============================================
// POKER DECISION SYSTEM TABLES
// ============================================

/**
 * Hand outcomes table - stores processed poker hand data
 * Pre-aggregated from the 1M row CSV dataset
 */
export const handOutcomes = mysqlTable("hand_outcomes", {
  id: int("id").autoincrement().primaryKey(),
  holeCards: varchar("hole_cards", { length: 20 }).notNull(),
  flop: varchar("flop", { length: 30 }).notNull(),
  flopStrength: varchar("flop_strength", { length: 30 }).notNull(),
  turn: varchar("turn", { length: 40 }).notNull(),
  turnStrength: varchar("turn_strength", { length: 30 }).notNull(),
  river: varchar("river", { length: 50 }).notNull(),
  riverStrength: varchar("river_strength", { length: 30 }).notNull(),
  flopToTurnImprovement: boolean("flop_to_turn_improvement").default(false),
  turnToRiverImprovement: boolean("turn_to_river_improvement").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type HandOutcome = typeof handOutcomes.$inferSelect;
export type InsertHandOutcome = typeof handOutcomes.$inferInsert;

/**
 * Hand strength statistics - pre-aggregated statistics by hand type
 */
export const handStrengthStats = mysqlTable("hand_strength_stats", {
  id: int("id").autoincrement().primaryKey(),
  handType: varchar("hand_type", { length: 30 }).notNull().unique(),
  totalCount: int("total_count").default(0),
  improvementToTurnCount: int("improvement_to_turn_count").default(0),
  improvementToRiverCount: int("improvement_to_river_count").default(0),
  improvementToTurnPct: float("improvement_to_turn_pct").default(0),
  improvementToRiverPct: float("improvement_to_river_pct").default(0),
});

export type HandStrengthStat = typeof handStrengthStats.$inferSelect;
export type InsertHandStrengthStat = typeof handStrengthStats.$inferInsert;

/**
 * Position ranges - pre-computed push/fold ranges by position
 */
export const positionRanges = mysqlTable("position_ranges", {
  id: int("id").autoincrement().primaryKey(),
  position: varchar("position", { length: 10 }).notNull(),
  handCategory: varchar("hand_category", { length: 20 }).notNull(),
  frequency: float("frequency").default(0),
  pushFoldEquity: float("push_fold_equity").default(0),
  opponentType: varchar("opponent_type", { length: 20 }).notNull(),
});

export type PositionRange = typeof positionRanges.$inferSelect;
export type InsertPositionRange = typeof positionRanges.$inferInsert;

/**
 * Research concepts - links research papers to product features
 */
export const researchConcepts = mysqlTable("research_concepts", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  author: varchar("author", { length: 100 }),
  year: int("year"),
  category: varchar("category", { length: 50 }),
  description: text("description"),
  linkedFeature: varchar("linked_feature", { length: 50 }),
  featureDescription: text("feature_description"),
  keyInsight: text("key_insight"),
});

export type ResearchConcept = typeof researchConcepts.$inferSelect;
export type InsertResearchConcept = typeof researchConcepts.$inferInsert;
