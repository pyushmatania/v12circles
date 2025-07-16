import React, { memo } from 'react';
import { SentryErrorBoundary, reportError } from '../services/sentry';

// 🛡️ Type definitions for better type safety
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * 🎯 ErrorBoundaryClass - Optimized error boundary class component
 * @description Catches JavaScript errors and displays fallback UI
 */
class ErrorBoundaryClass extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    reportError(error, { errorInfo });
  }

  // 🚀 Optimized error reset handler
  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  // 🚀 Optimized reload handler
  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} resetError={this.resetError} />;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8 border border-gray-200 dark:border-gray-700">
            {/* 🚀 Enhanced error icon */}
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
              <svg 
                className="w-8 h-8 text-red-600 dark:text-red-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
                />
              </svg>
            </div>
            
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Oops! Something went wrong
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                We're sorry, but something unexpected happened. Our team has been notified and is working on a fix.
              </p>
              
              {/* 🚀 Enhanced action buttons */}
              <div className="space-y-3">
                <button
                  onClick={this.resetError}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Try Again
                </button>
                <button
                  onClick={this.handleReload}
                  className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-lg font-medium hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Reload Page
                </button>
              </div>
              
              {/* 🚀 Development error details */}
              {import.meta.env.DEV && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium">
                    Error Details (Development)
                  </summary>
                  <pre className="mt-3 text-xs bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-auto max-h-48 border border-gray-200 dark:border-gray-700">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * 🎯 ErrorBoundary - Optimized error boundary wrapper component
 * @description Wrapper that uses Sentry's error boundary in production
 */
const ErrorBoundary: React.FC<ErrorBoundaryProps> = memo(({ children, fallback }) => {
  if (import.meta.env.PROD) {
    return (
      <SentryErrorBoundary>
        {children}
      </SentryErrorBoundary>
    );
  }

  return (
    <ErrorBoundaryClass fallback={fallback}>
      {children}
    </ErrorBoundaryClass>
  );
});

ErrorBoundary.displayName = 'ErrorBoundary';

export { ErrorBoundary }; 