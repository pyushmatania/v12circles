import { useState, useEffect, useMemo } from 'react';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'super_admin';
}

export const useAdminAuth = () => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock admin user
  const mockAdminUser = useMemo<AdminUser>(() => ({
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@circles.com',
    role: 'admin'
  }), []);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('admin_token');
        
        if (token) {
          // In a real app, validate token with backend
          setUser(mockAdminUser);
          setIsAuthenticated(true);
        }
      } catch (err) {
        setError('Authentication failed');
        console.error('Auth check failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [mockAdminUser]);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (username === 'admin' && password === 'admin') {
        const token = 'mock_admin_token_' + Date.now();
        localStorage.setItem('admin_token', token);
        setUser(mockAdminUser);
        setIsAuthenticated(true);
        return true;
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout
  };
};