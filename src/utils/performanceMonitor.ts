// V12 Circles - Enterprise Performance Monitor
// Real User Monitoring (RUM) with Core Web Vitals tracking

interface PerformanceMetrics {
  // Core Web Vitals
  coreWebVitals: {
    LCP: number; // Largest Contentful Paint
    FID: number; // First Input Delay
    CLS: number; // Cumulative Layout Shift
    FCP: number; // First Contentful Paint
    TTFB: number; // Time to First Byte
  };
  
  // Custom metrics
  customMetrics: {
    projectLoadTime: number;
    animationFrameRate: number;
    memoryUsage: number;
    cacheHitRate: number;
    apiResponseTime: number;
    imageLoadTime: number;
    componentRenderTime: number;
  };
  
  // User experience metrics
  userExperience: {
    bounceRate: number;
    sessionDuration: number;
    pageViews: number;
    conversionRate: number;
    timeOnPage: number;
    scrollDepth: number;
  };
  
  // Performance issues
  performanceIssues: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    timestamp: number;
    data: any;
  }>;
}

interface PerformanceConfig {
  sampleRate: number; // Percentage of users to monitor (0-100)
  enableRealUserMonitoring: boolean;
  enableCoreWebVitals: boolean;
  enableCustomMetrics: boolean;
  enableErrorTracking: boolean;
  enableAnalytics: boolean;
  endpoint: string;
  batchSize: number;
  flushInterval: number;
}

