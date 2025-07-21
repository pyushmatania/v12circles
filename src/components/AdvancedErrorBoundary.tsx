import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onRecover?: () => void;
  maxRetries?: number;
  retryDelay?: number;
  enableAutoRecovery?: boolean;
  enableErrorReporting?: boolean;
  errorReportingEndpoint?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
  isRecovering: boolean;
  retryCount: number;
  lastErrorTime: number;
  recoveryAttempts: Array<{
    timestamp: number;
    error: Error;
    success: boolean;
  }>;
}

class AdvancedErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private maxRetries: number;
  private retryDelay: number;
  private enableAutoRecovery: boolean;
  private enableErrorReporting: boolean;
  private errorReportingEndpoint: string;
  private recoveryTimer: NodeJS.Timeout | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    
    this.maxRetries = props.maxRetries || 3;
    this.retryDelay = props.retryDelay || 2000;
    this.enableAutoRecovery = props.enableAutoRecovery ?? true;
    this.enableErrorReporting = props.enableErrorReporting ?? true;
    this.errorReportingEndpoint = props.errorReportingEndpoint || '/api/errors';

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      isRecovering: false,
      retryCount: 0,
      lastErrorTime: 0,
      recoveryAttempts: []
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      hasError: true,
      error,
      errorId,
      lastErrorTime: Date.now()
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });

    // Classify error
    const errorType = this.classifyError(error);
    
    // Report error
    this.reportError(error, errorInfo, errorType);
    
    // Attempt recovery based on error type
    this.attemptRecovery(error, errorType);

    // Call parent error handler
    this.props.onError?.(error, errorInfo);
  }

  private classifyError(error: Error): 'critical' | 'recoverable' | 'cosmetic' {
    const errorMessage = error.message.toLowerCase();
    const errorStack = error.stack?.toLowerCase() || '';
    
    // Critical errors (break core functionality)
    if (
      errorMessage.includes('network') ||
      errorMessage.includes('fetch') ||
      errorMessage.includes('authentication') ||
      errorMessage.includes('payment') ||
      errorMessage.includes('database') ||
      errorStack.includes('authentication') ||
      errorStack.includes('payment') ||
      errorStack.includes('database')
    ) {
      return 'critical';
    }
    
    // Recoverable errors (can retry or fallback)
    if (
      errorMessage.includes('timeout') ||
      errorMessage.includes('loading') ||
      errorMessage.includes('render') ||
      errorMessage.includes('component') ||
      errorStack.includes('animation') ||
      errorStack.includes('chart') ||
      errorStack.includes('component')
    ) {
      return 'recoverable';
    }
    
    // Cosmetic errors (UI issues that don't break functionality)
    return 'cosmetic';
  }

  private reportError(error: Error, errorInfo: ErrorInfo, type: string) {
    const errorReport = {
      errorId: this.state.errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      type,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      userId: this.getUserId(),
      sessionId: this.getSessionId(),
      buildVersion: process.env.REACT_APP_VERSION || 'unknown',
      
      // Context information
      context: {
        route: window.location.pathname,
        props: this.props,
        localStorageSize: this.getLocalStorageSize(),
        memoryUsage: this.getMemoryUsage(),
        performanceMetrics: this.getPerformanceMetrics()
      }
    };

    // Send to multiple monitoring services
    this.sendToSentry(errorReport);
    this.sendToLogRocket(errorReport);
    this.sendToCustomEndpoint(errorReport);
  }

  private async attemptRecovery(error: Error, type: string) {
    this.setState({ isRecovering: true });

    switch (type) {
      case 'critical':
        await this.handleCriticalError(error);
        break;
      case 'recoverable':
        await this.handleRecoverableError(error);
        break;
      case 'cosmetic':
        await this.handleCosmeticError(error);
        break;
    }

    this.setState({ isRecovering: false });
  }

  private async handleCriticalError(error: Error) {
    // For critical errors, try to reload the entire page as last resort
    if (this.state.retryCount < this.maxRetries) {
      this.setState(prev => ({ retryCount: prev.retryCount + 1 }));
      
      // Wait before retry (exponential backoff)
      const delay = Math.pow(2, this.state.retryCount) * this.retryDelay;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Try to reload the page
      window.location.reload();
    } else {
      // Show critical error UI
      this.showCriticalErrorUI(error);
    }
  }

  private async handleRecoverableError(error: Error) {
    if (this.state.retryCount < this.maxRetries) {
      this.setState(prev => ({ retryCount: prev.retryCount + 1 }));
      
      // Wait before retry (exponential backoff)
      const delay = Math.pow(2, this.state.retryCount) * this.retryDelay;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Reset error boundary to retry
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null
      });
      
      // Record recovery attempt
      this.recordRecoveryAttempt(error, true);
    } else {
      // Show recoverable error UI
      this.showRecoverableErrorUI(error);
    }
  }

  private async handleCosmeticError(error: Error) {
    // Log the error but continue normal operation
    console.warn('Cosmetic error handled:', error);
    
    // Record recovery attempt
    this.recordRecoveryAttempt(error, true);
    
    // Reset error boundary
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  }

  private recordRecoveryAttempt(error: Error, success: boolean) {
    this.setState(prev => ({
      recoveryAttempts: [
        ...prev.recoveryAttempts,
        {
          timestamp: Date.now(),
          error,
          success
        }
      ]
    }));
  }

  private showCriticalErrorUI(error: Error) {
    // Show critical error notification
    this.showErrorNotification('Critical Error', 'A critical error occurred. Please refresh the page.', 'error');
  }

  private showRecoverableErrorUI(error: Error) {
    // Show recoverable error notification
    this.showErrorNotification('Error Recovered', 'An error occurred but was automatically recovered.', 'warning');
  }

  private showErrorNotification(title: string, message: string, type: 'error' | 'warning' | 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
      type === 'error' ? 'bg-red-500 text-white' :
      type === 'warning' ? 'bg-yellow-500 text-white' :
      'bg-blue-500 text-white'
    }`;
    
    notification.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="font-medium">${title}</span>
        <button onclick="this.parentElement.parentElement.remove()" class="text-white/80 hover:text-white">
          ✕
        </button>
      </div>
      <p class="text-sm mt-1">${message}</p>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 10000);
  }

  private sendToSentry(errorReport: any) {
    if (typeof Sentry !== 'undefined') {
      Sentry.withScope(scope => {
        scope.setTag('errorType', errorReport.type);
        scope.setContext('errorDetails', errorReport.context);
        Sentry.captureException(new Error(errorReport.message));
      });
    }
  }

  private sendToLogRocket(errorReport: any) {
    if (typeof LogRocket !== 'undefined') {
      LogRocket.captureException(errorReport);
    }
  }

  private sendToCustomEndpoint(errorReport: any) {
    if (this.enableErrorReporting) {
      fetch(this.errorReportingEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorReport)
      }).catch(err => {
        console.warn('Failed to send error report:', err);
      });
    }
  }

  private getUserId(): string {
    return localStorage.getItem('userId') || 'anonymous';
  }

  private getSessionId(): string {
    return sessionStorage.getItem('sessionId') || 'unknown';
  }

  private getLocalStorageSize(): number {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length;
      }
    }
    return total;
  }

  private getMemoryUsage(): any {
    if ('memory' in performance) {
      return (performance as any).memory;
    }
    return null;
  }

  private getPerformanceMetrics(): any {
    // Get performance metrics if available
    if (typeof window !== 'undefined' && (window as any).performanceMonitor) {
      return (window as any).performanceMonitor.getMetrics();
    }
    return null;
  }

  // Manual recovery methods
  public retry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    });
    
    this.props.onRecover?.();
  };

  public reload = () => {
    window.location.reload();
  };

  public reset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      recoveryAttempts: []
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          errorId={this.state.errorId}
          isRecovering={this.state.isRecovering}
          retryCount={this.state.retryCount}
          maxRetries={this.maxRetries}
          onRetry={this.retry}
          onReload={this.reload}
          onReset={this.reset}
          fallback={this.props.fallback}
        />
      );
    }

    return this.props.children;
  }

  componentWillUnmount() {
    if (this.recoveryTimer) {
      clearTimeout(this.recoveryTimer);
    }
  }
}

// Error Fallback Component
interface ErrorFallbackProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
  isRecovering: boolean;
  retryCount: number;
  maxRetries: number;
  onRetry: () => void;
  onReload: () => void;
  onReset: () => void;
  fallback?: ReactNode;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  errorInfo,
  errorId,
  isRecovering,
  retryCount,
  maxRetries,
  onRetry,
  onReload,
  onReset,
  fallback
}) => {
  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <motion.div
          className="text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {/* Error Icon */}
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          {/* Error Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isRecovering ? 'Recovering...' : 'Something went wrong'}
          </h2>

          {/* Error Message */}
          <p className="text-gray-600 mb-6">
            {isRecovering 
              ? 'We\'re trying to fix this automatically...'
              : 'An unexpected error occurred. Don\'t worry, we\'re working on it.'
            }
          </p>

          {/* Error Details (Development Only) */}
          {process.env.NODE_ENV === 'development' && error && (
            <details className="mb-6 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                Error Details (Development)
              </summary>
              <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono text-gray-800 overflow-auto max-h-32">
                <div className="mb-2">
                  <strong>Error ID:</strong> {errorId}
                </div>
                <div className="mb-2">
                  <strong>Message:</strong> {error.message}
                </div>
                {error.stack && (
                  <div>
                    <strong>Stack:</strong>
                    <pre className="whitespace-pre-wrap">{error.stack}</pre>
                  </div>
                )}
                {errorInfo?.componentStack && (
                  <div className="mt-2">
                    <strong>Component Stack:</strong>
                    <pre className="whitespace-pre-wrap">{errorInfo.componentStack}</pre>
                  </div>
                )}
              </div>
            </details>
          )}

          {/* Retry Count */}
          {retryCount > 0 && (
            <div className="mb-6 text-sm text-gray-500">
              Retry attempt {retryCount} of {maxRetries}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button
              onClick={onRetry}
              disabled={isRecovering}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isRecovering ? 'Recovering...' : 'Try Again'}
            </motion.button>

            <motion.button
              onClick={onReset}
              disabled={isRecovering}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Reset
            </motion.button>

            <motion.button
              onClick={onReload}
              disabled={isRecovering}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Reload Page
            </motion.button>
          </div>

          {/* Loading Indicator */}
          <AnimatePresence>
            {isRecovering && (
              <motion.div
                className="mt-6 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-sm text-gray-600">Recovering...</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdvancedErrorBoundary; 