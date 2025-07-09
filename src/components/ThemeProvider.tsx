import React, { useState, useEffect } from 'react';
import { ThemeContext } from './ThemeContext';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [currentGradient, setCurrentGradient] = useState(0);

  useEffect(() => {
    const savedTheme = localStorage.getItem('circles-theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('circles-theme', theme);
    document.documentElement.classList.toggle('light', theme === 'light');
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
    document.documentElement.setAttribute('data-gradient', currentGradient.toString());
  }, [currentGradient]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, currentGradient }}>
      {children}
    </ThemeContext.Provider>
  );
};