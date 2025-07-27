// 🎵 Spotify Artist Images Data
export interface SpotifyArtistImageData {
  id: string;
  name: string;
  imageUrl: string;
  followers: number;
  genres: string[];
  popularity: number;
  verified: boolean;
}

export interface SpotifyImagesData {
  lastUpdated: string;
  totalArtists: number;
  artists: Record<string, SpotifyArtistImageData>;
}

// Spotify artist images data
export const spotifyArtistImages: SpotifyImagesData = {
  lastUpdated: "2024-01-15T10:00:00Z",
  totalArtists: 0,
  artists: {}
};

// Helper function to get artist data by name
export const getSpotifyArtistData = (artistName: string): SpotifyArtistImageData | null => {
  return spotifyArtistImages.artists[artistName] || null;
};

// Helper function to check if artist has Spotify data
export const hasSpotifyData = (artistName: string): boolean => {
  return artistName in spotifyArtistImages.artists;
};

// Helper function to get all artist names
export const getAllSpotifyArtistNames = (): string[] => {
  return Object.keys(spotifyArtistImages.artists);
};

// Helper function to get artists by genre
export const getSpotifyArtistsByGenre = (genre: string): SpotifyArtistImageData[] => {
  return Object.values(spotifyArtistImages.artists).filter(artist => 
    artist.genres.some(g => g.toLowerCase().includes(genre.toLowerCase()))
  );
};

// Helper function to get top artists by popularity
export const getTopSpotifyArtists = (limit: number = 10): SpotifyArtistImageData[] => {
  return Object.values(spotifyArtistImages.artists)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
}; 