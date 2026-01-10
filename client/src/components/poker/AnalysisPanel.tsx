import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

export type AnalysisState = 'empty' | 'ready' | 'loading' | 'result' | 'error';

export interface AnalysisResult {
  action: 'FOLD' | 'CALL' | 'RAISE' | 'CHECK' | 'BET';
  confidence: number;
  ev?: number;
  potOdds?: number;
  equity?: number;
  reasons: string[];
  keyMetric?: {
    label: string;
    value: string;
  };
}

interface AnalysisPanelProps {
  state: AnalysisState;
  result?: AnalysisResult;
  errorMessage?: string;
  onAnalyze?: () => void;
  onTryExample?: () => void;
  onRetry?: () => void;
  className?: string;
}

export function AnalysisPanel({
  state,
  result,
  errorMessage,
  onAnalyze,
  onTryExample,
  onRetry,
  className
}: AnalysisPanelProps) {
  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  const animationProps = prefersReducedMotion 
    ? { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } };

  return (
    <div 
      className={cn(
        'min-h-[320px] rounded-xl border-2 border-gray-200 dark:border-gray-700',
        'bg-gray-50 dark:bg-gray-800/50 p-6',
        'flex flex-col',
        className
      )}
      role="region"
      aria-label="Analysis results"
      aria-live="polite"
    >
      <AnimatePresence mode="wait">
        {/* Empty State */}
        {state === 'empty' && (
          <motion.div
            key="empty"
            {...animationProps}
            className="flex-1 flex flex-col items-center justify-center text-center"
          >
            <div className="w-16 h-16 mb-4 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Ready to Analyze
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-xs">
              Enter your position, stack size, action line, and hole cards to get a recommendation
            </p>
            {onTryExample && (
              <button
                type="button"
                onClick={onTryExample}
                className={cn(
                  'px-4 py-2.5 rounded-lg text-sm font-medium',
                  'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
                  'hover:bg-gray-300 dark:hover:bg-gray-600',
                  'focus:outline-none focus:ring-2 focus:ring-emerald-500/50',
                  'transition-colors duration-150',
                  'min-h-[44px]'
                )}
              >
                Try Example Spot
              </button>
            )}
          </motion.div>
        )}

        {/* Ready State */}
        {state === 'ready' && (
          <motion.div
            key="ready"
            {...animationProps}
            className="flex-1 flex flex-col items-center justify-center text-center"
          >
            <div className="w-16 h-16 mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Ready to Analyze
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              All inputs are valid. Click below to get your recommendation.
            </p>
            {onAnalyze && (
              <button
                type="button"
                onClick={onAnalyze}
                className={cn(
                  'px-6 py-3 rounded-lg text-base font-semibold',
                  'bg-emerald-600 text-white',
                  'hover:bg-emerald-700 active:scale-[0.98]',
                  'focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2',
                  'transition-all duration-150',
                  'min-h-[48px] min-w-[160px]'
                )}
              >
                Analyze Spot
              </button>
            )}
          </motion.div>
        )}

        {/* Loading State */}
        {state === 'loading' && (
          <motion.div
            key="loading"
            {...animationProps}
            className="flex-1 flex flex-col"
          >
            {/* Skeleton for action */}
            <div className="mb-6">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
              <div className="h-12 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            </div>

            {/* Skeleton for metrics */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700/50">
                  <div className="h-3 w-16 bg-gray-200 dark:bg-gray-600 rounded animate-pulse mb-2" />
                  <div className="h-6 w-12 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
                </div>
              ))}
            </div>

            {/* Skeleton for reasons */}
            <div className="space-y-2">
              <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" style={{ width: `${100 - i * 15}%` }} />
              ))}
            </div>

            <div className="mt-auto pt-4 text-center">
              <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing...
              </div>
            </div>
          </motion.div>
        )}

        {/* Result State */}
        {state === 'result' && result && (
          <motion.div
            key="result"
            {...animationProps}
            className="flex-1 flex flex-col"
          >
            {/* Recommended Action */}
            <div className="mb-6">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Recommended Action
              </p>
              <div className="flex items-center gap-3">
                <span className={cn(
                  'px-4 py-2 rounded-lg text-2xl font-bold',
                  getActionColor(result.action)
                )}>
                  {result.action}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {result.confidence}% confidence
                </span>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {result.ev !== undefined && (
                <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700/50">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Expected Value</p>
                  <p className={cn(
                    'text-lg font-semibold',
                    result.ev >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                  )}>
                    {result.ev >= 0 ? '+' : ''}{result.ev.toFixed(2)} BB
                  </p>
                </div>
              )}
              {result.potOdds !== undefined && (
                <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700/50">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Pot Odds</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {result.potOdds.toFixed(1)}%
                  </p>
                </div>
              )}
              {result.equity !== undefined && (
                <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700/50">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Equity</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {result.equity.toFixed(1)}%
                  </p>
                </div>
              )}
              {result.keyMetric && (
                <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700/50">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{result.keyMetric.label}</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {result.keyMetric.value}
                  </p>
                </div>
              )}
            </div>

            {/* Reasons */}
            {result.reasons.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Why this action?
                </p>
                <ul className="space-y-1.5">
                  {result.reasons.slice(0, 3).map((reason, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <span className="text-emerald-500 mt-0.5">•</span>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Re-analyze button */}
            {onAnalyze && (
              <div className="mt-auto pt-4">
                <button
                  type="button"
                  onClick={onAnalyze}
                  className={cn(
                    'w-full px-4 py-2.5 rounded-lg text-sm font-medium',
                    'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
                    'hover:bg-gray-300 dark:hover:bg-gray-600',
                    'focus:outline-none focus:ring-2 focus:ring-emerald-500/50',
                    'transition-colors duration-150',
                    'min-h-[44px]'
                  )}
                >
                  Re-analyze
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Error State */}
        {state === 'error' && (
          <motion.div
            key="error"
            {...animationProps}
            className="flex-1 flex flex-col items-center justify-center text-center"
          >
            <div className="w-16 h-16 mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Analysis Failed
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-xs">
              {errorMessage || 'Something went wrong. Please try again.'}
            </p>
            <div className="flex gap-3">
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className={cn(
                    'px-4 py-2.5 rounded-lg text-sm font-medium',
                    'bg-emerald-600 text-white',
                    'hover:bg-emerald-700',
                    'focus:outline-none focus:ring-2 focus:ring-emerald-500/50',
                    'transition-colors duration-150',
                    'min-h-[44px]'
                  )}
                >
                  Try Again
                </button>
              )}
              <button
                type="button"
                onClick={() => window.location.reload()}
                className={cn(
                  'px-4 py-2.5 rounded-lg text-sm font-medium',
                  'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
                  'hover:bg-gray-300 dark:hover:bg-gray-600',
                  'focus:outline-none focus:ring-2 focus:ring-gray-500/50',
                  'transition-colors duration-150',
                  'min-h-[44px]'
                )}
              >
                Refresh Page
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper to get action color classes
function getActionColor(action: string): string {
  switch (action) {
    case 'FOLD':
      return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
    case 'CALL':
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
    case 'RAISE':
    case 'BET':
      return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300';
    case 'CHECK':
      return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    default:
      return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
  }
}

export default AnalysisPanel;
