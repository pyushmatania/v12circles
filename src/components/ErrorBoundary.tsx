import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to console
    console.error('🚨 ErrorBoundary caught an error:', error, errorInfo);
    
    // Log additional debugging information
    console.error('🚨 Error stack:', error.stack);
    console.error('🚨 Component stack:', errorInfo.componentStack);
    
    // Check for common React errors
    if (error.message.includes('useState') || error.message.includes('useEffect')) {
      console.error('🚨 React Hook error detected - this might be a React context issue');
    }
    
    if (error.message.includes('Maximum update depth exceeded')) {
      console.error('🚨 Infinite re-render detected - check for circular dependencies');
    }

    // Update state with error info
    this.setState({ errorInfo });
    
    // In a production app, you would log this to an error reporting service
    // logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
          <div className="max-w-4xl w-full bg-gray-800 shadow-lg rounded-lg p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg 
                  className="h-6 w-6 text-red-600"
                  fill="none" 
                  viewBox="0 0 24 24"
                  stroke="currentColor" 
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-red-400 mb-2">
                🚨 V12 Circles Error
              </h3>
              <p className="text-sm text-gray-300 mb-4">
                Something unexpected happened. Here are the details to help debug the issue.
              </p>
              
              {/* Error Details - Always show in production for debugging */}
              {this.state.error && (
                <div className="text-left bg-gray-900 p-4 rounded-lg mb-4">
                  <h4 className="text-sm font-medium text-red-400 mb-2">Error Message:</h4>
                  <pre className="text-xs text-red-300 bg-gray-950 p-3 rounded overflow-auto max-h-32">
                    {this.state.error.toString()}
                  </pre>
                  
                  {this.state.error.stack && (
                    <>
                      <h4 className="text-sm font-medium text-red-400 mb-2 mt-4">Error Stack:</h4>
                      <pre className="text-xs text-gray-300 bg-gray-950 p-3 rounded overflow-auto max-h-32">
                        {this.state.error.stack}
                      </pre>
                    </>
                  )}
                  
                  {this.state.errorInfo && (
                    <>
                      <h4 className="text-sm font-medium text-red-400 mb-2 mt-4">Component Stack:</h4>
                      <pre className="text-xs text-gray-300 bg-gray-950 p-3 rounded overflow-auto max-h-32">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </>
                  )}
                </div>
              )}
              
              {/* Environment Info */}
              <div className="text-left bg-gray-900 p-4 rounded-lg mb-4">
                <h4 className="text-sm font-medium text-blue-400 mb-2">Environment Info:</h4>
                <div className="text-xs text-gray-300 space-y-1">
                  <div><strong>URL:</strong> {window.location.href}</div>
                  <div><strong>User Agent:</strong> {navigator.userAgent}</div>
                  <div><strong>Time:</strong> {new Date().toISOString()}</div>
                  <div><strong>Environment:</strong> {import.meta.env.PROD ? 'Production' : 'Development'}</div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  🔄 Refresh Page
                </button>
                <button
                  type="button"
                  onClick={() => {
                    console.clear();
                    console.log('🚨 Error Details:', {
                      error: this.state.error,
                      errorInfo: this.state.errorInfo,
                      url: window.location.href,
                      userAgent: navigator.userAgent,
                      time: new Date().toISOString()
                    });
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  📋 Log to Console
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 