import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import LoadingFallback from './components/LoadingFallback';
import { ErrorBoundary } from './components/ErrorBoundary';
import { initSentry } from './services/sentry';
import { debug } from './utils/debug';
import './index.css';

// Initialize Sentry for error tracking
initSentry();

// Performance monitoring in development
if (import.meta.env.DEV) {
  console.log('🚀 Circles - Elite Performance Mode Active');
  console.log('📊 Performance monitoring enabled');
  console.log('🐛 Debug logging enabled');
  debug.info('Application starting in development mode');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <App />
      </Suspense>
    </ErrorBoundary>
  </StrictMode>
);
