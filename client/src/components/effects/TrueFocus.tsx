/**
 * TrueFocus Component
 * Blur/focus effect that toggles on hover or automatically
 * SSR-safe, accessibility-compliant, reduced-motion aware
 */

import React, { useState, useMemo, ReactNode } from 'react';
import type { ElementType } from 'react';
import styles from './TrueFocus.module.css';

interface TrueFocusProps {
  children?: ReactNode;
  sentence?: string;
  manualMode?: boolean;
  blurAmount?: 'small' | 'medium' | 'large';
  interval?: 'short' | 'normal' | 'long';
  intensity?: 'low' | 'normal' | 'high';
  className?: string;
  as?: ElementType;
}

/**
 * TrueFocus - Renders text with blur/focus toggle effect
 * 
 * @param children - Text content (fallback if sentence not provided)
 * @param sentence - Text to display with focus effect
 * @param manualMode - If true, only blur on hover; if false, auto-toggle
 * @param blurAmount - Blur intensity (small: 2px, medium: 4px, large: 6px)
 * @param interval - Animation duration (short: 0.2s, normal: 0.4s, long: 0.6s)
 * @param intensity - Visual intensity (low: 0.8, normal: 1, high: 1)
 * @param className - Additional CSS classes
 * @param as - HTML element to render as (default: span)
 */
export const TrueFocus = React.forwardRef<HTMLElement, TrueFocusProps>(
  (
    {
      children,
      sentence = '',
      manualMode = false,
      blurAmount = 'medium',
      interval = 'normal',
      intensity = 'normal',
      className = '',
      as: Component = 'span' as ElementType,
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = useState(false);
    const [autoBlurred, setAutoBlurred] = useState(false);

    // Check for reduced motion preference
    const prefersReducedMotion = useMemo(() => {
      if (typeof window === 'undefined') return false;
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }, []);

    // Auto-toggle effect (when not in manual mode)
    React.useEffect(() => {
      if (manualMode || prefersReducedMotion) return;

      const interval_ms = {
        short: 2000,
        normal: 3000,
        long: 4000,
      }[interval];

      const timer = setInterval(() => {
        setAutoBlurred(prev => !prev);
      }, interval_ms);

      return () => clearInterval(timer);
    }, [manualMode, interval, prefersReducedMotion]);

    const displayText = sentence || children;
    const isBlurred = prefersReducedMotion ? false : (manualMode ? isHovered : autoBlurred);

    const blurClass = {
      small: styles.blurSmall,
      medium: styles.blurMedium,
      large: styles.blurLarge,
    }[blurAmount];

    const intervalClass = {
      short: styles.intervalShort,
      normal: styles.intervalNormal,
      long: styles.intervalLong,
    }[interval];

    const intensityClass = {
      low: styles.intensityLow,
      normal: '',
      high: styles.intensityHigh,
    }[intensity];

    const containerClasses = [
      styles.trueFocusContainer,
      className,
    ].filter(Boolean).join(' ');

    const textClasses = [
      styles.trueFocusText,
      isBlurred ? styles.trueFocusTextBlurred : '',
      blurClass,
      intervalClass,
      intensityClass,
    ].filter(Boolean).join(' ');

    const props = {
      ref,
      className: containerClasses,
      onMouseEnter: () => manualMode && setIsHovered(true),
      onMouseLeave: () => manualMode && setIsHovered(false),
      role: 'status',
    };

    return React.createElement(
      Component as React.ElementType,
      props,
      React.createElement(
        'span',
        {
          className: textClasses,
          'aria-live': 'polite',
        },
        displayText
      )
    );
  }
);

TrueFocus.displayName = 'TrueFocus';

export default TrueFocus;
