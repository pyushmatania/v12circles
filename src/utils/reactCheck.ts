import React from 'react';

/**
 * React Availability Check Utility
 * Prevents the "Cannot read properties of null (reading 'useState')" error
 */

export const checkReactAvailability = (): boolean => {
  try {
    // Check if React is available
    if (typeof React === 'undefined') {
      console.error('❌ React is not defined');
      return false;
    }

    if (React === null) {
      console.error('❌ React is null');
      return false;
    }

    // Check if React.useState is available
    if (typeof React.useState !== 'function') {
      console.error('❌ React.useState is not available');
      return false;
    }

    // Check if React.useMemo is available
    if (typeof React.useMemo !== 'function') {
      console.error('❌ React.useMemo is not available');
      return false;
    }

    // Check if React.createContext is available
    if (typeof React.createContext !== 'function') {
      console.error('❌ React.createContext is not available');
      return false;
    }

    // Check if we're in a React context
    if (typeof window !== 'undefined' && !(window as { __REACT_DEVTOOLS_GLOBAL_HOOK__?: unknown }).__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      console.warn('⚠️ React DevTools not detected - may indicate React context issues');
    }

    return true;
  } catch (error) {
    console.error('❌ Error checking React availability:', error);
    return false;
  }
};

export const withReactCheck = <P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> => {
  return (props: P) => {
    if (!checkReactAvailability()) {
      return React.createElement('div', null, 'Loading React...');
    }
    return React.createElement(Component, props);
  };
}; 