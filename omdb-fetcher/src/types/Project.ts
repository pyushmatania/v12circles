export interface KeyCommunityData {
  id: string;
  movieId: string;
  movieName: string;
  productionHouse?: string;
  keyPeople?: string[];
  actor?: string;
  actress?: string;
  director?: string;
}

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