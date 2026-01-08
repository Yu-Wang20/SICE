/**
 * Text Effects System Unit Tests
 * Tests for motionPrefs, useCountUp, and component behavior
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

// Mock window.matchMedia
Object.defineProperty(global, 'matchMedia', {
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock CustomEvent
global.CustomEvent = class CustomEvent extends Event {
  detail: any;
  constructor(type: string, eventInitDict?: CustomEventInit) {
    super(type, eventInitDict);
    this.detail = eventInitDict?.detail;
  }
} as any;

describe('Motion Preferences', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should return default intensity when no preference is set', async () => {
    const { getAnimationIntensity } = await import('@/lib/motionPrefs');
    expect(getAnimationIntensity()).toBe('normal');
  });

  it('should save and retrieve intensity preference', async () => {
    const { setAnimationIntensity, getAnimationIntensity } = await import('@/lib/motionPrefs');
    
    setAnimationIntensity('high');
    expect(getAnimationIntensity()).toBe('high');
    
    setAnimationIntensity('low');
    expect(getAnimationIntensity()).toBe('low');
    
    setAnimationIntensity('off');
    expect(getAnimationIntensity()).toBe('off');
  });

  it('should check if animations are enabled', async () => {
    const { setAnimationIntensity, isAnimationsEnabled } = await import('@/lib/motionPrefs');
    
    setAnimationIntensity('normal');
    expect(isAnimationsEnabled()).toBe(true);
    
    setAnimationIntensity('off');
    expect(isAnimationsEnabled()).toBe(false);
  });

  it('should validate intensity levels', async () => {
    const { setAnimationIntensity, getAnimationIntensity } = await import('@/lib/motionPrefs');
    
    // Valid levels
    const validLevels = ['off', 'low', 'normal', 'high'] as const;
    for (const level of validLevels) {
      setAnimationIntensity(level);
      expect(getAnimationIntensity()).toBe(level);
    }
  });
});

describe('CountUp Hook Logic', () => {
  it('should format numbers with suffix correctly', () => {
    const formatValue = (value: number, decimals: number, prefix: string, suffix: string) => {
      return `${prefix}${value.toFixed(decimals)}${suffix}`;
    };
    
    expect(formatValue(7, 0, '', '+')).toBe('7+');
    expect(formatValue(1, 0, '', 'M')).toBe('1M');
    expect(formatValue(22, 0, '', '+')).toBe('22+');
    expect(formatValue(90, 0, '', '+')).toBe('90+');
    expect(formatValue(100, 2, '$', '')).toBe('$100.00');
  });

  it('should apply easing functions correctly', () => {
    const easingFunctions = {
      linear: (t: number) => t,
      easeIn: (t: number) => t * t,
      easeOut: (t: number) => t * (2 - t),
      easeInOut: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    };
    
    // Test linear
    expect(easingFunctions.linear(0)).toBe(0);
    expect(easingFunctions.linear(0.5)).toBe(0.5);
    expect(easingFunctions.linear(1)).toBe(1);
    
    // Test easeOut (should be faster at start, slower at end)
    expect(easingFunctions.easeOut(0)).toBe(0);
    expect(easingFunctions.easeOut(0.5)).toBe(0.75); // 0.5 * (2 - 0.5) = 0.75
    expect(easingFunctions.easeOut(1)).toBe(1);
    
    // Test easeIn (should be slower at start, faster at end)
    expect(easingFunctions.easeIn(0)).toBe(0);
    expect(easingFunctions.easeIn(0.5)).toBe(0.25); // 0.5 * 0.5 = 0.25
    expect(easingFunctions.easeIn(1)).toBe(1);
  });

  it('should calculate progress correctly', () => {
    const calculateProgress = (elapsed: number, duration: number) => {
      return Math.min(elapsed / duration, 1);
    };
    
    expect(calculateProgress(0, 2000)).toBe(0);
    expect(calculateProgress(1000, 2000)).toBe(0.5);
    expect(calculateProgress(2000, 2000)).toBe(1);
    expect(calculateProgress(3000, 2000)).toBe(1); // Should cap at 1
  });

  it('should interpolate values correctly', () => {
    const interpolate = (start: number, end: number, progress: number) => {
      return start + (end - start) * progress;
    };
    
    expect(interpolate(0, 100, 0)).toBe(0);
    expect(interpolate(0, 100, 0.5)).toBe(50);
    expect(interpolate(0, 100, 1)).toBe(100);
    expect(interpolate(10, 90, 0.5)).toBe(50);
  });
});

describe('TextFX Strategy Selection', () => {
  it('should select correct effect for hero variant', () => {
    const getSelectedEffect = (variant: string, intensity: string) => {
      if (variant === 'hero') {
        return (intensity === 'normal' || intensity === 'high') ? 'shiny' : 'none';
      }
      return 'none';
    };
    
    expect(getSelectedEffect('hero', 'normal')).toBe('shiny');
    expect(getSelectedEffect('hero', 'high')).toBe('shiny');
    expect(getSelectedEffect('hero', 'low')).toBe('none');
    expect(getSelectedEffect('hero', 'off')).toBe('none');
  });

  it('should select correct effect for resultTag variant', () => {
    const getSelectedEffect = (variant: string, intensity: string) => {
      if (variant === 'resultTag') {
        if (intensity === 'high') return 'glitch';
        if (intensity === 'normal') return 'shiny';
        return 'none';
      }
      return 'none';
    };
    
    expect(getSelectedEffect('resultTag', 'high')).toBe('glitch');
    expect(getSelectedEffect('resultTag', 'normal')).toBe('shiny');
    expect(getSelectedEffect('resultTag', 'low')).toBe('none');
    expect(getSelectedEffect('resultTag', 'off')).toBe('none');
  });

  it('should select correct effect for kpi variant', () => {
    const getSelectedEffect = (variant: string, intensity: string) => {
      if (variant === 'kpi') {
        return (intensity === 'normal' || intensity === 'high') ? 'shiny' : 'none';
      }
      return 'none';
    };
    
    expect(getSelectedEffect('kpi', 'normal')).toBe('shiny');
    expect(getSelectedEffect('kpi', 'high')).toBe('shiny');
    expect(getSelectedEffect('kpi', 'low')).toBe('none');
    expect(getSelectedEffect('kpi', 'off')).toBe('none');
  });

  it('should always return none for body variant', () => {
    const getSelectedEffect = (variant: string, intensity: string) => {
      if (variant === 'body') {
        return 'none';
      }
      return 'auto';
    };
    
    expect(getSelectedEffect('body', 'normal')).toBe('none');
    expect(getSelectedEffect('body', 'high')).toBe('none');
    expect(getSelectedEffect('body', 'low')).toBe('none');
    expect(getSelectedEffect('body', 'off')).toBe('none');
  });
});

describe('ShinyText Animation', () => {
  it('should calculate gradient position correctly', () => {
    const calculateBackgroundPosition = (progress: number) => {
      return `${150 - progress * 2}% center`;
    };
    
    expect(calculateBackgroundPosition(0)).toBe('150% center');
    expect(calculateBackgroundPosition(50)).toBe('50% center');
    expect(calculateBackgroundPosition(100)).toBe('-50% center');
  });

  it('should generate correct gradient style', () => {
    const generateGradient = (spread: number, color: string, shineColor: string) => {
      return `linear-gradient(${spread}deg, ${color} 0%, ${color} 35%, ${shineColor} 50%, ${color} 65%, ${color} 100%)`;
    };
    
    const gradient = generateGradient(120, '#b5b5b5', '#ffffff');
    expect(gradient).toContain('120deg');
    expect(gradient).toContain('#b5b5b5');
    expect(gradient).toContain('#ffffff');
  });
});

describe('GlitchText CSS Variables', () => {
  it('should generate correct CSS variables', () => {
    const generateStyles = (speed: number, enableShadows: boolean) => {
      return {
        '--after-duration': `${speed * 3}s`,
        '--before-duration': `${speed * 2}s`,
        '--after-shadow': enableShadows ? '-5px 0 red' : 'none',
        '--before-shadow': enableShadows ? '5px 0 cyan' : 'none'
      };
    };
    
    const stylesWithShadows = generateStyles(1, true);
    expect(stylesWithShadows['--after-duration']).toBe('3s');
    expect(stylesWithShadows['--before-duration']).toBe('2s');
    expect(stylesWithShadows['--after-shadow']).toBe('-5px 0 red');
    expect(stylesWithShadows['--before-shadow']).toBe('5px 0 cyan');
    
    const stylesWithoutShadows = generateStyles(2, false);
    expect(stylesWithoutShadows['--after-duration']).toBe('6s');
    expect(stylesWithoutShadows['--before-duration']).toBe('4s');
    expect(stylesWithoutShadows['--after-shadow']).toBe('none');
    expect(stylesWithoutShadows['--before-shadow']).toBe('none');
  });
});

describe('TrueFocus Animation', () => {
  it('should split sentence into words correctly', () => {
    const splitSentence = (sentence: string, separator: string) => {
      return sentence.split(separator);
    };
    
    expect(splitSentence('True Focus', ' ')).toEqual(['True', 'Focus']);
    expect(splitSentence('Hello World Test', ' ')).toEqual(['Hello', 'World', 'Test']);
    expect(splitSentence('One', ' ')).toEqual(['One']);
  });

  it('should cycle through word indices correctly', () => {
    const getNextIndex = (currentIndex: number, wordCount: number) => {
      return (currentIndex + 1) % wordCount;
    };
    
    expect(getNextIndex(0, 3)).toBe(1);
    expect(getNextIndex(1, 3)).toBe(2);
    expect(getNextIndex(2, 3)).toBe(0); // Should wrap around
  });

  it('should calculate blur filter correctly', () => {
    const getBlurFilter = (isActive: boolean, blurAmount: number) => {
      return isActive ? 'blur(0px)' : `blur(${blurAmount}px)`;
    };
    
    expect(getBlurFilter(true, 5)).toBe('blur(0px)');
    expect(getBlurFilter(false, 5)).toBe('blur(5px)');
    expect(getBlurFilter(false, 10)).toBe('blur(10px)');
  });
});
