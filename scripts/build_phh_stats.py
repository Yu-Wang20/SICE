#!/usr/bin/env python3
"""
PHH Stats Builder
Generates phh_stats.json from PHH dataset for opponent response engine.

Aggregates statistics by:
- Position (BTN, CO, SB, BB, MP, UTG)
- Stack depth bucket (20BB, 50BB, 100BB+)
- Scenario (SRP flop, 3bet pot flop)

Output: data/phh_stats.json
"""

import os
import re
import json
from pathlib import Path
from collections import defaultdict
from typing import Dict, List, Tuple, Any

# PHH Dataset path
PHH_DATASET_PATH = "/home/ubuntu/phh-dataset/data/handhq"

# Output path
OUTPUT_PATH = "/home/ubuntu/ai-research-showcase/data/phh_stats.json"

def parse_phhs_file(filepath: str) -> List[dict]:
    """Parse a .phhs file containing multiple hands"""
    hands = []
    
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
    except Exception as e:
        return []
    
    # Split by hand markers [1], [2], etc.
    hand_blocks = re.split(r'\[(\d+)\]', content)
    
    for i in range(1, len(hand_blocks), 2):
        hand_num = int(hand_blocks[i])
        hand_content = hand_blocks[i + 1] if i + 1 < len(hand_blocks) else ""
        
        hand = {'hand_num': hand_num}
        
        # Parse key-value pairs
        for line in hand_content.strip().split('\n'):
            line = line.strip()
            if '=' in line:
                key, value = line.split('=', 1)
                key = key.strip()
                value = value.strip()
                
                # Parse value
                if value.startswith('[') and value.endswith(']'):
                    try:
                        hand[key] = eval(value)
                    except:
                        hand[key] = value
                elif value.startswith("'") and value.endswith("'"):
                    hand[key] = value[1:-1]
                elif value.startswith('"') and value.endswith('"'):
                    hand[key] = value[1:-1]
                else:
                    try:
                        if '.' in value:
                            hand[key] = float(value)
                        else:
                            hand[key] = int(value)
                    except:
                        hand[key] = value
        
        if hand.get('actions'):
            hands.append(hand)
    
    return hands

def get_position(player_idx: int, seat_count: int) -> str:
    """Get position name from player index"""
    positions_6max = ["SB", "BB", "UTG", "MP", "CO", "BTN"]
    positions_9max = ["SB", "BB", "UTG", "UTG+1", "MP", "MP+1", "HJ", "CO", "BTN"]
    
    positions = positions_6max if seat_count <= 6 else positions_9max
    
    if player_idx < len(positions):
        return positions[player_idx]
    return "UNKNOWN"

def get_stack_bucket(stack_bb: float) -> str:
    """Categorize stack depth into buckets"""
    if stack_bb < 30:
        return "20BB"
    elif stack_bb < 75:
        return "50BB"
    else:
        return "100BB+"

def analyze_hand(hand: dict) -> List[Dict[str, Any]]:
    """
    Analyze a single hand and extract opponent response events.
    Returns list of response events with context.
    """
    events = []
    
    actions = hand.get('actions', [])
    if not actions or not isinstance(actions, list):
        return events
    
    stacks = hand.get('starting_stacks', [])
    blinds = hand.get('blinds_or_straddles', [])
    seat_count = hand.get('seat_count', 6)
    
    if not stacks or not blinds:
        return events
    
    # Get big blind size
    bb_size = max([b for b in blinds if b > 0]) if any(b > 0 for b in blinds) else 10
    
    # Track game state
    street = 'preflop'
    pot = sum(blinds)
    last_bet = 0
    last_aggressor = None
    is_3bet_pot = False
    raise_count = 0
    
    for action in actions:
        if not isinstance(action, str):
            continue
        
        # Detect street changes
        if action.startswith('d db'):
            if street == 'preflop':
                street = 'flop'
            elif street == 'flop':
                street = 'turn'
            elif street == 'turn':
                street = 'river'
            last_bet = 0
            last_aggressor = None
            continue
        
        # Skip deal actions
        if action.startswith('d dh'):
            continue
        
        # Parse player actions
        match = re.match(r'(p\d+)\s+(\w+)(?:\s+(\d+(?:\.\d+)?))?', action)
        if not match:
            continue
        
        player, action_type, amount = match.groups()
        player_idx = int(player[1]) - 1
        amount = float(amount) if amount else 0
        
        # Get player context
        if player_idx < len(stacks):
            stack = stacks[player_idx]
            stack_bb = stack / bb_size
            stack_bucket = get_stack_bucket(stack_bb)
        else:
            stack_bucket = "100BB+"
        
        position = get_position(player_idx, seat_count)
        
        # Determine scenario
        if street == 'flop':
            scenario = '3bet_pot_flop' if is_3bet_pot else 'srp_flop'
        elif street == 'turn':
            scenario = '3bet_pot_turn' if is_3bet_pot else 'srp_turn'
        elif street == 'river':
            scenario = '3bet_pot_river' if is_3bet_pot else 'srp_river'
        else:
            scenario = 'preflop'
        
        # Track preflop raises for 3bet detection
        if street == 'preflop' and action_type == 'cbr':
            raise_count += 1
            if raise_count >= 2:
                is_3bet_pot = True
        
        # Record response to bet/raise (cbet response)
        if last_aggressor and last_aggressor != player and street in ['flop', 'turn', 'river']:
            if action_type == 'f':
                events.append({
                    'position': position,
                    'stack_bucket': stack_bucket,
                    'scenario': scenario,
                    'response': 'fold',
                    'facing': 'cbet' if last_bet > 0 else 'check'
                })
            elif action_type == 'cc':
                events.append({
                    'position': position,
                    'stack_bucket': stack_bucket,
                    'scenario': scenario,
                    'response': 'call',
                    'facing': 'cbet'
                })
            elif action_type == 'cbr':
                events.append({
                    'position': position,
                    'stack_bucket': stack_bucket,
                    'scenario': scenario,
                    'response': 'raise',
                    'facing': 'cbet'
                })
        
        # Update state
        if action_type == 'cbr':
            last_bet = amount
            last_aggressor = player
            pot += amount
        elif action_type == 'cc':
            pot += last_bet
    
    return events

