import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { parseHand, getHandDisplay, type HandParseResult } from '@/utils/handParser';
import { cn } from '@/lib/utils';

interface HandInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidChange?: (isValid: boolean, normalized?: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function HandInput({
  value,
  onChange,
  onValidChange,
  placeholder = 'e.g., AKs, QQ, 87o',
  className,
  disabled = false
}: HandInputProps) {
  const [parseResult, setParseResult] = useState<HandParseResult>({ status: 'empty' });
  const [showAssist, setShowAssist] = useState(false);
  const [justSelected, setJustSelected] = useState(false);

  // Parse input whenever value changes
  useEffect(() => {
    const result = parseHand(value);
    setParseResult(result);
    
    // Show assist panel for needs_suitedness
    setShowAssist(result.status === 'needs_suitedness');
    
    // Notify parent of validity
    if (onValidChange) {
      onValidChange(result.status === 'valid', result.normalized);
    }
  }, [value, onValidChange]);

  // Handle suitedness selection
  const handleSuitednessSelect = useCallback((suited: boolean) => {
    if (parseResult.status === 'needs_suitedness' && parseResult.normalized) {
      const newValue = `${parseResult.normalized}${suited ? 's' : 'o'}`;
      onChange(newValue);
      setShowAssist(false);
      setJustSelected(true);
      
      // Reset animation state
      setTimeout(() => setJustSelected(false), 600);
    }
  }, [parseResult, onChange]);

  // Get input border color based on state
  const getBorderClass = () => {
    if (disabled) return 'border-gray-200 dark:border-gray-700';
    if (parseResult.status === 'valid') return 'border-emerald-500 dark:border-emerald-400';
    if (parseResult.status === 'needs_suitedness') return 'border-amber-400 dark:border-amber-500';
    if (parseResult.status === 'invalid') return 'border-red-400 dark:border-red-500';
    return 'border-gray-300 dark:border-gray-600';
  };

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  return (
    <div className={cn('relative', className)}>
      {/* Input field */}
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full px-4 py-3 rounded-lg border-2 transition-colors duration-200',
            'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            'focus:ring-emerald-500/50 dark:focus:ring-emerald-400/50',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            getBorderClass()
          )}
          aria-label="Hole cards"
          aria-describedby={parseResult.message ? 'hand-input-message' : undefined}
        />
        
        {/* Success checkmark for valid hands */}
        <AnimatePresence>
          {parseResult.status === 'valid' && (
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <svg 
                className={cn(
                  'w-5 h-5 text-emerald-500',
                  justSelected && !prefersReducedMotion && 'animate-bounce'
                )} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hand display (when valid) */}
      <AnimatePresence>
        {parseResult.status === 'valid' && parseResult.normalized && (
          <motion.p
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="mt-1.5 text-sm text-emerald-600 dark:text-emerald-400 font-medium"
          >
            {getHandDisplay(parseResult.normalized)}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Suited/Offsuit assist panel */}
      <AnimatePresence>
        {showAssist && parseResult.status === 'needs_suitedness' && (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="mt-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
            role="group"
            aria-label="Choose suitedness"
          >
            <p className="text-sm text-amber-800 dark:text-amber-200 mb-3" id="hand-input-message">
              {parseResult.message}
            </p>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleSuitednessSelect(true)}
                className={cn(
                  'flex-1 px-4 py-2.5 rounded-lg font-medium text-sm',
                  'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
                  'border-2 border-emerald-300 dark:border-emerald-700',
                  'hover:bg-emerald-200 dark:hover:bg-emerald-900/50',
                  'focus:outline-none focus:ring-2 focus:ring-emerald-500/50',
                  'transition-colors duration-150',
                  'min-h-[44px]' // Accessibility: minimum tap target
                )}
              >
                <span className="block font-semibold">{parseResult.normalized}s</span>
                <span className="block text-xs opacity-75">Suited (same suit)</span>
              </button>
              
              <button
                type="button"
                onClick={() => handleSuitednessSelect(false)}
                className={cn(
                  'flex-1 px-4 py-2.5 rounded-lg font-medium text-sm',
                  'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
                  'border-2 border-blue-300 dark:border-blue-700',
                  'hover:bg-blue-200 dark:hover:bg-blue-900/50',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500/50',
                  'transition-colors duration-150',
                  'min-h-[44px]' // Accessibility: minimum tap target
                )}
              >
                <span className="block font-semibold">{parseResult.normalized}o</span>
                <span className="block text-xs opacity-75">Offsuit (different suits)</span>
              </button>
            </div>
            
            <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
              Suited hands have both cards in the same suit (e.g., A♠ K♠)
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error message (only for truly invalid inputs) */}
      <AnimatePresence>
        {parseResult.status === 'invalid' && parseResult.message && (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="mt-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
            role="alert"
          >
            <p className="text-sm text-red-700 dark:text-red-300" id="hand-input-message">
              {parseResult.message}
            </p>
            {parseResult.suggestions && parseResult.suggestions.length > 0 && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                Try: {parseResult.suggestions.join(' • ')}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default HandInput;
