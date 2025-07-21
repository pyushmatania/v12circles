import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SafeOptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
  style?: React.CSSProperties;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'sync' | 'auto';
}

const SafeOptimizedImage: React.FC<SafeOptimizedImageProps> = ({
  src,
  alt,
  width = 400,
  height = 300,
  className = '',
  priority = false,
  quality = 80,
  sizes = '100vw',
  placeholder = 'blur',
  blurDataURL,
  onLoad,
  onError,
  style,
  loading = 'lazy',
  decoding = 'async'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);
  const [placeholderSrc, setPlaceholderSrc] = useState('');
  const [error, setError] = useState(false);
  const [useOptimization, setUseOptimization] = useState(false);

  useEffect(() => {
    // Check if optimization is available and enabled
    const checkOptimization = async () => {
      try {
        // Try to import the optimization utilities
        await import('../utils/performanceIntegration');
        setUseOptimization(true);
      } catch {
        // Fall back to regular image loading
        setUseOptimization(false);
      }
    };

    checkOptimization();
  }, []);

  useEffect(() => {
    if (!useOptimization) {
      // Use regular image loading
      setImageSrc(src);
      return;
    }

    // Generate optimized URL (simplified version)
    const generateOptimizedUrl = (originalSrc: string) => {
      try {
        // Simple optimization - add quality parameter
        const url = new URL(originalSrc, window.location.origin);
        url.searchParams.set('quality', quality.toString());
        return url.toString();
      } catch {
        return originalSrc;
      }
    };

    // Generate placeholder
    const generatePlaceholder = (originalSrc: string) => {
      if (blurDataURL) return blurDataURL;
      
      try {
        const url = new URL(originalSrc, window.location.origin);
        url.searchParams.set('quality', '10');
        url.searchParams.set('width', '20');
        return url.toString();
      } catch {
        return '';
      }
    };

    setImageSrc(generateOptimizedUrl(src));
    setPlaceholderSrc(generatePlaceholder(src));
  }, [src, quality, blurDataURL, useOptimization]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setError(true);
    // Fall back to original src
    setImageSrc(src);
    onError?.();
  };

  // If optimization is disabled or failed, use simple img
  if (!useOptimization) {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={loading}
        decoding={decoding}
        onLoad={handleLoad}
        onError={handleError}
        style={style}
      />
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height, ...style }}>
      {/* Low-quality placeholder */}
      <AnimatePresence>
        {!isLoaded && placeholderSrc && (
          <motion.img
            src={placeholderSrc}
            alt={alt}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'blur(5px)' }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* High-quality image */}
      <AnimatePresence>
        {imageSrc && !error && (
          <motion.img
            src={imageSrc}
            alt={alt}
            loading={priority ? 'eager' : loading}
            decoding={decoding}
            onLoad={handleLoad}
            onError={handleError}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Loading skeleton */}
      <AnimatePresence>
        {!isLoaded && !error && (
          <motion.div
            className="absolute inset-0 bg-gray-700 animate-pulse"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Error fallback */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="absolute inset-0 bg-gray-800 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-gray-400 text-sm">Image failed to load</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SafeOptimizedImage; 