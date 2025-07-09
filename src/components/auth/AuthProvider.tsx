import React, { useState, useEffect, ReactNode } from 'react';
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
    // Simulate checking for existing session
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('circles_token');
        
        if (token) {
          // In a real app, validate token with backend
          await new Promise(resolve => setTimeout(resolve, 1000));
          setUser(mockUser);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [mockUser]);

  const login = async (_email: string, _password: string, rememberMe = false) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock validation
      if (_email === 'demo@circles.com' && _password === 'password123') {
        const token = 'mock_jwt_token_' + Date.now();
        localStorage.setItem('circles_token', token);
        
        if (rememberMe) {
          localStorage.setItem('circles_remember', 'true');
        }
        
        setUser(mockUser);
      } else {
        throw new Error('Invalid credentials');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
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