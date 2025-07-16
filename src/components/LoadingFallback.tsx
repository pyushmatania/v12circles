import React, { memo } from 'react';

/**
 * 🎯 LoadingFallback - Optimized loading component with enhanced performance
 * @description Provides a beautiful loading screen with animated spinner
 */
const LoadingFallback: React.FC = memo(() => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black">
    <div className="text-center">
      <div className="relative">
        {/* 🚀 Enhanced spinner with multiple layers */}
        <div className="w-16 h-16 border-4 border-purple-500/30 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <div className="absolute inset-0 w-16 h-16 border-4 border-purple-400/50 border-t-transparent rounded-full animate-spin mx-auto mb-4" 
             style={{ animationDelay: '-0.5s' }} />
        <div className="absolute inset-0 w-16 h-16 border-4 border-purple-300 border-t-transparent rounded-full animate-spin mx-auto mb-4" 
             style={{ animationDelay: '-1s' }} />
      </div>
      
      {/* 🚀 Enhanced loading text with gradient */}
      <p className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 text-lg font-medium">
        Loading Circles...
      </p>
      
      {/* 🚀 Subtle pulse animation */}
      <div className="mt-4 flex justify-center space-x-1">
        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
      </div>
    </div>
  </div>
));

LoadingFallback.displayName = 'LoadingFallback';

export default LoadingFallback; 