import { useState, useCallback, useRef, useEffect, useMemo } from 'react';

// 🛡️ Type definitions for better type safety
interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
  timestamp: number;
}

interface ToastOptions {
  duration?: number;
  persistent?: boolean;
}

type ToastType = Toast['type'];

/**
 * 🎯 useToast - Optimized toast notification hook with enhanced performance
 * @description Manages toast notifications with auto-dismiss, queue management, and performance optimizations
 */
export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastTimeouts = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const removeToastRef = useRef<((id: string) => void) | null>(null);
  const maxToasts = 5; // Prevent too many toasts from overwhelming the UI

  // 🚀 Optimized toast addition with queue management and performance improvements
  const addToast = useCallback((toast: Omit<Toast, 'id' | 'timestamp'>, options: ToastOptions = {}) => {
    const id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9);
    const timestamp = Date.now();
    const newToast: Toast = { 
      ...toast, 
      id, 
      timestamp,
      duration: options.duration ?? toast.duration ?? 5000
    };

    setToasts(prev => {
      // Limit the number of toasts with better performance
      const updatedToasts = [...prev, newToast];
      return updatedToasts.length > maxToasts 
        ? updatedToasts.slice(-maxToasts) 
        : updatedToasts;
    });

    // Auto-dismiss toast unless persistent
    if (!options.persistent && newToast.duration && newToast.duration > 0) {
      const timeout = setTimeout(() => {
        if (removeToastRef.current) {
          removeToastRef.current(id);
        }
      }, newToast.duration);
      
      toastTimeouts.current.set(id, timeout);
    }

    return id;
  }, []);

  // 🚀 Optimized toast removal with cleanup
  const removeToast = useCallback((id: string) => {
    // Clear timeout if exists
    const timeout = toastTimeouts.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      toastTimeouts.current.delete(id);
    }

    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Store removeToast in ref for use in addToast
  removeToastRef.current = removeToast;

  // 🚀 Optimized toast methods with better type safety
  const toast = useMemo(() => ({
    success: (title: string, message?: string, options?: ToastOptions) => 
      addToast({ type: 'success', title, message }, options),
    error: (title: string, message?: string, options?: ToastOptions) => 
      addToast({ type: 'error', title, message }, options),
    info: (title: string, message?: string, options?: ToastOptions) => 
      addToast({ type: 'info', title, message }, options),
    warning: (title: string, message?: string, options?: ToastOptions) => 
      addToast({ type: 'warning', title, message }, options),
    custom: (type: ToastType, title: string, message?: string, options?: ToastOptions) => 
      addToast({ type, title, message }, options)
  }), [addToast]);

  // 🚀 Clear all toasts
  const clearAllToasts = useCallback(() => {
    // Clear all timeouts
    toastTimeouts.current.forEach(timeout => clearTimeout(timeout));
    toastTimeouts.current.clear();
    setToasts([]);
  }, []);

  // 🚀 Remove oldest toast
  const removeOldestToast = useCallback(() => {
    setToasts(prev => {
      if (prev.length === 0) return prev;
      const oldestToast = prev[0];
      removeToast(oldestToast.id);
      return prev.slice(1);
    });
  }, [removeToast]);

  // 🚀 Get toast count
  const toastCount = useMemo(() => toasts.length, [toasts]);

  // 🚀 Check if toast exists
  const hasToast = useCallback((id: string) => {
    return toasts.some(toast => toast.id === id);
  }, [toasts]);

  // 🚀 Update toast
  const updateToast = useCallback((id: string, updates: Partial<Omit<Toast, 'id' | 'timestamp'>>) => {
    setToasts(prev => 
      prev.map(toast => 
        toast.id === id ? { ...toast, ...updates } : toast
      )
    );
  }, []);

  // 🚀 Cleanup on unmount
  useEffect(() => {
    const timeouts = toastTimeouts.current;
    return () => {
      // Clear all timeouts on cleanup
      timeouts.forEach(timeout => clearTimeout(timeout));
      timeouts.clear();
    };
  }, []);

  return {
    toasts,
    toast,
    removeToast,
    clearAllToasts,
    removeOldestToast,
    toastCount,
    hasToast,
    updateToast
  };
};