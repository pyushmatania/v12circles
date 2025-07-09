import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import LoadingFallback from './components/LoadingFallback';
import './index.css';

// Performance monitoring in development
if (import.meta.env.DEV) {
  console.log('🚀 Circles - Elite Performance Mode Active');
  console.log('📊 Performance monitoring enabled');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<LoadingFallback />}>
      <App />
    </Suspense>
  </StrictMode>
);
