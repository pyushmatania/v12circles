// 🌐 Network Status Detection Utility
// Fixes offline detection issues in development

import React from 'react';

class NetworkStatusManager {
  private isOnline = navigator.onLine;
  private listeners: Array<(online: boolean) => void> = [];

  constructor() {
    this.initialize();
  }

  private initialize() {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifyListeners(true);
      console.log('🌐 Network: Online');
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyListeners(false);
      console.log('🌐 Network: Offline');
    });

    // In development, force online status
    if (import.meta.env.DEV) {
      this.isOnline = true;
      console.log('🌐 Development: Forcing online status');
    }
  }

  private notifyListeners(online: boolean) {
    this.listeners.forEach(listener => listener(online));
  }

  public getOnlineStatus(): boolean {
    return this.isOnline;
  }

  public addListener(callback: (online: boolean) => void) {
    this.listeners.push(callback);
    // Immediately call with current status
    callback(this.isOnline);
  }

  public removeListener(callback: (online: boolean) => void) {
    const index = this.listeners.indexOf(callback);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  public async checkConnectivity(): Promise<boolean> {
    try {
      // Try to fetch a small resource to test connectivity
      const response = await fetch('/favicon.ico', { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      return response.ok;
    } catch (error) {
      console.warn('🌐 Connectivity check failed:', error);
      return false;
    }
  }
}

// Global network status manager
export const networkStatus = new NetworkStatusManager();

// React hook for network status
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = React.useState(networkStatus.getOnlineStatus());

  React.useEffect(() => {
    const handleStatusChange = (online: boolean) => {
      setIsOnline(online);
    };

    networkStatus.addListener(handleStatusChange);

    return () => {
      networkStatus.removeListener(handleStatusChange);
    };
  }, []);

  return isOnline;
};

// Utility function to check if we're in development
export const isDevelopment = () => {
  return import.meta.env.DEV;
};

// Utility function to check if we're in production
export const isProduction = () => {
  return import.meta.env.PROD;
}; 