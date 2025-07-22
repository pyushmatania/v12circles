import { useEffect, useState, useCallback } from 'react';

interface ServiceWorkerState {
  isSupported: boolean;
  isInstalled: boolean;
  isActive: boolean;
  isUpdating: boolean;
  version: string;
  error: string | null;
}

interface PreloadConfig {
  routes: string[];
  components: string[];
  images: string[];
  priority: 'high' | 'medium' | 'low';
}

export const useServiceWorker = () => {
  const [swState, setSwState] = useState<ServiceWorkerState>({
    isSupported: 'serviceWorker' in navigator,
    isInstalled: false,
    isActive: false,
    isUpdating: false,
    version: '',
    error: null
  });

  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  // Register service worker
  const registerSW = useCallback(async () => {
    if (!swState.isSupported) {
      setSwState(prev => ({ ...prev, error: 'Service Worker not supported' }));
      return;
    }

    try {
      const reg = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      });

      setRegistration(reg);
      setSwState(prev => ({ 
        ...prev, 
        isInstalled: true,
        version: reg.active?.scriptURL || ''
      }));

      // Listen for updates
      reg.addEventListener('updatefound', () => {
        setSwState(prev => ({ ...prev, isUpdating: true }));
        
        const newWorker = reg.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available
              setSwState(prev => ({ ...prev, isUpdating: false }));
              // Optionally show update notification
              showUpdateNotification();
            }
          });
        }
      });

      // Listen for controller change
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setSwState(prev => ({ ...prev, isActive: true }));
        window.location.reload(); // Reload to get new content
      });

      console.log('[SW] Service Worker registered successfully');
    } catch (error) {
      console.error('[SW] Registration failed:', error);
      setSwState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Registration failed' 
      }));
    }
  }, [swState.isSupported]);

  // Netflix-style preloading
  const preloadContent = useCallback(async (config: PreloadConfig) => {
    if (!registration || !swState.isActive) return;

    try {
      // Preload critical routes
      if (config.routes.length > 0) {
        await Promise.all(
          config.routes.map(route => 
            fetch(route, { method: 'HEAD' })
          )
        );
      }

      // Preload components (lazy load)
      if (config.components.length > 0) {
        config.components.forEach(component => {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = component;
          document.head.appendChild(link);
        });
      }

      // Preload critical images
      if (config.images.length > 0) {
        config.images.forEach(imageSrc => {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = imageSrc;
          document.head.appendChild(link);
        });
      }

      console.log('[SW] Content preloaded successfully');
    } catch (error) {
      console.error('[SW] Preloading failed:', error);
    }
  }, [registration, swState.isActive]);

  // Preload based on user behavior patterns
  const preloadBasedOnPattern = useCallback((userPattern: string) => {
    const preloadConfigs = {
      'project-explorer': {
        routes: ['/projects', '/projects/[id]'],
        components: ['/components/ProjectCard', '/components/ProjectDetail'],
        images: ['/images/project-thumbnails'],
        priority: 'high' as const
      },
      'community-user': {
        routes: ['/community', '/community/hub'],
        components: ['/components/Community', '/components/Chat'],
        images: ['/images/community-avatars'],
        priority: 'high' as const
      },
      'investor': {
        routes: ['/dashboard', '/portfolio'],
        components: ['/components/Dashboard', '/components/Analytics'],
        images: ['/images/charts', '/images/portfolio'],
        priority: 'high' as const
      },
      'casual-browser': {
        routes: ['/'],
        components: ['/components/Hero', '/components/ProjectShowcase'],
        images: ['/images/hero', '/images/featured'],
        priority: 'medium' as const
      }
    };

    const config = preloadConfigs[userPattern as keyof typeof preloadConfigs];
    if (config) {
      preloadContent(config);
    }
  }, [preloadContent]);

  // Preload critical images
  const preloadCriticalImages = useCallback(() => {
    const criticalImages = [
      '/images/hero-bg.jpg',
      '/images/circles-logo-main.png',
      '/images/featured-project-1.jpg',
      '/images/featured-project-2.jpg'
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }, []);

  // Show update notification
  const showUpdateNotification = useCallback(() => {
    // Create update notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    notification.innerHTML = `
      <div class="flex items-center gap-2">
        <span>🔄 New version available</span>
        <button onclick="window.location.reload()" class="bg-white text-blue-600 px-2 py-1 rounded text-sm">
          Update
        </button>
        <button onclick="this.parentElement.parentElement.remove()" class="text-white/80 hover:text-white">
          ✕
        </button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 10000);
  }, []);

  // Skip waiting for new service worker
  const skipWaiting = useCallback(() => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }, [registration]);

  // Get service worker version
  const getVersion = useCallback(async () => {
    if (!registration) return '';

    return new Promise<string>((resolve) => {
      const channel = new MessageChannel();
      channel.port1.onmessage = (event) => {
        resolve(event.data.version || '');
      };
      
      if (registration.active) {
        registration.active.postMessage({ type: 'GET_VERSION' }, [channel.port2]);
      } else {
        resolve('');
      }
    });
  }, [registration]);

  // Initialize service worker
  useEffect(() => {
    if (swState.isSupported && !registration) {
      registerSW();
    }
  }, [swState.isSupported, registration, registerSW]);

  // Check if service worker is active
  useEffect(() => {
    if (registration) {
      setSwState(prev => ({ 
        ...prev, 
        isActive: !!navigator.serviceWorker.controller 
      }));
    }
  }, [registration]);

  // Preload critical content on mount
  useEffect(() => {
    if (swState.isActive) {
      preloadCriticalImages();
      
      // Preload based on current route
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/projects')) {
        preloadBasedOnPattern('project-explorer');
      } else if (currentPath.startsWith('/community')) {
        preloadBasedOnPattern('community-user');
      } else if (currentPath.startsWith('/dashboard')) {
        preloadBasedOnPattern('investor');
      } else {
        preloadBasedOnPattern('casual-browser');
      }
    }
  }, [swState.isActive, preloadCriticalImages, preloadBasedOnPattern]);

  return {
    ...swState,
    registration,
    registerSW,
    preloadContent,
    preloadBasedOnPattern,
    preloadCriticalImages,
    skipWaiting,
    getVersion
  };
};

