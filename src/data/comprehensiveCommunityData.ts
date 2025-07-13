// Comprehensive Community Data - Using balanced TMDB data
// Generated on: 2025-01-13

import balancedData from './balancedCommunityData.json';

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
  category?: string;
};

// Use the new balanced data with Bollywood, Hollywood, and World/Regional content
export const comprehensiveCommunityData: {
  movies: RealCommunityItem[];
  productionHouses: RealCommunityItem[];
  directors: RealCommunityItem[];
  actors: RealCommunityItem[];
  actresses: RealCommunityItem[];
} = {
  movies: balancedData.movies as RealCommunityItem[],
  productionHouses: balancedData.productionHouses as RealCommunityItem[],
  directors: balancedData.directors as RealCommunityItem[],
  actors: balancedData.actors as RealCommunityItem[],
  actresses: balancedData.actresses as RealCommunityItem[]
};

// Helper function to get movies by category
export const getMoviesByCategory = (category: string): RealCommunityItem[] => {
  return comprehensiveCommunityData.movies.filter(movie => movie.category === category);
};

// Helper function to get all Hollywood movies
export const getHollywoodMovies = (): RealCommunityItem[] => {
  return comprehensiveCommunityData.movies.filter(movie => movie.category === 'hollywood');
};

// Helper function to get all Bollywood movies
export const getBollywoodMovies = (): RealCommunityItem[] => {
  return comprehensiveCommunityData.movies.filter(movie => movie.category === 'bollywood');
};

// Helper function to get all World/Regional movies
export const getWorldMovies = (): RealCommunityItem[] => {
  return comprehensiveCommunityData.movies.filter(movie => movie.category === 'world');
};

// Helper function to get all Hollywood actors
export const getHollywoodActors = (): RealCommunityItem[] => {
  return comprehensiveCommunityData.actors.filter(actor => actor.category === 'hollywood');
};

// Helper function to get all Bollywood actors
export const getBollywoodActors = (): RealCommunityItem[] => {
  return comprehensiveCommunityData.actors.filter(actor => actor.category === 'bollywood');
};

// Helper function to get all World/Regional actors
export const getWorldActors = (): RealCommunityItem[] => {
  return comprehensiveCommunityData.actors.filter(actor => actor.category === 'world');
};

// Helper function to get all Hollywood actresses
export const getHollywoodActresses = (): RealCommunityItem[] => {
  return comprehensiveCommunityData.actresses.filter(actress => actress.category === 'hollywood');
};

// Helper function to get all Bollywood actresses
export const getBollywoodActresses = (): RealCommunityItem[] => {
  return comprehensiveCommunityData.actresses.filter(actress => actress.category === 'bollywood');
};

// Helper function to get all World/Regional actresses
export const getWorldActresses = (): RealCommunityItem[] => {
  return comprehensiveCommunityData.actresses.filter(actress => actress.category === 'world');
};

// Helper function to get all Hollywood directors
export const getHollywoodDirectors = (): RealCommunityItem[] => {
  return comprehensiveCommunityData.directors.filter(director => director.category === 'hollywood');
};

// Helper function to get all Bollywood directors
export const getBollywoodDirectors = (): RealCommunityItem[] => {
  return comprehensiveCommunityData.directors.filter(director => director.category === 'bollywood');
};

// Helper function to get all World/Regional directors
export const getWorldDirectors = (): RealCommunityItem[] => {
  return comprehensiveCommunityData.directors.filter(director => director.category === 'world');
};

// Helper function to get all Hollywood production houses
export const getHollywoodProductionHouses = (): RealCommunityItem[] => {
  return comprehensiveCommunityData.productionHouses.filter(house => house.category === 'hollywood');
};

// Helper function to get all Bollywood production houses
export const getBollywoodProductionHouses = (): RealCommunityItem[] => {
  return comprehensiveCommunityData.productionHouses.filter(house => house.category === 'bollywood');
};

// Helper function to get all World/Regional production houses
export const getWorldProductionHouses = (): RealCommunityItem[] => {
  return comprehensiveCommunityData.productionHouses.filter(house => house.category === 'world');
};

export const getCommunityDataByType = (type: string): RealCommunityItem[] => {
  switch (type) {
    case 'movie':
      return comprehensiveCommunityData.movies;
    case 'actor':
      return comprehensiveCommunityData.actors;
    case 'actress':
      return comprehensiveCommunityData.actresses;
    case 'director':
      return comprehensiveCommunityData.directors;
    case 'productionHouse':
      return comprehensiveCommunityData.productionHouses;
    default:
      return [];
  }
}; 