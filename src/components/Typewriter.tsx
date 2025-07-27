import React, { useEffect, useState, useCallback, memo } from 'react';

// 🛡️ Type definitions for better type safety
interface TypewriterProps {
  text: string;
  speed?: number;
  className?: string;
  onDone?: () => void;
}

/**
 * 🎯 Typewriter - Optimized typewriter component with enhanced performance
 * @description Creates a typewriter effect for text animation
 */
const Typewriter: React.FC<TypewriterProps> = memo(({ 
  text, 
  speed = 100, 
  className, 
  onDone 
}) => {
  const [displayed, setDisplayed] = useState('');

  // 🚀 Optimized typewriter effect with proper cleanup and performance improvements
  useEffect(() => {
    if (!text) {
      setDisplayed('');
      return;
    }

    let i = 0;
    let animationFrameId: number;
    
    const animate = () => {
      i += 1;
      setDisplayed(text.slice(0, i));
      
      if (i < text.length) {
        animationFrameId = setTimeout(() => {
          requestAnimationFrame(animate);
        }, speed);
      } else {
        if (onDone) {
          onDone();
        }
      }
    };

    // Start animation on next frame for better performance
    animationFrameId = requestAnimationFrame(animate);

    // 🚀 Cleanup function to prevent memory leaks
    return () => {
      if (animationFrameId) {
        clearTimeout(animationFrameId);
      }
    };
  }, [text, speed, onDone]);

  // 🚀 Memoized cursor component
  const Cursor = useCallback(() => (
    <span className="inline-block w-px bg-current ml-1 animate-pulse" />
  ), []);

  return (
    <span className={className}>
      {displayed}
      <Cursor />
    </span>
  );
});

Typewriter.displayName = 'Typewriter';

export default Typewriter;
