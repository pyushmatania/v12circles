import * as React from 'react';
import { useState, useEffect, ReactNode } from 'react';
import { User, MOCK_USER, AuthContextType } from './authConstants';
import { AuthContext } from './AuthContext';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock user data for demonstration
  const mockUser: User = MOCK_USER;

  useEffect(() => {
    // Keep user logged in by default
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        // Always set user as logged in by default
        await new Promise(resolve => setTimeout(resolve, 500)); // Reduced delay
        setUser(mockUser);
        
        // Ensure token is set in localStorage
        if (!localStorage.getItem('circles_token')) {
          const token = 'mock_jwt_token_' + Date.now();
          localStorage.setItem('circles_token', token);
          localStorage.setItem('circles_remember', 'true');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Even if there's an error, still keep user logged in
        setUser(mockUser);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [mockUser]);

  // Safety check for React availability - after all hooks are called
  if (typeof React === 'undefined' || !React.useState) {
    console.error('React is not properly loaded in AuthProvider');
    return <div>Loading authentication...</div>;
  }

  const login = async (_email: string, _password: string, rememberMe = false) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Always succeed for demo purposes
      const token = 'mock_jwt_token_' + Date.now();
      localStorage.setItem('circles_token', token);
      
      if (rememberMe) {
        localStorage.setItem('circles_remember', 'true');
      }
      
      setUser(mockUser);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newUser: User = {
        ...mockUser,
        id: Date.now().toString(),
        email,
        name,
        joinDate: new Date().toISOString(),
        investmentCount: 0,
        totalInvested: 0,
        bio: '',
        location: ''
      };
      
      const token = 'mock_jwt_token_' + Date.now();
      localStorage.setItem('circles_token', token);
      setUser(newUser);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear all auth-related data
    localStorage.removeItem('circles_token');
    localStorage.removeItem('circles_remember');
    
    // Set user to null and force a re-render
    setUser(null);
    
    // Add a small delay to ensure state updates properly
    setTimeout(() => {
      localStorage.setItem('logout_timestamp', Date.now().toString());
    }, 100);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser({ ...user, ...updates });
    } finally {
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const resetPassword = async (_email: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    // In real app, send reset email
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const changePassword = async (_currentPassword: string, _newPassword: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    // In real app, validate current password and update
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    resetPassword,
    changePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};