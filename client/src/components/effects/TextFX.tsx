"use client";
import { useState, useEffect } from 'react';
import ShinyText from './ShinyText';
import TrueFocus from './TrueFocus';
import GlitchText from './GlitchText';
import { 
  getEffectiveIntensity, 
  onAnimationIntensityChange,
  onPrefersReducedMotionChange,
  type IntensityLevel
} from '@/lib/motionPrefs';

/**
 * TextFX - Unified text effect component with automatic strategy selection
 * 
 * Variants:
 * - hero: ShinyText (Normal/High), none (Low/Off)
 * - sectionTitle: TrueFocus (Normal/High), hover-only (Low), none (Off)
 * - resultTag: ShinyText (Normal), GlitchText hover-only (High), none (Low/Off)
 * - kpi: ShinyText (Normal/High), none (Low/Off)
 * - warning: GlitchText hover-only (High), none (Normal/Low/Off)
 * - button: Light effects on hover (Normal/High), none (Low/Off)
 * - body: Always none (readability priority)
 */
type TextFXVariant = 'hero' | 'sectionTitle' | 'resultTag' | 'kpi' | 'warning' | 'button' | 'body';
type TextFXEffect = 'auto' | 'none' | 'shiny' | 'focus' | 'glitch';

interface TextFXProps {
  children: React.ReactNode;
  variant?: TextFXVariant;
  effect?: TextFXEffect;
  className?: string;
  as?: React.ElementType;
  speed?: number;
  color?: string;
  shineColor?: string;
  blurAmount?: number;
  borderColor?: string;
  glowColor?: string;
  glitchSpeed?: number;
  enableShadows?: boolean;
}

const TextFX: React.FC<TextFXProps> = ({
  children,
  variant = 'body',
  effect = 'auto',
  className = '',
  as: Component = 'span',
  // ShinyText props
  speed = 2,
  color = '#b5b5b5',
  shineColor = '#ffffff',
  // TrueFocus props
  blurAmount = 5,
  borderColor = '#10b981',
  glowColor = 'rgba(16, 185, 129, 0.6)',
  // GlitchText props
  glitchSpeed = 1,
  enableShadows = true
}) => {
  const [intensity, setIntensity] = useState<IntensityLevel>('normal');

  useEffect(() => {
    // Get initial intensity
    setIntensity(getEffectiveIntensity());

    // Listen for changes
    const unsubIntensity = onAnimationIntensityChange((newIntensity) => {
      setIntensity(newIntensity);
    });

    const unsubReduced = onPrefersReducedMotionChange(() => {
      setIntensity(getEffectiveIntensity());
    });

    return () => {
      unsubIntensity();
      unsubReduced();
    };
  }, []);

  // Determine which effect to use based on variant and intensity
  const getSelectedEffect = () => {
    // If effect is explicitly set (not auto), use that
    if (effect !== 'auto') {
      return effect;
    }

    // Auto-selection based on variant and intensity
    switch (variant) {
      case 'hero':
        // Hero text: ShinyText for Normal/High, none for Low/Off
        return (intensity === 'normal' || intensity === 'high') ? 'shiny' : 'none';

      case 'sectionTitle':
        // Section titles: TrueFocus for Normal/High, hover-only for Low, none for Off
        if (intensity === 'off') return 'none';
        return 'focus';

      case 'resultTag':
        // Result tags: ShinyText for Normal, GlitchText hover-only for High, none for Low/Off
        if (intensity === 'high') return 'glitch';
        if (intensity === 'normal') return 'shiny';
        return 'none';

      case 'kpi':
        // KPI numbers: ShinyText for Normal/High, none for Low/Off
        return (intensity === 'normal' || intensity === 'high') ? 'shiny' : 'none';

      case 'warning':
        // Warnings: GlitchText hover-only for High, none otherwise
        return intensity === 'high' ? 'glitch' : 'none';

      case 'button':
        // Buttons: Light effects on hover for Normal/High, none for Low/Off
        return (intensity === 'normal' || intensity === 'high') ? 'shiny' : 'none';

      case 'body':
      default:
        // Body text: Never use effects (readability priority)
        return 'none';
    }
  };

  const selectedEffect = getSelectedEffect();
  const text = typeof children === 'string' ? children : '';

  // Render based on selected effect
  switch (selectedEffect) {
    case 'shiny':
      // @ts-ignore - ShinyText is a JSX component
      return (
        <ShinyText
          text={text}
          speed={variant === 'hero' ? 3 : speed}
          color={color}
          shineColor={shineColor}
          className={className}
          disabled={intensity === 'off'}
          pauseOnHover={variant === 'button'}
        />
      );

    case 'focus':
      // @ts-ignore - TrueFocus is a JSX component
      return (
        <TrueFocus
          sentence={text}
          blurAmount={intensity === 'low' ? 3 : blurAmount}
          borderColor={borderColor}
          glowColor={glowColor}
          manualMode={intensity === 'low'}
          animationDuration={0.5}
          pauseBetweenAnimations={1.5}
        />
      );

    case 'glitch':
      // @ts-ignore - GlitchText is a JSX component
      return (
        <GlitchText
          speed={glitchSpeed}
          enableShadows={enableShadows}
          enableOnHover={true}
          className={className}
        >
          {children}
        </GlitchText>
      );

    case 'none':
    default:
      // Render as plain text with optional wrapper
      return (
        <Component className={className}>
          {children}
        </Component>
      );
  }
};

export default TextFX;
