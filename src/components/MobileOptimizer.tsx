import React, { useEffect, useRef, useState } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';

interface MobileOptimizerProps {
  children: React.ReactNode;
  enableSwipeGestures?: boolean;
  enablePullToRefresh?: boolean;
  enableHapticFeedback?: boolean;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPullToRefresh?: () => void;
}

export const MobileOptimizer: React.FC<MobileOptimizerProps> = ({
  children,
  enableSwipeGestures = true,
  enablePullToRefresh = true,
  enableHapticFeedback = true,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onPullToRefresh
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 100], [0, 1]);
  const scale = useTransform(y, [0, 100], [0.8, 1]);

  // Haptic feedback function
  const triggerHapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!enableHapticFeedback) return;
    
    try {
      if ('vibrate' in navigator) {
        const patterns = {
          light: [10],
          medium: [20],
          heavy: [30]
        };
        navigator.vibrate(patterns[type]);
      }
    } catch (error) {
      console.log('Haptic feedback not supported');
    }
  };

  // Handle pan gestures
  const handlePan = (event: any, info: PanInfo) => {
    const { offset, velocity } = info;
    const threshold = 50;
    const velocityThreshold = 500;

    if (Math.abs(velocity.x) > velocityThreshold || Math.abs(offset.x) > threshold) {
      if (offset.x > threshold && onSwipeRight) {
        triggerHapticFeedback('light');
        onSwipeRight();
      } else if (offset.x < -threshold && onSwipeLeft) {
        triggerHapticFeedback('light');
        onSwipeLeft();
      }
    }

    if (Math.abs(velocity.y) > velocityThreshold || Math.abs(offset.y) > threshold) {
      if (offset.y > threshold && onSwipeDown) {
        triggerHapticFeedback('light');
        onSwipeDown();
      } else if (offset.y < -threshold && onSwipeUp) {
        triggerHapticFeedback('light');
        onSwipeUp();
      }
    }
  };

  // Handle pull to refresh
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!enablePullToRefresh) return;
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!enablePullToRefresh) return;
    
    const currentY = e.touches[0].clientY;
    const distance = currentY - touchStartY;
    
    if (distance > 0 && window.scrollY === 0) {
      setPullDistance(Math.min(distance, 100));
      y.set(distance);
    }
  };

  const handleTouchEnd = () => {
    if (!enablePullToRefresh) return;
    
    if (pullDistance > 60 && onPullToRefresh) {
      triggerHapticFeedback('medium');
      setIsRefreshing(true);
      onPullToRefresh();
      
      // Reset after 2 seconds
      setTimeout(() => {
        setIsRefreshing(false);
        setPullDistance(0);
        y.set(0);
      }, 2000);
    } else {
      setPullDistance(0);
      y.set(0);
    }
  };

  // Add mobile-specific CSS
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Mobile-optimized scrolling */
      * {
        -webkit-overflow-scrolling: touch;
        overscroll-behavior: contain;
      }
      
      /* Improved touch targets */
      button, a, input, textarea, select {
        min-height: 44px;
        min-width: 44px;
      }
      
      /* Prevent text selection on touch */
      .no-select {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-touch-callout: none;
      }
      
      /* Smooth scrolling */
      html {
        scroll-behavior: smooth;
      }
      
      /* Hide scrollbars on mobile */
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      
      /* Mobile-friendly focus states */
      button:focus, a:focus, input:focus, textarea:focus, select:focus {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
      }
      
      /* Prevent zoom on input focus */
      input, textarea, select {
        font-size: 16px;
      }
      
      /* Improved mobile typography */
      @media (max-width: 768px) {
        body {
          font-size: 16px;
          line-height: 1.6;
        }
        
        h1 { font-size: 2rem; }
        h2 { font-size: 1.75rem; }
        h3 { font-size: 1.5rem; }
        h4 { font-size: 1.25rem; }
        h5 { font-size: 1.125rem; }
        h6 { font-size: 1rem; }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <motion.div
      className="relative min-h-screen"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      drag={enableSwipeGestures}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onPanEnd={handlePan}
      style={{ y }}
    >
      {/* Pull to refresh indicator */}
      {enablePullToRefresh && (
        <motion.div
          className="absolute top-0 left-0 right-0 flex items-center justify-center h-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white z-50"
          style={{ opacity, scale }}
          initial={{ y: -64 }}
          animate={{ y: pullDistance > 0 ? 0 : -64 }}
        >
          <div className="flex items-center gap-2">
            {isRefreshing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-medium">Refreshing...</span>
              </>
            ) : (
              <>
                <motion.div
                  animate={{ rotate: pullDistance > 60 ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  ⬇️
                </motion.div>
                <span className="text-sm font-medium">
                  {pullDistance > 60 ? 'Release to refresh' : 'Pull to refresh'}
                </span>
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* Main content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Mobile-specific overlay for better touch handling */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Safe area indicators */}
        <div className="absolute top-0 left-0 right-0 h-safe-top bg-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-safe-bottom bg-transparent" />
      </div>
    </motion.div>
  );
};

// Hook for mobile detection
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

// Hook for device orientation
export const useDeviceOrientation = () => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };

    handleOrientationChange();
    window.addEventListener('resize', handleOrientationChange);
    return () => window.removeEventListener('resize', handleOrientationChange);
  }, []);

  return orientation;
};

// Hook for safe area insets
export const useSafeAreaInsets = () => {
  const [insets, setInsets] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  });

  useEffect(() => {
    const updateInsets = () => {
      const style = getComputedStyle(document.documentElement);
      setInsets({
        top: parseInt(style.getPropertyValue('--sat') || '0'),
        bottom: parseInt(style.getPropertyValue('--sab') || '0'),
        left: parseInt(style.getPropertyValue('--sal') || '0'),
        right: parseInt(style.getPropertyValue('--sar') || '0')
      });
    };

    updateInsets();
    window.addEventListener('resize', updateInsets);
    return () => window.removeEventListener('resize', updateInsets);
  }, []);

  return insets;
};

export default MobileOptimizer; 