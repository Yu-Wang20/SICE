/**
 * SplitText - Text animation component inspired by ReactBits
 * Animates text character by character or word by word using motion/react
 */

import { motion } from 'motion/react';
import { useEffect, useRef, useState, useMemo } from 'react';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  splitType?: 'chars' | 'words';
  from?: { opacity?: number; y?: number; x?: number; scale?: number; rotate?: number };
  to?: { opacity?: number; y?: number; x?: number; scale?: number; rotate?: number };
  threshold?: number;
  rootMargin?: string;
  textAlign?: 'left' | 'center' | 'right';
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  onAnimationComplete?: () => void;
  staggerChildren?: number;
}

const SplitText = ({
  text,
  className = '',
  delay = 50,
  duration = 0.6,
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '0px',
  textAlign = 'center',
  tag = 'p',
  onAnimationComplete,
  staggerChildren = 0.03
}: SplitTextProps) => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLElement>(null);

  // Split text into elements
  const elements = useMemo(() => {
    if (splitType === 'words') {
      return text.split(' ').map((word, i, arr) => ({
        content: word,
        isLast: i === arr.length - 1
      }));
    }
    return text.split('').map((char, i, arr) => ({
      content: char,
      isLast: i === arr.length - 1
    }));
  }, [text, splitType]);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerChildren,
        delayChildren: delay / 1000
      }
    }
  };

  const itemVariants = {
    hidden: from,
    visible: {
      ...to,
      transition: {
        duration,
        ease: 'easeOut' as const // smooth animation
      }
    }
  };

  const style = {
    textAlign,
    display: 'flex',
    flexWrap: 'wrap' as const,
    justifyContent: textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start'
  };

  const content = (
    <motion.span
      style={style}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      onAnimationComplete={() => {
        if (inView && onAnimationComplete) {
          onAnimationComplete();
        }
      }}
    >
      {elements.map((item, index) => (
        <motion.span
          key={index}
          variants={itemVariants}
          className="inline-block will-change-[transform,opacity]"
          style={{ 
            whiteSpace: item.content === ' ' ? 'pre' : 'normal'
          }}
        >
          {item.content === ' ' ? '\u00A0' : item.content}
          {splitType === 'words' && !item.isLast && '\u00A0'}
        </motion.span>
      ))}
    </motion.span>
  );

  const renderTag = () => {
    const commonProps = {
      ref: ref as any,
      className
    };

    switch (tag) {
      case 'h1':
        return <h1 {...commonProps}>{content}</h1>;
      case 'h2':
        return <h2 {...commonProps}>{content}</h2>;
      case 'h3':
        return <h3 {...commonProps}>{content}</h3>;
      case 'h4':
        return <h4 {...commonProps}>{content}</h4>;
      case 'h5':
        return <h5 {...commonProps}>{content}</h5>;
      case 'h6':
        return <h6 {...commonProps}>{content}</h6>;
      case 'span':
        return <span {...commonProps}>{content}</span>;
      case 'div':
        return <div {...commonProps}>{content}</div>;
      default:
        return <p {...commonProps}>{content}</p>;
    }
  };

  return renderTag();
};

export default SplitText;
