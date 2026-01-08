#!/usr/bin/env node
/**
 * Database Seed Script
 * Populates the database with sample poker data for demonstration
 */

import mysql from 'mysql2/promise';

async function main() {
  console.log('🎰 Database Seed Script');
  console.log('=======================');
  
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  console.log('✓ Connected to database');
  
  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await connection.execute('DELETE FROM hand_outcomes');
    await connection.execute('DELETE FROM hand_strength_stats');
    await connection.execute('DELETE FROM position_ranges');
    await connection.execute('DELETE FROM research_concepts');
    console.log('✓ Cleared existing data');
    
    // Insert hand strength statistics
    console.log('Inserting hand strength statistics...');
    const handStats = [
      ['NOTHING', 150000, 12000, 8000, 8.0, 5.3],
      ['PAIR', 120000, 18000, 15000, 15.0, 12.5],
      ['TWO PAIR', 45000, 5400, 4500, 12.0, 10.0],
      ['THREE OF A KIND', 21000, 2100, 1890, 10.0, 9.0],
      ['STRAIGHT', 18000, 900, 720, 5.0, 4.0],
      ['FLUSH', 15000, 600, 450, 4.0, 3.0],
      ['FULL HOUSE', 9000, 270, 180, 3.0, 2.0],
      ['FOUR OF A KIND', 1500, 15, 8, 1.0, 0.5],
      ['STRAIGHT FLUSH', 300, 3, 2, 1.0, 0.7],
      ['ROYAL FLUSH', 50, 0, 0, 0.0, 0.0],
    ];
    
    for (const [handType, total, turnImprove, riverImprove, turnPct, riverPct] of handStats) {
      await connection.execute(
        `INSERT INTO hand_strength_stats (hand_type, total_count, improvement_to_turn_count, improvement_to_river_count, improvement_to_turn_pct, improvement_to_river_pct) VALUES (?, ?, ?, ?, ?, ?)`,
        [handType, total, turnImprove, riverImprove, turnPct, riverPct]
      );
    }
    console.log(`✓ Inserted ${handStats.length} hand strength statistics`);
    
    // Insert position ranges
    console.log('Inserting position ranges...');
    const positions = ['UTG', 'MP', 'CO', 'BTN', 'SB', 'BB'];
    const handCategories = ['premium', 'strong', 'medium', 'weak'];
    const opponentTypes = ['tight', 'normal', 'loose', 'aggressive'];
    
    let rangeCount = 0;
    for (const pos of positions) {
      for (const handCat of handCategories) {
        for (const oppType of opponentTypes) {
          const baseFreq = { premium: 0.95, strong: 0.75, medium: 0.45, weak: 0.15 }[handCat];
          const posFactor = { UTG: 0.6, MP: 0.7, CO: 0.85, BTN: 0.95, SB: 0.8, BB: 0.7 }[pos];
          const oppFactor = { tight: 0.85, normal: 1.0, loose: 1.15, aggressive: 1.1 }[oppType];
          
          const frequency = Math.min(1.0, baseFreq * posFactor * oppFactor);
          const pushFoldEquity = 0.45 + (frequency * 0.25);
          
          await connection.execute(
            `INSERT INTO position_ranges (position, hand_category, frequency, push_fold_equity, opponent_type) VALUES (?, ?, ?, ?, ?)`,
            [pos, handCat, frequency, pushFoldEquity, oppType]
          );
          rangeCount++;
        }
      }
    }
    console.log(`✓ Inserted ${rangeCount} position range entries`);
    
    // Insert research concepts
    console.log('Inserting research concepts...');
    const concepts = [
      { name: 'Kolmogorov Axioms', author: 'Andrey Kolmogorov', year: 1933, category: 'Mathematics', linkedFeature: 'hand-strength', description: 'Probability axiomatization providing measure-theoretic foundation for randomness. The three axioms (non-negativity, normalization, additivity) form the basis of all probability calculations.', featureDescription: 'Hand strength calculations use conditional probability P(improvement|current_hand) derived from these axioms.', keyInsight: 'All poker probabilities derive from these three axioms: non-negativity, normalization, and additivity.' },
      { name: 'Martingale Theory', author: 'Joseph Doob', year: 1953, category: 'Mathematics', linkedFeature: 'pot-odds', description: 'Stochastic processes with fair game property - expected future value equals current value. Foundation for understanding betting sequences.', featureDescription: 'Pot odds calculator tracks expected value across betting streets using martingale principles.', keyInsight: 'Optimal betting ensures your EV trajectory is a martingale - no systematic drift in either direction.' },
      { name: 'Nash Equilibrium', author: 'John Nash', year: 1950, category: 'Game Theory', linkedFeature: 'push-fold', description: 'Strategy profile where no player benefits from unilateral deviation. The cornerstone of modern game theory and strategic analysis.', featureDescription: 'Push/fold trainer outputs GTO-optimal ranges that form Nash equilibrium in heads-up scenarios.', keyInsight: 'In heads-up push/fold, Nash equilibrium defines unexploitable ranges that guarantee minimum EV.' },
      { name: 'Harsanyi Transformation', author: 'John Harsanyi', year: 1967, category: 'Game Theory', linkedFeature: 'position', description: 'Converting incomplete information games to imperfect information via belief states. Won Nobel Prize in Economics (1994).', featureDescription: 'Position simulator models opponent beliefs and updates them with Bayes rule as new cards are revealed.', keyInsight: 'Poker is incomplete information - we model it as imperfect information via hand ranges (belief states).' },
      { name: 'Prospect Theory', author: 'Tversky & Kahneman', year: 1979, category: 'Behavioral Economics', linkedFeature: 'pot-odds', description: 'Humans overweight losses vs gains (loss aversion) and distort probabilities near extremes. Won Nobel Prize in Economics (2002).', featureDescription: 'Pot odds tool highlights when human bias leads to suboptimal decisions, especially with large bets.', keyInsight: 'Loss aversion makes humans fold too often when facing large bets - the math often says call.' },
      { name: 'CFR Algorithm', author: 'Zinkevich et al.', year: 2007, category: 'AI/ML', linkedFeature: 'push-fold', description: 'Counterfactual Regret Minimization - iteratively minimizes regret to find Nash equilibrium in extensive-form games.', featureDescription: 'Push/fold ranges are computed using CFR-style regret minimization over millions of iterations.', keyInsight: 'CFR converges to Nash equilibrium in two-player zero-sum games - the foundation of poker AI.' },
      { name: 'DeepStack', author: 'Moravčík et al.', year: 2017, category: 'AI/ML', linkedFeature: 'position', description: 'First AI to defeat professional poker players in heads-up no-limit Texas Hold\'em using deep learning + game theory.', featureDescription: 'Position simulator uses nested subgame solving inspired by DeepStack\'s continual re-solving approach.', keyInsight: 'Combining neural networks with game-theoretic reasoning enables superhuman play in imperfect information games.' },
      { name: 'ReBeL', author: 'Brown et al.', year: 2020, category: 'AI/ML', linkedFeature: 'position', description: 'Recursive Belief-based Learning - general framework for imperfect information games combining RL and search.', featureDescription: 'Decision tree in position simulator uses belief state reasoning from ReBeL\'s public belief state approach.', keyInsight: 'Public belief states enable efficient reasoning in imperfect information games without exponential blowup.' },
      { name: 'The Bitter Lesson', author: 'Richard Sutton', year: 2019, category: 'AI Philosophy', linkedFeature: 'research-map', description: 'General methods leveraging computation outperform human-designed domain knowledge. The most important insight in AI research.', featureDescription: 'This entire system demonstrates compute-driven analysis over hand-crafted rules - data beats intuition.', keyInsight: 'Search and learning beat expertise - our data-driven approach validates this across all tools.' },
    ];
    
    for (const concept of concepts) {
      await connection.execute(
        `INSERT INTO research_concepts (name, author, year, category, description, linked_feature, feature_description, key_insight) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [concept.name, concept.author, concept.year, concept.category, concept.description, concept.linkedFeature, concept.featureDescription, concept.keyInsight]
      );
    }
    console.log(`✓ Inserted ${concepts.length} research concepts`);
    
    // Insert sample hand outcomes
    console.log('Inserting sample hand outcomes...');
    const sampleHands = [
      ['A♠ K♠', '2♥ 7♦ J♣', 'NOTHING', '2♥ 7♦ J♣ Q♠', 'NOTHING', '2♥ 7♦ J♣ Q♠ T♥', 'STRAIGHT', true, true],
      ['Q♥ Q♦', '3♠ 8♣ Q♣', 'THREE OF A KIND', '3♠ 8♣ Q♣ 5♦', 'THREE OF A KIND', '3♠ 8♣ Q♣ 5♦ 8♥', 'FULL HOUSE', false, true],
      ['9♠ 8♠', '6♠ 7♠ K♦', 'FLUSH', '6♠ 7♠ K♦ 2♣', 'FLUSH', '6♠ 7♠ K♦ 2♣ 5♠', 'STRAIGHT FLUSH', false, true],
      ['A♦ A♣', 'K♥ K♠ 2♦', 'TWO PAIR', 'K♥ K♠ 2♦ A♥', 'FULL HOUSE', 'K♥ K♠ 2♦ A♥ 3♣', 'FULL HOUSE', true, false],
      ['J♥ T♥', '9♥ 8♥ 2♣', 'FLUSH', '9♥ 8♥ 2♣ Q♥', 'STRAIGHT FLUSH', '9♥ 8♥ 2♣ Q♥ 4♦', 'STRAIGHT FLUSH', true, false],
      ['7♦ 7♣', '7♥ 4♠ 9♦', 'THREE OF A KIND', '7♥ 4♠ 9♦ 7♠', 'FOUR OF A KIND', '7♥ 4♠ 9♦ 7♠ K♣', 'FOUR OF A KIND', true, false],
      ['K♠ Q♠', 'J♠ T♠ 3♦', 'FLUSH', 'J♠ T♠ 3♦ A♠', 'ROYAL FLUSH', 'J♠ T♠ 3♦ A♠ 5♥', 'ROYAL FLUSH', true, false],
      ['5♣ 5♦', '5♥ 5♠ A♦', 'FOUR OF A KIND', '5♥ 5♠ A♦ K♣', 'FOUR OF A KIND', '5♥ 5♠ A♦ K♣ Q♥', 'FOUR OF A KIND', false, false],
      ['A♥ K♥', 'Q♥ J♥ 2♣', 'FLUSH', 'Q♥ J♥ 2♣ T♥', 'ROYAL FLUSH', 'Q♥ J♥ 2♣ T♥ 8♦', 'ROYAL FLUSH', true, false],
      ['8♦ 8♣', '8♥ 3♠ 6♦', 'THREE OF A KIND', '8♥ 3♠ 6♦ 3♥', 'FULL HOUSE', '8♥ 3♠ 6♦ 3♥ 3♣', 'FULL HOUSE', true, true],
    ];
    
    for (const [holeCards, flop, flopStrength, turn, turnStrength, river, riverStrength, flopToTurn, turnToRiver] of sampleHands) {
      await connection.execute(
        `INSERT INTO hand_outcomes (hole_cards, flop, flop_strength, turn, turn_strength, river, river_strength, flop_to_turn_improvement, turn_to_river_improvement) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [holeCards, flop, flopStrength, turn, turnStrength, river, riverStrength, flopToTurn, turnToRiver]
      );
    }
    console.log(`✓ Inserted ${sampleHands.length} sample hand outcomes`);
    
    // Verify data
    console.log('\nVerifying data...');
    const [[{ count: handCount }]] = await connection.execute('SELECT COUNT(*) as count FROM hand_outcomes');
    const [[{ count: statsCount }]] = await connection.execute('SELECT COUNT(*) as count FROM hand_strength_stats');
    const [[{ count: rangeCount2 }]] = await connection.execute('SELECT COUNT(*) as count FROM position_ranges');
    const [[{ count: conceptCount }]] = await connection.execute('SELECT COUNT(*) as count FROM research_concepts');
    
    console.log(`  ✓ Hand outcomes: ${handCount} rows`);
    console.log(`  ✓ Hand strength stats: ${statsCount} hand types`);
    console.log(`  ✓ Position ranges: ${rangeCount2} entries`);
    console.log(`  ✓ Research concepts: ${conceptCount} entries`);
    
    console.log('\n✅ Database seeding complete!');
    
  } finally {
    await connection.end();
  }
}

main().catch(console.error);
