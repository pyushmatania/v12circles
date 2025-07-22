import React from 'react';

// 🚨 NUCLEAR FALLBACK SYSTEM FOR FRAMER MOTION
// This ensures AnimatePresence and motion are ALWAYS available

// Fallback AnimatePresence component
const FallbackAnimatePresence: React.FC<{ children: React.ReactNode; mode?: string; key?: string }> = ({ children }) => {
  return <React.Fragment>{children}</React.Fragment>;
};

// Create a proper motion component with all HTML elements
const createMotionComponent = () => {
  const MotionComponent = React.forwardRef<HTMLElement, any>(({ children, as = 'div', ...props }, ref) => {
    return React.createElement(as, { ...props, ref }, children);
  });

  // Add all HTML element properties
  const motion = MotionComponent as any;
  motion.div = (props: any) => React.createElement('div', props);
  motion.button = (props: any) => React.createElement('button', props);
  motion.span = (props: any) => React.createElement('span', props);
  motion.p = (props: any) => React.createElement('p', props);
  motion.h1 = (props: any) => React.createElement('h1', props);
  motion.h2 = (props: any) => React.createElement('h2', props);
  motion.h3 = (props: any) => React.createElement('h3', props);
  motion.h4 = (props: any) => React.createElement('h4', props);
  motion.h5 = (props: any) => React.createElement('h5', props);
  motion.h6 = (props: any) => React.createElement('h6', props);
  motion.section = (props: any) => React.createElement('section', props);
  motion.article = (props: any) => React.createElement('article', props);
  motion.nav = (props: any) => React.createElement('nav', props);
  motion.header = (props: any) => React.createElement('header', props);
  motion.footer = (props: any) => React.createElement('footer', props);
  motion.main = (props: any) => React.createElement('main', props);
  motion.aside = (props: any) => React.createElement('aside', props);
  motion.form = (props: any) => React.createElement('form', props);
  motion.input = (props: any) => React.createElement('input', props);
  motion.label = (props: any) => React.createElement('label', props);
  motion.ul = (props: any) => React.createElement('ul', props);
  motion.ol = (props: any) => React.createElement('ol', props);
  motion.li = (props: any) => React.createElement('li', props);
  motion.a = (props: any) => React.createElement('a', props);
  motion.img = (props: any) => React.createElement('img', props);
  motion.svg = (props: any) => React.createElement('svg', props);
  motion.path = (props: any) => React.createElement('path', props);
  motion.circle = (props: any) => React.createElement('circle', props);
  motion.rect = (props: any) => React.createElement('rect', props);

  return motion;
};

const FallbackMotion = createMotionComponent();

// Global variables to store the real components
let realMotion: any = null;
let realAnimatePresence: any = null;
let isLoaded = false;

// Try to load Framer Motion
const loadFramerMotion = async () => {
  try {
    const framerMotion = await import('framer-motion');
    realMotion = framerMotion.motion;
    realAnimatePresence = framerMotion.AnimatePresence;
    isLoaded = true;
    console.log('✅ Framer Motion loaded successfully');
  } catch (error) {
    console.error('🚨 Framer Motion failed to load, using fallbacks:', error);
    realMotion = FallbackMotion;
    realAnimatePresence = FallbackAnimatePresence;
    isLoaded = true;
  }
};

// Start loading immediately
loadFramerMotion();

// Export components that always work
export const motion = new Proxy(FallbackMotion, {
  get(target, prop) {
    if (realMotion && isLoaded) {
      return realMotion[prop as keyof typeof realMotion];
    }
    return target[prop as keyof typeof target] || target;
  }
});

export const AnimatePresence = realAnimatePresence || FallbackAnimatePresence;

// Hook to check if Framer Motion is loaded
export const useFramerMotionStatus = () => {
  const [status, setStatus] = React.useState({ isLoaded, hasRealMotion: !!realMotion });
  
  React.useEffect(() => {
    const checkStatus = () => {
      setStatus({ isLoaded, hasRealMotion: !!realMotion });
    };
    
    const interval = setInterval(checkStatus, 100);
    return () => clearInterval(interval);
  }, []);
  
  return status;
};

// Force reload Framer Motion
export const reloadFramerMotion = () => {
  isLoaded = false;
  realMotion = null;
  realAnimatePresence = null;
  loadFramerMotion();
}; 