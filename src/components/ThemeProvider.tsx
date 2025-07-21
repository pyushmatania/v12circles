import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  currentGradient: number;
}

const defaultThemeContext: ThemeContextType = {
  theme: 'dark',
  toggleTheme: () => {},
  currentGradient: 0
};

export const ThemeContext = createContext<ThemeContextType>(defaultThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

// Fallback component that doesn't use React hooks
const ThemeProviderFallback: React.FC<ThemeProviderProps> = ({ children }) => {
  // Apply default dark theme to document
  try {
    document.documentElement.classList.remove('light');
    document.documentElement.setAttribute('data-gradient', '0');
  } catch (error) {
    console.warn('Failed to apply fallback theme:', error);
  }

  return (
    <ThemeContext.Provider value={defaultThemeContext}>
      {children}
    </ThemeContext.Provider>
  );
};

// Create a wrapper component to handle potential React context issues
const ThemeProviderWrapper: React.FC<ThemeProviderProps> = ({ children }) => {
  try {
    // Ensure React is properly imported
    if (!React || !React.useState) {
      console.error('React.useState is not available, using fallback');
      return <ThemeProviderFallback>{children}</ThemeProviderFallback>;
    }

    const [theme, setTheme] = useState<'light' | 'dark'>('dark');
    const [currentGradient, setCurrentGradient] = useState(0);

    useEffect(() => {
      try {
        const savedTheme = localStorage.getItem('circles-theme') as 'light' | 'dark';
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
          setTheme(savedTheme);
        }
      } catch (error) {
        console.warn('Failed to load theme from localStorage:', error);
      }
    }, []);

    useEffect(() => {
      try {
        localStorage.setItem('circles-theme', theme);
        document.documentElement.classList.toggle('light', theme === 'light');
      } catch (error) {
        console.warn('Failed to save theme to localStorage:', error);
      }
    }, [theme]);

    // Auto-cycle through gradient themes every 4 seconds
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentGradient((prev) => (prev + 1) % 5); // 5 total gradients (0-4)
      }, 4000);

      return () => clearInterval(interval);
    }, []);

    // Apply current gradient to document
    useEffect(() => {
      try {
        document.documentElement.setAttribute('data-gradient', currentGradient.toString());
      } catch (error) {
        console.warn('Failed to set gradient attribute:', error);
      }
    }, [currentGradient]);

    const toggleTheme = () => {
      setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const contextValue: ThemeContextType = {
      theme,
      toggleTheme,
      currentGradient
    };

    return (
      <ThemeContext.Provider value={contextValue}>
        {children}
      </ThemeContext.Provider>
    );
  } catch (error) {
    console.error('ThemeProvider error:', error);
    // Fallback to default context if there's an error
    return <ThemeProviderFallback>{children}</ThemeProviderFallback>;
  }
};

export const ThemeProvider = ThemeProviderWrapper;