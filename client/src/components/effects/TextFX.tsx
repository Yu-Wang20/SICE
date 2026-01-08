/**
 * TextFX Component
 * Unified text effect wrapper with automatic strategy selection
 * Selects appropriate effect based on variant, context, and intensity
 */

import React, { ReactNode, useMemo, ElementType } from 'react';
import { useAnimation, AnimationIntensity } from '@/contexts/AnimationContext';
import ShinyText from './ShinyText';
import TrueFocus from './TrueFocus';
import GlitchText from './GlitchText';

export type TextVariant = 'hero' | 'sectionTitle' | 'kpi' | 'resultTag' | 'warning' | 'button' | 'body';
export type EffectType = 'auto' | 'none' | 'shiny' | 'focus' | 'glitch';

interface TextFXProps {
  children: ReactNode;
  text?: string;
  variant?: TextVariant;
  effect?: EffectType;
  intensityOverride?: AnimationIntensity;
  className?: string;
  as?: ElementType;
}

/**
 * Determine which effect to use based on variant and intensity
 */
function selectEffect(
  variant: TextVariant,
  intensity: AnimationIntensity,
  requestedEffect: EffectType
): EffectType {
  // If explicitly requested, use that (unless it's 'auto')
  if (requestedEffect !== 'auto') {
    return requestedEffect;
  }

  // Auto-selection based on variant and intensity
  switch (variant) {
    case 'hero':
      // Hero text: ShinyText with varying intensity
      return intensity === 'off' ? 'none' : 'shiny';

    case 'kpi':
      // KPI numbers: ShinyText or countUp (we use Shiny here, countUp handled separately)
      return intensity === 'off' ? 'none' : intensity === 'low' ? 'none' : 'shiny';

    case 'sectionTitle':
      // Section titles: TrueFocus
      return intensity === 'off' ? 'none' : 'focus';

    case 'resultTag':
      // Result tags (FOLD/CALL/RAISE): ShinyText normally, GlitchText on high
      if (intensity === 'off' || intensity === 'low') return 'none';
      return intensity === 'high' ? 'glitch' : 'shiny';

    case 'warning':
      // Warnings: GlitchText only on high, otherwise plain
      return intensity === 'high' ? 'glitch' : 'none';

    case 'button':
      // Buttons: Light Shiny on hover (but we don't support hover-only Shiny yet, so none)
      return 'none';

    case 'body':
      // Body text: Never use effects
      return 'none';

    default:
      return 'none';
  }
}

/**
 * TextFX - Unified text effect component
 * 
 * @param children - Text content
 * @param text - Alternative text prop
 * @param variant - Semantic role (hero, kpi, sectionTitle, resultTag, warning, button, body)
 * @param effect - Effect override (auto, none, shiny, focus, glitch)
 * @param intensityOverride - Override global intensity setting
 * @param className - Additional CSS classes
 * @param as - HTML element to render as
 */
export const TextFX = React.forwardRef<HTMLElement, TextFXProps>(
  (
    {
      children,
      text,
      variant = 'body',
      effect = 'auto',
      intensityOverride,
      className = '',
      as = 'span',
    },
    ref
  ) => {
    const { intensity: globalIntensity, prefersReducedMotion } = useAnimation();
    const effectiveIntensity = intensityOverride || globalIntensity;

    // Select effect based on strategy
    const selectedEffect = useMemo(
      () => selectEffect(variant, effectiveIntensity, effect),
      [variant, effectiveIntensity, effect]
    );

    const displayText = text || children;

    // Render based on selected effect
    switch (selectedEffect) {
      case 'shiny':
        return (
          <ShinyText
            ref={ref}
            as={as}
            className={className}
            speed={effectiveIntensity === 'low' ? 'slow' : 'normal'}
            intensity={effectiveIntensity === 'low' ? 'low' : 'normal'}
            disabled={prefersReducedMotion}
          >
            {displayText}
          </ShinyText>
        );

      case 'focus':
        return (
          <TrueFocus
            ref={ref}
            as={as}
            className={className}
            sentence={typeof displayText === 'string' ? displayText : undefined}
            manualMode={effectiveIntensity === 'low'}
            blurAmount={effectiveIntensity === 'low' ? 'small' : 'medium'}
            intensity={effectiveIntensity === 'low' ? 'low' : 'normal'}
          >
            {displayText}
          </TrueFocus>
        );

      case 'glitch':
        return (
          <GlitchText
            ref={ref}
            as={as}
            className={className}
            enableOnHover={true}
            intensity={effectiveIntensity === 'high' ? 'high' : 'normal'}
            disabled={prefersReducedMotion}
          >
            {displayText}
          </GlitchText>
        );

      case 'none':
      default:
        // Render as plain text with optional wrapper
        const Element = as as ElementType;
        return (
          <Element ref={ref} className={className}>
            {displayText}
          </Element>
        );
    }
  }
);

TextFX.displayName = 'TextFX';

export default TextFX;
