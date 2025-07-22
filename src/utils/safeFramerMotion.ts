import React from 'react';

// Safe fallback components
const SafeMotion = ({ children, ...props }: any) => React.createElement('div', props, children);
const SafeAnimatePresence = ({ children }: any) => React.createElement(React.Fragment, {}, children);

// Try to import the real components
let motion: any = SafeMotion;
let AnimatePresence: any = SafeAnimatePresence;

// Dynamic import with fallback
const loadFramerMotion = async () => {
  try {
    const framerMotion = await import('framer-motion');
    motion = framerMotion.motion || SafeMotion;
    AnimatePresence = framerMotion.AnimatePresence || SafeAnimatePresence;
  } catch (error) {
    console.warn('Framer Motion not available, using fallbacks:', error);
  }
};

// Load immediately
loadFramerMotion();

export { motion, AnimatePresence }; 