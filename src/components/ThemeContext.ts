import { createContext, useContext } from 'react';

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
export type { ThemeContextType };

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 