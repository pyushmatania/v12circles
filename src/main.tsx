import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { checkReactAvailability } from './utils/reactCheck';
import { ThemeProvider } from './components/ThemeProvider';
import { AuthProvider } from './components/auth/AuthProvider';
import ErrorBoundary from './components/ErrorBoundary';

// 🎯 Scroll Utilities
import { initializeScrollRestoration } from './utils/scrollUtils';

// 🚀 Safe Performance Integration (non-blocking)
import { performanceIntegration } from './utils/performanceIntegration';

// 🚨 NUCLEAR FRAMER MOTION FALLBACK - Import this first to ensure it's available
import './utils/framerMotionFallback';

// 🚨 GLOBAL ERROR HANDLING
window.addEventListener('error', (event) => {
  console.error('🚨 Global Error:', event.error);
  console.error('🚨 Error Details:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  });
  
  // Show error on screen in production
  if (import.meta.env.PROD) {
    showErrorOnScreen('Global Error: ' + event.message);
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('🚨 Unhandled Promise Rejection:', event.reason);
  console.error('🚨 Promise Details:', {
    reason: event.reason,
    promise: event.promise
  });
  
  // Show error on screen in production
  if (import.meta.env.PROD) {
    showErrorOnScreen('Promise Error: ' + (event.reason?.message || event.reason));
  }
});

// 🚨 Function to show errors on screen
function showErrorOnScreen(message: string) {
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #1a1a1a;
    color: #ff4444;
    font-family: monospace;
    padding: 20px;
    z-index: 10000;
    overflow: auto;
    white-space: pre-wrap;
  `;
  errorDiv.innerHTML = `
    <h2>🚨 V12 Circles Error</h2>
    <p><strong>Error:</strong> ${message}</p>
    <p><strong>Time:</strong> ${new Date().toISOString()}</p>
    <p><strong>URL:</strong> ${window.location.href}</p>
    <p><strong>User Agent:</strong> ${navigator.userAgent}</p>
    <hr>
    <h3>Console Logs:</h3>
    <div id="console-logs"></div>
    <hr>
    <button onclick="window.location.reload()" style="padding: 10px 20px; background: #ff4444; color: white; border: none; border-radius: 5px; cursor: pointer;">
      Reload Page
    </button>
  `;
  document.body.appendChild(errorDiv);
  
  // Capture console logs
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;
  
  const logs: string[] = [];
  
  console.log = (...args) => {
    logs.push('LOG: ' + args.join(' '));
    originalLog.apply(console, args);
  };
  
  console.error = (...args) => {
    logs.push('ERROR: ' + args.join(' '));
    originalError.apply(console, args);
  };
  
  console.warn = (...args) => {
    logs.push('WARN: ' + args.join(' '));
    originalWarn.apply(console, args);
  };
  
  // Update logs every second
  setInterval(() => {
    const logsDiv = document.getElementById('console-logs');
    if (logsDiv) {
      logsDiv.textContent = logs.slice(-50).join('\n');
    }
  }, 1000);
}

// 🧪 Performance Testing (development only)
if (import.meta.env.DEV) {
  import('./utils/performanceTest').catch(() => {
    // Silently fail if test module doesn't exist
  });
  import('./utils/benchmarkTest').catch(() => {
    // Silently fail if test module doesn't exist
  });
}

// 🌐 Disable Service Worker in development to prevent offline issues
if (import.meta.env.DEV && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => {
      registration.unregister();
      console.log('🌐 Development: Service Worker disabled');
    });
  });
}

// 🎯 React availability check
const isReactAvailable = checkReactAvailability();
if (!isReactAvailable) {
  console.error('❌ React is not available');
  showErrorOnScreen('React is not available. Please check your setup.');
} else {
  console.log('✅ React is available and ready');
}

// 🎯 Loading screen
const loadingScreen = document.createElement('div');
loadingScreen.id = 'loading-screen';
loadingScreen.innerHTML = `
  <div style="
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    color: white;
    font-family: Arial, sans-serif;
  ">
    <div style="
      width: 60px;
      height: 60px;
      border: 4px solid rgba(255, 255, 255, 0.3);
      border-top: 4px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 20px;
    "></div>
    <div style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">V12 Circles</div>
    <div style="font-size: 14px; opacity: 0.8;">Loading your entertainment investment platform...</div>
    <div id="loading-status" style="font-size: 12px; opacity: 0.6; margin-top: 10px;">Initializing...</div>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  </div>
`;
document.body.appendChild(loadingScreen);

// 🚀 Render function with enhanced error handling
const renderApp = () => {
  try {
    console.log('🚀 Starting app render...');
    updateLoadingStatus('Creating React root...');
    
    // 🎯 Ensure scroll position starts from top
    window.scrollTo(0, 0);
    
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      throw new Error('Root element not found');
    }
    
    updateLoadingStatus('Initializing React...');
    const root = ReactDOM.createRoot(rootElement);
    
    updateLoadingStatus('Rendering components...');
    root.render(
      <React.StrictMode>
        <ThemeProvider>
          <AuthProvider>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </AuthProvider>
        </ThemeProvider>
      </React.StrictMode>
    );

    console.log('✅ App rendered successfully');
    updateLoadingStatus('App loaded successfully!');

    // Remove loading screen after render
    setTimeout(() => {
      const loadingScreen = document.getElementById('loading-screen');
      if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transition = 'opacity 0.5s ease-out';
        setTimeout(() => {
          loadingScreen.remove();
          // 🎯 Ensure scroll is at top after loading screen is removed
          window.scrollTo(0, 0);
        }, 500);
      }
    }, 1000);
    
  } catch (error) {
    console.error('🚨 Render error:', error);
    showErrorOnScreen('Render Error: ' + (error instanceof Error ? error.message : String(error)));
  }
};

// 🎯 Function to update loading status
function updateLoadingStatus(message: string) {
  const statusElement = document.getElementById('loading-status');
  if (statusElement) {
    statusElement.textContent = message;
  }
  console.log('📊 Loading Status:', message);
}

// 🚀 Start the application with enhanced error handling
try {
  console.log('🚀 Starting V12 Circles application...');
  updateLoadingStatus('Starting application...');
  
  setTimeout(() => {
    try {
      renderApp();
    } catch (error) {
      console.error('🚨 Delayed render error:', error);
      showErrorOnScreen('Delayed Render Error: ' + (error instanceof Error ? error.message : String(error)));
    }
  }, 100);
  
} catch (error) {
  console.error('🚨 Startup error:', error);
  showErrorOnScreen('Startup Error: ' + (error instanceof Error ? error.message : String(error)));
}

// 🎯 Initialize scroll restoration
try {
  const cleanupScrollRestoration = initializeScrollRestoration();
  console.log('✅ Scroll restoration initialized');
} catch (error) {
  console.error('🚨 Scroll restoration error:', error);
}

// 🚀 Initialize performance optimizations after app is rendered (non-blocking)
setTimeout(() => {
  try {
    performanceIntegration.initialize().catch(error => {
      console.warn('[V12] Performance initialization failed, continuing normally:', error);
    });
  } catch (error) {
    console.error('🚨 Performance integration error:', error);
  }
}, 1000); // Wait 1 second after app renders
