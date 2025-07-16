import { useState, useEffect } from 'react';
import { debug } from '../utils/debug';

export const useTMDBData = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [actors, setActors] = useState<any[]>([]);
  const [actresses, setActresses] = useState<any[]>([]);
  const [directors, setDirectors] = useState<any[]>([]);
  const [productionHouses, setProductionHouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const TMDB_API_KEY = '00c8935eeb21058413bf54ae11048768';
  const BASE_URL = 'https://api.themoviedb.org/3';

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // Fetch trending movies
        const moviesResponse = await fetch(
          `${BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}&page=1`
        );
        if (!moviesResponse.ok) throw new Error('Failed to fetch movies');
        const moviesData = await moviesResponse.json();
        setMovies(moviesData.results?.slice(0, 20) || []);

        // Fetch popular actors
        const actorsResponse = await fetch(
          `${BASE_URL}/person/popular?api_key=${TMDB_API_KEY}&page=1`
        );
        if (!actorsResponse.ok) throw new Error('Failed to fetch actors');
        const actorsData = await actorsResponse.json();
        const allActors = actorsData.results?.slice(0, 50) || [];
        
        // Filter actors and actresses by gender (1 = female, 2 = male)
        const maleActors = allActors.filter((person: any) => person.gender === 2).slice(0, 25);
        const femaleActors = allActors.filter((person: any) => person.gender === 1).slice(0, 25);
        
        setActors(maleActors);
        setActresses(femaleActors);

        // Fetch directors (using crew data from popular movies)
        const directorsResponse = await fetch(
          `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&sort_by=popularity.desc&page=1&with_crew=1`
        );
        if (!directorsResponse.ok) throw new Error('Failed to fetch directors');
        const directorsData = await directorsResponse.json();
        
        // Get credits for first few movies to find directors
        const directorPromises = directorsData.results?.slice(0, 10).map(async (movie: any) => {
          try {
            const creditsResponse = await fetch(
              `${BASE_URL}/movie/${movie.id}/credits?api_key=${TMDB_API_KEY}`
            );
            if (creditsResponse.ok) {
              const creditsData = await creditsResponse.json();
              return creditsData.crew?.filter((member: any) => member.job === 'Director').slice(0, 2) || [];
            }
            return [];
          } catch {
            return [];
          }
        }) || [];

        const allDirectors = await Promise.all(directorPromises);
        const uniqueDirectors = Array.from(
          new Map(
            allDirectors.flat().map((director: any) => [director.id, director])
          ).values()
        ).slice(0, 20);
        
        setDirectors(uniqueDirectors);

        // Fetch production companies
        const companiesResponse = await fetch(
          `${BASE_URL}/company/popular?api_key=${TMDB_API_KEY}&page=1`
        );
        if (!companiesResponse.ok) throw new Error('Failed to fetch production companies');
        const companiesData = await companiesResponse.json();
        setProductionHouses(companiesData.results?.slice(0, 30) || []);

      } catch (err: any) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch TMDB data';
        setError(errorMessage);
        if (import.meta.env.DEV) {
          debug.error('Error fetching data:', err);
        }
    } finally {
      setLoading(false);
    }
  };

    fetchAllData();
  }, []);

  return {
    movies,
    actors,
    actresses,
    directors,
    productionHouses,
    loading,
    error
  };
}; 