def aggregate_stats(events: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Aggregate events into statistics structure.
    """
    # Initialize counters
    stats = {
        'by_position': defaultdict(lambda: {'fold': 0, 'call': 0, 'raise': 0, 'total': 0}),
        'by_stack': defaultdict(lambda: {'fold': 0, 'call': 0, 'raise': 0, 'total': 0}),
        'by_scenario': defaultdict(lambda: {'fold': 0, 'call': 0, 'raise': 0, 'total': 0}),
        'combined': defaultdict(lambda: {'fold': 0, 'call': 0, 'raise': 0, 'total': 0}),
    }
    
    for event in events:
        if event['facing'] != 'cbet':
            continue
        
        pos = event['position']
        stack = event['stack_bucket']
        scenario = event['scenario']
        response = event['response']
        
        # Update counters
        stats['by_position'][pos][response] += 1
        stats['by_position'][pos]['total'] += 1
        
        stats['by_stack'][stack][response] += 1
        stats['by_stack'][stack]['total'] += 1
        
        stats['by_scenario'][scenario][response] += 1
        stats['by_scenario'][scenario]['total'] += 1
        
        # Combined key
        combined_key = f"{pos}_{stack}_{scenario}"
        stats['combined'][combined_key][response] += 1
        stats['combined'][combined_key]['total'] += 1
    
    return stats

def calculate_rates(stats: Dict[str, Any]) -> Dict[str, Any]:
    """
    Convert counts to rates (0-1).
    """
    result = {}
    
    for category, data in stats.items():
        result[category] = {}
        for key, counts in data.items():
            total = counts['total']
            if total > 0:
                result[category][key] = {
                    'fold_to_cbet': round(counts['fold'] / total, 3),
                    'call_vs_cbet': round(counts['call'] / total, 3),
                    'raise_vs_cbet': round(counts['raise'] / total, 3),
                    'sample_size': total
                }
            else:
                result[category][key] = {
                    'fold_to_cbet': 0.5,
                    'call_vs_cbet': 0.4,
                    'raise_vs_cbet': 0.1,
                    'sample_size': 0
                }
    
    return result

def create_opponent_types(overall_stats: Dict[str, float]) -> Dict[str, Dict[str, float]]:
    """
    Create 4 opponent type profiles based on overall stats.
    """
    base_fold = overall_stats.get('fold_to_cbet', 0.5)
    base_call = overall_stats.get('call_vs_cbet', 0.4)
    base_raise = overall_stats.get('raise_vs_cbet', 0.1)
    
    return {
        'Balanced': {
            'fold_to_cbet': round(base_fold, 3),
            'call_vs_cbet': round(base_call, 3),
            'raise_vs_cbet': round(base_raise, 3),
            'description': 'Uses PHH overall averages. Represents typical online player.'
        },
        'Tight': {
            'fold_to_cbet': round(min(base_fold * 1.3, 0.8), 3),
            'call_vs_cbet': round(base_call * 0.7, 3),
            'raise_vs_cbet': round(base_raise * 0.8, 3),
            'description': 'Folds more often, calls less. Plays fewer hands postflop.'
        },
        'Loose': {
            'fold_to_cbet': round(base_fold * 0.6, 3),
            'call_vs_cbet': round(min(base_call * 1.5, 0.6), 3),
            'raise_vs_cbet': round(base_raise * 0.9, 3),
            'description': 'Folds less, calls more. Sticky player who sees many showdowns.'
        },
        'Aggressive': {
            'fold_to_cbet': round(base_fold * 0.8, 3),
            'call_vs_cbet': round(base_call * 0.6, 3),
            'raise_vs_cbet': round(min(base_raise * 2.5, 0.25), 3),
            'description': 'Raises frequently, calls less. Applies maximum pressure.'
        }
    }

def main():
    """Main function to build PHH stats."""
    print("=" * 60)
    print("PHH Stats Builder")
    print("=" * 60)
    
    # Find all PHHS files
    phhs_dirs = [
        f"{PHH_DATASET_PATH}/PS-2009-07-01_2009-07-23_1000NLH_OBFU/10",
        f"{PHH_DATASET_PATH}/PS-2009-07-01_2009-07-23_400NLH_OBFU/4",
        f"{PHH_DATASET_PATH}/PS-2009-07-01_2009-07-23_200NLH_OBFU/2",
    ]
    
    all_events = []
    total_hands = 0
    files_processed = 0
    files_failed = 0
    
    for phhs_dir in phhs_dirs:
        if not os.path.exists(phhs_dir):
            print(f"Directory not found: {phhs_dir}")
            continue
        
        print(f"\nProcessing: {phhs_dir}")
        phhs_files = list(Path(phhs_dir).glob("*.phhs"))
        print(f"Found {len(phhs_files)} PHHS files")
        
        for phhs_file in phhs_files[:100]:  # Limit for speed
            try:
                hands = parse_phhs_file(str(phhs_file))
                total_hands += len(hands)
                
                for hand in hands:
                    events = analyze_hand(hand)
                    all_events.extend(events)
                
                files_processed += 1
            except Exception as e:
                files_failed += 1
        
        print(f"  Processed {files_processed} files, {files_failed} failed")
    
    print(f"\n{'=' * 60}")
    print(f"AGGREGATION")
    print(f"{'=' * 60}")
    print(f"Total hands analyzed: {total_hands}")
    print(f"Total response events: {len(all_events)}")
    
    # Aggregate statistics
    raw_stats = aggregate_stats(all_events)
    rates = calculate_rates(raw_stats)
    
    # Calculate overall stats for opponent types
    overall = {'fold': 0, 'call': 0, 'raise': 0, 'total': 0}
    for event in all_events:
        if event['facing'] == 'cbet':
            overall[event['response']] += 1
            overall['total'] += 1
    
    if overall['total'] > 0:
        overall_rates = {
            'fold_to_cbet': overall['fold'] / overall['total'],
            'call_vs_cbet': overall['call'] / overall['total'],
            'raise_vs_cbet': overall['raise'] / overall['total'],
        }
    else:
        overall_rates = {
            'fold_to_cbet': 0.5,
            'call_vs_cbet': 0.4,
            'raise_vs_cbet': 0.1,
        }
    
    # Create opponent types
    opponent_types = create_opponent_types(overall_rates)
    
    # Build final output
    output = {
        'metadata': {
            'source': 'PHH Dataset (uoftcprg/phh-dataset)',
            'venues': ['PokerStars'],
            'stakes': ['200NL', '400NL', '1000NL'],
            'date_range': '2009-07-01 to 2009-07-23',
            'total_hands': total_hands,
            'total_events': len(all_events),
            'files_processed': files_processed,
            'files_failed': files_failed,
            'generated_at': '2026-01-08',
            'limitations': [
                'Only PokerStars hands from July 2009',
                'PHHS format only (not raw PHH)',
                'Limited to first 100 files per stake level',
                'Postflop cbet responses only'
            ]
        },
        'overall': {
            'fold_to_cbet': round(overall_rates['fold_to_cbet'], 3),
            'call_vs_cbet': round(overall_rates['call_vs_cbet'], 3),
            'raise_vs_cbet': round(overall_rates['raise_vs_cbet'], 3),
            'sample_size': overall['total']
        },
        'opponent_types': opponent_types,
        'by_position': rates['by_position'],
        'by_stack': rates['by_stack'],
        'by_scenario': rates['by_scenario'],
    }
    
    # Save output
    with open(OUTPUT_PATH, 'w') as f:
        json.dump(output, f, indent=2)
    
    print(f"\n{'=' * 60}")
    print(f"OUTPUT SAVED")
    print(f"{'=' * 60}")
    print(f"File: {OUTPUT_PATH}")
    print(f"\nOverall Stats:")
    print(f"  Fold to Cbet: {output['overall']['fold_to_cbet']:.1%}")
    print(f"  Call vs Cbet: {output['overall']['call_vs_cbet']:.1%}")
    print(f"  Raise vs Cbet: {output['overall']['raise_vs_cbet']:.1%}")
    print(f"\nOpponent Types:")
    for name, data in opponent_types.items():
        print(f"  {name}: F={data['fold_to_cbet']:.0%} C={data['call_vs_cbet']:.0%} R={data['raise_vs_cbet']:.0%}")
    
    return output

if __name__ == "__main__":
    main()
