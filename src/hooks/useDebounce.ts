import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * 🎯 useDebounce - Optimized debounce hook with enhanced performance
 * @description Debounces a value with configurable delay and cleanup
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds
 * @param options - Additional options for debouncing behavior
 */
export function useDebounce<T>(
  value: T, 
  delay: number, 
  options: {
    leading?: boolean;
    trailing?: boolean;
    maxWait?: number;
  } = {}
): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastCallTimeRef = useRef<number>(0);
  const { leading = false, trailing = true, maxWait } = options;

  // 🚀 Optimized debounce function
  const debounce = useCallback((newValue: T) => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTimeRef.current;
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Handle leading edge
    if (leading && timeSinceLastCall >= delay) {
      setDebouncedValue(newValue);
      lastCallTimeRef.current = now;
      return;
    }

    // Handle maxWait
    if (maxWait && timeSinceLastCall >= maxWait) {
      setDebouncedValue(newValue);
      lastCallTimeRef.current = now;
      return;
    }

    // Set trailing timeout
    if (trailing) {
      timeoutRef.current = setTimeout(() => {
        setDebouncedValue(newValue);
        lastCallTimeRef.current = Date.now();
        timeoutRef.current = null;
      }, delay);
    }
  }, [delay, leading, trailing, maxWait]);

  // 🚀 Optimized effect to handle value changes
  useEffect(() => {
    debounce(value);
    
    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [value, debounce]);

  // 🚀 Cleanup effect for better memory management
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);



  return debouncedValue;
}

/**
 * 🎯 useDebouncedCallback - Hook for debouncing function calls
 * @description Creates a debounced version of a callback function
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number,
  options: {
    leading?: boolean;
    trailing?: boolean;
    maxWait?: number;
  } = {}
): T {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastCallTimeRef = useRef<number>(0);
  const { leading = false, trailing = true, maxWait } = options;

  const debouncedCallback = useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTimeRef.current;
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Handle leading edge
    if (leading && timeSinceLastCall >= delay) {
      callback(...args);
      lastCallTimeRef.current = now;
      return;
    }

    // Handle maxWait
    if (maxWait && timeSinceLastCall >= maxWait) {
      callback(...args);
      lastCallTimeRef.current = now;
      return;
    }

    // Set trailing timeout
    if (trailing) {
      timeoutRef.current = setTimeout(() => {
        callback(...args);
        lastCallTimeRef.current = Date.now();
        timeoutRef.current = null;
      }, delay);
    }
  }, [callback, delay, leading, trailing, maxWait]) as T;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  return debouncedCallback;
} 