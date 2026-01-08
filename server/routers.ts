import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  getHandStrengthStats,
  queryHandOutcomes,
  getImprovementProbability,
  getPositionRanges,
  getAllPositionRanges,
  getResearchConcepts,
  getResearchConceptByFeature,
  calculatePotOdds,
  getPushFoldRecommendation,
} from "./db";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============================================
  // POKER DECISION SYSTEM API
  // ============================================

  poker: router({
    // Hand Strength Evolution Query
    handStrength: router({
      // Get all hand strength statistics
      getStats: publicProcedure
        .input(z.object({ handType: z.string().optional() }).optional())
        .query(async ({ input }) => {
          return getHandStrengthStats(input?.handType);
        }),

      // Query hand outcomes by hole cards
      queryOutcomes: publicProcedure
        .input(z.object({
          holeCards: z.string(),
          limit: z.number().min(1).max(500).default(100),
        }))
        .query(async ({ input }) => {
          return queryHandOutcomes(input.holeCards, input.limit);
        }),

      // Get improvement probability for current hand strength
      getImprovementProbability: publicProcedure
        .input(z.object({ currentStrength: z.string() }))
        .query(async ({ input }) => {
          return getImprovementProbability(input.currentStrength);
        }),
    }),

    // Pot Odds Decision Engine
    potOdds: router({
      calculate: publicProcedure
        .input(z.object({
          potSize: z.number().min(0),
          betSize: z.number().min(0),
          outs: z.number().min(0).max(47),
        }))
        .query(({ input }) => {
          return calculatePotOdds(input.potSize, input.betSize, input.outs);
        }),
    }),

    // Push/Fold Short Stack Trainer
    pushFold: router({
      // Get position ranges
      getPositionRanges: publicProcedure
        .input(z.object({
          position: z.enum(['UTG', 'MP', 'CO', 'BTN', 'SB', 'BB']),
          opponentType: z.enum(['tight', 'normal', 'loose', 'aggressive']),
        }))
        .query(async ({ input }) => {
          return getPositionRanges(input.position, input.opponentType);
        }),

      // Get all ranges for a position
      getAllRanges: publicProcedure
        .input(z.object({
          position: z.enum(['UTG', 'MP', 'CO', 'BTN', 'SB', 'BB']),
        }))
        .query(async ({ input }) => {
          return getAllPositionRanges(input.position);
        }),

      // Get push/fold recommendation
      getRecommendation: publicProcedure
        .input(z.object({
          stackBB: z.number().min(1).max(200),
          position: z.enum(['UTG', 'MP', 'CO', 'BTN', 'SB', 'BB']),
          opponentType: z.enum(['tight', 'normal', 'loose', 'aggressive']),
          handCategory: z.enum(['premium', 'strong', 'medium', 'weak']),
        }))
        .query(async ({ input }) => {
          return getPushFoldRecommendation(
            input.stackBB,
            input.position,
            input.opponentType,
            input.handCategory
          );
        }),
    }),

    // Position Advantage Simulator
    position: router({
      // Get decision tree for IP vs OOP
      getDecisionTree: publicProcedure
        .input(z.object({
          isIP: z.boolean(),
          street: z.enum(['flop', 'turn', 'river']),
          potSize: z.number().min(0),
          stackSize: z.number().min(0),
        }))
        .query(({ input }) => {
          // Generate decision tree based on position and street
          const { isIP, street, potSize, stackSize } = input;
          const spr = stackSize / potSize; // Stack-to-pot ratio

          // Decision nodes based on position and SPR
          const nodes = generateDecisionTree(isIP, street, spr);
          
          return {
            isIP,
            street,
            potSize,
            stackSize,
            spr: Math.round(spr * 10) / 10,
            nodes,
            positionAdvantage: isIP ? 'You have position advantage' : 'Opponent has position advantage',
          };
        }),
    }),
  }),

  // Research → Product Mapping
  research: router({
    // Get all research concepts
    getConcepts: publicProcedure.query(async () => {
      return getResearchConcepts();
    }),

    // Get concepts by linked feature
    getByFeature: publicProcedure
      .input(z.object({ feature: z.string() }))
      .query(async ({ input }) => {
        return getResearchConceptByFeature(input.feature);
      }),
  }),
});

// Helper function to generate decision tree
function generateDecisionTree(isIP: boolean, street: string, spr: number) {
  const baseActions = ['check', 'bet_small', 'bet_medium', 'bet_large'];
  
  interface DecisionNode {
    id: string;
    action: string;
    ev: number;
    frequency: number;
    children?: DecisionNode[];
    note?: string;
  }

  const createNode = (action: string, ev: number, freq: number, note?: string): DecisionNode => ({
    id: `${action}_${Math.random().toString(36).substr(2, 9)}`,
    action,
    ev: Math.round(ev * 100) / 100,
    frequency: Math.round(freq * 100),
    note,
  });

  // IP has more aggressive options
  if (isIP) {
    if (spr > 3) {
      // Deep stacked - more complex tree
      return [
        createNode('check', 0, 30, 'Check back to control pot'),
        {
          ...createNode('bet_33%', 0.15, 40, 'Standard c-bet sizing'),
          children: [
            createNode('opponent_folds', 0.4, 45),
            createNode('opponent_calls', -0.1, 45),
            createNode('opponent_raises', -0.3, 10),
          ],
        },
        {
          ...createNode('bet_66%', 0.2, 25, 'Polarized sizing'),
          children: [
            createNode('opponent_folds', 0.5, 50),
            createNode('opponent_calls', -0.05, 40),
            createNode('opponent_raises', -0.4, 10),
          ],
        },
        createNode('bet_100%', 0.1, 5, 'Overbet for max value/bluff'),
      ];
    } else {
      // Short SPR - simpler decisions
      return [
        createNode('check', 0, 20),
        {
          ...createNode('bet_50%', 0.25, 50, 'Standard sizing'),
          children: [
            createNode('opponent_folds', 0.5, 55),
            createNode('opponent_shoves', -0.2, 45),
          ],
        },
        createNode('shove', 0.3, 30, 'Commit with strong hands'),
      ];
    }
  } else {
    // OOP - more defensive
    if (spr > 3) {
      return [
        {
          ...createNode('check', 0, 60, 'Check to IP player'),
          children: [
            createNode('opponent_checks', 0.1, 40),
            {
              ...createNode('opponent_bets', -0.1, 60),
              children: [
                createNode('fold', -0.3, 30),
                createNode('call', -0.1, 50),
                createNode('raise', 0.2, 20),
              ],
            },
          ],
        },
        createNode('donk_bet_33%', 0.05, 25, 'Lead with merged range'),
        createNode('donk_bet_66%', 0.1, 15, 'Polarized lead'),
      ];
    } else {
      return [
        {
          ...createNode('check', 0, 50),
          children: [
            createNode('opponent_checks', 0.15, 35),
            createNode('opponent_shoves', -0.25, 65),
          ],
        },
        createNode('shove', 0.2, 35, 'Deny equity'),
        createNode('donk_small', 0.05, 15),
      ];
    }
  }
}

export type AppRouter = typeof appRouter;
