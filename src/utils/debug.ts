import React from 'react';
import { reportError } from '../services/sentry';

// 🛡️ Type definitions for better type safety
interface DebugConfig {
  enabled: boolean;
  logLevel: string;
  performance: boolean;
  maxLogEntries: number;
  enableSentry: boolean;
}

interface LogEntry {
  timestamp: number;
  level: string;
  message: string;
  args: unknown[];
  stack?: string;
}

type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'trace';

// 🚀 Debug configuration with enhanced options
const DEBUG_CONFIG: DebugConfig = {
  enabled: import.meta.env.DEV || import.meta.env.VITE_DEBUG === 'true',
  logLevel: import.meta.env.VITE_LOG_LEVEL || 'info',
  performance: import.meta.env.VITE_PERFORMANCE_DEBUG === 'true',
  maxLogEntries: 1000,
  enableSentry: import.meta.env.VITE_ENABLE_SENTRY !== 'false'
};

// 🚀 Log levels with numeric values
const LOG_LEVELS: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
  trace: 4,
};



/**
 * 🎯 DebugLogger - Optimized debug logging with enhanced performance
 * @description Provides comprehensive logging with performance monitoring and error tracking
 */
export class DebugLogger {
  private static instance: DebugLogger;
  private logLevel: number;
  private logHistory: LogEntry[] = [];
  private isEnabled: boolean;

  private constructor() {
    this.logLevel = LOG_LEVELS[DEBUG_CONFIG.logLevel as LogLevel] || LOG_LEVELS.info;
    this.isEnabled = DEBUG_CONFIG.enabled;
  }

  static getInstance(): DebugLogger {
    if (!DebugLogger.instance) {
      DebugLogger.instance = new DebugLogger();
    }
    return DebugLogger.instance;
  }

  private shouldLog(level: number): boolean {
    return this.isEnabled && level <= this.logLevel;
  }

  private addToHistory(level: string, message: string, args: unknown[]): void {
    if (this.logHistory.length >= DEBUG_CONFIG.maxLogEntries) {
      this.logHistory = this.logHistory.slice(-DEBUG_CONFIG.maxLogEntries / 2);
    }

    this.logHistory.push({
      timestamp: Date.now(),
      level,
      message,
      args,
      stack: new Error().stack
    });
  }

  private formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  }

  error(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LOG_LEVELS.error)) {
      const formattedMessage = this.formatMessage('ERROR', message);
      console.error(formattedMessage, ...args);
      this.addToHistory('error', message, args);

      // Report to Sentry if enabled
      if (DEBUG_CONFIG.enableSentry && args[0] instanceof Error) {
        reportError(args[0], { message, args: args.slice(1) });
      }
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LOG_LEVELS.warn)) {
      const formattedMessage = this.formatMessage('WARN', message);
      console.warn(formattedMessage, ...args);
      this.addToHistory('warn', message, args);
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LOG_LEVELS.info)) {
      const formattedMessage = this.formatMessage('INFO', message);
      console.info(formattedMessage, ...args);
      this.addToHistory('info', message, args);
    }
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LOG_LEVELS.debug)) {
      const formattedMessage = this.formatMessage('DEBUG', message);
      console.debug(formattedMessage, ...args);
      this.addToHistory('debug', message, args);
    }
  }

  trace(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LOG_LEVELS.trace)) {
      const formattedMessage = this.formatMessage('TRACE', message);
      console.trace(formattedMessage, ...args);
      this.addToHistory('trace', message, args);
    }
  }

  // 🚀 Get log history
  getLogHistory(): LogEntry[] {
    return [...this.logHistory];
  }

  // 🚀 Clear log history
  clearHistory(): void {
    this.logHistory = [];
  }

  // 🚀 Export logs
  exportLogs(): string {
    return this.logHistory
      .map(entry => `${new Date(entry.timestamp).toISOString()} [${entry.level.toUpperCase()}] ${entry.message}`)
      .join('\n');
  }

  // 🚀 Set log level
  setLogLevel(level: LogLevel): void {
    this.logLevel = LOG_LEVELS[level];
  }

  // 🚀 Enable/disable logging
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }
}

/**
 * 🎯 PerformanceMonitor - Enhanced performance monitoring with detailed metrics
 * @description Provides comprehensive performance tracking and analysis
 */
export class PerformanceMonitor {
  private static marks = new Map<string, number>();
  private static measures = new Map<string, number[]>();
  private static isEnabled = DEBUG_CONFIG.performance;

  static startTimer(name: string): void {
    if (this.isEnabled) {
      this.marks.set(name, performance.now());
      console.debug(`⏱️ Timer started: ${name}`);
    }
  }

  static endTimer(name: string): number {
    if (this.isEnabled) {
      const startTime = this.marks.get(name);
      if (startTime) {
        const duration = performance.now() - startTime;
        console.debug(`⏱️ Timer ended: ${name} (${duration.toFixed(2)}ms)`);
        this.marks.delete(name);
        
        // Store measure for analysis
        if (!this.measures.has(name)) {
          this.measures.set(name, []);
        }
        this.measures.get(name)!.push(duration);
        
        return duration;
      }
    }
    return 0;
  }

