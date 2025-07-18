export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  location?: string;
  joinDate: string;
  investmentCount: number;
  totalInvested: number;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  preferences: {
    notifications: boolean;
    newsletter: boolean;
    twoFactor: boolean;
  };
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

export const MOCK_USER: User = {
  id: '1',
  email: 'pyushmatania@gmail.com',
  name: 'Akash Matania',
  avatar: '/images/akash-matania.JPG',
  bio: 'Passionate about supporting innovative entertainment projects. Film enthusiast and early investor in emerging talent.',
  location: 'Bangalore, India',
  joinDate: '2025-07-01',
  investmentCount: 12,
  totalInvested: 450000,
  socialLinks: {
    twitter: 'https://twitter.com/akash_matania',
    linkedin: 'https://www.linkedin.com/in/akash-matania-ba5b77276/',
    instagram: 'https://www.instagram.com/akashmatania/'
  },
  preferences: {
    notifications: true,
    newsletter: true,
    twoFactor: false
  }
}; 