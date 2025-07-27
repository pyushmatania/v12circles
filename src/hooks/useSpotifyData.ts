import { useState, useEffect, useCallback } from 'react';
import spotifyApi, { type SpotifyArtist, type SpotifyAlbum, type SpotifyTrack } from '../services/spotifyApi';
import { debug } from '../utils/debug';

// 🛡️ Type definitions for better type safety
interface SpotifyArtistSearchResult {
  artists: SpotifyArtist[];
  total: number;
  loading: boolean;
  error: string | null;
}

interface SpotifyArtistDetails extends SpotifyArtist {
  albums: SpotifyAlbum[];
  topTracks: SpotifyTrack[];
  relatedArtists: SpotifyArtist[];
  loading: boolean;
  error: string | null;
}

interface SpotifyTrendingData {
  artists: SpotifyArtist[];
  loading: boolean;
  error: string | null;
}

interface SpotifyMultipleArtistsData {
  artists: SpotifyArtist[];
  loading: boolean;
  error: string | null;
}

// 🚀 Search for artists
export const useSpotifySearch = (query: string, enabled: boolean = true) => {
  const [result, setResult] = useState<SpotifyArtistSearchResult>({
    artists: [],
    total: 0,
    loading: false,
    error: null
  });

  const searchArtists = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResult({ artists: [], total: 0, loading: false, error: null });
      return;
    }

    setResult(prev => ({ ...prev, loading: true, error: null }));

    try {
      const artists = await spotifyApi.searchArtists(searchQuery);
      setResult({
        artists,
        total: artists.length,
        loading: false,
        error: null
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to search artists';
      setResult({
        artists: [],
        total: 0,
        loading: false,
        error: errorMessage
      });
      if (import.meta.env.DEV) {
        debug.error('Error searching artists:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (enabled && query) {
      searchArtists(query);
    }
  }, [query, enabled, searchArtists]);

  return { ...result, searchArtists };
};

// 🚀 Get artist details with enhanced data
export const useSpotifyArtist = (artistId: string) => {
  const [artistData, setArtistData] = useState<SpotifyArtistDetails>({
    id: '',
    name: '',
    popularity: 0,
    followers: { total: 0 },
    genres: [],
    images: [],
    external_urls: { spotify: '' },
    albums: [],
    topTracks: [],
    relatedArtists: [],
    loading: false,
    error: null
  });

  useEffect(() => {
    if (!artistId) return;

    const fetchArtistData = async () => {
      setArtistData(prev => ({ ...prev, loading: true, error: null }));

    try {
        const fullDetails = await spotifyApi.getArtistFullDetails(artistId);
        setArtistData({
          ...fullDetails,
          loading: false,
          error: null
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch artist data';
        setArtistData(prev => ({
          ...prev,
          loading: false,
          error: errorMessage
        }));
        if (import.meta.env.DEV) {
          debug.error('Error getting artist details:', error);
        }
      }
    };

    fetchArtistData();
  }, [artistId]);

  return artistData;
};

// 🚀 Get trending artists
export const useSpotifyTrending = () => {
  const [trendingData, setTrendingData] = useState<SpotifyTrendingData>({
    artists: [],
    loading: false,
    error: null
  });

  const fetchTrendingArtists = useCallback(async () => {
    setTrendingData(prev => ({ ...prev, loading: true, error: null }));

    try {
      const artists = await spotifyApi.getTrendingArtists();
      setTrendingData({
        artists,
        loading: false,
        error: null
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch trending artists';
      setTrendingData({
        artists: [],
        loading: false,
        error: errorMessage
      });
      if (import.meta.env.DEV) {
        debug.error('Error getting trending artists:', error);
      }
    }
  }, []);

  useEffect(() => {
    fetchTrendingArtists();
  }, [fetchTrendingArtists]);

  return { ...trendingData, refresh: fetchTrendingArtists };
};

// 🚀 Get multiple artists by names
export const useSpotifyMultipleArtists = (artistNames: string[]) => {
  const [artistsData, setArtistsData] = useState<SpotifyMultipleArtistsData>({
    artists: [],
    loading: false,
    error: null
  });

  useEffect(() => {
    if (!artistNames.length) return;

    const fetchMultipleArtists = async () => {
      setArtistsData(prev => ({ ...prev, loading: true, error: null }));

    try {
      const artists = await spotifyApi.getMultipleArtists(artistNames);
        setArtistsData({
          artists,
          loading: false,
          error: null
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch multiple artists';
        setArtistsData({
          artists: [],
          loading: false,
          error: errorMessage
        });
        if (import.meta.env.DEV) {
          debug.error('Error getting multiple artists:', error);
        }
    }
    };

    fetchMultipleArtists();
  }, [artistNames]);

  return artistsData;
};

// 🚀 Enhanced hook for community artist data with caching
export const useSpotifyArtistForCommunity = (artistName: string) => {
  const [artistData, setArtistData] = useState<{
    artist: SpotifyArtist | null;
    loading: boolean;
    error: string | null;
  }>({
    artist: null,
    loading: false,
    error: null
  });

  useEffect(() => {
    if (!artistName) return;

    const fetchArtistData = async () => {
      setArtistData(prev => ({ ...prev, loading: true, error: null }));

      try {
        // Use search to find the artist, then get details
        const searchResults = await spotifyApi.searchArtists(artistName, 1);
        
        if (searchResults.length > 0) {
          const artist = searchResults[0];
          setArtistData({
            artist,
            loading: false,
            error: null
          });
        } else {
          setArtistData({
            artist: null,
            loading: false,
            error: 'Artist not found'
          });
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch artist data';
        setArtistData({
          artist: null,
          loading: false,
          error: errorMessage
        });
        if (import.meta.env.DEV) {
          debug.error('Error fetching artist data:', err);
        }
      }
    };

    fetchArtistData();
  }, [artistName]);

  return artistData;
};

// 🚀 Hook for fetching trending artists with enhanced error handling
export const useSpotifyTrendingArtists = () => {
  const [data, setData] = useState<{
    artists: SpotifyArtist[];
    loading: boolean;
    error: string | null;
  }>({
    artists: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchTrendingArtists = async () => {
      setData(prev => ({ ...prev, loading: true, error: null }));

    try {
        const artists = await spotifyApi.getTrendingArtists();
        setData({
          artists,
          loading: false,
          error: null
        });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch trending artists';
        setData({
          artists: [],
          loading: false,
          error: errorMessage
        });
        if (import.meta.env.DEV) {
          debug.error('Error fetching trending artists:', err);
        }
      }
    };

    fetchTrendingArtists();
  }, []);

  return data;
};

// 🚀 Hook for searching artists with debounced queries
export const useSpotifyArtistSearch = (query: string, delay: number = 300) => {
  const [searchData, setSearchData] = useState<{
    artists: SpotifyArtist[];
    loading: boolean;
    error: string | null;
  }>({
    artists: [],
    loading: false,
    error: null
  });

  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Debounce the query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => clearTimeout(timer);
  }, [query, delay]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSearchData({ artists: [], loading: false, error: null });
      return;
    }

    const searchArtists = async () => {
      setSearchData(prev => ({ ...prev, loading: true, error: null }));

      try {
        const artists = await spotifyApi.searchArtists(debouncedQuery);
        setSearchData({
          artists,
          loading: false,
          error: null
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to search artists';
        setSearchData({
          artists: [],
          loading: false,
          error: errorMessage
        });
        if (import.meta.env.DEV) {
          debug.error('Error searching artists:', err);
        }
      }
    };

    searchArtists();
  }, [debouncedQuery]);

  return searchData;
}; 