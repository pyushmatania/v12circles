// 🛡️ Type definitions for better type safety
interface PreloadOptions {
  concurrency?: number;
  priority?: 'high' | 'normal' | 'low';
  retryAttempts?: number;
  retryDelay?: number;
}

interface PreloadStats {
  preloaded: number;
  queued: number;
  failed: number;
  inProgress: number;
}

type TMDBImageSize = 'w150' | 'w300' | 'w500' | 'w780' | 'w1280' | 'original';
type CommunityCategory = 'actors' | 'actresses' | 'directors' | 'movies' | 'productionHouses' | 'musicArtists';

/**
 * 🎯 ImagePreloader - Optimized image preloading service with enhanced performance
 * @description Handles image preloading with concurrency control, retry logic, and memory management
 */
class ImagePreloader {
  private preloadedImages: Set<string> = new Set();
  private failedImages: Set<string> = new Set();
  private preloadQueue: Array<{ url: string; priority: string; retries: number }> = [];
  private inProgress: Set<string> = new Set();
  private isProcessing = false;
  private maxRetries = 3;
  private defaultConcurrency = 3;
  private maxQueueSize = 1000; // Prevent memory issues

  // 🚀 Preload a single image with retry logic
  async preloadImage(src: string, options: PreloadOptions = {}): Promise<void> {
    const { retryAttempts = this.maxRetries, retryDelay = 1000 } = options;

    if (this.preloadedImages.has(src)) {
      return Promise.resolve();
    }

    if (this.failedImages.has(src)) {
      return Promise.reject(new Error(`Image previously failed to load: ${src}`));
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      let retryCount = 0;

      const attemptLoad = () => {
        img.onload = () => {
          this.preloadedImages.add(src);
          this.inProgress.delete(src);
          resolve();
        };

        img.onerror = () => {
          this.inProgress.delete(src);
          
          if (retryCount < retryAttempts) {
            retryCount++;
            setTimeout(() => {
              this.inProgress.add(src);
              attemptLoad();
            }, retryDelay * retryCount);
          } else {
            this.failedImages.add(src);
            reject(new Error(`Failed to preload image after ${retryAttempts} attempts: ${src}`));
          }
        };

        this.inProgress.add(src);
        img.src = src;
      };

      attemptLoad();
    });
  }

  // 🚀 Preload multiple images with enhanced concurrency control
  async preloadImages(urls: string[], options: PreloadOptions = {}): Promise<void> {
    const { concurrency = this.defaultConcurrency } = options;
    
    // Filter out already preloaded and failed images
    const filteredUrls = urls.filter(url => 
      !this.preloadedImages.has(url) && 
      !this.failedImages.has(url) &&
      !this.inProgress.has(url)
    );

    if (filteredUrls.length === 0) {
      return Promise.resolve();
    }

    const chunks = this.chunkArray(filteredUrls, concurrency);
    
    for (const chunk of chunks) {
      await Promise.allSettled(
        chunk.map(url => this.preloadImage(url, options))
      );
    }
  }

  // 🚀 Add images to preload queue with priority
  queueImages(urls: string[], options: PreloadOptions = {}): void {
    const { priority = 'normal' } = options;
    
    // Prevent queue from growing too large
    if (this.preloadQueue.length >= this.maxQueueSize) {
      this.preloadQueue = this.preloadQueue.slice(-this.maxQueueSize / 2);
    }

    const queueItems = urls.map(url => ({
      url,
      priority,
      retries: 0
    }));

    // Add to queue based on priority
    if (priority === 'high') {
      this.preloadQueue.unshift(...queueItems);
    } else {
      this.preloadQueue.push(...queueItems);
    }

    this.processQueue();
  }

  // 🚀 Process the preload queue with enhanced error handling
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.preloadQueue.length === 0) return;

    this.isProcessing = true;
    const batch = this.preloadQueue.splice(0, 10); // Process 10 at a time
    
    try {
      const urls = batch.map(item => item.url);
      await this.preloadImages(urls, { concurrency: this.defaultConcurrency });
    } catch (error) {
      console.warn('Error preloading images:', error);
      
      // Retry failed items
      const failedItems = batch.filter(item => 
        !this.preloadedImages.has(item.url) && 
        !this.failedImages.has(item.url)
      );
      
      if (failedItems.length > 0) {
        failedItems.forEach(item => {
          if (item.retries < this.maxRetries) {
            item.retries++;
            this.preloadQueue.push(item);
          }
        });
      }
    } finally {
      this.isProcessing = false;
      
      // Continue processing if there are more items
      if (this.preloadQueue.length > 0) {
        setTimeout(() => this.processQueue(), 100);
      }
    }
  }

  // 🚀 Check if image is already preloaded
  isPreloaded(src: string): boolean {
    return this.preloadedImages.has(src);
  }

  // 🚀 Check if image failed to load
  isFailed(src: string): boolean {
    return this.failedImages.has(src);
  }

  // 🚀 Check if image is currently being loaded
  isLoading(src: string): boolean {
    return this.inProgress.has(src);
  }

  // 🚀 Get optimized TMDB URL with enhanced size options
  getOptimizedTMDBUrl(originalUrl: string, size: TMDBImageSize = 'w500'): string {
    if (!originalUrl || !originalUrl.includes('image.tmdb.org')) {
      return originalUrl;
    }
    
    // Handle different URL patterns
    const sizePattern = /\/t\/p\/w\d+\//;
    if (sizePattern.test(originalUrl)) {
      return originalUrl.replace(sizePattern, `/t/p/${size}/`);
    }
    
    // Fallback for URLs without size pattern
    return originalUrl.replace('/t/p/', `/t/p/${size}/`);
  }

  // 🚀 Preload community images by category with enhanced error handling
  async preloadCommunityImages(category: CommunityCategory, options: PreloadOptions = {}): Promise<void> {
    try {
      const { comprehensiveCommunityData } = await import('../data/comprehensiveCommunityData');
      const items = comprehensiveCommunityData[category];
      
      if (items && items.length > 0) {
        const urls = items
          .slice(0, 20) // Preload first 20 images
          .map(item => this.getOptimizedTMDBUrl(item.avatar, 'w300'))
          .filter(url => url && !this.isPreloaded(url) && !this.isFailed(url));
        
        if (urls.length > 0) {
          this.queueImages(urls, options);
        }
      }
    } catch (error) {
      console.warn(`Error preloading ${category} images:`, error);
    }
  }

  // 🚀 Preload all community images with progress tracking
  async preloadAllCommunityImages(options: PreloadOptions = {}): Promise<void> {
    const categories: CommunityCategory[] = [
      'actors', 'actresses', 'directors', 'movies', 'productionHouses', 'musicArtists'
    ];

    const promises = categories.map(category => 
      this.preloadCommunityImages(category, options)
    );

    await Promise.allSettled(promises);
  }

  // 🚀 Preload project images
  async preloadProjectImages(projects: Array<{ poster: string; backdrop?: string }>, options: PreloadOptions = {}): Promise<void> {
    const urls = projects.flatMap(project => {
      const urls: string[] = [];
      if (project.poster) {
        urls.push(this.getOptimizedTMDBUrl(project.poster, 'w500'));
      }
      if (project.backdrop) {
        urls.push(this.getOptimizedTMDBUrl(project.backdrop, 'w1280'));
      }
      return urls;
    }).filter(url => url && !this.isPreloaded(url) && !this.isFailed(url));

    if (urls.length > 0) {
      this.queueImages(urls, options);
    }
  }

  // 🚀 Utility function to chunk array
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  // 🚀 Clear preloaded images and reset state
  clear(): void {
    this.preloadedImages.clear();
    this.failedImages.clear();
    this.preloadQueue = [];
    this.inProgress.clear();
    this.isProcessing = false;
  }

  // 🚀 Clear only failed images
  clearFailed(): void {
    this.failedImages.clear();
  }

  // 🚀 Get comprehensive stats
  getStats(): PreloadStats {
    return {
      preloaded: this.preloadedImages.size,
      queued: this.preloadQueue.length,
      failed: this.failedImages.size,
      inProgress: this.inProgress.size
    };
  }

  // 🚀 Get memory usage estimate
  getMemoryUsage(): number {
    // Rough estimate: 1MB per image (average)
    return this.preloadedImages.size * 1024 * 1024;
  }

  // 🚀 Optimize memory usage by clearing old images
  optimizeMemory(maxImages: number = 100): void {
    if (this.preloadedImages.size > maxImages) {
      const imagesArray = Array.from(this.preloadedImages);
      const imagesToRemove = imagesArray.slice(0, this.preloadedImages.size - maxImages);
      
      imagesToRemove.forEach(url => {
        this.preloadedImages.delete(url);
      });
    }
  }
}

// 🚀 Create singleton instance
const imagePreloader = new ImagePreloader();

export default imagePreloader; 