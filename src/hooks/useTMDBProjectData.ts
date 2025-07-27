import { useState, useEffect } from 'react';
import { tmdbService, TMDBMovieDetails, TMDBActor } from '../services/tmdbApi';
import { debug } from '../utils/debug';

export interface TMDBProjectData extends TMDBMovieDetails {
  cast: TMDBActor[];
  crew: TMDBActor[];
}

export const useTMDBProjectData = (projectTitle: string, tmdbId?: number) => {
  const [projectData, setProjectData] = useState<TMDBProjectData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectTitle && !tmdbId) return;

    const fetchProjectData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (import.meta.env.DEV) {
          debug.info('🔍 Fetching TMDB data for:', projectTitle, 'TMDB ID:', tmdbId);
        }

        let movieData: TMDBMovieDetails;

        if (tmdbId) {
          // Fetch by TMDB ID if available
          if (import.meta.env.DEV) {
            debug.info('🎬 Fetching by TMDB ID:', tmdbId);
          }
          movieData = await tmdbService.getMovieDetails(tmdbId);
        } else {
          // Search by title
          if (import.meta.env.DEV) {
            debug.info('🔍 Searching by title:', projectTitle);
          }
          const searchResults = await tmdbService.searchMovies(projectTitle);
          if (import.meta.env.DEV) {
            debug.info('📋 Search results:', searchResults.results.length, 'movies found');
          }

            const bestMatch = searchResults.results[0];
          if (bestMatch && import.meta.env.DEV) {
            debug.info('✅ Best match:', bestMatch.title, 'ID:', bestMatch.id);
          }

          if (!bestMatch) {
            if (import.meta.env.DEV) {
              debug.warn('❌ No movies found for:', projectTitle);
            }
            throw new Error(`No TMDB data found for "${projectTitle}"`);
          }
          movieData = await tmdbService.getMovieDetails(bestMatch.id);
        }

        // Extract credits from movie data (already included in append_to_response)
        const cast = movieData.credits?.cast || [];
        const crew = movieData.credits?.crew || [];
        
        if (import.meta.env.DEV) {
          debug.info('🎭 Cast members found:', cast.length);
          debug.info('🎬 Crew members found:', crew.length);
        }

        const enhancedData: TMDBProjectData = {
          ...movieData,
          cast,
          crew,
        };

        setProjectData(enhancedData);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch TMDB data';
        setError(errorMessage);
        if (import.meta.env.DEV) {
          debug.error('❌ Error fetching TMDB data:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectTitle, tmdbId]);

  return { projectData, loading, error };
};

// Helper functions to extract main cast and crew
export const getMainCast = (cast: TMDBActor[], limit: number = 5): TMDBActor[] => {
  return cast.slice(0, limit);
};

// Note: Crew members have different structure than actors
// This function expects crew data with job property
export const getKeyCrew = (crew: Array<TMDBActor & { job?: string }>, roles: string[] = ['Director', 'Producer', 'Writer']): Array<TMDBActor & { job?: string }> => {
  return crew.filter(member => roles.includes(member.job || ''));
}; 