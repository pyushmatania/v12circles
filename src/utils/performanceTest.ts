// 🚀 Performance Test Utility
// Tests if all performance features are working correctly

import { performanceIntegration } from './performanceIntegration';
import { realPerformanceOptimizations } from './realPerformanceOptimizations';

export async function testPerformanceFeatures(): Promise<{
  success: boolean;
  features: Record<string, boolean>;
  errors: string[];
}> {
  const results = {
    success: false,
    features: {} as Record<string, boolean>,
    errors: [] as string[]
  };

  try {
    console.log('🧪 Testing Performance Features...');

    // Test 1: Performance Integration
    try {
      await performanceIntegration.initialize();
      results.features.integration = true;
      console.log('✅ Performance Integration: OK');
    } catch (error) {
      results.features.integration = false;
      results.errors.push(`Integration failed: ${error}`);
      console.log('❌ Performance Integration: FAILED');
    }

    // Test 2: Real Performance Optimizations
    try {
      await realPerformanceOptimizations.applyOptimizations();
      results.features.optimizations = true;
      console.log('✅ Real Optimizations: OK');
    } catch (error) {
      results.features.optimizations = false;
      results.errors.push(`Optimizations failed: ${error}`);
      console.log('❌ Real Optimizations: FAILED');
    }

    // Test 3: Service Worker
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        results.features.serviceWorker = !!registration;
        console.log('✅ Service Worker: OK');
      } else {
        results.features.serviceWorker = false;
        results.errors.push('Service Worker not supported');
        console.log('❌ Service Worker: NOT SUPPORTED');
      }
    } catch (error) {
      results.features.serviceWorker = false;
      results.errors.push(`Service Worker failed: ${error}`);
      console.log('❌ Service Worker: FAILED');
    }

    // Test 4: Performance Observer
    try {
      if ('PerformanceObserver' in window) {
        results.features.performanceObserver = true;
        console.log('✅ Performance Observer: OK');
      } else {
        results.features.performanceObserver = false;
        results.errors.push('Performance Observer not supported');
        console.log('❌ Performance Observer: NOT SUPPORTED');
      }
    } catch (error) {
      results.features.performanceObserver = false;
      results.errors.push(`Performance Observer failed: ${error}`);
      console.log('❌ Performance Observer: FAILED');
    }

    // Test 5: Cache API
    try {
      if ('caches' in window) {
        results.features.cacheAPI = true;
        console.log('✅ Cache API: OK');
      } else {
        results.features.cacheAPI = false;
        results.errors.push('Cache API not supported');
        console.log('❌ Cache API: NOT SUPPORTED');
      }
    } catch (error) {
      results.features.cacheAPI = false;
      results.errors.push(`Cache API failed: ${error}`);
      console.log('❌ Cache API: FAILED');
    }

    // Calculate overall success
    const workingFeatures = Object.values(results.features).filter(Boolean).length;
    const totalFeatures = Object.keys(results.features).length;
    results.success = workingFeatures >= totalFeatures * 0.6; // 60% success rate

    console.log(`📊 Performance Test Results: ${workingFeatures}/${totalFeatures} features working`);
    console.log('🎯 Overall Status:', results.success ? 'PASSED' : 'FAILED');

    return results;

  } catch (error) {
    console.error('💥 Performance test crashed:', error);
    results.errors.push(`Test crashed: ${error}`);
    return results;
  }
}

// Auto-run test in development
if (import.meta.env.DEV) {
  setTimeout(() => {
    testPerformanceFeatures().then(results => {
      console.log('🔍 Auto Performance Test Results:', results);
    });
  }, 2000);
} 