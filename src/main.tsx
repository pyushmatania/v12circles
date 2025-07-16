import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import { initSentry } from './services/sentry';
import { debug } from './utils/debug';
import './index.css';

// 🚀 Initialize Sentry for error tracking
initSentry();

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

// 🎯 Root element validation
const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

// 🚀 Create and render the application
const root = createRoot(container);
root.render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
