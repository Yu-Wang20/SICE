/**
 * CountUp Component - Animated number display
 * Uses useCountUp hook for animation
 */

import { useCountUp } from '@/hooks/useCountUp';

interface CountUpProps {
  end: number;
  start?: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  easing?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';
  delay?: number;
}

export function CountUp({
  end,
  start = 0,
  duration = 2000,
  decimals = 0,
  suffix = '',
  prefix = '',
  className = '',
  easing = 'easeOut',
  delay = 0
}: CountUpProps) {
  const { value } = useCountUp({
    start,
    end,
    duration,
    decimals,
    suffix,
    prefix,
    easing,
    delay
  });

  return <span className={className}>{value}</span>;
}

export default CountUp;