  static measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    if (!this.isEnabled) {
      return fn();
    }

    this.startTimer(name);
    return fn().finally(() => {
      this.endTimer(name);
    });
  }

  static measureSync<T>(name: string, fn: () => T): T {
    if (!this.isEnabled) {
      return fn();
    }

    this.startTimer(name);
    try {
      return fn();
    } finally {
      this.endTimer(name);
    }
  }

  // 🚀 Get performance statistics
  static getStats(name: string): { count: number; avg: number; min: number; max: number } | null {
    const measures = this.measures.get(name);
    if (!measures || measures.length === 0) return null;

    const sum = measures.reduce((a, b) => a + b, 0);
    return {
      count: measures.length,
      avg: sum / measures.length,
      min: Math.min(...measures),
      max: Math.max(...measures)
    };
  }

  // 🚀 Clear performance data
  static clear(): void {
    this.marks.clear();
    this.measures.clear();
  }

  // 🚀 Enable/disable performance monitoring
  static setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }
}

/**
 * 🎯 useDebugEffect - Enhanced React effect debugging hook
 * @description Provides detailed debugging for React effects
 */
export function useDebugEffect(
  effect: React.EffectCallback, 
  deps: React.DependencyList, 
  name?: string
): void {
  const logger = DebugLogger.getInstance();
  const effectName = name || 'useEffect';

  React.useEffect(() => {
    logger.debug(`Effect started: ${effectName}`, { deps });
    const cleanup = effect();
    return () => {
      logger.debug(`Effect cleanup: ${effectName}`);
      if (cleanup) cleanup();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps]);
}

/**
 * 🎯 useDebugState - Enhanced React state debugging hook
 * @description Provides detailed debugging for React state changes
 */
export function useDebugState<T>(
  initialState: T, 
  name?: string
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const logger = DebugLogger.getInstance();
  const stateName = name || 'state';
  const [state, setState] = React.useState<T>(initialState);

  const debugSetState = React.useCallback((value: React.SetStateAction<T>) => {
    logger.debug(`State update: ${stateName}`, { 
      current: state, 
      newValue: typeof value === 'function' ? 'function' : value 
    });
    setState(value);
  }, [state, stateName, logger]);

  return [state, debugSetState];
}

/**
 * 🎯 debugFetch - Enhanced fetch debugging wrapper
 * @description Provides detailed debugging for fetch requests
 */
export function debugFetch(url: string, options?: RequestInit): Promise<Response> {
  const logger = DebugLogger.getInstance();
  const startTime = performance.now();

  logger.debug(`Fetch request: ${url}`, { options });

  return fetch(url, options)
    .then(response => {
      const duration = performance.now() - startTime;
      logger.debug(`Fetch response: ${url}`, { 
        status: response.status, 
        duration: `${duration.toFixed(2)}ms` 
      });
      return response;
    })
    .catch(error => {
      const duration = performance.now() - startTime;
      logger.error(`Fetch error: ${url}`, { error, duration: `${duration.toFixed(2)}ms` });
      throw error;
    });
}

/**
 * 🎯 debugAsync - Debug wrapper for async functions
 * @description Provides debugging for async function execution
 */
export function debugAsync<T>(
  name: string,
  fn: () => Promise<T>,
  logger?: DebugLogger
): Promise<T> {
  const debugLogger = logger || DebugLogger.getInstance();
  const startTime = performance.now();

  debugLogger.debug(`Async function started: ${name}`);
  
  return fn()
    .then(result => {
      const duration = performance.now() - startTime;
      debugLogger.debug(`Async function completed: ${name}`, { 
        duration: `${duration.toFixed(2)}ms`,
        result 
      });
      return result;
    })
    .catch(error => {
      const duration = performance.now() - startTime;
      debugLogger.error(`Async function failed: ${name}`, { 
        error, 
        duration: `${duration.toFixed(2)}ms` 
      });
      throw error;
    });
}

// 🚀 Export convenience functions
export const debug = DebugLogger.getInstance();
export const perf = PerformanceMonitor;

// 🚀 Global error handler with enhanced error tracking
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    debug.error('Global error caught', event.error);
    if (DEBUG_CONFIG.enableSentry) {
      reportError(event.error, { 
        filename: event.filename, 
        lineno: event.lineno, 
        colno: event.colno 
      });
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    debug.error('Unhandled promise rejection', event.reason);
    if (DEBUG_CONFIG.enableSentry) {
      reportError(new Error('Unhandled promise rejection'), { reason: event.reason });
    }
  });

  // 🚀 Performance monitoring for page load
  if (DEBUG_CONFIG.performance) {
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      debug.info('Page load completed', { loadTime: `${loadTime.toFixed(2)}ms` });
    });
  }
} 