class RealUserMonitoring {
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];
  private config: PerformanceConfig;
  private batchQueue: any[] = [];
  private flushTimer: number | null = null;
  private sessionStartTime: number;
  private pageStartTime: number;
  private frameCount = 0;
  private lastFrameTime = performance.now();
  private fps = 60;

  constructor(config?: Partial<PerformanceConfig>) {
    this.config = {
      sampleRate: 100,
      enableRealUserMonitoring: true,
      enableCoreWebVitals: true,
      enableCustomMetrics: true,
      enableErrorTracking: true,
      enableAnalytics: true,
      endpoint: '/api/metrics',
      batchSize: 10,
      flushInterval: 30000, // 30 seconds
      ...config
    };

    this.sessionStartTime = Date.now();
    this.pageStartTime = performance.now();

    this.init();
  }

  private init(): void {
    if (!this.shouldMonitor()) return;

    if (this.config.enableCoreWebVitals) {
      this.measureCoreWebVitals();
    }

    if (this.config.enableCustomMetrics) {
      this.measureCustomMetrics();
    }

    if (this.config.enableErrorTracking) {
      this.setupErrorTracking();
    }

    if (this.config.enableAnalytics) {
      this.measureUserBehavior();
    }

    this.startBatchFlush();
  }

  private shouldMonitor(): boolean {
    // Sample rate check
    if (Math.random() * 100 > this.config.sampleRate) {
      return false;
    }

    // Check if performance monitoring is supported
    if (!('performance' in window)) {
      console.warn('[Performance] Performance API not supported');
      return false;
    }

    return true;
  }

  // Core Web Vitals Measurement
  private measureCoreWebVitals(): void {
    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      this.metrics.coreWebVitals = {
        ...this.metrics.coreWebVitals,
        LCP: lastEntry.startTime
      };
      
      this.reportMetric('LCP', lastEntry.startTime);
      
      // Performance issue detection
      if (lastEntry.startTime > 2500) {
        this.reportPerformanceIssue('slow_lcp', {
          value: lastEntry.startTime,
          threshold: 2500
        });
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    new PerformanceObserver((list) => {
      const firstInput = list.getEntries()[0];
      const fid = firstInput.processingStart - firstInput.startTime;
      
      this.metrics.coreWebVitals = {
        ...this.metrics.coreWebVitals,
        FID: fid
      };
      
      this.reportMetric('FID', fid);
      
      if (fid > 100) {
        this.reportPerformanceIssue('slow_fid', {
          value: fid,
          threshold: 100
        });
      }
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    let clsValue = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      
      this.metrics.coreWebVitals = {
        ...this.metrics.coreWebVitals,
        CLS: clsValue
      };
      
      this.reportMetric('CLS', clsValue);
      
      if (clsValue > 0.1) {
        this.reportPerformanceIssue('high_cls', {
          value: clsValue,
          threshold: 0.1
        });
      }
    }).observe({ entryTypes: ['layout-shift'] });

    // First Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcp = entries[entries.length - 1].startTime;
      
      this.metrics.coreWebVitals = {
        ...this.metrics.coreWebVitals,
        FCP: fcp
      };
      
      this.reportMetric('FCP', fcp);
    }).observe({ entryTypes: ['paint'] });

    // Time to First Byte
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      for (const entry of entries) {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          const ttfb = navEntry.responseStart - navEntry.requestStart;
          
          this.metrics.coreWebVitals = {
            ...this.metrics.coreWebVitals,
            TTFB: ttfb
          };
          
          this.reportMetric('TTFB', ttfb);
          
          if (ttfb > 600) {
            this.reportPerformanceIssue('slow_ttfb', {
              value: ttfb,
              threshold: 600
            });
          }
        }
      }
    }).observe({ entryTypes: ['navigation'] });
  }

  // Custom Metrics Measurement
  private measureCustomMetrics(): void {
    // Animation frame rate monitoring
    const measureFPS = (currentTime: number) => {
      this.frameCount++;
      
      if (currentTime >= this.lastFrameTime + 1000) {
        this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastFrameTime));
        
        this.metrics.customMetrics = {
          ...this.metrics.customMetrics,
          animationFrameRate: this.fps
        };
        
        if (this.fps < 55) {
          this.reportPerformanceIssue('low_fps', {
            fps: this.fps,
            timestamp: currentTime
          });
        }
        
        this.frameCount = 0;
        this.lastFrameTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    requestAnimationFrame(measureFPS);

    // Memory usage monitoring
    if ('memory' in performance) {
      setInterval(() => {
        const memInfo = (performance as any).memory;
        const memoryUsage = memInfo.usedJSHeapSize / memInfo.totalJSHeapSize;
        
        this.metrics.customMetrics = {
          ...this.metrics.customMetrics,
          memoryUsage: memoryUsage
        };
        
        if (memoryUsage > 0.9) {
          this.reportPerformanceIssue('high_memory_usage', {
            usage: memoryUsage,
            used: memInfo.usedJSHeapSize,
            total: memInfo.totalJSHeapSize
          });
        }
      }, 30000); // Every 30 seconds
    }

    // Cache hit rate monitoring
    setInterval(() => {
      // This would integrate with the cache manager
      const cacheStats = this.getCacheStats();
      if (cacheStats) {
        this.metrics.customMetrics = {
          ...this.metrics.customMetrics,
          cacheHitRate: cacheStats.memoryHitRate
        };
      }
    }, 60000); // Every minute
  }

  // User Behavior Measurement
  private measureUserBehavior(): void {
    let sessionStart = Date.now();
    let pageViews = 0;
    let interactions = 0;
    let scrollDepth = 0;
    let timeOnPage = 0;

    // Page visibility API
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        timeOnPage = Date.now() - this.pageStartTime;
        this.metrics.userExperience = {
          ...this.metrics.userExperience,
          timeOnPage
        };
      } else {
        this.pageStartTime = Date.now();
      }
    });

    // User interactions
    ['click', 'scroll', 'keydown'].forEach(eventType => {
      document.addEventListener(eventType, () => {
        interactions++;
      }, { passive: true });
    });

    // Scroll depth tracking
    let maxScrollDepth = 0;
    document.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
        scrollDepth = maxScrollDepth;
        
        this.metrics.userExperience = {
          ...this.metrics.userExperience,
          scrollDepth
        };
      }
    }, { passive: true });

    // Route changes
    window.addEventListener('popstate', () => {
      pageViews++;
      this.metrics.userExperience = {
        ...this.metrics.userExperience,
        pageViews
      };
    });

    // Session duration tracking
    window.addEventListener('beforeunload', () => {
      const sessionDuration = Date.now() - sessionStart;
      this.metrics.userExperience = {
        ...this.metrics.userExperience,
        sessionDuration
      };
      
      this.reportMetric('session_duration', sessionDuration);
    });
  }

  // Error Tracking
  private setupErrorTracking(): void {
    // JavaScript errors
    window.addEventListener('error', (event) => {
      this.reportPerformanceIssue('javascript_error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.stack
      });
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.reportPerformanceIssue('unhandled_rejection', {
        reason: event.reason,
        promise: event.promise
      });
    });

    // Resource loading errors
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      for (const entry of entries) {
        if (entry.entryType === 'resource' && entry.duration === 0) {
          this.reportPerformanceIssue('resource_load_failed', {
            name: entry.name,
            initiatorType: entry.initiatorType
          });
        }
      }
    }).observe({ entryTypes: ['resource'] });
  }

  // Performance Issue Reporting
  private reportPerformanceIssue(type: string, data: any): void {
    const issue = {
      type,
      severity: this.getSeverity(type, data),
      message: this.getIssueMessage(type, data),
      timestamp: Date.now(),
      data
    };

    this.metrics.performanceIssues = [
      ...(this.metrics.performanceIssues || []),
      issue
    ];

    console.warn(`[Performance] ${issue.message}`, data);
    
    // Send to error tracking service
    this.sendToErrorTracking(issue);
  }

  private getSeverity(type: string, data: any): 'low' | 'medium' | 'high' | 'critical' {
    switch (type) {
      case 'slow_lcp':
        return data.value > 4000 ? 'critical' : data.value > 2500 ? 'high' : 'medium';
      case 'slow_fid':
        return data.value > 300 ? 'critical' : data.value > 100 ? 'high' : 'medium';
      case 'high_cls':
        return data.value > 0.25 ? 'critical' : data.value > 0.1 ? 'high' : 'medium';
      case 'low_fps':
        return data.fps < 30 ? 'critical' : data.fps < 45 ? 'high' : 'medium';
      case 'high_memory_usage':
        return data.usage > 0.95 ? 'critical' : data.usage > 0.9 ? 'high' : 'medium';
      default:
        return 'medium';
    }
  }

  private getIssueMessage(type: string, data: any): string {
    switch (type) {
      case 'slow_lcp':
        return `Slow Largest Contentful Paint: ${data.value.toFixed(0)}ms`;
      case 'slow_fid':
        return `Slow First Input Delay: ${data.value.toFixed(0)}ms`;
      case 'high_cls':
        return `High Cumulative Layout Shift: ${data.value.toFixed(3)}`;
      case 'low_fps':
        return `Low Frame Rate: ${data.fps} FPS`;
      case 'high_memory_usage':
        return `High Memory Usage: ${(data.usage * 100).toFixed(1)}%`;
      case 'javascript_error':
        return `JavaScript Error: ${data.message}`;
      case 'resource_load_failed':
        return `Resource Load Failed: ${data.name}`;
      default:
        return `Performance Issue: ${type}`;
    }
  }

  // Metric Reporting
  private reportMetric(name: string, value: number): void {
    const metric = {
      name,
      value,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      sessionId: this.getSessionId(),
      pageLoadId: this.getPageLoadId()
    };

    this.batchQueue.push(metric);

    // Send to analytics service
    if (typeof gtag !== 'undefined') {
      gtag('event', 'performance_metric', {
        metric_name: name,
        metric_value: value,
        custom_parameter: 'v12_circles'
      });
    }

    // Flush if batch is full
    if (this.batchQueue.length >= this.config.batchSize) {
      this.flushBatch();
    }
  }

  // Batch Processing
  private startBatchFlush(): void {
    this.flushTimer = setInterval(() => {
      this.flushBatch();
    }, this.config.flushInterval);
  }

  private flushBatch(): void {
    if (this.batchQueue.length === 0) return;

    const batch = [...this.batchQueue];
    this.batchQueue = [];

    this.sendToMonitoringService(batch);
  }

  // Service Communication
  private sendToMonitoringService(data: any): void {
    // Only send metrics in development or if endpoint is configured
    if (!this.config.endpoint || this.config.endpoint === '/api/metrics') {
      // Log metrics to console in development
      if (import.meta.env.DEV) {
        console.log('[Performance] Metrics:', data);
      }
      return;
    }

    fetch(this.config.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).catch(error => {
      console.warn('[Performance] Failed to send metrics:', error);
    });
  }

  private sendToErrorTracking(data: any): void {
    // Send to error tracking service (Sentry, LogRocket, etc.)
    if (typeof Sentry !== 'undefined') {
      Sentry.captureMessage('Performance Issue', {
        level: 'warning',
        extra: data
      });
    }
  }

  // Utility Methods
  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('v12_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('v12_session_id', sessionId);
    }
    return sessionId;
  }

  private getPageLoadId(): string {
    return `page_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getCacheStats(): any {
    // This would integrate with the cache manager
    if (typeof window !== 'undefined' && (window as any).cacheManager) {
      return (window as any).cacheManager.getStats();
    }
    return null;
  }

  // Public API
  public getMetrics(): Partial<PerformanceMetrics> {
    return this.metrics;
  }

  public getFPS(): number {
    return this.fps;
  }

  public measureComponentRender(componentName: string, renderTime: number): void {
    this.metrics.customMetrics = {
      ...this.metrics.customMetrics,
      componentRenderTime: renderTime
    };

    if (renderTime > 16) { // More than one frame
      this.reportPerformanceIssue('slow_component_render', {
        component: componentName,
        renderTime
      });
    }
  }

  public measureImageLoad(imageSrc: string, loadTime: number): void {
    this.metrics.customMetrics = {
      ...this.metrics.customMetrics,
      imageLoadTime: loadTime
    };

    if (loadTime > 1000) {
      this.reportPerformanceIssue('slow_image_load', {
        image: imageSrc,
        loadTime
      });
    }
  }

  public measureAPIResponse(endpoint: string, responseTime: number): void {
    this.metrics.customMetrics = {
      ...this.metrics.customMetrics,
      apiResponseTime: responseTime
    };

    if (responseTime > 2000) {
      this.reportPerformanceIssue('slow_api_response', {
        endpoint,
        responseTime
      });
    }
  }

  public destroy(): void {
    // Clean up observers
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];

    // Clear timers
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    // Flush remaining data
    this.flushBatch();
  }
}

// Global monitoring instance
export const performanceMonitor = new RealUserMonitoring();

// React hook for component performance monitoring
export function usePerformanceMonitoring(componentName: string) {
  const startTime = useRef(performance.now());

  useEffect(() => {
    const renderTime = performance.now() - startTime.current;
    performanceMonitor.measureComponentRender(componentName, renderTime);
  });

  return {
    measureOperation: (operationName: string, operation: () => void) => {
      const start = performance.now();
      operation();
      const duration = performance.now() - start;
      
      if (duration > 16) {
        performanceMonitor.reportPerformanceIssue('slow_operation', {
          component: componentName,
          operation: operationName,
          duration
        });
      }
    }
  };
} 