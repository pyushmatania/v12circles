import { useState, useEffect } from 'react';
import { 
  tmdbService, 
  convertTMDBMovieToCommunityItem, 
  convertTMDBActorToCommunityItem, 
  convertTMDBCompanyToCommunityItem,
  TMDBMovie,
  TMDBActor,
  TMDBProductionCompany
} from '../services/tmdbApi';

export interface CommunityItem {
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
}

interface UseTMDBDataReturn {
  movies: CommunityItem[];
  actors: CommunityItem[];
  actresses: CommunityItem[];
  directors: CommunityItem[];
  productionHouses: CommunityItem[];
  loading: boolean;
  error: string | null;
  refreshData: () => void;
}

export const useTMDBData = (): UseTMDBDataReturn => {
  const [movies, setMovies] = useState<CommunityItem[]>([]);
  const [actors, setActors] = useState<CommunityItem[]>([]);
  const [actresses, setActresses] = useState<CommunityItem[]>([]);
  const [directors, setDirectors] = useState<CommunityItem[]>([]);
  const [productionHouses, setProductionHouses] = useState<CommunityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMovies = async () => {
    try {
      const [popularMovies, topRatedMovies, nowPlayingMovies] = await Promise.all([
        tmdbService.getPopularMovies(1),
        tmdbService.getTopRatedMovies(1),
        tmdbService.getNowPlayingMovies(1)
      ]);

      const allMovies = [
        ...popularMovies.results,
        ...topRatedMovies.results,
        ...nowPlayingMovies.results
      ];

      // Remove duplicates based on movie ID
      const uniqueMovies = allMovies.filter((movie, index, self) => 
        index === self.findIndex(m => m.id === movie.id)
      );

      const convertedMovies = uniqueMovies
        .slice(0, 20) // Limit to 20 movies
        .map(convertTMDBMovieToCommunityItem);

      setMovies(convertedMovies);
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError('Failed to fetch movies');
    }
  };

  const fetchActors = async () => {
    try {
      const popularActors = await tmdbService.getPopularActors(1);
      
      // Filter actors by gender (this is a simplified approach)
      // In a real app, you'd need to fetch individual actor details to get gender
      const convertedActors = popularActors.results
        .slice(0, 15)
        .map(actor => convertTMDBActorToCommunityItem(actor, 'actor'));

      setActors(convertedActors);
    } catch (err) {
      console.error('Error fetching actors:', err);
      setError('Failed to fetch actors');
    }
  };

  const fetchActresses = async () => {
    try {
      const popularActors = await tmdbService.getPopularActors(2); // Get second page for variety
      
      // For demo purposes, we'll use the same data but mark as actresses
      // In a real app, you'd need to fetch individual actor details to get gender
      const convertedActresses = popularActors.results
        .slice(0, 15)
        .map(actor => convertTMDBActorToCommunityItem(actor, 'actress'));

      setActresses(convertedActresses);
    } catch (err) {
      console.error('Error fetching actresses:', err);
      setError('Failed to fetch actresses');
    }
  };

  const fetchDirectors = async () => {
    try {
      const popularActors = await tmdbService.getPopularActors(3); // Get third page for variety
      
      // Filter for directors (known_for_department === 'Directing')
      const directors = popularActors.results
        .filter(actor => actor.known_for_department === 'Directing')
        .slice(0, 10);

      const convertedDirectors = directors.map(director => 
        convertTMDBActorToCommunityItem(director, 'director')
      );

      setDirectors(convertedDirectors);
    } catch (err) {
      console.error('Error fetching directors:', err);
      setError('Failed to fetch directors');
    }
  };

  const fetchProductionHouses = async () => {
    try {
      // Search for major production companies
      const companies = [
        'Marvel Studios',
        'Warner Bros. Pictures',
        'Universal Pictures',
        'Paramount Pictures',
        '20th Century Studios',
        'Sony Pictures',
        'Lionsgate',
        'A24',
        'Netflix',
        'Disney'
      ];

      const companyPromises = companies.map(name => 
        tmdbService.searchCompanies(name, 1)
      );

      const companyResults = await Promise.all(companyPromises);
      
      const allCompanies = companyResults
        .flatMap(result => result.results)
        .filter((company, index, self) => 
          index === self.findIndex(c => c.id === company.id)
        );

      const convertedCompanies = allCompanies
        .slice(0, 10)
        .map(convertTMDBCompanyToCommunityItem);

      setProductionHouses(convertedCompanies);
    } catch (err) {
      console.error('Error fetching production houses:', err);
      setError('Failed to fetch production houses');
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);

    try {
      await Promise.all([
        fetchMovies(),
        fetchActors(),
        fetchActresses(),
        fetchDirectors(),
        fetchProductionHouses()
      ]);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchAllData();
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return {
    movies,
    actors,
    actresses,
    directors,
    productionHouses,
    loading,
    error,
    refreshData
  };
}; 