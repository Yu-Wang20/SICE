/**
 * GlitchText Component
 * Glitch/distortion effect for text
 * SSR-safe, accessibility-compliant, reduced-motion aware
 * Default: static, glitch only on hover
 */

import React, { useMemo, ReactNode } from 'react';
import type { ElementType } from 'react';
import styles from './GlitchText.module.css';

interface GlitchTextProps {
  children: ReactNode;
  enableOnHover?: boolean;
  intensity?: 'low' | 'normal' | 'high';
  disabled?: boolean;
  className?: string;
  as?: ElementType;
}

/**
 * GlitchText - Renders text with glitch effect
 * 
 * @param children - Text content to animate
 * @param enableOnHover - If true, glitch only on hover (default); if false, always glitch
 * @param intensity - Visual intensity (low: 0.7, normal: 1, high: 1)
 * @param disabled - If true, disables animation and shows plain text
 * @param className - Additional CSS classes
 * @param as - HTML element to render as (default: span)
 */
export const GlitchText = React.forwardRef<HTMLElement, GlitchTextProps>(
  (
    {
      children,
      enableOnHover = true,
      intensity = 'normal',
      disabled = false,
      className = '',
      as: Component = 'span' as ElementType,
    },
    ref
  ) => {
    // Check for reduced motion preference
    const prefersReducedMotion = useMemo(() => {
      if (typeof window === 'undefined') return false;
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }, []);

    // Disable glitch if reduced motion is preferred or disabled prop is true
    const shouldGlitch = !prefersReducedMotion && !disabled;

    const intensityClass = {
      low: styles.glitchLow,
      normal: '',
      high: styles.glitchHigh,
    }[intensity];

    const containerClasses = [
      styles.glitchContainer,
      className,
    ].filter(Boolean).join(' ');

    const textClasses = [
      styles.glitchText,
      shouldGlitch && enableOnHover ? styles.glitchHoverOnly : '',
      intensityClass,
    ].filter(Boolean).join(' ');

    const textContent = typeof children === 'string' ? children : '';

    const props = {
      ref,
      className: containerClasses,
      role: disabled ? 'status' : undefined,
      'aria-disabled': disabled,
    };

    return React.createElement(
      Component as React.ElementType,
      props,
      React.createElement(
        'span',
        {
          className: textClasses,
          'data-text': shouldGlitch ? textContent : undefined,
        },
        children
      )
    );
  }
);

GlitchText.displayName = 'GlitchText';

export default GlitchText;
