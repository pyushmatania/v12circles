// Comprehensive Community Data - Using balanced TMDB data
// Generated on: 2025-01-13

export type RealCommunityItem = {
  id: string;
  name: string;
  avatar: string;
  cover: string;
  description: string;
  type: 'movie' | 'productionHouse' | 'director' | 'actor' | 'actress';
  followers: number;
  verified: boolean;
  isActive: boolean;
  projects: any[];
  tmdbId?: number;
  rating?: number;
  releaseDate?: string;
  knownFor?: string[];
  country?: string;
};

// Community data structure
const communityData = {
  actors: [] as RealCommunityItem[],
  actresses: [] as RealCommunityItem[],
  directors: [] as RealCommunityItem[],
  movies: [] as RealCommunityItem[],
  productionHouses: [] as RealCommunityItem[]
};

export const comprehensiveCommunityData = communityData; 