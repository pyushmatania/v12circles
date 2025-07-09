import React, { useState, useCallback } from 'react';
import { handleImageError } from '../utils/imageOptimizer';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  fallback?: string;
  onLoad?: () => void;
  onError?: () => void;
  width?: number;
  height?: number;
  priority?: boolean;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  fallback,
  onLoad,
  onError,
  width,
  height,
  priority = false
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);



  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback((event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasError && fallback) {
      setImageSrc(fallback);
      setHasError(true);
    } else {
      handleImageError(event, fallback);
      setHasError(true);
    }
    onError?.();
  }, [fallback, hasError, onError]);

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      loading={priority ? 'eager' : loading}
      width={width}
      height={height}
      onLoad={handleLoad}
      onError={handleError}
      style={{
        willChange: 'opacity',
        contain: 'layout style paint'
      }}
    />
  );
};

export default OptimizedImage; 