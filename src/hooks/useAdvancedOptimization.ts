import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { useDebounce } from './useDebounce';

// Advanced performance hook with enterprise-level optimizations
export const useAdvancedOptimization = () => {
  const rafRef = useRef<number>();
  const observerRef = useRef<IntersectionObserver>();
  const workerRef = useRef<Worker>();

  // Initialize Web Worker for heavy computations
  useEffect(() => {
    // Create worker for background processing
    const workerScript = `
      self.onmessage = function(e) {
        const { type, data } = e.data;
        
        switch(type) {
          case 'PROCESS_LARGE_DATASET':
            // Process large datasets in background
            const processed = data.map(item => ({
              ...item,
              processed: true,
              timestamp: Date.now()
            }));
            self.postMessage({ type: 'DATASET_PROCESSED', data: processed });
            break;
            
          case 'CALCULATE_METRICS':
            // Calculate complex metrics
            const metrics = {
              avg: data.reduce((sum, val) => sum + val, 0) / data.length,
              max: Math.max(...data),
              min: Math.min(...data),
              variance: data.reduce((sum, val) => sum + Math.pow(val - (data.reduce((s, v) => s + v, 0) / data.length), 2), 0) / data.length
            };
            self.postMessage({ type: 'METRICS_CALCULATED', data: metrics });
            break;
            
          case 'OPTIMIZE_IMAGES':
            // Image optimization calculations
            const optimized = data.map(img => ({
              ...img,
              optimizedSrc: img.src + '?w=800&q=85&f=webp',
              placeholderSrc: img.src + '?w=20&q=30&blur=10'
            }));
            self.postMessage({ type: 'IMAGES_OPTIMIZED', data: optimized });
            break;
        }
      };
    `;

    const blob = new Blob([workerScript], { type: 'application/javascript' });
    const blobUrl = URL.createObjectURL(blob);
    workerRef.current = new Worker(blobUrl);

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, []);

  // Advanced RAF-based animation optimization
  const useRAFCallback = useCallback((callback: () => void) => {
    const animateFrame = () => {
      callback();
      rafRef.current = requestAnimationFrame(animateFrame);
    };
    
    rafRef.current = requestAnimationFrame(animateFrame);
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Intersection Observer for lazy loading with advanced options
  const useAdvancedIntersectionObserver = useCallback((
    callback: (entry: IntersectionObserverEntry) => void,
    options: IntersectionObserverInit = {}
  ) => {
    const defaultOptions: IntersectionObserverInit = {
      rootMargin: '50px 0px 50px 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1],
      ...options
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(callback);
    }, defaultOptions);

    return observerRef.current;
  }, []);

  // Advanced memoization with cache management
  const useAdvancedMemo = useCallback(<T>(
    factory: () => T,
    deps: React.DependencyList,
    cacheSize: number = 10
  ): T => {
    const cache = useRef<Map<string, T>>(new Map());
    const depsHash = useMemo(() => JSON.stringify(deps), deps);

    return useMemo(() => {
      if (cache.current.has(depsHash)) {
        return cache.current.get(depsHash)!;
      }

      const result = factory();
      
      // Manage cache size
      if (cache.current.size >= cacheSize) {
        const firstKey = cache.current.keys().next().value;
        if (firstKey !== undefined) {
          cache.current.delete(firstKey);
        }
      }
      
      cache.current.set(depsHash, result);
      return result;
    }, [depsHash, factory, cacheSize]);
  }, []);

  // Performance monitoring and optimization
  const usePerformanceMonitor = useCallback(() => {
    const startTime = useRef<number>(performance.now());
    const metrics = useRef<{
      renderTime: number[];
      memoryUsage: number[];
      frameDrops: number;
    }>({
      renderTime: [],
      memoryUsage: [],
      frameDrops: 0
    });

    useEffect(() => {
      const measurePerformance = () => {
        const now = performance.now();
        const renderTime = now - startTime.current;
        
        metrics.current.renderTime.push(renderTime);
        
        // Keep only last 100 measurements
        if (metrics.current.renderTime.length > 100) {
          metrics.current.renderTime.shift();
        }

        // Monitor memory usage if available
        if ('memory' in performance) {
          const memoryInfo = (performance as any).memory;
          metrics.current.memoryUsage.push(memoryInfo.usedJSHeapSize);
          
          if (metrics.current.memoryUsage.length > 100) {
            metrics.current.memoryUsage.shift();
          }
        }

        startTime.current = now;
      };

      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'measure') {
            measurePerformance();
          }
        });
      });

      observer.observe({ entryTypes: ['measure', 'navigation', 'paint'] });

      return () => observer.disconnect();
    }, []);

    return metrics.current;
  }, []);

  // Virtual scrolling for large lists
  const useVirtualScrolling = useCallback((
    items: any[],
    itemHeight: number,
    containerHeight: number,
    overscan: number = 5
  ) => {
    const scrollTop = useRef(0);
    const visibleStart = Math.floor(scrollTop.current / itemHeight);
    const visibleEnd = Math.min(
      visibleStart + Math.ceil(containerHeight / itemHeight),
      items.length - 1
    );

    const startIndex = Math.max(0, visibleStart - overscan);
    const endIndex = Math.min(items.length - 1, visibleEnd + overscan);

    const visibleItems = items.slice(startIndex, endIndex + 1);
    const offsetY = startIndex * itemHeight;

    const updateScrollTop = useCallback((newScrollTop: number) => {
      scrollTop.current = newScrollTop;
    }, []);

    return {
      visibleItems,
      startIndex,
      endIndex,
      offsetY,
      updateScrollTop,
      totalHeight: items.length * itemHeight
    };
  }, []);

  // Debounced resize observer
  const useDebouncedResizeObserver = useCallback((
    callback: (entry: ResizeObserverEntry) => void,
    delay: number = 16
  ) => {
    const debouncedCallback = useDebounce(callback, delay);
    
    useEffect(() => {
      const resizeObserver = new ResizeObserver((entries) => {
        entries.forEach(debouncedCallback);
      });

      return () => resizeObserver.disconnect();
    }, [debouncedCallback]);
  }, []);

  // GPU-accelerated animations
  const useGPUAcceleration = useCallback((element: HTMLElement) => {
    if (element) {
      // Enable hardware acceleration
      element.style.willChange = 'transform, opacity';
      element.style.backfaceVisibility = 'hidden';
      element.style.perspective = '1000px';
      element.style.transform = 'translateZ(0)';
      
      return () => {
        element.style.willChange = 'auto';
        element.style.backfaceVisibility = 'visible';
        element.style.perspective = 'none';
        element.style.transform = 'none';
      };
    }
  }, []);

  // Preloading and caching optimization
  const useResourcePreloader = useCallback(() => {
    const preloadResource = (url: string, type: 'image' | 'video' | 'audio' | 'script' | 'style') => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = url;
      
      switch (type) {
        case 'image':
          link.as = 'image';
          break;
        case 'video':
          link.as = 'video';
          break;
        case 'audio':
          link.as = 'audio';
          break;
        case 'script':
          link.as = 'script';
          break;
        case 'style':
          link.as = 'style';
          break;
      }
      
      document.head.appendChild(link);
    };

    const preloadImages = (urls: string[]) => {
      urls.forEach(url => {
        const img = new Image();
        img.src = url;
      });
    };

    const preloadVideos = (urls: string[]) => {
      urls.forEach(url => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.src = url;
      });
    };

    return { preloadResource, preloadImages, preloadVideos };
  }, []);

  // Background task scheduler
  const useTaskScheduler = useCallback(() => {
    const taskQueue = useRef<(() => void)[]>([]);
    const isProcessing = useRef(false);

    const scheduleTask = (task: () => void, priority: 'high' | 'normal' | 'low' = 'normal') => {
      if (priority === 'high') {
        taskQueue.current.unshift(task);
      } else {
        taskQueue.current.push(task);
      }

      if (!isProcessing.current) {
        processQueue();
      }
    };

    const processQueue = () => {
      isProcessing.current = true;

      const processNextTask = () => {
        if (taskQueue.current.length === 0) {
          isProcessing.current = false;
          return;
        }

        const task = taskQueue.current.shift();
        if (task) {
          // Use scheduler API if available, otherwise use setTimeout
          if ('scheduler' in window && 'postTask' in (window as any).scheduler) {
            (window as any).scheduler.postTask(task);
          } else {
            setTimeout(task, 0);
          }
        }

        // Schedule next task processing
        requestIdleCallback(() => {
          processNextTask();
        }, { timeout: 1000 });
      };

      processNextTask();
    };

    return { scheduleTask };
  }, []);

  return {
    useRAFCallback,
    useAdvancedIntersectionObserver,
    useAdvancedMemo,
    usePerformanceMonitor,
    useVirtualScrolling,
    useDebouncedResizeObserver,
    useGPUAcceleration,
    useResourcePreloader,
    useTaskScheduler,
    worker: workerRef.current
  };
};

export default useAdvancedOptimization; 