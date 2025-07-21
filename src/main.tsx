import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { initSentry } from './services/sentry';
import { debug } from './utils/debug';
import './index.css';

// 🚀 Initialize Sentry for error tracking
initSentry();

// 🛡️ Global error handler to catch React context issues
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  
  if (event.error && event.error.message && event.error.message.includes('useState')) {
    console.error('React useState error detected:', event.error);
    // Reload the page to recover from React context issues
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
  
  // Check for memory issues
  if (event.error && event.error.message && event.error.message.includes('out of memory')) {
    console.error('Memory error detected:', event.error);
  }
  
  // Check for network issues
  if (event.error && event.error.message && event.error.message.includes('fetch')) {
    console.error('Network error detected:', event.error);
  }
});

// 🛡️ Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// 🎯 Performance monitoring and development utilities
if (import.meta.env.DEV) {
  debug.info('🚀 Circles - Elite Performance Mode Active');
  debug.info('📊 Performance monitoring enabled');
  debug.info('🐛 Debug logging enabled');
  
  // 🚀 Performance monitoring setup
  window.addEventListener('load', () => {
    const loadTime = performance.now();
    debug.info(`⚡ Page load time: ${loadTime}ms`);
  });
}

// 🚀 Initialize development mode
if (import.meta.env.DEV) {
  debug.setEnabled(true);
}

// 🚀 Safe Performance Integration (non-blocking)
import { performanceIntegration } from './utils/performanceIntegration';

// 🧪 Performance Testing (development only)
if (import.meta.env.DEV) {
  import('./utils/performanceTest').catch(() => {
    // Silently fail if test module doesn't exist
  });
}

// 🛡️ Ensure React is properly loaded before proceeding
const ensureReactLoaded = () => {
  if (!React || !React.useState || !React.useMemo || !React.createContext) {
    console.error('❌ React is not properly loaded, retrying...');
    return false;
  }
  
  return true;
};

// 🎯 Root element validation
const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

// 🚀 Show loading state
container.innerHTML = `
  <div style="
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-family: system-ui, -apple-system, sans-serif;
  ">
    <div style="text-align: center;">
      <div style="
        width: 60px;
        height: 60px;
        border: 4px solid rgba(255,255,255,0.3);
        border-top: 4px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 20px;
      "></div>
      <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">Loading Circles...</div>
      <div style="font-size: 14px; opacity: 0.8;">Lights, Camera, Ownership!</div>
    </div>
  </div>
  <style>
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
`;

// 🚀 Create and render the application with React availability check
const renderApp = () => {
  if (!ensureReactLoaded()) {
    // Retry after a short delay
    setTimeout(renderApp, 100);
    return;
  }

  try {
    // Clear the loading state
    container.innerHTML = '';
    
    const root = createRoot(container);
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } catch (error) {
    console.error('❌ Failed to render app:', error);
    // Retry rendering after a delay
    setTimeout(renderApp, 500);
  }
};

// 🚀 Start the application with a small delay to ensure React is loaded
setTimeout(renderApp, 50);

// 🚀 Initialize performance optimizations after app is rendered (non-blocking)
setTimeout(() => {
  performanceIntegration.initialize().catch(error => {
    console.warn('[V12] Performance initialization failed, continuing normally:', error);
  });
}, 1000); // Wait 1 second after app renders
