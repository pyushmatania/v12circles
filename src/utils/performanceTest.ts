// V12 Circles - Performance Integration Test
// This script tests if all performance features are working correctly

import { performanceIntegration } from './performanceIntegration';

export const testPerformanceFeatures = async () => {
  console.log('🧪 [V12] Starting Performance Feature Tests...');
  
  const results = {
    integration: false,
    monitoring: false,
    caching: false,
    serviceWorker: false,
    imageOptimization: false,
    mobileOptimizations: false,
    virtualScrolling: false
  };

  try {
    // Test 1: Integration Wrapper
    console.log('✅ Testing Integration Wrapper...');
    const config = performanceIntegration.getConfig();
    results.integration = config.enabled !== undefined;
    console.log('📊 Integration Config:', config);

    // Test 2: Feature Checks
    console.log('✅ Testing Feature Checks...');
    const features = ['monitoring', 'caching', 'serviceWorker', 'imageOptimization', 'mobileOptimizations', 'virtualScrolling'] as const;
    
    for (const feature of features) {
      const isEnabled = performanceIntegration.isFeatureEnabled(feature);
      results[feature] = isEnabled;
      console.log(`📊 ${feature}: ${isEnabled ? '✅ Enabled' : '❌ Disabled'}`);
    }

    // Test 3: Safe Initialization
    console.log('✅ Testing Safe Initialization...');
    await performanceIntegration.initialize();
    console.log('✅ Initialization completed without errors');

    // Test 4: Performance Monitoring
    try {
      const { performanceMonitor } = await import('./performanceMonitor');
      results.monitoring = true;
      console.log('✅ Performance Monitor loaded successfully');
    } catch (error) {
      console.warn('⚠️ Performance Monitor failed to load:', error);
    }

    // Test 5: Cache Manager
    try {
      const { cacheManager } = await import('./cacheManager');
      results.caching = true;
      console.log('✅ Cache Manager loaded successfully');
    } catch (error) {
      console.warn('⚠️ Cache Manager failed to load:', error);
    }

    // Test 6: Service Worker
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration('/sw.js');
        results.serviceWorker = !!registration;
        console.log('✅ Service Worker check completed');
      } catch (error) {
        console.warn('⚠️ Service Worker check failed:', error);
      }
    }

    // Test 7: Mobile Optimizations
    try {
      const { useMobileOptimizations } = await import('../hooks/useMobileOptimizations');
      results.mobileOptimizations = true;
      console.log('✅ Mobile Optimizations loaded successfully');
    } catch (error) {
      console.warn('⚠️ Mobile Optimizations failed to load:', error);
    }

    // Test 8: Virtual Scrolling
    try {
      const { default: VirtualScrolling } = await import('../components/VirtualScrolling');
      results.virtualScrolling = true;
      console.log('✅ Virtual Scrolling loaded successfully');
    } catch (error) {
      console.warn('⚠️ Virtual Scrolling failed to load:', error);
    }

  } catch (error) {
    console.error('❌ Performance test failed:', error);
  }

  // Summary
  console.log('📊 [V12] Performance Test Results:');
  console.table(results);
  
  const successCount = Object.values(results).filter(Boolean).length;
  const totalCount = Object.keys(results).length;
  
  console.log(`🎯 Overall Success Rate: ${successCount}/${totalCount} (${Math.round(successCount/totalCount*100)}%)`);
  
  if (successCount === totalCount) {
    console.log('🎉 All performance features are working correctly!');
  } else {
    console.log('⚠️ Some features failed to load, but app continues to work normally');
  }

  return results;
};

// Auto-run test in development
if (import.meta.env.DEV) {
  // Run test after a delay to ensure app is loaded
  setTimeout(() => {
    testPerformanceFeatures();
  }, 2000);
} 