import * as Sentry from '@sentry/react';

// Initialize Sentry
export function initSentry() {
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: "https://your-sentry-dsn-here@your-org.ingest.sentry.io/your-project", // Replace with your actual DSN
      // Performance Monitoring
      tracesSampleRate: 1.0,
      // Session Replay
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      // Environment
      environment: import.meta.env.MODE,
      // Release tracking
      release: import.meta.env.VITE_APP_VERSION || '1.0.0',
      // Debug mode in development
      debug: import.meta.env.DEV,
    });
  }
}

// Error boundary component
export const SentryErrorBoundary = Sentry.ErrorBoundary;

// Performance monitoring
export const SentryProfiler = Sentry.Profiler;

// Custom error reporting
export function reportError(error: Error, context?: Record<string, unknown>) {
  if (import.meta.env.PROD) {
    Sentry.captureException(error, {
      extra: context,
    });
  } else {
    console.error('Error reported to Sentry:', error, context);
  }
}

// User context
export function setUserContext(user: { id: string; email?: string; username?: string }) {
  Sentry.setUser(user);
}

// Clear user context
export function clearUserContext() {
  Sentry.setUser(null);
} 