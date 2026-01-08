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

// ============================================
// QUIZ & TRAINING TABLES
// ============================================

export const quizAttempts = mysqlTable("quiz_attempts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  questionId: varchar("question_id", { length: 50 }).notNull(),
  userAnswer: varchar("user_answer", { length: 50 }).notNull(),
  correctAnswer: varchar("correct_answer", { length: 50 }).notNull(),
  isCorrect: boolean("is_correct").notNull(),
  timeSpentSeconds: int("time_spent_seconds"),
  difficulty: varchar("difficulty", { length: 20 }),
  category: varchar("category", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type InsertQuizAttempt = typeof quizAttempts.$inferInsert;

export const userProgress = mysqlTable("user_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  totalAttempts: int("total_attempts").default(0),
  correctAnswers: int("correct_answers").default(0),
  currentStreak: int("current_streak").default(0),
  longestStreak: int("longest_streak").default(0),
  categoryStats: json("category_stats"),
  lastActivityAt: timestamp("last_activity_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = typeof userProgress.$inferInsert;

// ============================================
// HAND HISTORY & ANALYSIS TABLES
// ============================================

export const handHistories = mysqlTable("hand_histories", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id"),
  fileName: varchar("file_name", { length: 255 }),
  rawContent: text("raw_content"),
  analysisResult: json("analysis_result"),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

export type HandHistory = typeof handHistories.$inferSelect;
export type InsertHandHistory = typeof handHistories.$inferInsert;

export const deviationAnalysis = mysqlTable("deviation_analysis", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id"),
  handHistoryId: int("hand_history_id"),
  decisionPoint: int("decision_point"),
  playerAction: varchar("player_action", { length: 50 }),
  gtoRecommendation: varchar("gto_recommendation", { length: 50 }),
  deviationScore: float("deviation_score"),
  explanation: text("explanation"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type DeviationAnalysis = typeof deviationAnalysis.$inferSelect;
export type InsertDeviationAnalysis = typeof deviationAnalysis.$inferInsert;

// ============================================
// STRATEGY & COMPARISON TABLES
// ============================================

export const strategySnapshots = mysqlTable("strategy_snapshots", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  strategyType: varchar("strategy_type", { length: 50 }).notNull(),
  rangeData: json("range_data"),
  metadata: json("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type StrategySnapshot = typeof strategySnapshots.$inferSelect;
export type InsertStrategySnapshot = typeof strategySnapshots.$inferInsert;

export const strategyComparisons = mysqlTable("strategy_comparisons", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id"),
  strategy1Id: int("strategy1_id"),
  strategy2Id: int("strategy2_id"),
  comparisonData: json("comparison_data"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type StrategyComparison = typeof strategyComparisons.$inferSelect;
export type InsertStrategyComparison = typeof strategyComparisons.$inferInsert;
