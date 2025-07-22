import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import PerformanceTestResults from './PerformanceTestResults';

const PerformanceTestButton: React.FC = () => {
  const [showResults, setShowResults] = useState(false);

  if (!import.meta.env.DEV) {
    return null; // Only show in development
  }

  return (
    <>
      {/* Test Button */}
      <motion.button
        onClick={() => setShowResults(true)}
        className="fixed bottom-4 left-4 z-50 p-3 bg-purple-600/80 backdrop-blur-sm border border-purple-400/20 rounded-full shadow-lg hover:bg-purple-600/90 transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Performance Benchmark"
      >
        <TrendingUp className="w-5 h-5 text-purple-200" />
      </motion.button>

      {/* Results Modal */}
      <AnimatePresence>
        {showResults && (
          <PerformanceTestResults />
        )}
      </AnimatePresence>
    </>
  );
};

export default PerformanceTestButton; 