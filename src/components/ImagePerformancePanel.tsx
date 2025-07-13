import React from 'react';
import { useImagePerformance } from '../hooks/useImagePerformance';
import { BarChart3, Clock, CheckCircle, XCircle, Zap } from 'lucide-react';

const ImagePerformancePanel: React.FC = () => {
  const { stats, isMonitoring, getPerformanceReport } = useImagePerformance();

  if (!isMonitoring) return null;

  const report = getPerformanceReport();

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 backdrop-blur-lg rounded-2xl p-4 text-white text-sm border border-white/20 shadow-2xl z-50">
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 className="w-4 h-4 text-purple-400" />
        <span className="font-semibold">Image Performance</span>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Success Rate:</span>
          <span className="font-mono text-green-400">{report.successRate}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Avg Load Time:</span>
          <span className="font-mono text-blue-400">{report.averageLoadTime}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Total Images:</span>
          <span className="font-mono">{report.totalImages}</span>
        </div>
        
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-400" />
            <span>{report.loadedImages}</span>
          </div>
          <div className="flex items-center gap-1">
            <XCircle className="w-3 h-3 text-red-400" />
            <span>{report.failedImages}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePerformancePanel; 