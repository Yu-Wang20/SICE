/**
 * AnimationContext
 * Global animation settings and preferences
 * Manages intensity level, reduced-motion detection, and localStorage persistence
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type AnimationIntensity = 'off' | 'low' | 'normal' | 'high';

interface AnimationContextType {
  intensity: AnimationIntensity;
  setIntensity: (intensity: AnimationIntensity) => void;
  prefersReducedMotion: boolean;
  isEnabled: boolean;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

interface AnimationProviderProps {
  children: ReactNode;
  defaultIntensity?: AnimationIntensity;
}

/**
 * AnimationProvider - Provides global animation settings
 * Reads from localStorage and system prefers-reduced-motion
 */
export const AnimationProvider: React.FC<AnimationProviderProps> = ({
  children,
  defaultIntensity = 'normal',
}) => {
  const [intensity, setIntensityState] = useState<AnimationIntensity>(defaultIntensity);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Check for reduced motion preference and load from localStorage
  useEffect(() => {
    // Check system preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    // Load from localStorage
    const savedIntensity = localStorage.getItem('animation-intensity') as AnimationIntensity | null;
    if (savedIntensity && ['off', 'low', 'normal', 'high'].includes(savedIntensity)) {
      setIntensityState(savedIntensity);
    }

    // Listen for system preference changes
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    setIsHydrated(true);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const setIntensity = (newIntensity: AnimationIntensity) => {
    setIntensityState(newIntensity);
    localStorage.setItem('animation-intensity', newIntensity);
  };

  // If system prefers reduced motion, force intensity to 'off' or 'low'
  const effectiveIntensity = prefersReducedMotion ? 'off' : intensity;
  const isEnabled = effectiveIntensity !== 'off';

  const value: AnimationContextType = {
    intensity: effectiveIntensity,
    setIntensity,
    prefersReducedMotion,
    isEnabled,
  };

  // Don't render until hydrated to avoid SSR mismatch
  if (!isHydrated) {
    return <>{children}</>;
  }

  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  );
};

/**
 * useAnimation - Hook to access global animation settings
 */
export const useAnimation = (): AnimationContextType => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimation must be used within AnimationProvider');
  }
  return context;
};

export default AnimationContext;
