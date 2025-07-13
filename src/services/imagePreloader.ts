class ImagePreloader {
  private preloadedImages: Set<string> = new Set();
  private preloadQueue: string[] = [];
  private isProcessing = false;

  // Preload a single image
  preloadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.preloadedImages.has(src)) {
        resolve();
        return;
      }

      const img = new Image();
      img.onload = () => {
        this.preloadedImages.add(src);
        resolve();
      };
      img.onerror = () => {
        reject(new Error(`Failed to preload image: ${src}`));
      };
      img.src = src;
    });
  }

  // Preload multiple images with concurrency control
  async preloadImages(urls: string[], concurrency = 3): Promise<void> {
    const chunks = this.chunkArray(urls, concurrency);
    
    for (const chunk of chunks) {
      await Promise.allSettled(
        chunk.map(url => this.preloadImage(url))
      );
    }
  }

  // Add images to preload queue
  queueImages(urls: string[]): void {
    this.preloadQueue.push(...urls);
    this.processQueue();
  }

  // Process the preload queue
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.preloadQueue.length === 0) return;

    this.isProcessing = true;
    const batch = this.preloadQueue.splice(0, 10); // Process 10 at a time
    
    try {
      await this.preloadImages(batch, 3);
    } catch (error) {
      console.warn('Error preloading images:', error);
    } finally {
      this.isProcessing = false;
      
      // Continue processing if there are more items
      if (this.preloadQueue.length > 0) {
        setTimeout(() => this.processQueue(), 100);
      }
    }
  }

  // Check if image is already preloaded
  isPreloaded(src: string): boolean {
    return this.preloadedImages.has(src);
  }

  // Get optimized TMDB URL
  getOptimizedTMDBUrl(originalUrl: string, size: 'w150' | 'w300' | 'w500' | 'w780' = 'w500'): string {
    if (!originalUrl || !originalUrl.includes('image.tmdb.org')) {
      return originalUrl;
    }
    return originalUrl.replace('/t/p/w500/', `/t/p/${size}/`);
  }

  // Preload community images by category
  async preloadCommunityImages(category: 'actors' | 'actresses' | 'directors' | 'movies' | 'productionHouses'): Promise<void> {
    try {
      const { comprehensiveCommunityData } = await import('../data/comprehensiveCommunityData');
      const items = comprehensiveCommunityData[category];
      
      if (items && items.length > 0) {
        const urls = items
          .slice(0, 20) // Preload first 20 images
          .map(item => this.getOptimizedTMDBUrl(item.avatar, 'w300'))
          .filter(url => url && !this.isPreloaded(url));
        
        this.queueImages(urls);
      }
    } catch (error) {
      console.warn(`Error preloading ${category} images:`, error);
    }
  }

  // Preload all community images
  async preloadAllCommunityImages(): Promise<void> {
    const categories: Array<'actors' | 'actresses' | 'directors' | 'movies' | 'productionHouses'> = [
      'actors', 'actresses', 'directors', 'movies', 'productionHouses'
    ];

    for (const category of categories) {
      await this.preloadCommunityImages(category);
    }
  }

  // Utility function to chunk array
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  // Clear preloaded images (useful for memory management)
  clear(): void {
    this.preloadedImages.clear();
    this.preloadQueue = [];
    this.isProcessing = false;
  }

  // Get stats
  getStats(): { preloaded: number; queued: number } {
    return {
      preloaded: this.preloadedImages.size,
      queued: this.preloadQueue.length
    };
  }
}

// Create singleton instance
const imagePreloader = new ImagePreloader();

export default imagePreloader; 