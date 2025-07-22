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
  document.body.innerHTML = '<div style="color: red; padding: 20px;">React is not available. Please check your setup.</div>';
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
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  </div>
`;
document.body.appendChild(loadingScreen);

// 🚀 Render function
const renderApp = () => {
  // 🎯 Ensure scroll position starts from top
  window.scrollTo(0, 0);
  
  const root = ReactDOM.createRoot(document.getElementById('root')!);
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
};

// 🚀 Start the application with a small delay to ensure React is loaded
setTimeout(renderApp, 50);

// 🎯 Initialize scroll restoration
const cleanupScrollRestoration = initializeScrollRestoration();

// 🚀 Initialize performance optimizations after app is rendered (non-blocking)
setTimeout(() => {
  performanceIntegration.initialize().catch(error => {
    console.warn('[V12] Performance initialization failed, continuing normally:', error);
  });
}, 1000); // Wait 1 second after app renders
