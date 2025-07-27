import React, { useState, useRef, useEffect, useCallback } from 'react';

// Extend Window interface for performance tracking
declare global {
  interface Window {
    imagePerformanceTracker?: (url: string, loadTime: number, success: boolean) => void;
  }
}

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjM2I0MjU5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+'
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(placeholder);
  const [retryCount, setRetryCount] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);

  // 🚀 Enhanced fallback image generation based on alt text
  const generateFallbackImage = (text: string): string => {
    const colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444'];
    const color = colors[text.length % colors.length];
    const initials = text.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
    
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${color}"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="48" fill="white" text-anchor="middle" dy=".3em">${initials}</text>
      </svg>
    `)}`;
  };

  // 🚀 Enhanced TMDB URL validation and optimization
  const getOptimizedSrc = useCallback((originalSrc: string): string => {
    if (!originalSrc || originalSrc === placeholder) return placeholder;
    
    // If it's already a TMDB URL, optimize it
    if (originalSrc.includes('image.tmdb.org')) {
      // Use w300 for thumbnails, w500 for medium, w780 for larger images
      const size = width && width <= 100 ? 'w150' : 
                   width && width <= 200 ? 'w300' : 
                   width && width <= 400 ? 'w500' : 'w780';
      
      return originalSrc.replace('/t/p/w500/', `/t/p/${size}/`);
    }
    
    return originalSrc;
  }, [placeholder, width]);

  // 🚀 Enhanced error handling with retry mechanism
  const loadImage = useCallback((imageSrc: string, isRetry = false) => {
    if (!imageSrc || imageSrc === placeholder) return;

    setIsLoading(true);
    setHasError(false);

    const optimizedSrc = getOptimizedSrc(imageSrc);
    const startTime = performance.now();
    
    // Preload image
    const img = new Image();
    img.onload = () => {
      const loadTime = performance.now() - startTime;
      setCurrentSrc(optimizedSrc);
      setIsLoading(false);
      setRetryCount(0);
      
      // Track performance if monitoring is available
      if (window.imagePerformanceTracker) {
        window.imagePerformanceTracker(optimizedSrc, loadTime, true);
      }
    };
    img.onerror = () => {
      const loadTime = performance.now() - startTime;
      
      // Track performance if monitoring is available
      if (window.imagePerformanceTracker) {
        window.imagePerformanceTracker(optimizedSrc, loadTime, false);
      }

      // 🚀 Optimized retry with different TMDB sizes if it's a TMDB URL
      if (optimizedSrc.includes('image.tmdb.org') && retryCount < 2 && !isRetry) {
        setRetryCount(prev => prev + 1);
        const fallbackSizes = ['w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original'];
        const currentSize = optimizedSrc.match(/\/t\/p\/([^/]+)\//)?.[1];
        const currentIndex = fallbackSizes.indexOf(currentSize || 'w500');
        const nextSize = fallbackSizes[Math.min(currentIndex + 1, fallbackSizes.length - 1)];
        const fallbackSrc = optimizedSrc.replace(/\/t\/p\/[^/]+\//, `/t/p/${nextSize}/`);
        
        // Use requestAnimationFrame for smoother retry timing
        requestAnimationFrame(() => loadImage(fallbackSrc, true));
        return;
      }

      // 🚀 Use fallback image if all retries fail
      setHasError(true);
      setIsLoading(false);
      setCurrentSrc(generateFallbackImage(alt));
    };
    img.src = optimizedSrc;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [placeholder, retryCount, alt, getOptimizedSrc]);

  useEffect(() => {
    loadImage(src);
  }, [src, width, placeholder, loadImage]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        className={`transition-all duration-300 ${
          isLoading ? 'blur-sm scale-105' : 'blur-0 scale-100'
        } ${hasError ? 'opacity-90' : 'opacity-100'}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
          setCurrentSrc(generateFallbackImage(alt));
        }}
      />
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-800/20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
        </div>
      )}
      
      {/* Error overlay - only show if we're using the placeholder */}
      {hasError && currentSrc === placeholder && (
        <div className="absolute inset-0 bg-gray-800/50 flex items-center justify-center">
          <div className="text-white text-xs text-center">
            <div className="w-8 h-8 mx-auto mb-1 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-gray-400">!</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage; 