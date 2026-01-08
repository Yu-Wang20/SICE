/**
 * useCountUp Hook - Animated number counting effect using anime.js
 * Respects global animation intensity settings
 */

import { useEffect, useRef, useState } from 'react';
import { getEffectiveIntensity, onAnimationIntensityChange, type IntensityLevel } from '@/lib/motionPrefs';

interface UseCountUpOptions {
  start?: number;
  end: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  easing?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';
  delay?: number;
  onComplete?: () => void;
}

interface UseCountUpReturn {
  value: string;
  isAnimating: boolean;
  reset: () => void;
}

export function useCountUp({
  start = 0,
  end,
  duration = 2000,
  decimals = 0,
  suffix = '',
  prefix = '',
  easing = 'easeOut',
  delay = 0,
  onComplete
}: UseCountUpOptions): UseCountUpReturn {
  const [displayValue, setDisplayValue] = useState<number>(start);
  const [isAnimating, setIsAnimating] = useState(false);
  const [intensity, setIntensity] = useState<IntensityLevel>('normal');
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const hasAnimatedRef = useRef(false);

  // Get initial intensity and listen for changes
  useEffect(() => {
    setIntensity(getEffectiveIntensity());
    const unsub = onAnimationIntensityChange((newIntensity) => {
      setIntensity(newIntensity);
    });
    return unsub;
  }, []);

  // Easing functions
  const easingFunctions = {
    linear: (t: number) => t,
    easeIn: (t: number) => t * t,
    easeOut: (t: number) => t * (2 - t),
    easeInOut: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  };

  // Animation function
  const animate = (timestamp: number) => {
    if (startTimeRef.current === null) {
      startTimeRef.current = timestamp;
    }

    const elapsed = timestamp - startTimeRef.current - delay;
    
    if (elapsed < 0) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easingFunctions[easing](progress);
    const currentValue = start + (end - start) * easedProgress;

    setDisplayValue(currentValue);

    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      setIsAnimating(false);
      hasAnimatedRef.current = true;
      onComplete?.();
    }
  };

  // Start animation on mount (only once)
  useEffect(() => {
    // If animations are off, just show the final value
    if (intensity === 'off') {
      setDisplayValue(end);
      hasAnimatedRef.current = true;
      return;
    }

    // Only animate once
    if (hasAnimatedRef.current) {
      setDisplayValue(end);
      return;
    }

    // Adjust duration based on intensity
    const adjustedDuration = intensity === 'low' ? duration * 0.5 : 
                             intensity === 'high' ? duration * 1.2 : 
                             duration;

    setIsAnimating(true);
    startTimeRef.current = null;
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [end, intensity]);

  // Reset function
  const reset = () => {
    hasAnimatedRef.current = false;
    setDisplayValue(start);
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
    }
    
    if (intensity !== 'off') {
      setIsAnimating(true);
      startTimeRef.current = null;
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  // Format the display value
  const formattedValue = `${prefix}${displayValue.toFixed(decimals)}${suffix}`;

  return {
    value: formattedValue,
    isAnimating,
    reset
  };
}

export default useCountUp;