// Hook for background sync
export const useBackgroundSync = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    setIsSupported('serviceWorker' in navigator && 'sync' in (window.ServiceWorkerRegistration.prototype as ServiceWorkerRegistration & { sync?: unknown }));
  }, []);

  const registerBackgroundSync = useCallback(async (tag: string) => {
    if (!isSupported) return false;

    try {
      const registration = await navigator.serviceWorker.ready;
      await (registration as ServiceWorkerRegistration & { sync: { register(tag: string): Promise<void> } }).sync.register(tag);
      setIsRegistered(true);
      return true;
    } catch (error) {
      console.error('[SW] Background sync registration failed:', error);
      return false;
    }
  }, [isSupported]);

  return {
    isSupported,
    isRegistered,
    registerBackgroundSync
  };
};

// Hook for push notifications
export const usePushNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  useEffect(() => {
    setIsSupported('serviceWorker' in navigator && 'PushManager' in window);
    setPermission(Notification.permission);
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isSupported) return false;

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (error) {
      console.error('[SW] Push permission request failed:', error);
      return false;
    }
  }, [isSupported]);

  const subscribeToPush = useCallback(async (vapidPublicKey: string) => {
    if (!isSupported || permission !== 'granted') return null;

    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey
      });
      
      setSubscription(sub);
      return sub;
    } catch (error) {
      console.error('[SW] Push subscription failed:', error);
      return null;
    }
  }, [isSupported, permission]);

  const unsubscribeFromPush = useCallback(async () => {
    if (subscription) {
      await subscription.unsubscribe();
      setSubscription(null);
    }
  }, [subscription]);

  return {
    isSupported,
    permission,
    subscription,
    requestPermission,
    subscribeToPush,
    unsubscribeFromPush
  };
}; 