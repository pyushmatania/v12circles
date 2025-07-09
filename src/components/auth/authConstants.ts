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
  email: 'rahul.investor@gmail.com',
  name: 'Rahul Krishnan',
  avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
  bio: 'Passionate about supporting innovative entertainment projects. Film enthusiast and early investor in emerging talent.',
  location: 'Mumbai, India',
  joinDate: '2023-01-15',
  investmentCount: 12,
  totalInvested: 450000,
  socialLinks: {
    twitter: 'https://twitter.com/rahul_investor',
    linkedin: 'https://linkedin.com/in/rahul-krishnan',
    instagram: 'https://instagram.com/rahul.films'
  },
  preferences: {
    notifications: true,
    newsletter: true,
    twoFactor: false
  }
}; 