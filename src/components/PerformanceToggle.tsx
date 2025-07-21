import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Zap, Shield, CheckCircle, XCircle } from 'lucide-react';
import { useSafePerformance } from '../utils/performanceIntegration';

const PerformanceToggle: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isEnabled, isFeatureEnabled, initialize } = useSafePerformance();
  const [isInitializing, setIsInitializing] = useState(false);

  const features = [
    {
      key: 'serviceWorker' as const,
      name: 'Service Worker',
      description: 'Offline functionality and caching',
      icon: Shield
    },
    {
      key: 'imageOptimization' as const,
      name: 'Image Optimization',
      description: 'Progressive loading and compression',
      icon: Zap
    },
    {
      key: 'caching' as const,
      name: 'Smart Caching',
      description: 'Multi-layer caching system',
      icon: CheckCircle
    },
    {
      key: 'virtualScrolling' as const,
      name: 'Virtual Scrolling',
      description: 'Smooth large list rendering',
      icon: Zap
    },
    {
      key: 'mobileOptimizations' as const,
      name: 'Mobile Optimizations',
      description: 'Touch and battery optimizations',
      icon: Zap
    },
    {
      key: 'monitoring' as const,
      name: 'Performance Monitoring',
      description: 'Real-time performance tracking',
      icon: Settings
    }
  ];

  const handleInitialize = async () => {
    setIsInitializing(true);
    try {
      await initialize();
    } catch (error) {
      console.error('Failed to initialize performance features:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  if (!isEnabled || import.meta.env.DEV) {
    return null; // Don't show in development mode, only in production
  }

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 p-3 bg-black/80 backdrop-blur-sm border border-white/20 rounded-full shadow-lg hover:bg-black/90 transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Performance Settings"
      >
        <Zap className="w-5 h-5 text-blue-400" />
      </motion.button>

      {/* Performance Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-20 right-4 z-50 w-80 bg-black/90 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl p-4"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-lg">Performance Features</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                const isActive = isFeatureEnabled(feature.key);
                
                return (
                  <div
                    key={feature.key}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                      isActive
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-gray-800/50 border-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4 h-4 ${
                        isActive ? 'text-green-400' : 'text-gray-400'
                      }`} />
                      <div>
                        <div className={`text-sm font-medium ${
                          isActive ? 'text-green-400' : 'text-gray-300'
                        }`}>
                          {feature.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {feature.description}
                        </div>
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      isActive ? 'bg-green-400' : 'bg-gray-600'
                    }`} />
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <button
                onClick={handleInitialize}
                disabled={isInitializing}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                {isInitializing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Initializing...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Initialize Performance</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PerformanceToggle; 