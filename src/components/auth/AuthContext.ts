import { createContext } from 'react';
import { AuthContextType } from './authConstants';
 
export const AuthContext = createContext<AuthContextType | undefined>(undefined); 