import { useEffect, useState, useCallback, useMemo } from 'react';

interface MobileOptimizationStrategy {
  // Touch performance
  touch: {
    fastClick: boolean; // 300ms delay removal
    passiveListeners: boolean; // Scroll performance
    touchCallout: boolean; // iOS long-press menu
    userSelect: boolean; // Text selection optimization
  };
  
  // Network optimization
  network: {
    adaptiveLoading: boolean; // Adjust based on connection
    saveData: boolean; // Respect save-data header
    backgroundSync: boolean; // Background data sync
    preloadStrategy: 'conservative' | 'aggressive';
  };
  
  // Battery optimization
  battery: {
    reducedMotion: boolean; // Respect prefers-reduced-motion
    frameRateLimit: boolean; // Limit animations on low battery
    backgroundThrottling: boolean; // Throttle when not visible
  };
}

interface NetworkInfo {
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
}

interface BatteryInfo {
  level: number;
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
}

interface MobileOptimizations {
  // Device capabilities
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  devicePixelRatio: number;
  screenSize: { width: number; height: number };
  
  // Network information
  networkInfo: NetworkInfo | null;
  connectionSpeed: string;
  saveData: boolean;
  
  // Battery information
  batteryInfo: BatteryInfo | null;
  batteryLevel: number;
  isLowBattery: boolean;
  
  // Performance optimizations
  shouldLoadHeavyContent: boolean;
  shouldReduceAnimations: boolean;
  shouldLimitFrameRate: boolean;
  shouldThrottleBackground: boolean;
  
  // Touch optimizations
  enableFastClick: boolean;
  enablePassiveListeners: boolean;
  
  // Utility functions
  optimizeImageQuality: (baseQuality: number) => number;
  optimizeAnimationDuration: (baseDuration: number) => number;
  shouldPreloadContent: (priority: 'high' | 'medium' | 'low') => boolean;
}

