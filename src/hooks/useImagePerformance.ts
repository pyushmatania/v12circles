import { useState, useCallback } from 'react';

interface ImageLoadStats {
  totalImages: number;
  loadedImages: number;
  failedImages: number;
  averageLoadTime: number;
  loadTimes: number[];
}

export const useImagePerformance = () => {
  const [stats, setStats] = useState<ImageLoadStats>({
    totalImages: 0,
    loadedImages: 0,
    failedImages: 0,
    averageLoadTime: 0,
    loadTimes: []
  });

  const [isMonitoring, setIsMonitoring] = useState(false);

  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);
    setStats({
      totalImages: 0,
      loadedImages: 0,
      failedImages: 0,
      averageLoadTime: 0,
      loadTimes: []
    });
  }, []);

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
  }, []);

  const trackImageLoad = useCallback((url: string, loadTime: number, success: boolean) => {
    if (!isMonitoring) return;

    setStats(prev => {
      const newLoadTimes = [...prev.loadTimes, loadTime];
      const averageLoadTime = newLoadTimes.reduce((a, b) => a + b, 0) / newLoadTimes.length;

      return {
        totalImages: prev.totalImages + 1,
        loadedImages: success ? prev.loadedImages + 1 : prev.loadedImages,
        failedImages: success ? prev.failedImages : prev.failedImages + 1,
        averageLoadTime,
        loadTimes: newLoadTimes
      };
    });
  }, [isMonitoring]);

  const getPerformanceReport = useCallback(() => {
    const successRate = stats.totalImages > 0 ? (stats.loadedImages / stats.totalImages) * 100 : 0;
    const avgTime = stats.averageLoadTime.toFixed(2);
    
    return {
      successRate: `${successRate.toFixed(1)}%`,
      averageLoadTime: `${avgTime}ms`,
      totalImages: stats.totalImages,
      loadedImages: stats.loadedImages,
      failedImages: stats.failedImages
    };
  }, [stats]);

  return {
    stats,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    trackImageLoad,
    getPerformanceReport
  };
}; 