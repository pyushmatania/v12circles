// V12 Circles - Safe Performance Integration
// This wrapper ensures performance optimizations don't break the existing app

interface PerformanceConfig {
  enabled: boolean;
  features: {
    serviceWorker: boolean;
    imageOptimization: boolean;
    caching: boolean;
    virtualScrolling: boolean;
    mobileOptimizations: boolean;
    monitoring: boolean;
  };
}

class SafePerformanceIntegration {
  private config: PerformanceConfig;
  private isInitialized = false;

  constructor() {
    this.config = {
      enabled: import.meta.env.DEV ? false : true, // Disabled in dev by default, enabled in production
      features: {
        serviceWorker: !import.meta.env.DEV, // Only in production
        imageOptimization: !import.meta.env.DEV, // Only in production
        caching: !import.meta.env.DEV, // Only in production
        virtualScrolling: !import.meta.env.DEV, // Only in production
        mobileOptimizations: !import.meta.env.DEV, // Only in production
        monitoring: !import.meta.env.DEV // Only in production
      }
    };
  }

  // Safe initialization that won't break the app
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('[V12] Initializing performance optimizations safely...');
      
      // Initialize features one by one with error handling
      if (this.config.features.monitoring) {
        await this.initializeMonitoring();
      }

      if (this.config.features.caching) {
        await this.initializeCaching();
      }

      if (this.config.features.serviceWorker) {
        await this.initializeServiceWorker();
      }

      this.isInitialized = true;
      console.log('[V12] Performance optimizations initialized successfully');
    } catch (error) {
      console.warn('[V12] Performance optimization failed, continuing without optimizations:', error);
      // Don't throw - app continues to work normally
    }
  }

  private async initializeMonitoring(): Promise<void> {
    try {
      const { performanceMonitor } = await import('./performanceMonitor');
      console.log('[V12] Performance monitoring initialized');
    } catch (error) {
      console.warn('[V12] Performance monitoring failed to initialize:', error);
    }
  }

  private async initializeCaching(): Promise<void> {
    try {
      const { cacheManager } = await import('./cacheManager');
      console.log('[V12] Cache manager initialized');
    } catch (error) {
      console.warn('[V12] Cache manager failed to initialize:', error);
    }
  }

  private async initializeServiceWorker(): Promise<void> {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('[V12] Service Worker registered:', registration);
      }
    } catch (error) {
      console.warn('[V12] Service Worker failed to initialize:', error);
    }
  }

  // Safe feature checks
  isFeatureEnabled(feature: keyof PerformanceConfig['features']): boolean {
    return this.config.enabled && this.config.features[feature];
  }

  // Enable/disable features safely
  enableFeature(feature: keyof PerformanceConfig['features']): void {
    this.config.features[feature] = true;
  }

  disableFeature(feature: keyof PerformanceConfig['features']): void {
    this.config.features[feature] = false;
  }

  // Get current config
  getConfig(): PerformanceConfig {
    return { ...this.config };
  }
}

// Export singleton instance
export const performanceIntegration = new SafePerformanceIntegration();

// Safe hooks that won't break if features are disabled
export const useSafePerformance = () => {
  return {
    isEnabled: performanceIntegration.getConfig().enabled,
    isFeatureEnabled: performanceIntegration.isFeatureEnabled.bind(performanceIntegration),
    initialize: performanceIntegration.initialize.bind(performanceIntegration)
  };
}; 