export const useMobileOptimizations = (): MobileOptimizations => {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [batteryInfo, setBatteryInfo] = useState<BatteryInfo | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  // Device detection
  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  }, []);

  const isTablet = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= 768 && window.innerWidth < 1024;
  }, []);

  const isDesktop = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= 1024;
  }, []);

  const devicePixelRatio = useMemo(() => {
    if (typeof window === 'undefined') return 1;
    return window.devicePixelRatio || 1;
  }, []);

  const screenSize = useMemo(() => {
    if (typeof window === 'undefined') return { width: 0, height: 0 };
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }, []);

  // Network information
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateNetworkInfo = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        setNetworkInfo({
          effectiveType: connection.effectiveType || '4g',
          downlink: connection.downlink || 10,
          rtt: connection.rtt || 50,
          saveData: connection.saveData || false
        });
      }
    };

    updateNetworkInfo();

    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      connection.addEventListener('change', updateNetworkInfo);
      return () => connection.removeEventListener('change', updateNetworkInfo);
    }
  }, []);

  // Battery information
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateBatteryInfo = async () => {
      if ('getBattery' in navigator) {
        try {
          const battery = await (navigator as any).getBattery();
          setBatteryInfo({
            level: battery.level,
            charging: battery.charging,
            chargingTime: battery.chargingTime,
            dischargingTime: battery.dischargingTime
          });

          const updateBattery = () => {
            setBatteryInfo({
              level: battery.level,
              charging: battery.charging,
              chargingTime: battery.chargingTime,
              dischargingTime: battery.dischargingTime
            });
          };

          battery.addEventListener('levelchange', updateBattery);
          battery.addEventListener('chargingchange', updateBattery);
          battery.addEventListener('chargingtimechange', updateBattery);
          battery.addEventListener('dischargingtimechange', updateBattery);

          return () => {
            battery.removeEventListener('levelchange', updateBattery);
            battery.removeEventListener('chargingchange', updateBattery);
            battery.removeEventListener('chargingtimechange', updateBattery);
            battery.removeEventListener('dischargingtimechange', updateBattery);
          };
        } catch (error) {
          console.warn('Failed to get battery information:', error);
        }
      }
    };

    updateBatteryInfo();
  }, []);

  // Page visibility
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Touch optimizations
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Remove 300ms click delay
    document.addEventListener('touchstart', () => {}, { passive: true });

    // Optimize scroll performance
    const scrollElements = document.querySelectorAll('.scroll-container, .overflow-auto, .overflow-scroll');
    scrollElements.forEach(element => {
      element.addEventListener('touchstart', () => {}, { passive: true });
      element.addEventListener('touchmove', () => {}, { passive: true });
    });

    // Disable iOS bounce and zoom for non-input elements
    const disableBounce = (e: TouchEvent) => {
      if ((e.target as HTMLElement).tagName !== 'INPUT' && 
          (e.target as HTMLElement).tagName !== 'TEXTAREA' &&
          (e.target as HTMLElement).contentEditable !== 'true') {
        e.preventDefault();
      }
    };

    document.addEventListener('touchmove', disableBounce, { passive: false });

    return () => {
      document.removeEventListener('touchmove', disableBounce);
    };
  }, []);

  // Derived values
  const connectionSpeed = useMemo(() => {
    return networkInfo?.effectiveType || '4g';
  }, [networkInfo]);

  const saveData = useMemo(() => {
    return networkInfo?.saveData || false;
  }, [networkInfo]);

  const batteryLevel = useMemo(() => {
    return batteryInfo?.level || 1;
  }, [batteryInfo]);

  const isLowBattery = useMemo(() => {
    return batteryLevel < 0.2;
  }, [batteryLevel]);

  // Performance optimization decisions
  const shouldLoadHeavyContent = useMemo(() => {
    if (saveData) return false;
    if (isLowBattery) return false;
    if (connectionSpeed === 'slow-2g' || connectionSpeed === '2g') return false;
    return true;
  }, [saveData, isLowBattery, connectionSpeed]);

  const shouldReduceAnimations = useMemo(() => {
    if (isLowBattery) return true;
    if (!isVisible) return true;
    
    // Check for prefers-reduced-motion
    if (typeof window !== 'undefined') {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      return prefersReducedMotion.matches;
    }
    
    return false;
  }, [isLowBattery, isVisible]);

  const shouldLimitFrameRate = useMemo(() => {
    return isLowBattery || !isVisible;
  }, [isLowBattery, isVisible]);

  const shouldThrottleBackground = useMemo(() => {
    return !isVisible || isLowBattery;
  }, [isVisible, isLowBattery]);

  const enableFastClick = useMemo(() => {
    return isMobile || isTablet;
  }, [isMobile, isTablet]);

  const enablePassiveListeners = useMemo(() => {
    return true; // Always enable for better performance
  }, []);

  // Utility functions
  const optimizeImageQuality = useCallback((baseQuality: number): number => {
    if (saveData) return Math.min(baseQuality, 60);
    if (isLowBattery) return Math.min(baseQuality, 70);
    if (connectionSpeed === 'slow-2g' || connectionSpeed === '2g') return Math.min(baseQuality, 50);
    if (connectionSpeed === '3g') return Math.min(baseQuality, 80);
    return baseQuality;
  }, [saveData, isLowBattery, connectionSpeed]);

  const optimizeAnimationDuration = useCallback((baseDuration: number): number => {
    if (shouldReduceAnimations) return baseDuration * 0.5;
    return baseDuration;
  }, [shouldReduceAnimations]);

  const shouldPreloadContent = useCallback((priority: 'high' | 'medium' | 'low'): boolean => {
    if (priority === 'high') return true;
    if (priority === 'low' && !shouldLoadHeavyContent) return false;
    
    // Delay loading based on connection speed
    const delay = {
      'slow-2g': 2000,
      '2g': 1500,
      '3g': 1000,
      '4g': 500
    }[connectionSpeed] || 0;
    
    return delay < 1000; // Only preload if delay is reasonable
  }, [shouldLoadHeavyContent, connectionSpeed]);

  return {
    // Device capabilities
    isMobile,
    isTablet,
    isDesktop,
    devicePixelRatio,
    screenSize,
    
    // Network information
    networkInfo,
    connectionSpeed,
    saveData,
    
    // Battery information
    batteryInfo,
    batteryLevel,
    isLowBattery,
    
    // Performance optimizations
    shouldLoadHeavyContent,
    shouldReduceAnimations,
    shouldLimitFrameRate,
    shouldThrottleBackground,
    
    // Touch optimizations
    enableFastClick,
    enablePassiveListeners,
    
    // Utility functions
    optimizeImageQuality,
    optimizeAnimationDuration,
    shouldPreloadContent
  };
};

