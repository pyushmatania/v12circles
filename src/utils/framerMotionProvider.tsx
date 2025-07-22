import React, { createContext, useContext, useEffect, useState } from 'react';

// Global Framer Motion context
interface FramerMotionContextType {
  motion: any;
  AnimatePresence: any;
  isLoaded: boolean;
}

const FramerMotionContext = createContext<FramerMotionContextType>({
  motion: null,
  AnimatePresence: null,
  isLoaded: false
});

export const useFramerMotion = () => useContext(FramerMotionContext);

interface FramerMotionProviderProps {
  children: React.ReactNode;
}

export const FramerMotionProvider: React.FC<FramerMotionProviderProps> = ({ children }) => {
  const [framerMotion, setFramerMotion] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load Framer Motion dynamically
    import('framer-motion').then((module) => {
      setFramerMotion(module);
      setIsLoaded(true);
      console.log('✅ Framer Motion loaded successfully');
    }).catch((error) => {
      console.error('🚨 Failed to load Framer Motion:', error);
      // Create fallback components
      setFramerMotion({
        motion: ({ children, ...props }: any) => React.createElement('div', props, children),
        AnimatePresence: ({ children }: any) => React.createElement(React.Fragment, {}, children)
      });
      setIsLoaded(true);
    });
  }, []);

  const value = {
    motion: framerMotion?.motion || (({ children, ...props }: any) => React.createElement('div', props, children)),
    AnimatePresence: framerMotion?.AnimatePresence || (({ children }: any) => React.createElement(React.Fragment, {}, children)),
    isLoaded
  };

  return (
    <FramerMotionContext.Provider value={value}>
      {children}
    </FramerMotionContext.Provider>
  );
}; 