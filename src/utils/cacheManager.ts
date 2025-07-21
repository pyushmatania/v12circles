// V12 Circles - Enterprise Cache Manager
// Multi-layer caching system with Google-level performance

import { useState, useEffect, useCallback } from 'react';

interface CacheItem<T = any> {
  key: string;
  data: T;
  timestamp: number;
  ttl: number;
  size: number;
  version: string;
  tags?: string[];
}

interface CacheConfig {
  memory: {
    maxSize: number; // 50MB
    ttl: number; // 5 minutes
    strategy: 'LRU';
  };
  indexedDB: {
    maxSize: number; // 200MB
    ttl: number; // 1 hour
    stores: string[];
  };
  serviceWorker: {
    maxSize: number; // 500MB
    ttl: number; // 24 hours
  };
}

class AdvancedCacheManager {
  private memoryCache = new Map<string, CacheItem>();
  private indexedDBCache: IDBDatabase | null = null;
  private maxMemorySize = 50 * 1024 * 1024; // 50MB
  private currentMemorySize = 0;
  private config: CacheConfig;
  private version = 'v12-cache-v1.0.0';
  private totalRequests = 0;
  private hitRequests = 0;

  constructor(config?: Partial<CacheConfig>) {
    this.config = {
      memory: {
        maxSize: 50 * 1024 * 1024,
        ttl: 5 * 60 * 1000,
        strategy: 'LRU'
      },
      indexedDB: {
        maxSize: 200 * 1024 * 1024,
        ttl: 60 * 60 * 1000,
        stores: ['api-cache', 'image-cache', 'user-data', 'project-cache']
      },
      serviceWorker: {
        maxSize: 500 * 1024 * 1024,
        ttl: 24 * 60 * 60 * 1000
      },
      ...config
    };

    this.initIndexedDB();
    this.startCleanupInterval();
  }

