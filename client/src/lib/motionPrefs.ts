/**
 * Motion Preferences Manager
 * Handles global animation intensity settings and prefers-reduced-motion detection
 */

export type IntensityLevel = 'off' | 'low' | 'normal' | 'high';

const STORAGE_KEY = 'animation-intensity';
const INTENSITY_LEVELS: IntensityLevel[] = ['off', 'low', 'normal', 'high'];

/**
 * Get current animation intensity from localStorage
 */
export function getAnimationIntensity(): IntensityLevel {
  if (typeof window === 'undefined') return 'normal';
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && INTENSITY_LEVELS.includes(stored as IntensityLevel)) {
    return stored as IntensityLevel;
  }
  return 'normal';
}

/**
 * Set animation intensity and save to localStorage
 */
export function setAnimationIntensity(intensity: IntensityLevel): void {
  if (typeof window === 'undefined') return;
  
  if (!INTENSITY_LEVELS.includes(intensity)) {
    console.warn(`Invalid intensity level: ${intensity}`);
    return;
  }
  
  localStorage.setItem(STORAGE_KEY, intensity);
  
  // Dispatch custom event for components to listen to
  window.dispatchEvent(new CustomEvent('animation-intensity-changed', { detail: { intensity } }));
}

/**
 * Check if system prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get effective animation intensity considering system preference
 * If system prefers reduced motion, force 'off'
 */
export function getEffectiveIntensity(): IntensityLevel {
  if (prefersReducedMotion()) {
    return 'off';
  }
  return getAnimationIntensity();
}

/**
 * Check if animations are enabled
 */
export function isAnimationsEnabled(): boolean {
  return getEffectiveIntensity() !== 'off';
}

/**
 * Listen for animation intensity changes
 */
export function onAnimationIntensityChange(callback: (intensity: IntensityLevel) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  
  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<{ intensity: IntensityLevel }>;
    callback(customEvent.detail.intensity);
  };
  
  window.addEventListener('animation-intensity-changed', handler);
  
  return () => {
    window.removeEventListener('animation-intensity-changed', handler);
  };
}

/**
 * Listen for system prefers-reduced-motion changes
 */
export function onPrefersReducedMotionChange(callback: (prefersReduced: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  const handler = (e: MediaQueryListEvent) => {
    callback(e.matches);
  };
  
  mediaQuery.addEventListener('change', handler);
  
  return () => {
    mediaQuery.removeEventListener('change', handler);
  };
}

export default {
  getAnimationIntensity,
  setAnimationIntensity,
  prefersReducedMotion,
  getEffectiveIntensity,
  isAnimationsEnabled,
  onAnimationIntensityChange,
  onPrefersReducedMotionChange
};
