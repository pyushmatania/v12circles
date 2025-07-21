import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TestTube, Zap, CheckCircle, XCircle } from 'lucide-react';
import { testPerformanceFeatures } from '../utils/performanceTest';

const PerformanceTestButton: React.FC = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);

  const handleTest = async () => {
    setIsTesting(true);
    try {
      const results = await testPerformanceFeatures();
      setTestResults(results);
    } catch (error) {
      console.error('Test failed:', error);
    } finally {
      setIsTesting(false);
    }
  };

  if (!import.meta.env.DEV) {
    return null; // Only show in development
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <motion.button
        onClick={handleTest}
        disabled={isTesting}
        className="p-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-full shadow-lg transition-all duration-300 flex items-center space-x-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Test Performance Features"
      >
        {isTesting ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Testing...</span>
          </>
        ) : (
          <>
            <TestTube className="w-4 h-4" />
            <span>Test</span>
          </>
        )}
      </motion.button>

      {/* Test Results */}
      {testResults && (
        <motion.div
          className="absolute bottom-16 left-0 w-80 bg-black/90 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl p-4"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="text-white font-semibold text-lg mb-3">Test Results</h3>
          <div className="space-y-2">
            {Object.entries(testResults).map(([feature, status]) => (
              <div key={feature} className="flex items-center justify-between">
                <span className="text-gray-300 text-sm capitalize">
                  {feature.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                {status ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400" />
                )}
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-white/10">
            <button
              onClick={() => setTestResults(null)}
              className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PerformanceTestButton; 