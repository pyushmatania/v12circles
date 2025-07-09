// Types for our data models
export interface Project {
  id: string;
  title: string;
  type: 'film' | 'music' | 'webseries';
  category: string;
  language: string;
  poster: string;
  fundedPercentage: number;
  targetAmount: number;
  raisedAmount: number;
  timeLeft?: string;
  tags: string[];
  description: string;
  director?: string;
  artist?: string;
  genre: string;
  perks: string[];
  rating?: number;
  investorCount?: number;
  trailer?: string;
  imageValidated?: boolean;
  imageSource?: string;
  status?: string; // e.g., 'active', 'disabled', etc.
  createdAt?: string; // ISO date string or similar
  updatedAt?: string; // ISO date string or similar
  movie?: string; // Movie name or ID
  keyPeople?: string[]; // Array of key people involved in the project
  actor?: string | string[]; // Main actor(s) in the project
  actress?: string | string[]; // Main actress(es) in the project
  productionHouse?: string; // Name of the production house
  targetAmountHuman?: string; // Human-readable target amount (e.g., '₹1 Crore')
  raisedAmountHuman?: string; // Human-readable raised amount (e.g., '₹50 Lakh')
  keyCommunityData?: unknown;
  disabled?: boolean;
}

export interface MerchandiseItem {
  id: string;
  title: string;
  category: string;
  price: number;
  stockLevel: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  image?: string;
  createdAt: string;
}

export interface Perk {
  id: string;
  title: string;
  description: string;
  projectId?: string;
  projectTitle?: string;
  tier: 'supporter' | 'backer' | 'producer' | 'executive';
  minAmount: number;
  createdAt: string;
}

export interface MediaAsset {
  id: string;
  title: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  fileSize: number;
  dimensions?: string;
  projectId?: string;
  tags: string[];
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive' | 'banned';
  investmentCount: number;
  totalInvested: number;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  userId?: string;
  userName?: string;
  resourceType: 'project' | 'merchandise' | 'perk' | 'media' | 'user' | 'system';
  resourceId?: string;
  details?: string;
  timestamp: string;
}

export interface BackupData {
  id: string;
  name: string;
  size: number;
  createdAt: string;
  status: 'completed' | 'in-progress' | 'failed';
}

// Context type
export interface AdminContextType {
  // Projects
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  archiveProject: (id: string) => void;
  
  // Merchandise
  merchandiseItems: MerchandiseItem[];
  addMerchandiseItem: (item: Omit<MerchandiseItem, 'id' | 'createdAt'>) => void;
  updateMerchandiseItem: (id: string, updates: Partial<MerchandiseItem>) => void;
  deleteMerchandiseItem: (id: string) => void;
  
  // Perks
  perks: Perk[];
  addPerk: (perk: Omit<Perk, 'id' | 'createdAt'>) => void;
  updatePerk: (id: string, updates: Partial<Perk>) => void;
  deletePerk: (id: string) => void;
  
  // Media
  mediaAssets: MediaAsset[];
  addMediaAsset: (asset: Omit<MediaAsset, 'id' | 'createdAt'>) => void;
  updateMediaAsset: (id: string, updates: Partial<MediaAsset>) => void;
  deleteMediaAsset: (id: string) => void;
  
  // Users
  users: User[];
  updateUserStatus: (id: string, status: User['status']) => void;
  
  // Activity Log
  activityLogs: ActivityLog[];
  addActivityLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
  
  // Backups
  backups: BackupData[];
  createBackup: () => Promise<void>;
  restoreBackup: (id: string) => Promise<void>;
} 