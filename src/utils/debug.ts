import React from 'react';
import { reportError } from '../services/sentry';

// Debug configuration
const DEBUG_CONFIG = {
  enabled: import.meta.env.DEV || import.meta.env.VITE_DEBUG === 'true',
  logLevel: import.meta.env.VITE_LOG_LEVEL || 'info',
  performance: import.meta.env.VITE_PERFORMANCE_DEBUG === 'true',
};

// Log levels
const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
  trace: 4,
};

// Performance monitoring
const performanceMarks = new Map<string, number>();

// Debug logger
export class DebugLogger {
  private static instance: DebugLogger;
  private logLevel: number;

  private constructor() {
    this.logLevel = LOG_LEVELS[DEBUG_CONFIG.logLevel as keyof typeof LOG_LEVELS] || LOG_LEVELS.info;
  }

  static getInstance(): DebugLogger {
    if (!DebugLogger.instance) {
      DebugLogger.instance = new DebugLogger();
    }
    return DebugLogger.instance;
  }

  private shouldLog(level: number): boolean {
    return DEBUG_CONFIG.enabled && level <= this.logLevel;
  }

  error(message: string, ...args: any[]): void {
    if (this.shouldLog(LOG_LEVELS.error)) {
      console.error(`[ERROR] ${message}`, ...args);
      if (args[0] instanceof Error) {
        reportError(args[0], { message, args: args.slice(1) });
      }
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.shouldLog(LOG_LEVELS.warn)) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.shouldLog(LOG_LEVELS.info)) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  debug(message: string, ...args: any[]): void {
    if (this.shouldLog(LOG_LEVELS.debug)) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }

  trace(message: string, ...args: any[]): void {
    if (this.shouldLog(LOG_LEVELS.trace)) {
      console.trace(`[TRACE] ${message}`, ...args);
    }
  }
}

// Performance monitoring
export class PerformanceMonitor {
  static startTimer(name: string): void {
    if (DEBUG_CONFIG.performance) {
      performanceMarks.set(name, performance.now());
      console.debug(`⏱️ Timer started: ${name}`);
    }
  }

  static endTimer(name: string): number {
    if (DEBUG_CONFIG.performance) {
      const startTime = performanceMarks.get(name);
      if (startTime) {
        const duration = performance.now() - startTime;
        console.debug(`⏱️ Timer ended: ${name} (${duration.toFixed(2)}ms)`);
        performanceMarks.delete(name);
        return duration;
      }
    }
    return 0;
  }

  static measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    if (!DEBUG_CONFIG.performance) {
      return fn();
    }

    this.startTimer(name);
    return fn().finally(() => {
      this.endTimer(name);
    });
  }

  static measureSync<T>(name: string, fn: () => T): T {
    if (!DEBUG_CONFIG.performance) {
      return fn();
    }

    this.startTimer(name);
    try {
      return fn();
    } finally {
      this.endTimer(name);
    }
  }
}

// Hook debugging
export function useDebugEffect(effect: React.EffectCallback, deps?: React.DependencyList, name?: string): void {
  const logger = DebugLogger.getInstance();
  const effectName = name || 'useEffect';

  React.useEffect(() => {
    logger.debug(`Effect started: ${effectName}`, { deps });
    const cleanup = effect();
    return () => {
      logger.debug(`Effect cleanup: ${effectName}`);
      if (cleanup) cleanup();
    };
  }, deps);
}

// State debugging
export function useDebugState<T>(initialState: T, name?: string): [T, React.Dispatch<React.SetStateAction<T>>] {
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

// Network debugging
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

// Export convenience functions
export const debug = DebugLogger.getInstance();
export const perf = PerformanceMonitor;

// Global error handler
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    debug.error('Global error caught', event.error);
    reportError(event.error, { 
      filename: event.filename, 
      lineno: event.lineno, 
      colno: event.colno 
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    debug.error('Unhandled promise rejection', event.reason);
    reportError(new Error('Unhandled promise rejection'), { reason: event.reason });
  });
} 