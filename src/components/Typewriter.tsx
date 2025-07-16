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

  // 🚀 Optimized typewriter effect with proper cleanup
  useEffect(() => {
    if (!text) {
      setDisplayed('');
      return;
    }

    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setDisplayed(text.slice(0, i));
      
      if (i >= text.length) {
        clearInterval(interval);
        if (onDone) {
          onDone();
        }
      }
    }, speed);

    // 🚀 Cleanup function to prevent memory leaks
    return () => {
      clearInterval(interval);
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