  // Initialize IndexedDB
  private async initIndexedDB(): Promise<void> {
    if (!('indexedDB' in window)) {
      console.warn('[Cache] IndexedDB not supported');
      return;
    }

    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open('v12-cache', 1);

      request.onerror = () => {
        console.error('[Cache] IndexedDB initialization failed:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.indexedDBCache = request.result;
        console.log('[Cache] IndexedDB initialized successfully');
        resolve();
      };

      request.onupgradeneeded = () => {
        const db = request.result;

        // Create object stores
        this.config.indexedDB.stores.forEach(storeName => {
          if (!db.objectStoreNames.contains(storeName)) {
            const store = db.createObjectStore(storeName, { keyPath: 'key' });
            store.createIndex('timestamp', 'timestamp', { unique: false });
            store.createIndex('tags', 'tags', { unique: false });
          }
        });
      };
    });
  }

  // Get item from cache (multi-layer)
  async get<T>(key: string, store: string = 'api-cache'): Promise<T | null> {
    this.totalRequests++;
    
    try {
      // 1. Try memory cache first (fastest)
      const memoryItem = this.memoryCache.get(key);
      if (memoryItem && !this.isExpired(memoryItem)) {
        this.hitRequests++;
        console.log('[Cache] Memory hit:', key);
        return memoryItem.data as T;
      }

      // 2. Try IndexedDB cache
      const indexedDBItem = await this.getFromIndexedDB(key, store);
      if (indexedDBItem && !this.isExpired(indexedDBItem)) {
        // Promote to memory cache
        this.setInMemory(key, indexedDBItem.data, indexedDBItem.ttl, store);
        this.hitRequests++;
        console.log('[Cache] IndexedDB hit:', key);
        return indexedDBItem.data as T;
      }

      // 3. Cache miss
      console.log('[Cache] Miss:', key);
      return null;
    } catch (error) {
      console.error('[Cache] Get failed:', error);
      return null;
    }
  }

  // Set item in cache (multi-layer)
  async set<T>(key: string, data: T, ttl: number = this.config.memory.ttl, store: string = 'api-cache', tags?: string[]): Promise<void> {
    try {
      const item: CacheItem<T> = {
        key,
        data,
        timestamp: Date.now(),
        ttl,
        size: this.calculateSize(data),
        version: this.version,
        tags
      };

      // Store in memory cache
      this.setInMemory(key, data, ttl, store, tags);

      // Store in IndexedDB for persistence
      await this.setInIndexedDB(item, store);

      console.log('[Cache] Set successful:', key);
    } catch (error) {
      console.error('[Cache] Set failed:', error);
    }
  }

  // Set in memory cache
  private setInMemory<T>(key: string, data: T, ttl: number, store: string, tags?: string[]): void {
    const item: CacheItem<T> = {
      key,
      data,
      timestamp: Date.now(),
      ttl,
      size: this.calculateSize(data),
      version: this.version,
      tags
    };

    // Check memory limit
    if (this.currentMemorySize + item.size > this.maxMemorySize) {
      this.evictLRU();
    }

    this.memoryCache.set(key, item);
    this.currentMemorySize += item.size;
  }

  // LRU eviction strategy
  private evictLRU(): void {
    const sortedItems = Array.from(this.memoryCache.entries())
      .sort(([, a], [, b]) => a.timestamp - b.timestamp);

    while (this.currentMemorySize > this.maxMemorySize * 0.8 && sortedItems.length > 0) {
      const [key, item] = sortedItems.shift()!;
      this.memoryCache.delete(key);
      this.currentMemorySize -= item.size;
    }
  }

  // Get from IndexedDB
  private async getFromIndexedDB(key: string, store: string): Promise<CacheItem | null> {
    if (!this.indexedDBCache) return null;

    return new Promise((resolve) => {
      const transaction = this.indexedDBCache!.transaction([store], 'readonly');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.get(key);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    });
  }

  // Set in IndexedDB
  private async setInIndexedDB(item: CacheItem, store: string): Promise<void> {
    if (!this.indexedDBCache) return;

    return new Promise((resolve, reject) => {
      const transaction = this.indexedDBCache!.transaction([store], 'readwrite');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.put(item);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Invalidate cache by tags
  async invalidateByTags(tags: string[]): Promise<void> {
    try {
      // Clear from memory cache
      for (const [key, item] of this.memoryCache.entries()) {
        if (item.tags && item.tags.some(tag => tags.includes(tag))) {
          this.memoryCache.delete(key);
          this.currentMemorySize -= item.size;
        }
      }

      // Clear from IndexedDB
      if (this.indexedDBCache) {
        for (const store of this.config.indexedDB.stores) {
          const transaction = this.indexedDBCache.transaction([store], 'readwrite');
          const objectStore = transaction.objectStore(store);
          const index = objectStore.index('tags');

          for (const tag of tags) {
            const request = index.openCursor(IDBKeyRange.only(tag));
            request.onsuccess = () => {
              const cursor = request.result;
              if (cursor) {
                objectStore.delete(cursor.primaryKey);
                cursor.continue();
              }
            };
          }
        }
      }

      console.log('[Cache] Invalidated by tags:', tags);
    } catch (error) {
      console.error('[Cache] Invalidation failed:', error);
    }
  }

  // Clear all cache
  async clear(): Promise<void> {
    try {
      // Clear memory cache
      this.memoryCache.clear();
      this.currentMemorySize = 0;

      // Clear IndexedDB
      if (this.indexedDBCache) {
        for (const store of this.config.indexedDB.stores) {
          const transaction = this.indexedDBCache.transaction([store], 'readwrite');
          const objectStore = transaction.objectStore(store);
          objectStore.clear();
        }
      }

      console.log('[Cache] All cache cleared');
    } catch (error) {
      console.error('[Cache] Clear failed:', error);
    }
  }

  // Get cache statistics
  getStats(): {
    memorySize: number;
    memoryItems: number;
    memoryHitRate: number;
    totalRequests: number;
    hitRequests: number;
  } {
    return {
      memorySize: this.currentMemorySize,
      memoryItems: this.memoryCache.size,
      memoryHitRate: this.calculateHitRate(),
      totalRequests: this.totalRequests,
      hitRequests: this.hitRequests
    };
  }

  // Calculate cache hit rate
  private calculateHitRate(): number {
    return this.totalRequests > 0 ? (this.hitRequests / this.totalRequests) * 100 : 0;
  }

  // Check if item is expired
  private isExpired(item: CacheItem): boolean {
    return Date.now() - item.timestamp > item.ttl;
  }

  // Calculate data size
  private calculateSize(data: any): number {
    return new Blob([JSON.stringify(data)]).size;
  }

  // Start cleanup interval
  private startCleanupInterval(): void {
    setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  // Cleanup expired items
  private cleanup(): void {
    try {
      // Clean memory cache
      for (const [key, item] of this.memoryCache.entries()) {
        if (this.isExpired(item)) {
          this.memoryCache.delete(key);
          this.currentMemorySize -= item.size;
        }
      }

      // Clean IndexedDB (async)
      if (this.indexedDBCache) {
        for (const store of this.config.indexedDB.stores) {
          const transaction = this.indexedDBCache.transaction([store], 'readwrite');
          const objectStore = transaction.objectStore(store);
          const index = objectStore.index('timestamp');
          const cutoff = Date.now() - this.config.indexedDB.ttl;

          const request = index.openCursor(IDBKeyRange.upperBound(cutoff));
          request.onsuccess = () => {
            const cursor = request.result;
            if (cursor) {
              objectStore.delete(cursor.primaryKey);
              cursor.continue();
            }
          };
        }
      }

      console.log('[Cache] Cleanup completed');
    } catch (error) {
      console.error('[Cache] Cleanup failed:', error);
    }
  }
}

// Global cache instance
export const cacheManager = new AdvancedCacheManager();

// Cache hook for React components
export function useCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: {
    ttl?: number;
    store?: string;
    tags?: string[];
    enabled?: boolean;
  } = {}
): {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const {
    ttl = 5 * 60 * 1000,
    store = 'api-cache',
    tags = [],
    enabled = true
  } = options;

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);

      // Try cache first
      const cached = await cacheManager.get<T>(key, store);
      if (cached) {
        setData(cached);
        setLoading(false);
        return;
      }

      // Fetch fresh data
      const fresh = await fetcher();
      await cacheManager.set(key, fresh, ttl, store, tags);
      setData(fresh);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, ttl, store, tags, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
} 