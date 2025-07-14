import React, { useState, useEffect } from 'react';
import { debug, perf } from '../utils/debug';

interface DebugInfo {
  timestamp: string;
  level: string;
  message: string;
  data?: any;
}

interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: string;
}

const DebugPanel: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [logs, setLogs] = useState<DebugInfo[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [appState, setAppState] = useState<any>({});

  // Capture console logs
  useEffect(() => {
    if (!import.meta.env.DEV) return;

    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalDebug = console.debug;

    const addLog = (level: string, message: string, ...args: any[]) => {
      setLogs(prev => [...prev.slice(-99), {
        timestamp: new Date().toISOString(),
        level,
        message,
        data: args.length > 0 ? args : undefined
      }]);
    };

    console.log = (...args) => {
      originalLog(...args);
      addLog('log', args[0], ...args.slice(1));
    };

    console.error = (...args) => {
      originalError(...args);
      addLog('error', args[0], ...args.slice(1));
    };

    console.warn = (...args) => {
      originalWarn(...args);
      addLog('warn', args[0], ...args.slice(1));
    };

    console.debug = (...args) => {
      originalDebug(...args);
      addLog('debug', args[0], ...args.slice(1));
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      console.debug = originalDebug;
    };
  }, []);

  // Performance monitoring
  useEffect(() => {
    if (!import.meta.env.DEV) return;

    const interval = setInterval(() => {
      // Monitor memory usage
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setAppState((prev: any) => ({
          ...prev,
          memory: {
            used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
            total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
            limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
          },
          timestamp: new Date().toISOString()
        }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const clearLogs = () => setLogs([]);
  const clearMetrics = () => setPerformanceMetrics([]);

  if (!import.meta.env.DEV) return null;

  return (
    <>
      {/* Debug Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-50 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-all duration-200"
        title="Toggle Debug Panel"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </button>

      {/* Debug Panel */}
      {isVisible && (
        <div className="fixed inset-4 z-40 bg-black bg-opacity-90 text-white p-4 rounded-lg overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">🐛 Debug Panel</h2>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
            {/* Logs Panel */}
            <div className="bg-gray-800 rounded p-4 overflow-hidden">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">📝 Logs</h3>
                <button
                  onClick={clearLogs}
                  className="text-xs bg-red-600 px-2 py-1 rounded hover:bg-red-700"
                >
                  Clear
                </button>
              </div>
              <div className="h-64 overflow-y-auto text-xs space-y-1">
                {logs.map((log, index) => (
                  <div key={index} className={`p-1 rounded ${getLogColor(log.level)}`}>
                    <div className="flex justify-between">
                      <span className="text-gray-400">{log.timestamp.split('T')[1].split('.')[0]}</span>
                      <span className={`px-1 rounded text-xs ${getLogBadgeColor(log.level)}`}>
                        {log.level}
                      </span>
                    </div>
                    <div className="font-mono">{log.message}</div>
                    {log.data && (
                      <pre className="text-xs text-gray-400 mt-1 overflow-x-auto">
                        {JSON.stringify(log.data, null, 2)}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Panel */}
            <div className="bg-gray-800 rounded p-4 overflow-hidden">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">⏱️ Performance</h3>
                <button
                  onClick={clearMetrics}
                  className="text-xs bg-red-600 px-2 py-1 rounded hover:bg-red-700"
                >
                  Clear
                </button>
              </div>
              <div className="h-64 overflow-y-auto text-xs space-y-2">
                {appState.memory && (
                  <div className="bg-gray-700 p-2 rounded">
                    <h4 className="font-semibold mb-1">Memory Usage</h4>
                    <div className="space-y-1">
                      <div>Used: {appState.memory.used}MB</div>
                      <div>Total: {appState.memory.total}MB</div>
                      <div>Limit: {appState.memory.limit}MB</div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(appState.memory.used / appState.memory.limit) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                {performanceMetrics.map((metric, index) => (
                  <div key={index} className="bg-gray-700 p-2 rounded">
                    <div className="flex justify-between">
                      <span>{metric.name}</span>
                      <span className="text-green-400">{metric.duration.toFixed(2)}ms</span>
                    </div>
                    <div className="text-gray-400 text-xs">{metric.timestamp}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* App State Panel */}
            <div className="bg-gray-800 rounded p-4 overflow-hidden">
              <h3 className="font-semibold mb-2">🔧 App State</h3>
              <div className="h-64 overflow-y-auto text-xs">
                <div className="space-y-2">
                  <div className="bg-gray-700 p-2 rounded">
                    <div className="font-semibold">Environment</div>
                    <div>Mode: {import.meta.env.MODE}</div>
                    <div>Dev: {import.meta.env.DEV ? 'Yes' : 'No'}</div>
                    <div>Base URL: {import.meta.env.BASE_URL}</div>
                  </div>
                  <div className="bg-gray-700 p-2 rounded">
                    <div className="font-semibold">Browser</div>
                    <div>User Agent: {navigator.userAgent.substring(0, 50)}...</div>
                    <div>Language: {navigator.language}</div>
                    <div>Online: {navigator.onLine ? 'Yes' : 'No'}</div>
                  </div>
                  <div className="bg-gray-700 p-2 rounded">
                    <div className="font-semibold">Performance</div>
                    <div>Load Time: {performance.timing.loadEventEnd - performance.timing.navigationStart}ms</div>
                    <div>DOM Ready: {performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart}ms</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const getLogColor = (level: string) => {
  switch (level) {
    case 'error': return 'bg-red-900/50 border-l-4 border-red-500';
    case 'warn': return 'bg-yellow-900/50 border-l-4 border-yellow-500';
    case 'debug': return 'bg-blue-900/50 border-l-4 border-blue-500';
    default: return 'bg-gray-700/50 border-l-4 border-gray-500';
  }
};

const getLogBadgeColor = (level: string) => {
  switch (level) {
    case 'error': return 'bg-red-600 text-white';
    case 'warn': return 'bg-yellow-600 text-black';
    case 'debug': return 'bg-blue-600 text-white';
    default: return 'bg-gray-600 text-white';
  }
};

export default DebugPanel; 