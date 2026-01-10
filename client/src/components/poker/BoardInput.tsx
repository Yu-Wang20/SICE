import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { parseBoard, getExpectedCardCount, getBoardTexture, type Street, type BoardParseResult } from '@/utils/boardParser';
import { cn } from '@/lib/utils';

interface BoardInputProps {
  value: string;
  onChange: (value: string) => void;
  street: Street;
  onStreetChange: (street: Street) => void;
  onValidChange?: (isValid: boolean, cards?: string[]) => void;
  className?: string;
  disabled?: boolean;
}

const STREETS: { value: Street; label: string; cards: number }[] = [
  { value: 'preflop', label: 'Preflop', cards: 0 },
  { value: 'flop', label: 'Flop', cards: 3 },
  { value: 'turn', label: 'Turn', cards: 4 },
  { value: 'river', label: 'River', cards: 5 },
];

export function BoardInput({
  value,
  onChange,
  street,
  onStreetChange,
  onValidChange,
  className,
  disabled = false
}: BoardInputProps) {
  const [parseResult, setParseResult] = useState<BoardParseResult>({ status: 'empty', cards: [], street: 'preflop' });

  // Parse input whenever value or street changes
  useEffect(() => {
    if (street === 'preflop') {
      setParseResult({ status: 'valid', cards: [], street: 'preflop' });
      onValidChange?.(true, []);
      return;
    }

    const result = parseBoard(value, street);
    setParseResult(result);
    
    const isValid = result.status === 'valid' && result.cards.length === getExpectedCardCount(street);
    onValidChange?.(isValid, result.cards);
  }, [value, street, onValidChange]);

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  // Get placeholder based on street
  const getPlaceholder = () => {
    switch (street) {
      case 'flop': return 'e.g., As Kd 2c';
      case 'turn': return 'e.g., As Kd 2c 7h';
      case 'river': return 'e.g., As Kd 2c 7h 3s';
      default: return '';
    }
  };

  // Get border color based on state
  const getBorderClass = () => {
    if (disabled || street === 'preflop') return 'border-gray-200 dark:border-gray-700';
    if (parseResult.status === 'valid' && parseResult.cards.length === getExpectedCardCount(street)) {
      return 'border-emerald-500 dark:border-emerald-400';
    }
    if (parseResult.status === 'invalid') return 'border-red-400 dark:border-red-500';
    return 'border-gray-300 dark:border-gray-600';
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Street selector */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
        {STREETS.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => onStreetChange(s.value)}
            disabled={disabled}
            className={cn(
              'flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-emerald-500/50',
              'min-h-[44px]', // Accessibility: minimum tap target
              street === s.value
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <span className="block">{s.label}</span>
            {s.cards > 0 && (
              <span className="block text-xs opacity-60">{s.cards} cards</span>
            )}
          </button>
        ))}
      </div>

      {/* Board input (hidden for preflop) */}
      <AnimatePresence mode="wait">
        {street !== 'preflop' && (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative">
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={getPlaceholder()}
                disabled={disabled}
                className={cn(
                  'w-full px-4 py-3 rounded-lg border-2 transition-colors duration-200',
                  'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
                  'placeholder:text-gray-400 dark:placeholder:text-gray-500',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2',
                  'focus:ring-emerald-500/50 dark:focus:ring-emerald-400/50',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'font-mono tracking-wide',
                  getBorderClass()
                )}
                aria-label={`${street} board cards`}
              />

              {/* Card count indicator */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                {parseResult.cards.length}/{getExpectedCardCount(street)}
              </div>
            </div>

            {/* Board preview */}
            <AnimatePresence>
              {parseResult.cards.length > 0 && (
                <motion.div
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="mt-2 flex flex-wrap gap-2"
                >
                  {parseResult.cards.map((card, index) => (
                    <div
                      key={index}
                      className={cn(
                        'px-3 py-1.5 rounded-md font-mono text-sm font-semibold',
                        'bg-gray-100 dark:bg-gray-700',
                        card.length === 2 
                          ? getSuitColor(card[1])
                          : 'text-gray-600 dark:text-gray-300'
                      )}
                    >
                      {formatCard(card)}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Board texture (when complete) */}
            <AnimatePresence>
              {parseResult.status === 'valid' && 
               parseResult.cards.length === getExpectedCardCount(street) && 
               parseResult.cards.length >= 3 && (
                <motion.p
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-2 text-sm text-gray-500 dark:text-gray-400"
                >
                  Board texture: {getBoardTexture(parseResult.cards)}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Error/help message */}
            <AnimatePresence>
              {parseResult.status === 'invalid' && parseResult.message && (
                <motion.div
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="mt-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                  role="alert"
                >
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {parseResult.message}
                  </p>
                  {parseResult.suggestions && parseResult.suggestions.length > 0 && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      Examples: {parseResult.suggestions.join(' • ')}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Help text */}
            {parseResult.status !== 'invalid' && parseResult.cards.length < getExpectedCardCount(street) && (
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Enter cards with suits (e.g., As for Ace of spades, Kd for King of diamonds)
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preflop message */}
      {street === 'preflop' && (
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
          No community cards for preflop analysis
        </p>
      )}
    </div>
  );
}

// Helper to get suit color
function getSuitColor(suit: string): string {
  switch (suit.toLowerCase()) {
    case 's': return 'text-gray-900 dark:text-gray-100'; // Spades - black
    case 'c': return 'text-emerald-600 dark:text-emerald-400'; // Clubs - green
    case 'h': return 'text-red-500 dark:text-red-400'; // Hearts - red
    case 'd': return 'text-blue-500 dark:text-blue-400'; // Diamonds - blue
    default: return 'text-gray-600 dark:text-gray-300';
  }
}

// Helper to format card with suit symbol
function formatCard(card: string): string {
  if (card.length !== 2) return card;
  
  const rank = card[0];
  const suit = card[1].toLowerCase();
  
  const suitSymbols: Record<string, string> = {
    's': '♠',
    'h': '♥',
    'd': '♦',
    'c': '♣'
  };
  
  return `${rank}${suitSymbols[suit] || suit}`;
}

export default BoardInput;
