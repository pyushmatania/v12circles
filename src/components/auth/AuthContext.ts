import { createContext } from 'react';
import { AuthContextType } from './authConstants';

// Create a default context value that matches the expected type
const defaultAuthContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateProfile: async () => {},
  resetPassword: async () => {},
  changePassword: async () => {}
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext); 