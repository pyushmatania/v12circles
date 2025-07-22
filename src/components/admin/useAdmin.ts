import { useContext } from 'react';
import { AdminContext } from './AdminContextTypes';

export const useAdmin = () => {
  const context = useContext(AdminContext);
  return context;
}; 