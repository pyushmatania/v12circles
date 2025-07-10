import { useState, useEffect, useRef, useCallback } from 'react';

interface UseViewportLazyOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Elite viewport-based lazy loading hook for optimal performance
 * Only renders components when they're visible in the viewport
 */
export const useViewportLazy = (options: UseViewportLazyOptions = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    triggerOnce = true
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    
    if (entry.isIntersecting) {
      setIsVisible(true);
      if (triggerOnce) {
        setHasTriggered(true);
      }
    } else if (!triggerOnce) {
      setIsVisible(false);
    }
  }, [triggerOnce]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [handleIntersection, threshold, rootMargin]);

  // Reset visibility if not triggerOnce
  useEffect(() => {
    if (!triggerOnce && hasTriggered) {
      setIsVisible(false);
      setHasTriggered(false);
    }
  }, [triggerOnce, hasTriggered]);

  return {
    elementRef,
    isVisible: triggerOnce ? isVisible || hasTriggered : isVisible
  };
};

/**
 * Performance-optimized image lazy loading hook
 */
export const useLazyImage = (src: string, placeholder?: string) => {
  const [imageSrc, setImageSrc] = useState(placeholder || src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
      setError(false);
    };

    img.onerror = () => {
      setError(true);
      setIsLoaded(false);
    };

    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, placeholder]);

  return {
    src: imageSrc,
    isLoaded,
    error,
    isLoading: !isLoaded && !error
  };
}; 