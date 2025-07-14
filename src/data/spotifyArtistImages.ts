// Spotify Artist Images Data - Fetched once and saved permanently
// This data was fetched from Spotify API and saved to avoid repeated API calls

export interface SpotifyArtistImageData {
  id: string;
  name: string;
  avatar: string;
  cover: string;
  popularity: number;
  followers: number;
  genres: string[];
  spotifyUrl: string;
}

export interface SpotifyImagesData {
  fetchedAt: string;
  totalArtists: number;
  foundArtists: number;
  duration: number;
  artists: Record<string, SpotifyArtistImageData>;
}

// Import the saved data
import spotifyData from './spotifyArtistImages.json';

export const spotifyArtistImages: SpotifyImagesData = spotifyData;

// Helper function to get artist data by name
export const getSpotifyArtistData = (artistName: string): SpotifyArtistImageData | null => {
  return spotifyArtistImages.artists[artistName] || null;
};

// Helper function to get all artist names
export const getAllSpotifyArtistNames = (): string[] => {
  return Object.keys(spotifyArtistImages.artists);
};

// Helper function to check if an artist has Spotify data
export const hasSpotifyData = (artistName: string): boolean => {
  return artistName in spotifyArtistImages.artists;
};

// Helper function to get artist image URL
export const getSpotifyArtistImageUrl = (artistName: string, size: 'avatar' | 'cover' = 'avatar'): string | null => {
  const artistData = getSpotifyArtistData(artistName);
  if (!artistData) return null;
  
  return size === 'avatar' ? artistData.avatar : artistData.cover;
}; 