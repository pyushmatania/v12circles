import React, { useState, useEffect, ReactNode } from 'react';
import { ThemeContext, ThemeContextType } from './ThemeContext';

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
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
};

export { ThemeProvider };