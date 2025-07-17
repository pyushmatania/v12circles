import React from 'react';

/**
 * React Availability Check Utility
 * Prevents the "Cannot read properties of null (reading 'useState')" error
 */

export const checkReactAvailability = (): boolean => {
  try {
    console.log('🔍 React availability check details:');
    console.log('  - React type:', typeof React);
    console.log('  - React is null:', React === null);
    console.log('  - React is undefined:', React === undefined);
    
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
      console.log('  - React.useState type:', typeof React.useState);
      return false;
    }

    // Check if React.createContext is available
    if (typeof React.createContext !== 'function') {
      console.error('❌ React.createContext is not available');
      console.log('  - React.createContext type:', typeof React.createContext);
      return false;
    }

    // Check if we're in a React context
    if (typeof window !== 'undefined' && !(window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      console.warn('⚠️ React DevTools not detected - may indicate React context issues');
    }

    console.log('✅ React availability check passed');
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