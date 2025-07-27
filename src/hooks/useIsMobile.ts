import { useEffect, useState, useCallback, useMemo } from 'react';

// 🛡️ Type definitions for better type safety
interface BreakpointConfig {
  mobile: number;
  tablet: number;
  desktop: number;
}

type DeviceType = 'mobile' | 'tablet' | 'desktop';

/**
 * 🎯 useIsMobile - Optimized responsive hook with enhanced performance
 * @description Detects mobile devices and screen sizes with performance optimizations
 * @param breakpoint - The breakpoint in pixels (default: 768)
 * @param config - Optional breakpoint configuration
 */
export default function useIsMobile(
  config?: Partial<BreakpointConfig>
) {
  const [isMobile, setIsMobile] = useState(false);
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });

  // 🚀 Memoized breakpoint configuration
  const breakpointConfig = useMemo(() => ({
    mobile: config?.mobile ?? 768,
    tablet: config?.tablet ?? 1024,
    desktop: config?.desktop ?? 1200
  }), [config]);

  // 🚀 Optimized media query handler
  const handleResize = useCallback(() => {
    // Check if window is available (client-side only)
    if (typeof window === 'undefined') return;
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    setScreenSize({ width, height });
    
    // Determine device type
    if (width <= breakpointConfig.mobile) {
      setDeviceType('mobile');
      setIsMobile(true);
    } else if (width <= breakpointConfig.tablet) {
      setDeviceType('tablet');
      setIsMobile(false);
    } else {
      setDeviceType('desktop');
      setIsMobile(false);
    }
  }, [breakpointConfig]);

  // 🚀 Optimized effect with cleanup and throttling
  useEffect(() => {
    // Check if window is available (client-side only)
    if (typeof window === 'undefined') return;

    // Initial check
    handleResize();

    // Throttled resize handler for better performance
    let ticking = false;
    const throttledResize = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleResize();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Add event listeners with passive option for better performance
    window.addEventListener('resize', throttledResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('resize', throttledResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [handleResize]);

  // 🚀 Memoized responsive utilities
  const responsiveUtils = useMemo(() => ({
    isMobile,
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
    deviceType,
    screenSize,
    isLandscape: screenSize.width > screenSize.height,
    isPortrait: screenSize.height > screenSize.width,
    isSmallScreen: screenSize.width <= breakpointConfig.mobile,
    isMediumScreen: screenSize.width > breakpointConfig.mobile && screenSize.width <= breakpointConfig.tablet,
    isLargeScreen: screenSize.width > breakpointConfig.tablet
  }), [isMobile, deviceType, screenSize, breakpointConfig]);

  return {
    ...responsiveUtils
  };
}

/**
 * 🎯 useBreakpoint - Hook for specific breakpoint detection
 * @description Detects if current screen size matches a specific breakpoint
 */
export function useBreakpoint(breakpoint: number): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);
    
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Set initial value
    setMatches(mediaQuery.matches);

    // Add listener
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [breakpoint]);

  return matches;
}

/**
 * 🎯 useScreenSize - Hook for getting current screen dimensions
 * @description Returns current screen width and height with debounced updates
 */
export function useScreenSize() {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // Initial size
    handleResize();

    // Add listener
    window.addEventListener('resize', handleResize, { passive: true });

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
}
