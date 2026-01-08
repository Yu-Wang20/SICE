/**
 * Poker Dataset Preprocessing Script
 * 
 * Processes the real poker_dataset.csv (1M+ hands) and populates the database
 * with hand outcomes and pre-aggregated statistics.
 */

import fs from 'fs';
import readline from 'readline';
import mysql from 'mysql2/promise';

// Database connection
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required');
  process.exit(1);
}

const INPUT_FILE = '/home/ubuntu/upload/poker_dataset.csv';

// Statistics accumulators
const handTypeStats = {
  'NOTHING': { count: 0, improveToTurn: 0, improveToRiver: 0 },
  'PAIR': { count: 0, improveToTurn: 0, improveToRiver: 0 },
  'TWO PAIR': { count: 0, improveToTurn: 0, improveToRiver: 0 },
  'THREE OF A KIND': { count: 0, improveToTurn: 0, improveToRiver: 0 },
  'STRAIGHT': { count: 0, improveToTurn: 0, improveToRiver: 0 },
  'FLUSH': { count: 0, improveToTurn: 0, improveToRiver: 0 },
  'FULL HOUSE': { count: 0, improveToTurn: 0, improveToRiver: 0 },
  'FOUR OF A KIND': { count: 0, improveToTurn: 0, improveToRiver: 0 },
  'STRAIGHT FLUSH': { count: 0, improveToTurn: 0, improveToRiver: 0 },
  'ROYAL FLUSH': { count: 0, improveToTurn: 0, improveToRiver: 0 },
};

// Hand type ranking for comparison
const handRanking = {
  'NOTHING': 0,
  'PAIR': 1,
  'TWO PAIR': 2,
  'THREE OF A KIND': 3,
  'STRAIGHT': 4,
  'FLUSH': 5,
  'FULL HOUSE': 6,
  'FOUR OF A KIND': 7,
  'STRAIGHT FLUSH': 8,
  'ROYAL FLUSH': 9,
};

function didImprove(from, to) {
  return handRanking[to] > handRanking[from];
}

async function main() {
  console.log('🎰 Poker Dataset Preprocessing Script');
  console.log('=====================================');
  console.log(`Input file: ${INPUT_FILE}`);
  
  // Connect to database
  const connection = await mysql.createConnection(DATABASE_URL);
  console.log('✓ Connected to database');
  
  // Clear existing data
  console.log('Clearing existing data...');
  await connection.execute('DELETE FROM hand_outcomes');
  await connection.execute('DELETE FROM hand_strength_stats');
  console.log('✓ Cleared existing data');
  
  // Process CSV file
  console.log('Processing CSV file...');
  
  const fileStream = fs.createReadStream(INPUT_FILE);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  
  let lineCount = 0;
  let processedCount = 0;
  let sampleHands = []; // Store sample hands for hand_outcomes table
  const SAMPLE_SIZE = 10000; // Store 10k sample hands
  
  for await (const line of rl) {
    lineCount++;
    
    // Skip header
    if (lineCount === 1) continue;
    
    // Parse CSV line
    const parts = line.split(',');
    if (parts.length < 7) continue;
    
    const [hand, flop, result1, turn, result2, river, result3] = parts;
    
    // Validate hand types
    if (!handTypeStats[result1]) continue;
    
    // Update statistics
    handTypeStats[result1].count++;
    
    if (result2 && didImprove(result1, result2)) {
      handTypeStats[result1].improveToTurn++;
    }
    
    if (result3 && didImprove(result1, result3)) {
      handTypeStats[result1].improveToRiver++;
    }
    
    // Store sample hands (every 100th hand up to SAMPLE_SIZE)
    if (sampleHands.length < SAMPLE_SIZE && lineCount % 100 === 0) {
      sampleHands.push({
        holeCards: hand,
        flop: flop,
        turn: turn,
        river: river,
        flopResult: result1,
        turnResult: result2 || result1,
        riverResult: result3 || result2 || result1,
        flopToTurnImprove: result2 ? didImprove(result1, result2) : false,
        turnToRiverImprove: result3 ? didImprove(result2 || result1, result3) : false,
      });
    }
    
    processedCount++;
    
    // Progress update
    if (processedCount % 100000 === 0) {
      console.log(`  Processed ${processedCount.toLocaleString()} hands...`);
    }
  }
  
  console.log(`✓ Processed ${processedCount.toLocaleString()} hands total`);
  
  // Insert hand strength statistics (using correct column names from schema)
  console.log('Inserting hand strength statistics...');
  
  for (const [handType, stats] of Object.entries(handTypeStats)) {
    if (stats.count === 0) continue;
    
    const improveTurnPct = stats.count > 0 
      ? Math.round((stats.improveToTurn / stats.count) * 1000) / 10 
      : 0;
    const improveRiverPct = stats.count > 0 
      ? Math.round((stats.improveToRiver / stats.count) * 1000) / 10 
      : 0;
    
    await connection.execute(
      `INSERT INTO hand_strength_stats (hand_type, total_count, improvement_to_turn_count, improvement_to_river_count, improvement_to_turn_pct, improvement_to_river_pct) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [handType, stats.count, stats.improveToTurn, stats.improveToRiver, improveTurnPct, improveRiverPct]
    );
  }
  
  console.log(`✓ Inserted ${Object.keys(handTypeStats).length} hand strength statistics`);
  
  // Insert sample hand outcomes (using correct column names from schema)
  console.log(`Inserting ${sampleHands.length} sample hand outcomes...`);
  
  for (const hand of sampleHands) {
    await connection.execute(
      `INSERT INTO hand_outcomes (hole_cards, flop, flop_strength, turn, turn_strength, river, river_strength, flop_to_turn_improvement, turn_to_river_improvement) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [hand.holeCards, hand.flop, hand.flopResult, hand.turn, hand.turnResult, hand.river, hand.riverResult, hand.flopToTurnImprove, hand.turnToRiverImprove]
    );
  }
  
  console.log(`✓ Inserted ${sampleHands.length} sample hand outcomes`);
  
  // Print statistics summary
  console.log('\n📊 Hand Type Statistics:');
  console.log('------------------------');
  for (const [handType, stats] of Object.entries(handTypeStats)) {
    if (stats.count === 0) continue;
    const turnPct = stats.count > 0 ? ((stats.improveToTurn / stats.count) * 100).toFixed(2) : 0;
    const riverPct = stats.count > 0 ? ((stats.improveToRiver / stats.count) * 100).toFixed(2) : 0;
    console.log(`  ${handType.padEnd(16)} | Count: ${stats.count.toLocaleString().padStart(10)} | Turn: ${turnPct}% | River: ${riverPct}%`);
  }
  
  await connection.end();
  console.log('\n✅ Database preprocessing complete!');
}

main().catch(console.error);
