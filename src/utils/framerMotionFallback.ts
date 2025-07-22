import React from 'react';

// Simple fallback components for when framer-motion fails to load
export const AnimatePresence = ({ children }: any) => React.createElement(React.Fragment, {}, children);

// Export motion from framer-motion if available, otherwise use fallback
let motion: any;
try {
  const framerMotion = require('framer-motion');
  motion = framerMotion.motion;
} catch {
  motion = ({ children, ...props }: any) => React.createElement('div', props, children);
}

export { motion }; 