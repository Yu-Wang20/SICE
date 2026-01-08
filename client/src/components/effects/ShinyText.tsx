/**
 * ShinyText Component
 * Smooth shine animation effect for text
 * SSR-safe, accessibility-compliant, reduced-motion aware
 */

import React, { useMemo, ReactNode } from 'react';
import type { ElementType } from 'react';
import styles from './ShinyText.module.css';

interface ShinyTextProps {
  children: ReactNode;
  speed?: 'slow' | 'normal' | 'fast';
  intensity?: 'low' | 'normal' | 'high';
  disabled?: boolean;
  className?: string;
  as?: ElementType;
}

/**
 * ShinyText - Renders text with smooth shine animation
 * 
 * @param children - Text content to animate
 * @param speed - Animation speed (slow: 5s, normal: 3s, fast: 1.5s)
 * @param intensity - Visual intensity (low: 0.7, normal: 1, high: 1)
 * @param disabled - If true, disables animation and shows plain text
 * @param className - Additional CSS classes
 * @param as - HTML element to render as (default: span)
 */
export const ShinyText = React.forwardRef<HTMLElement, ShinyTextProps>(
  (
    {
      children,
      speed = 'normal',
      intensity = 'normal',
      disabled = false,
      className = '',
      as: Component = 'span' as ElementType,
    },
    ref
  ) => {
    // Check for reduced motion preference (client-side only)
    const prefersReducedMotion = useMemo(() => {
      if (typeof window === 'undefined') return false;
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }, []);

    // Disable animation if reduced motion is preferred or disabled prop is true
    const shouldAnimate = !prefersReducedMotion && !disabled;

    const speedClass = {
      slow: styles.shinyTextSlow,
      normal: styles.shinyTextNormal,
      fast: styles.shinyTextFast,
    }[speed];

    const intensityClass = {
      low: styles.shinyTextLow,
      normal: '',
      high: styles.shinyTextHigh,
    }[intensity];

    const containerClasses = [
      styles.shinyContainer,
      className,
    ].filter(Boolean).join(' ');

    const textClasses = [
      shouldAnimate ? styles.shinyText : styles.shinyTextDisabled,
      speedClass,
      intensityClass,
    ].filter(Boolean).join(' ');

    const props = {
      ref,
      className: containerClasses,
    };

    return React.createElement(
      Component as React.ElementType,
      props,
      React.createElement(
        'span',
        {
          className: textClasses,
          role: disabled ? 'status' : undefined,
          'aria-disabled': disabled,
        },
        children
      )
    );
  }
);

ShinyText.displayName = 'ShinyText';

export default ShinyText;
