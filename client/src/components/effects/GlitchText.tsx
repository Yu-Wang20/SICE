"use client";
import { CSSProperties } from 'react';
import './GlitchText.css';

interface GlitchTextProps {
  children: React.ReactNode;
  speed?: number;
  enableShadows?: boolean;
  enableOnHover?: boolean;
  className?: string;
}

interface CustomCSSProperties extends CSSProperties {
  '--after-duration'?: string;
  '--before-duration'?: string;
  '--after-shadow'?: string;
  '--before-shadow'?: string;
}

const GlitchText: React.FC<GlitchTextProps> = ({ 
  children, 
  speed = 1, 
  enableShadows = true, 
  enableOnHover = true, 
  className = '' 
}) => {
  const inlineStyles: CustomCSSProperties = {
    '--after-duration': `${speed * 3}s`,
    '--before-duration': `${speed * 2}s`,
    '--after-shadow': enableShadows ? '-5px 0 red' : 'none',
    '--before-shadow': enableShadows ? '5px 0 cyan' : 'none'
  };

  const hoverClass = enableOnHover ? 'enable-on-hover' : '';
  const textContent = typeof children === 'string' ? children : '';

  return (
    <div className={`glitch ${hoverClass} ${className}`} style={inlineStyles} data-text={textContent}>
      {children}
    </div>
  );
};

export default GlitchText;
