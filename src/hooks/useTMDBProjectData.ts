import { useState, useEffect } from 'react';
import { tmdbService, TMDBMovieDetails, TMDBActor } from '../services/tmdbApi';

export interface TMDBProjectData {
  movieDetails: TMDBMovieDetails | null;
  cast: TMDBActor[];
  crew: TMDBActor[];
  loading: boolean;
  error: string | null;
}

export const useTMDBProjectData = (projectTitle: string, tmdbId?: number) => {
  const [data, setData] = useState<TMDBProjectData>({
    movieDetails: null,
    cast: [],
    crew: [],
    loading: false,
    error: null
  });

  useEffect(() => {
    const fetchTMDBData = async () => {
      if (!projectTitle) return;

      console.log('🔍 Fetching TMDB data for:', projectTitle, 'TMDB ID:', tmdbId);
      setData(prev => ({ ...prev, loading: true, error: null }));

      try {
        let movieDetails: TMDBMovieDetails | null = null;
        let cast: TMDBActor[] = [];
        let crew: TMDBActor[] = [];

        // If we have a valid TMDB ID, fetch directly
        if (tmdbId && tmdbId > 0 && tmdbId < 1000000) {
          console.log('🎬 Fetching by TMDB ID:', tmdbId);
          movieDetails = await tmdbService.getMovieDetails(tmdbId);
          if (movieDetails.credits) {
            cast = movieDetails.credits.cast || [];
            crew = movieDetails.credits.crew || [];
          }
        } else {
          // Search for the movie by title
          console.log('🔍 Searching by title:', projectTitle);
          const searchResults = await tmdbService.searchMovies(projectTitle, 1);
          console.log('📋 Search results:', searchResults.results.length, 'movies found');
          
          if (searchResults.results.length > 0) {
            const bestMatch = searchResults.results[0];
            console.log('✅ Best match:', bestMatch.title, 'ID:', bestMatch.id);
            movieDetails = await tmdbService.getMovieDetails(bestMatch.id);
            if (movieDetails.credits) {
              cast = movieDetails.credits.cast || [];
              crew = movieDetails.credits.crew || [];
            }
          } else {
            console.log('❌ No movies found for:', projectTitle);
          }
        }

        console.log('🎭 Cast members found:', cast.length);
        console.log('🎬 Crew members found:', crew.length);

        setData({
          movieDetails,
          cast: cast.slice(0, 20), // Limit to top 20 cast members
          crew: crew.slice(0, 15), // Limit to top 15 crew members
          loading: false,
          error: null
        });

      } catch (error) {
        console.error('❌ Error fetching TMDB data:', error);
        setData(prev => ({
          ...prev,
          loading: false,
          error: `Failed to load movie data: ${error instanceof Error ? error.message : 'Unknown error'}`
        }));
      }
    };

    fetchTMDBData();
  }, [projectTitle, tmdbId]);

  return data;
};

// Helper function to get crew by department
export const getCrewByDepartment = (crew: TMDBActor[], department: string) => {
  return crew.filter(member => member.known_for_department === department);
};

// Helper function to get main cast (top 10)
export const getMainCast = (cast: TMDBActor[]) => {
  return cast.slice(0, 10);
};

// Helper function to get supporting cast (11-20)
export const getSupportingCast = (cast: TMDBActor[]) => {
  return cast.slice(10, 20);
};

// Helper function to get key crew positions
export const getKeyCrew = (crew: TMDBActor[]) => {
  const keyPositions = ['Director', 'Producer', 'Writer', 'Cinematography', 'Editing', 'Music'];
  return crew.filter(member => 
    keyPositions.some(position => 
      member.known_for_department?.toLowerCase().includes(position.toLowerCase())
    )
  ).slice(0, 8);
}; 