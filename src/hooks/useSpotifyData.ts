import { useState, useEffect, useCallback } from 'react';
import spotifyApi, { type SpotifyArtist, type SpotifyAlbum, type SpotifyTrack } from '../services/spotifyApi';

interface SpotifyArtistDetails {
  artist: SpotifyArtist | null;
  albums: SpotifyAlbum[];
  topTracks: SpotifyTrack[];
  relatedArtists: SpotifyArtist[];
}

interface UseSpotifyDataReturn {
  // Artist search
  searchArtists: (query: string) => Promise<SpotifyArtist[]>;
  searchResults: SpotifyArtist[];
  isSearching: boolean;
  searchError: string | null;
  
  // Artist details
  getArtistDetails: (artistId: string) => Promise<SpotifyArtistDetails | null>;
  artistDetails: SpotifyArtistDetails | null;
  isLoadingDetails: boolean;
  detailsError: string | null;
  
  // Trending artists
  getTrendingArtists: () => Promise<SpotifyArtist[]>;
  trendingArtists: SpotifyArtist[];
  isLoadingTrending: boolean;
  trendingError: string | null;
  
  // Multiple artists
  getMultipleArtists: (artistNames: string[]) => Promise<Array<{ name: string; data: SpotifyArtistDetails | null }>>;
  multipleArtists: Array<{ name: string; data: SpotifyArtistDetails | null }>;
  isLoadingMultiple: boolean;
  multipleError: string | null;
  
  // Utility functions
  formatArtistForCommunity: (artist: SpotifyArtist) => any;
  getArtistImageUrl: (artist: SpotifyArtist, size?: 'small' | 'medium' | 'large') => string;
}

export const useSpotifyData = (): UseSpotifyDataReturn => {
  // Search state
  const [searchResults, setSearchResults] = useState<SpotifyArtist[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Artist details state
  const [artistDetails, setArtistDetails] = useState<SpotifyArtistDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  // Trending artists state
  const [trendingArtists, setTrendingArtists] = useState<SpotifyArtist[]>([]);
  const [isLoadingTrending, setIsLoadingTrending] = useState(false);
  const [trendingError, setTrendingError] = useState<string | null>(null);

  // Multiple artists state
  const [multipleArtists, setMultipleArtists] = useState<Array<{ name: string; data: SpotifyArtistDetails | null }>>([]);
  const [isLoadingMultiple, setIsLoadingMultiple] = useState(false);
  const [multipleError, setMultipleError] = useState<string | null>(null);

  // Search artists
  const searchArtists = useCallback(async (query: string): Promise<SpotifyArtist[]> => {
    if (!query.trim()) {
      setSearchResults([]);
      return [];
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const results = await spotifyApi.searchArtists(query, 10);
      setSearchResults(results);
      return results;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to search artists';
      setSearchError(errorMessage);
      console.error('Error searching artists:', error);
      return [];
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Get artist details
  const getArtistDetails = useCallback(async (artistId: string): Promise<SpotifyArtistDetails | null> => {
    if (!artistId) {
      setArtistDetails(null);
      return null;
    }

    setIsLoadingDetails(true);
    setDetailsError(null);

    try {
      const details = await spotifyApi.getArtistFullDetails(artistId);
      setArtistDetails(details);
      return details;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get artist details';
      setDetailsError(errorMessage);
      console.error('Error getting artist details:', error);
      return null;
    } finally {
      setIsLoadingDetails(false);
    }
  }, []);

  // Get trending artists
  const getTrendingArtists = useCallback(async (): Promise<SpotifyArtist[]> => {
    setIsLoadingTrending(true);
    setTrendingError(null);

    try {
      const trending = await spotifyApi.getTrendingArtists(20);
      setTrendingArtists(trending);
      return trending;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get trending artists';
      setTrendingError(errorMessage);
      console.error('Error getting trending artists:', error);
      return [];
    } finally {
      setIsLoadingTrending(false);
    }
  }, []);

  // Get multiple artists
  const getMultipleArtists = useCallback(async (artistNames: string[]): Promise<Array<{ name: string; data: SpotifyArtistDetails | null }>> => {
    if (!artistNames.length) {
      setMultipleArtists([]);
      return [];
    }

    setIsLoadingMultiple(true);
    setMultipleError(null);

    try {
      const artists = await spotifyApi.getMultipleArtists(artistNames);
      setMultipleArtists(artists);
      return artists;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get multiple artists';
      setMultipleError(errorMessage);
      console.error('Error getting multiple artists:', error);
      return [];
    } finally {
      setIsLoadingMultiple(false);
    }
  }, []);

  // Utility functions
  const formatArtistForCommunity = useCallback((artist: SpotifyArtist) => {
    return spotifyApi.formatArtistForCommunity(artist);
  }, []);

  const getArtistImageUrl = useCallback((artist: SpotifyArtist, size: 'small' | 'medium' | 'large' = 'large') => {
    return spotifyApi.getArtistImageUrl(artist, size);
  }, []);

  return {
    // Artist search
    searchArtists,
    searchResults,
    isSearching,
    searchError,
    
    // Artist details
    getArtistDetails,
    artistDetails,
    isLoadingDetails,
    detailsError,
    
    // Trending artists
    getTrendingArtists,
    trendingArtists,
    isLoadingTrending,
    trendingError,
    
    // Multiple artists
    getMultipleArtists,
    multipleArtists,
    isLoadingMultiple,
    multipleError,
    
    // Utility functions
    formatArtistForCommunity,
    getArtistImageUrl
  };
};

// Hook for a specific artist
export const useSpotifyArtist = (artistName: string) => {
  const [artistData, setArtistData] = useState<SpotifyArtistDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!artistName.trim()) {
      setArtistData(null);
      return;
    }

    const fetchArtistData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await spotifyApi.searchAndGetArtistDetails(artistName);
        setArtistData(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch artist data';
        setError(errorMessage);
        console.error('Error fetching artist data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtistData();
  }, [artistName]);

  return { artistData, isLoading, error };
};

// Hook for trending artists with auto-refresh
export const useTrendingArtists = (autoRefresh: boolean = true, refreshInterval: number = 300000) => { // 5 minutes
  const [trendingArtists, setTrendingArtists] = useState<SpotifyArtist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrending = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const artists = await spotifyApi.getTrendingArtists(20);
      setTrendingArtists(artists);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch trending artists';
      setError(errorMessage);
      console.error('Error fetching trending artists:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrending();
    
    if (autoRefresh) {
      const interval = setInterval(fetchTrending, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchTrending, autoRefresh, refreshInterval]);

  return { trendingArtists, isLoading, error, refetch: fetchTrending };
};



// Hook for artist search with debouncing
export const useArtistSearch = (debounceMs: number = 500) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SpotifyArtist[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      setError(null);

      try {
        const results = await spotifyApi.searchArtists(searchQuery, 10);
        setSearchResults(results);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to search artists';
        setError(errorMessage);
        console.error('Error searching artists:', err);
      } finally {
        setIsSearching(false);
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, debounceMs]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    error
  };
}; 