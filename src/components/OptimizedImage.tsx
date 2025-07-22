import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
  style?: React.CSSProperties;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'sync' | 'auto';
}

interface ImageFormat {
  format: 'avif' | 'webp' | 'jpeg';
  supported: boolean;
  quality: number;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width = 400,
  height = 300,
  className = '',
  priority = false,
  quality = 80,
  sizes = '100vw',
  blurDataURL,
  onLoad,
  onError,
  style,
  loading = 'lazy',
  decoding = 'async'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const [placeholderSrc, setPlaceholderSrc] = useState('');
  const [format, setFormat] = useState<ImageFormat | null>(null);
  const [error, setError] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Detect supported image formats
  const detectImageFormats = useCallback(async (): Promise<ImageFormat> => {
    // Check AVIF support
    const avifSupported = await new Promise<boolean>((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
    });

    // Check WebP support
    const webpSupported = await new Promise<boolean>((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = 'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAADsAD+JaQAA3AAAAAA';
    });

    // Return best format
    if (avifSupported) {
      return { format: 'avif', supported: true, quality: Math.min(quality, 80) };
    } else if (webpSupported) {
      return { format: 'webp', supported: true, quality: Math.min(quality, 85) };
    } else {
      return { format: 'jpeg', supported: true, quality: Math.min(quality, 90) };
    }
  }, [quality]);

  // Generate optimized image URL
  const generateOptimizedUrl = useCallback((originalSrc: string, format: ImageFormat, targetWidth: number): string => {
    // If it's already an optimized URL, return as is
    if (originalSrc.includes('?format=') || originalSrc.includes('&format=')) {
      return originalSrc;
    }

    // For external URLs (TMDB, etc.), return as is to preserve quality
    if (originalSrc.includes('tmdb.org') || originalSrc.includes('image.tmdb.org')) {
    return originalSrc;
    }

    // For local images, apply optimization
    const url = new URL(originalSrc, window.location.origin);
    url.searchParams.set('format', format.format);
    url.searchParams.set('width', targetWidth.toString());
    url.searchParams.set('quality', format.quality.toString());
    url.searchParams.set('optimize', 'true');

    return url.toString();
  }, []);

  // Generate placeholder URL
  const generatePlaceholderUrl = useCallback((originalSrc: string): string => {
    if (blurDataURL) return blurDataURL;
    
    // Generate low-quality placeholder
    const url = new URL(originalSrc, window.location.origin);
    url.searchParams.set('format', 'jpeg');
    url.searchParams.set('width', '20');
    url.searchParams.set('quality', '20');
    url.searchParams.set('blur', '5');
    url.searchParams.set('placeholder', 'true');

    return url.toString();
  }, [blurDataURL]);

  // Calculate optimal image size based on device
  const calculateOptimalSize = useCallback((baseWidth: number): number => {
    const devicePixelRatio = window.devicePixelRatio || 1;
    const screenWidth = window.innerWidth;
    
    // Responsive sizing
    if (screenWidth < 640) { // Mobile
      return Math.min(baseWidth, screenWidth * devicePixelRatio);
    } else if (screenWidth < 1024) { // Tablet
      return Math.min(baseWidth * 1.2, screenWidth * devicePixelRatio);
    } else { // Desktop
      return Math.min(baseWidth * 1.5, screenWidth * devicePixelRatio);
    }
  }, []);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (loading === 'lazy' && imgRef.current) {
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsIntersecting(true);
            observerRef.current?.disconnect();
          }
        },
        {
          rootMargin: '50px 0px',
          threshold: 0.1
        }
      );

      observerRef.current.observe(imgRef.current);
    } else {
      setIsIntersecting(true);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [loading]);

  // Initialize image optimization
  useEffect(() => {
    if (!isIntersecting && loading === 'lazy') return;

    const initializeImage = async () => {
      try {
        // Detect supported formats
        const detectedFormat = await detectImageFormats();
        setFormat(detectedFormat);

        // Calculate optimal size
        const optimalWidth = calculateOptimalSize(width);
        
        // Generate optimized URL
        const optimizedUrl = generateOptimizedUrl(src, detectedFormat, optimalWidth);
        setImageSrc(optimizedUrl);

        // Generate placeholder
        const placeholderUrl = generatePlaceholderUrl(src);
        setPlaceholderSrc(placeholderUrl);

        // Preload if priority
        if (priority) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = optimizedUrl;
          document.head.appendChild(link);
        }
      } catch (error) {
        console.error('[OptimizedImage] Initialization failed:', error);
        setImageSrc(src); // Fallback to original
      }
    };

    initializeImage();
  }, [src, isIntersecting, loading, priority, detectImageFormats, generateOptimizedUrl, generatePlaceholderUrl, calculateOptimalSize, width]);

  // Handle image load
  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setError(false);
    onLoad?.();
  }, [onLoad]);

  // Handle image error
  const handleError = useCallback(() => {
    setError(true);
    setIsLoaded(false);
    // Fallback to original source
    setImageSrc(src);
    onError?.();
  }, [src, onError]);

  // Generate responsive sizes
  const responsiveSizes = sizes || `(max-width: 640px) ${Math.min(width, 640)}px, (max-width: 1024px) ${Math.min(width * 1.2, 1024)}px, ${width * 1.5}px`;

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ width, height, ...style }}
    >
      {/* Low-quality placeholder */}
      <AnimatePresence>
        {!isLoaded && placeholderSrc && (
          <motion.img
            src={placeholderSrc}
            alt={alt}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ 
              filter: 'blur(5px)',
              transform: 'scale(1.1)' // Prevent blur edges
            }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* High-quality image */}
      <AnimatePresence>
        {imageSrc && (
          <motion.img
        ref={imgRef}
            src={imageSrc}
        alt={alt}
        width={width}
        height={height}
            sizes={responsiveSizes}
            loading={priority ? 'eager' : loading}
            decoding={decoding}
            onLoad={handleLoad}
            onError={handleError}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{
              willChange: 'opacity',
              transform: 'translateZ(0)' // Force GPU acceleration
            }}
          />
        )}
      </AnimatePresence>

      {/* Loading skeleton */}
      <AnimatePresence>
        {!isLoaded && !error && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"
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
            className="absolute inset-0 bg-gray-100 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center text-gray-500">
              <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">Image unavailable</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Performance monitoring */}
      {import.meta.env.DEV && (
        <div className="absolute top-1 left-1 bg-black/50 text-white text-xs px-1 py-0.5 rounded opacity-0 hover:opacity-100 transition-opacity">
          {format?.format.toUpperCase()} • {width}x{height}
        </div>
      )}
    </div>
  );
};

export default OptimizedImage; 