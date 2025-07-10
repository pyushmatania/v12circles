import { useEffect, useRef, useCallback, useMemo } from 'react';

interface MemoryConfig {
  maxCacheSize?: number;
  gcInterval?: number;
  preloadBatchSize?: number;
  lazyThreshold?: number;
}

// Advanced memory management and CPU optimization
export const useMemoryOptimization = (config: MemoryConfig = {}) => {
  const {
    maxCacheSize = 50,
    gcInterval = 30000, // 30 seconds
    preloadBatchSize = 5,
    lazyThreshold = 0.1
  } = config;

  const cacheRef = useRef<Map<string, any>>(new Map());
  const gcTimerRef = useRef<NodeJS.Timeout>();
  const memoryUsageRef = useRef<number>(0);
  const performanceObserverRef = useRef<PerformanceObserver>();

  // Memory monitoring and garbage collection
  useEffect(() => {
    const startMemoryMonitoring = () => {
      // Monitor performance entries
      if ('PerformanceObserver' in window) {
        performanceObserverRef.current = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.entryType === 'measure' || entry.entryType === 'navigation') {
              // Track memory usage patterns
              if ('memory' in performance) {
                const memoryInfo = (performance as any).memory;
                memoryUsageRef.current = memoryInfo.usedJSHeapSize;
                
                // Trigger aggressive cleanup if memory usage is high
                const memoryThreshold = 50 * 1024 * 1024; // 50MB
                if (memoryInfo.usedJSHeapSize > memoryThreshold) {
                  performAggressiveCleanup();
                }
              }
            }
          });
        });

        performanceObserverRef.current.observe({ 
          entryTypes: ['measure', 'navigation', 'resource'] 
        });
      }

      // Automatic garbage collection
      gcTimerRef.current = setInterval(() => {
        performGarbageCollection();
      }, gcInterval);
    };

    startMemoryMonitoring();

    return () => {
      if (performanceObserverRef.current) {
        performanceObserverRef.current.disconnect();
      }
      if (gcTimerRef.current) {
        clearInterval(gcTimerRef.current);
      }
    };
  }, [gcInterval]);

  // Intelligent cache management
  const useSmartCache = useCallback(<T>(
    key: string,
    factory: () => T,
    ttl: number = 300000 // 5 minutes default
  ): T => {
    const cache = cacheRef.current;
    const now = Date.now();

    // Check if item exists and is not expired
    if (cache.has(key)) {
      const item = cache.get(key);
      if (item.expiry > now) {
        item.lastAccessed = now;
        item.accessCount++;
        return item.value;
      } else {
        cache.delete(key);
      }
    }

    // Create new cache entry
    const value = factory();
    const cacheItem = {
      value,
      expiry: now + ttl,
      lastAccessed: now,
      accessCount: 1,
      size: JSON.stringify(value).length
    };

    // Manage cache size
    if (cache.size >= maxCacheSize) {
      evictLeastUsedItems();
    }

    cache.set(key, cacheItem);
    return value;
  }, [maxCacheSize]);

  // LRU eviction strategy
  const evictLeastUsedItems = useCallback(() => {
    const cache = cacheRef.current;
    const items = Array.from(cache.entries());
    
    // Sort by access frequency and recency
    items.sort((a, b) => {
      const scoreA = a[1].accessCount * (Date.now() - a[1].lastAccessed);
      const scoreB = b[1].accessCount * (Date.now() - b[1].lastAccessed);
      return scoreB - scoreA;
    });

    // Remove bottom 25% of items
    const itemsToRemove = Math.floor(items.length * 0.25);
    for (let i = 0; i < itemsToRemove; i++) {
      cache.delete(items[items.length - 1 - i][0]);
    }
  }, []);

  // Memory-efficient object pooling
  const useObjectPool = useCallback(<T>(
    factory: () => T,
    reset: (obj: T) => void,
    maxPoolSize: number = 20
  ) => {
    const pool = useRef<T[]>([]);

    const acquire = useCallback((): T => {
      if (pool.current.length > 0) {
        return pool.current.pop()!;
      }
      return factory();
    }, [factory]);

    const release = useCallback((obj: T) => {
      if (pool.current.length < maxPoolSize) {
        reset(obj);
        pool.current.push(obj);
      }
    }, [reset, maxPoolSize]);

    const clear = useCallback(() => {
      pool.current.length = 0;
    }, []);

    return { acquire, release, clear };
  }, []);

  // Aggressive cleanup for memory pressure
  const performAggressiveCleanup = useCallback(() => {
    const cache = cacheRef.current;
    
    // Clear old cache entries
    const now = Date.now();
    const staleThreshold = 60000; // 1 minute
    
    for (const [key, item] of cache) {
      if (now - item.lastAccessed > staleThreshold) {
        cache.delete(key);
      }
    }

    // Force garbage collection if available
    if ('gc' in window && typeof (window as any).gc === 'function') {
      (window as any).gc();
    }

    // Clear unused DOM elements
    cleanupUnusedDOMElements();
    
    // Optimize images
    optimizeImageMemory();
  }, []);

  // Regular garbage collection
  const performGarbageCollection = useCallback(() => {
    const cache = cacheRef.current;
    const now = Date.now();

    // Remove expired entries
    for (const [key, item] of cache) {
      if (item.expiry < now) {
        cache.delete(key);
      }
    }

    // Cleanup event listeners
    cleanupEventListeners();
    
    // Clear browser caches selectively
    clearSelectiveBrowserCache();
  }, []);

  // DOM cleanup utilities
  const cleanupUnusedDOMElements = useCallback(() => {
    // Remove hidden elements that are no longer needed
    const hiddenElements = document.querySelectorAll('[style*="display: none"]');
    hiddenElements.forEach(el => {
      if (!el.hasAttribute('data-keep')) {
        el.remove();
      }
    });

    // Clean up orphaned event listeners
    const elements = document.querySelectorAll('*');
    elements.forEach(el => {
      const listeners = (el as any)._eventListeners;
      if (listeners && Object.keys(listeners).length === 0) {
        delete (el as any)._eventListeners;
      }
    });
  }, []);

  // Image memory optimization
  const optimizeImageMemory = useCallback(() => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      // Lazy load images that are far from viewport
      const rect = img.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const distanceFromViewport = Math.abs(rect.top - viewportHeight / 2);
      
      if (distanceFromViewport > viewportHeight * 2) {
        // Unload image if it's too far from viewport
        if (img.src && !img.dataset.originalSrc) {
          img.dataset.originalSrc = img.src;
          img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InRyYW5zcGFyZW50Ii8+PC9zdmc+';
        }
      } else if (img.dataset.originalSrc && !img.src.startsWith('data:')) {
        // Reload image if it's back in viewport area
        img.src = img.dataset.originalSrc;
        delete img.dataset.originalSrc;
      }
    });
  }, []);

  // Event listener cleanup
  const cleanupEventListeners = useCallback(() => {
    // Remove passive event listeners that might be accumulating
    const elements = document.querySelectorAll('[data-cleanup-listeners]');
    elements.forEach(el => {
      const listeners = (el as any)._passiveListeners;
      if (listeners) {
        listeners.forEach((listener: any) => {
          el.removeEventListener(listener.type, listener.handler, listener.options);
        });
        delete (el as any)._passiveListeners;
      }
    });
  }, []);

  // Selective browser cache clearing
  const clearSelectiveBrowserCache = useCallback(() => {
    // Clear old entries from localStorage
    const localStorageKeys = Object.keys(localStorage);
    const now = Date.now();
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days

    localStorageKeys.forEach(key => {
      try {
        const item = JSON.parse(localStorage.getItem(key) || '{}');
        if (item.timestamp && now - item.timestamp > maxAge) {
          localStorage.removeItem(key);
        }
      } catch {
        // Invalid JSON, remove it
        localStorage.removeItem(key);
      }
    });

    // Clear old sessionStorage entries
    const sessionKeys = Object.keys(sessionStorage);
    sessionKeys.forEach(key => {
      if (key.startsWith('temp_') || key.startsWith('cache_')) {
        try {
          const item = JSON.parse(sessionStorage.getItem(key) || '{}');
          if (item.timestamp && now - item.timestamp > 3600000) { // 1 hour
            sessionStorage.removeItem(key);
          }
        } catch {
          sessionStorage.removeItem(key);
        }
      }
    });
  }, []);

  // CPU-efficient batch processing
  const useBatchProcessor = useCallback(<T, R>(
    processor: (batch: T[]) => R[],
    batchSize: number = 10,
    delay: number = 16 // One frame at 60fps
  ) => {
    const queue = useRef<T[]>([]);
    const processing = useRef(false);
    const results = useRef<R[]>([]);

    const processBatch = useCallback(async () => {
      if (processing.current || queue.current.length === 0) return;

      processing.current = true;
      
      while (queue.current.length > 0) {
        const batch = queue.current.splice(0, batchSize);
        const batchResults = processor(batch);
        results.current.push(...batchResults);
        
        // Yield control to browser
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      processing.current = false;
    }, [processor, batchSize, delay]);

    const addToBatch = useCallback((items: T[]) => {
      queue.current.push(...items);
      processBatch();
    }, [processBatch]);

    const getResults = useCallback(() => {
      const allResults = [...results.current];
      results.current = [];
      return allResults;
    }, []);

    return { addToBatch, getResults, isProcessing: () => processing.current };
  }, []);

  // Memory usage monitoring
  const getMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memoryInfo = (performance as any).memory;
      return {
        used: memoryInfo.usedJSHeapSize,
        total: memoryInfo.totalJSHeapSize,
        limit: memoryInfo.jsHeapSizeLimit,
        percentage: (memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) * 100
      };
    }
    return null;
  }, []);

  // Resource preloading with memory awareness
  const useMemoryAwarePreloader = useCallback(() => {
    const preloadQueue = useRef<string[]>([]);
    const preloadedResources = useRef<Set<string>>(new Set());

    const preloadResource = useCallback((url: string, type: string) => {
      if (preloadedResources.current.has(url)) return;

      const memoryUsage = getMemoryUsage();
      
      // Only preload if memory usage is below 70%
      if (memoryUsage && memoryUsage.percentage > 70) {
        preloadQueue.current.push(url);
        return;
      }

      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = url;
      link.as = type;
      
      link.onload = () => {
        preloadedResources.current.add(url);
        document.head.removeChild(link);
      };
      
      link.onerror = () => {
        document.head.removeChild(link);
      };

      document.head.appendChild(link);
    }, [getMemoryUsage]);

    const processPreloadQueue = useCallback(() => {
      const memoryUsage = getMemoryUsage();
      
      if (memoryUsage && memoryUsage.percentage < 60 && preloadQueue.current.length > 0) {
        const urls = preloadQueue.current.splice(0, preloadBatchSize);
        urls.forEach(url => {
          // Determine resource type from URL
          const type = url.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? 'image' :
                      url.match(/\.(mp4|webm|ogg)$/i) ? 'video' :
                      url.match(/\.(mp3|wav|ogg)$/i) ? 'audio' :
                      url.match(/\.(js|mjs)$/i) ? 'script' :
                      url.match(/\.css$/i) ? 'style' : 'fetch';
          
          preloadResource(url, type);
        });
      }
    }, [getMemoryUsage, preloadResource, preloadBatchSize]);

    return { preloadResource, processPreloadQueue };
  }, [getMemoryUsage, preloadBatchSize]);

  return {
    useSmartCache,
    useObjectPool,
    useBatchProcessor,
    useMemoryAwarePreloader,
    performAggressiveCleanup,
    performGarbageCollection,
    getMemoryUsage,
    cacheSize: () => cacheRef.current.size,
    clearCache: () => cacheRef.current.clear()
  };
};

export default useMemoryOptimization; 