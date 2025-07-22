// 🧪 Simple Benchmark Test
// Tests if the benchmark can generate results

import { performanceBenchmark } from './performanceBenchmark';

export async function testBenchmark(): Promise<boolean> {
  try {
    console.log('🧪 Testing benchmark functionality...');
    
    // Test 1: Basic metrics generation
    const beforeMetrics = await performanceBenchmark.runBenchmark();
    console.log('✅ Before metrics generated:', beforeMetrics);
    
    // Test 2: Create fake after metrics
    const afterMetrics = {
      ...beforeMetrics,
      LCP: beforeMetrics.LCP * 0.8, // 20% improvement
      FID: beforeMetrics.FID * 0.7, // 30% improvement
      CLS: beforeMetrics.CLS * 0.5, // 50% improvement
      FCP: beforeMetrics.FCP * 0.8, // 20% improvement
      TTFB: beforeMetrics.TTFB * 0.9, // 10% improvement
      memoryUsage: beforeMetrics.memoryUsage * 0.8, // 20% improvement
      renderTime: beforeMetrics.renderTime * 0.6, // 40% improvement
      imageLoadTime: beforeMetrics.imageLoadTime * 0.5, // 50% improvement
      animationFPS: Math.min(60, beforeMetrics.animationFPS * 1.2), // 20% improvement
      cacheHitRate: Math.min(100, beforeMetrics.cacheHitRate * 1.1), // 10% improvement
      apiResponseTime: beforeMetrics.apiResponseTime * 0.8, // 20% improvement
      timeToInteractive: beforeMetrics.timeToInteractive * 0.9, // 10% improvement
      scrollPerformance: Math.min(100, beforeMetrics.scrollPerformance * 1.05), // 5% improvement
      touchResponsiveness: beforeMetrics.touchResponsiveness * 0.8 // 20% improvement
    };
    
    console.log('✅ After metrics created:', afterMetrics);
    
    // Test 3: Calculate improvements
    const result = performanceBenchmark.calculateImprovements(beforeMetrics, afterMetrics);
    console.log('✅ Benchmark result calculated:', result);
    
    // Test 4: Verify result structure
    const hasRequiredFields = result && 
      result.before && 
      result.after && 
      result.improvements && 
      typeof result.overallScore === 'number' && 
      result.grade;
    
    if (hasRequiredFields) {
      console.log('✅ Benchmark test PASSED - all fields present');
      return true;
    } else {
      console.log('❌ Benchmark test FAILED - missing required fields');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Benchmark test crashed:', error);
    return false;
  }
}

// Auto-run test in development
if (import.meta.env.DEV) {
  setTimeout(() => {
    testBenchmark().then(success => {
      console.log('🎯 Benchmark test result:', success ? 'PASSED' : 'FAILED');
    });
  }, 1000);
} 