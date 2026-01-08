"use client";
import { useState, useEffect } from 'react';
import { 
  getAnimationIntensity, 
  setAnimationIntensity, 
  prefersReducedMotion,
  onAnimationIntensityChange 
} from '@/lib/motionPrefs';

type IntensityLevel = 'off' | 'low' | 'normal' | 'high';

export default function AnimationSettings() {
  const [intensity, setIntensity] = useState<IntensityLevel>('normal');
  const [prefersReduced, setPrefersReduced] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    // Load initial values
    setIntensity(getAnimationIntensity() as IntensityLevel);
    setPrefersReduced(prefersReducedMotion());

    // Listen for changes
    const unsubscribe = onAnimationIntensityChange((newIntensity: string) => {
      setIntensity(newIntensity as IntensityLevel);
    });

    return unsubscribe;
  }, []);

  const handleIntensityChange = (newIntensity: IntensityLevel): void => {
    setAnimationIntensity(newIntensity);
    setIntensity(newIntensity);
  };

  const effectiveIntensity: IntensityLevel = prefersReduced ? 'off' : intensity;

  return (
    <div className="animation-settings">
      <button 
        className="animation-settings-trigger"
        onClick={() => setIsOpen(!isOpen)}
        title="Animation Settings"
        aria-label="Animation Settings"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v20M2 12h20M6 6l12 12M18 6l-12 12" />
        </svg>
      </button>

      {isOpen && (
        <div className="animation-settings-panel">
          <div className="animation-settings-header">
            <h3>Animation Settings</h3>
            <button 
              className="close-button"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="animation-settings-content">
            {prefersReduced && (
              <div className="system-preference-notice">
                <p>⚠️ Your system prefers reduced motion. Animations are disabled.</p>
              </div>
            )}

            <div className="intensity-selector">
              <label>Animation Intensity:</label>
              <div className="intensity-options">
                {(['off', 'low', 'normal', 'high'] as IntensityLevel[]).map((level) => (
                  <button
                    key={level}
                    className={`intensity-button ${effectiveIntensity === level ? 'active' : ''} ${prefersReduced ? 'disabled' : ''}`}
                    onClick={() => !prefersReduced && handleIntensityChange(level)}
                    disabled={prefersReduced}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="intensity-description">
              <p>
                {effectiveIntensity === 'off' && 'All animations are disabled.'}
                {effectiveIntensity === 'low' && 'Only subtle animations on hover.'}
                {effectiveIntensity === 'normal' && 'Standard animations on hero, titles, and tags.'}
                {effectiveIntensity === 'high' && 'Enhanced animations including glitch effects.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