// Hook for adaptive content loading
export function useAdaptiveContentLoader(
  priority: 'high' | 'medium' | 'low' = 'medium'
) {
  const {
    shouldLoadHeavyContent,
    shouldPreloadContent,
    connectionSpeed,
    saveData,
    batteryLevel
  } = useMobileOptimizations();

  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (priority === 'high') {
      setShouldLoad(true);
      return;
    }

    if (priority === 'low' && !shouldLoadHeavyContent) {
      setShouldLoad(false);
      return;
    }

    // Delay loading based on connection speed and battery
    const delay = {
      'slow-2g': 2000,
      '2g': 1500,
      '3g': 1000,
      '4g': 500
    }[connectionSpeed] || 0;

    // Add battery-based delay
    const batteryDelay = batteryLevel < 0.3 ? 1000 : 0;
    const totalDelay = delay + batteryDelay;

    const timer = setTimeout(() => {
      setShouldLoad(shouldPreloadContent(priority));
    }, totalDelay);

    return () => clearTimeout(timer);
  }, [shouldLoadHeavyContent, shouldPreloadContent, connectionSpeed, batteryLevel, priority]);

  return shouldLoad;
}

// Hook for battery-aware performance
export function useBatteryAwarePerformance() {
  const {
    batteryLevel,
    isLowBattery,
    shouldReduceAnimations,
    shouldLimitFrameRate
  } = useMobileOptimizations();

  const [frameRate, setFrameRate] = useState(60);

  useEffect(() => {
    if (shouldLimitFrameRate) {
      setFrameRate(30);
    } else {
      setFrameRate(60);
    }
  }, [shouldLimitFrameRate]);

  const getOptimizedFrameRate = useCallback(() => {
    if (batteryLevel < 0.1) return 15;
    if (batteryLevel < 0.3) return 30;
    return 60;
  }, [batteryLevel]);

  const shouldThrottleAnimations = useCallback(() => {
    return isLowBattery || shouldReduceAnimations;
  }, [isLowBattery, shouldReduceAnimations]);

  return {
    frameRate,
    getOptimizedFrameRate,
    shouldThrottleAnimations,
    isLowBattery
  };
}

// Hook for network-aware loading
export function useNetworkAwareLoading() {
  const {
    connectionSpeed,
    saveData,
    networkInfo,
    shouldLoadHeavyContent
  } = useMobileOptimizations();

  const getLoadingStrategy = useCallback(() => {
    if (connectionSpeed === 'slow-2g' || connectionSpeed === '2g') {
      return 'minimal';
    }
    if (connectionSpeed === '3g') {
      return 'conservative';
    }
    if (saveData) {
      return 'conservative';
    }
    return 'aggressive';
  }, [connectionSpeed, saveData]);

  const shouldLoadImages = useCallback(() => {
    return shouldLoadHeavyContent && !saveData;
  }, [shouldLoadHeavyContent, saveData]);

  const shouldLoadVideos = useCallback(() => {
    return shouldLoadHeavyContent && !saveData && connectionSpeed !== 'slow-2g' && connectionSpeed !== '2g';
  }, [shouldLoadHeavyContent, saveData, connectionSpeed]);

  const getImageQuality = useCallback((baseQuality: number) => {
    if (saveData) return Math.min(baseQuality, 50);
    if (connectionSpeed === 'slow-2g' || connectionSpeed === '2g') return Math.min(baseQuality, 30);
    if (connectionSpeed === '3g') return Math.min(baseQuality, 70);
    return baseQuality;
  }, [saveData, connectionSpeed]);

  return {
    getLoadingStrategy,
    shouldLoadImages,
    shouldLoadVideos,
    getImageQuality,
    connectionSpeed,
    saveData,
    networkInfo
  };
} 