import { useContext } from 'react';
import { AuthContextType } from './authConstants';
import { AuthContext } from './AuthContext';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  return context;
}; 