/**
 * Motion Preferences Manager
 * Handles global animation intensity settings and prefers-reduced-motion detection
 */

const STORAGE_KEY = 'animation-intensity';
const INTENSITY_LEVELS = ['off', 'low', 'normal', 'high'];

/**
 * Get current animation intensity from localStorage
 * @returns {string} 'off' | 'low' | 'normal' | 'high'
 */
export function getAnimationIntensity() {
  if (typeof window === 'undefined') return 'normal';
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && INTENSITY_LEVELS.includes(stored)) {
    return stored;
  }
  return 'normal';
}

/**
 * Set animation intensity and save to localStorage
 * @param {string} intensity - 'off' | 'low' | 'normal' | 'high'
 */
export function setAnimationIntensity(intensity) {
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
 * @returns {boolean}
 */
export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get effective animation intensity considering system preference
 * If system prefers reduced motion, force 'off'
 * @returns {string} 'off' | 'low' | 'normal' | 'high'
 */
export function getEffectiveIntensity() {
  if (prefersReducedMotion()) {
    return 'off';
  }
  return getAnimationIntensity();
}

/**
 * Check if animations are enabled
 * @returns {boolean}
 */
export function isAnimationsEnabled() {
  return getEffectiveIntensity() !== 'off';
}

/**
 * Listen for animation intensity changes
 * @param {Function} callback - Called with { intensity } when intensity changes
 * @returns {Function} Unsubscribe function
 */
export function onAnimationIntensityChange(callback) {
  if (typeof window === 'undefined') return () => {};
  
  const handler = (event) => {
    callback(event.detail.intensity);
  };
  
  window.addEventListener('animation-intensity-changed', handler);
  
  return () => {
    window.removeEventListener('animation-intensity-changed', handler);
  };
}

/**
 * Listen for system prefers-reduced-motion changes
 * @param {Function} callback - Called with boolean when preference changes
 * @returns {Function} Unsubscribe function
 */
export function onPrefersReducedMotionChange(callback) {
  if (typeof window === 'undefined') return () => {};
  
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  const handler = (e) => {
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
