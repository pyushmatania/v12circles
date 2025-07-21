import React, { useState, useRef, useEffect } from 'react';

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
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!src || src === placeholder) return;

    // Convert TMDB URLs to optimized format
    const getOptimizedSrc = (originalSrc: string): string => {
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
    };

    setIsLoading(true);
    setHasError(false);

    const optimizedSrc = getOptimizedSrc(src);
    const startTime = performance.now();
    
    // Preload image
    const img = new Image();
    img.onload = () => {
      const loadTime = performance.now() - startTime;
      setCurrentSrc(optimizedSrc);
      setIsLoading(false);
      
      // Track performance if monitoring is available
      if (window.imagePerformanceTracker) {
        window.imagePerformanceTracker(optimizedSrc, loadTime, true);
      }
    };
    img.onerror = () => {
      const loadTime = performance.now() - startTime;
      setHasError(true);
      setIsLoading(false);
      setCurrentSrc(placeholder);
      
      // Track performance if monitoring is available
      if (window.imagePerformanceTracker) {
        window.imagePerformanceTracker(optimizedSrc, loadTime, false);
      }
    };
    img.src = optimizedSrc;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, width, placeholder]);

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
        } ${hasError ? 'opacity-50' : 'opacity-100'}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
      />
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-800/20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
        </div>
      )}
      
      {/* Error overlay */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-800/50 flex items-center justify-center">
          <div className="text-white text-xs text-center">
            <div className="w-8 h-8 mx-auto mb-1 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-gray-400">!</span>
            </div>
            Image unavailable
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage; 