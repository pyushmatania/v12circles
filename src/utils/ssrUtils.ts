// SSR-safe utility functions to prevent hydration mismatches

export const isClient = typeof window !== 'undefined';

export const isServer = typeof window === 'undefined';

// Safe localStorage access
export const getLocalStorage = (key: string): string | null => {
  if (isServer) return null;
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.warn('localStorage access failed:', error);
    return null;
  }
};

export const setLocalStorage = (key: string, value: string): void => {
  if (isServer) return;
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.warn('localStorage set failed:', error);
  }
};

export const removeLocalStorage = (key: string): void => {
  if (isServer) return;
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn('localStorage remove failed:', error);
  }
};

// Safe window access
export const getWindowDimensions = () => {
  if (isServer) {
    return { width: 0, height: 0 };
  }
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

// Safe navigator access
export const getNavigatorInfo = () => {
  if (isServer) {
    return {
      userAgent: '',
      language: 'en',
      onLine: true,
    };
  }
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    onLine: navigator.onLine,
  };
};

// Safe clipboard access
export const copyToClipboard = async (text: string): Promise<boolean> => {
  if (isServer) return false;
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    return false;
  } catch (error) {
    console.warn('Clipboard access failed:', error);
    return false;
  }
};

// Safe vibration access
export const vibrate = (pattern: number | number[]): boolean => {
  if (isServer) return false;
  try {
    if (navigator.vibrate) {
      return navigator.vibrate(pattern);
    }
    return false;
  } catch (error) {
    console.warn('Vibration failed:', error);
    return false;
  }
};

// Safe share API access
export const share = async (data: ShareData): Promise<boolean> => {
  if (isServer) return false;
  try {
    if (navigator.share) {
      await navigator.share(data);
      return true;
    }
    return false;
  } catch (error) {
    console.warn('Share API failed:', error);
    return false;
  }
};

// Safe scroll position
export const getScrollPosition = () => {
  if (isServer) return 0;
  return window.scrollY;
};

// Safe scroll to
export const scrollTo = (options: ScrollToOptions) => {
  if (isServer) return;
  window.scrollTo(options);
};

// Safe location access
export const getLocationInfo = () => {
  if (isServer) {
    return {
      href: '',
      origin: '',
      pathname: '',
    };
  }
  return {
    href: window.location.href,
    origin: window.location.origin,
    pathname: window.location.pathname,
  };
};

// Safe reload
export const reload = () => {
  if (isServer) return;
  window.location.reload();
};

// Safe redirect
export const redirect = (url: string) => {
  if (isServer) return;
  window.location.href = url;
};

// Safe open window
export const openWindow = (url: string, target?: string) => {
  if (isServer) return null;
  return window.open(url, target);
}; 