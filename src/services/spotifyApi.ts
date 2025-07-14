// Spotify API Service
// Client ID: 4a91e1d58f6a436ab83b2e6170f428d7
// Client Secret: 601baa35b7014e55a076ab80f600eb03

interface SpotifyToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface SpotifyArtist {
  id: string;
  name: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  followers: {
    total: number;
  };
  popularity: number;
  genres: string[];
  external_urls: {
    spotify: string;
  };
}

interface SpotifyAlbum {
  id: string;
  name: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  release_date: string;
  total_tracks: number;
  album_type: string;
}

interface SpotifyTrack {
  id: string;
  name: string;
  duration_ms: number;
  popularity: number;
  preview_url: string;
  external_urls: {
    spotify: string;
  };
  album: {
    name: string;
    images: Array<{
      url: string;
      height: number;
      width: number;
    }>;
  };
}

interface SpotifySearchResponse {
  artists: {
    items: SpotifyArtist[];
    total: number;
    limit: number;
    offset: number;
  };
}

class SpotifyApiService {
  private clientId = '4a91e1d58f6a436ab83b2e6170f428d7';
  private clientSecret = '601baa35b7014e55a076ab80f600eb03';
  private baseUrl = 'https://api.spotify.com/v1';
  private token: string | null = null;
  private tokenExpiry: number = 0;

  // Get access token with caching
  private async getAccessToken(): Promise<string> {
    // Check if we have a valid cached token
    if (this.token && Date.now() < this.tokenExpiry) {
      return this.token;
    }

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(`${this.clientId}:${this.clientSecret}`)
        },
        body: 'grant_type=client_credentials'
      });

      if (!response.ok) {
        throw new Error(`Failed to get Spotify token: ${response.statusText}`);
      }

      const data: SpotifyToken = await response.json();
      
      // Cache token with expiry
      this.token = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // Expire 1 minute early
      
      return this.token;
    } catch (error) {
      console.error('Error getting Spotify access token:', error);
      throw error;
    }
  }

  // Search for artists
  async searchArtists(query: string, limit: number = 10): Promise<SpotifyArtist[]> {
    try {
      const token = await this.getAccessToken();
      const response = await fetch(
        `${this.baseUrl}/search?q=${encodeURIComponent(query)}&type=artist&limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Spotify API error: ${response.statusText}`);
      }

      const data: SpotifySearchResponse = await response.json();
      return data.artists.items;
    } catch (error) {
      console.error('Error searching Spotify artists:', error);
      return [];
    }
  }

  // Get artist details by ID
  async getArtist(id: string): Promise<SpotifyArtist | null> {
    try {
      const token = await this.getAccessToken();
      const response = await fetch(`${this.baseUrl}/artists/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Spotify API error: ${response.statusText}`);
      }

      const artist: SpotifyArtist = await response.json();
      return artist;
    } catch (error) {
      console.error('Error getting Spotify artist:', error);
      return null;
    }
  }

  // Get artist albums
  async getArtistAlbums(artistId: string, limit: number = 20): Promise<SpotifyAlbum[]> {
    try {
      const token = await this.getAccessToken();
      const response = await fetch(
        `${this.baseUrl}/artists/${artistId}/albums?include_groups=album,single&limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Spotify API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.items;
    } catch (error) {
      console.error('Error getting Spotify artist albums:', error);
      return [];
    }
  }

  // Get artist top tracks
  async getArtistTopTracks(artistId: string, market: string = 'IN'): Promise<SpotifyTrack[]> {
    try {
      const token = await this.getAccessToken();
      const response = await fetch(
        `${this.baseUrl}/artists/${artistId}/top-tracks?market=${market}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Spotify API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.tracks;
    } catch (error) {
      console.error('Error getting Spotify artist top tracks:', error);
      return [];
    }
  }

  // Get related artists
  async getRelatedArtists(artistId: string): Promise<SpotifyArtist[]> {
    try {
      const token = await this.getAccessToken();
      const response = await fetch(`${this.baseUrl}/artists/${artistId}/related-artists`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Spotify API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.artists;
    } catch (error) {
      console.error('Error getting Spotify related artists:', error);
      return [];
    }
  }

  // Get artist with full details (artist + albums + top tracks + related artists)
  async getArtistFullDetails(artistId: string) {
    try {
      const [artist, albums, topTracks, relatedArtists] = await Promise.allSettled([
        this.getArtist(artistId),
        this.getArtistAlbums(artistId),
        this.getArtistTopTracks(artistId),
        this.getRelatedArtists(artistId)
      ]);

      return {
        artist: artist.status === 'fulfilled' ? artist.value : null,
        albums: albums.status === 'fulfilled' ? albums.value : [],
        topTracks: topTracks.status === 'fulfilled' ? topTracks.value : [],
        relatedArtists: relatedArtists.status === 'fulfilled' ? relatedArtists.value : []
      };
    } catch (error) {
      console.error('Error getting Spotify artist full details:', error);
      return {
        artist: null,
        albums: [],
        topTracks: [],
        relatedArtists: []
      };
    }
  }



  // Search for artists by name and get full details
  async searchAndGetArtistDetails(artistName: string) {
    try {
      const artists = await this.searchArtists(artistName, 1);
      if (artists.length > 0) {
        return await this.getArtistFullDetails(artists[0].id);
      }
      return null;
    } catch (error) {
      console.error('Error searching and getting artist details:', error);
      return null;
    }
  }

  // Get multiple artists by names
  async getMultipleArtists(artistNames: string[]) {
    try {
      const artistPromises = artistNames.map(name => this.searchAndGetArtistDetails(name));
      const results = await Promise.allSettled(artistPromises);
      
      return results
        .map((result, index) => ({
          name: artistNames[index],
          data: result.status === 'fulfilled' ? result.value : null
        }))
        .filter(item => item.data !== null);
    } catch (error) {
      console.error('Error getting multiple artists:', error);
      return [];
    }
  }

  // Get trending artists (based on popularity)
  async getTrendingArtists(limit: number = 20): Promise<SpotifyArtist[]> {
    try {
      // Search for popular artists and sort by popularity
      const popularQueries = [
        'Taylor Swift', 'Ed Sheeran', 'Drake', 'Ariana Grande', 'Post Malone',
        'Billie Eilish', 'The Weeknd', 'Dua Lipa', 'BTS', 'Blackpink',
        'Arijit Singh', 'Shreya Ghoshal', 'Pritam', 'Neha Kakkar', 'Atif Aslam'
      ];

      const artistPromises = popularQueries.map(query => this.searchArtists(query, 1));
      const results = await Promise.allSettled(artistPromises);
      
      const allArtists = results
        .filter(result => result.status === 'fulfilled')
        .flatMap(result => (result as PromiseFulfilledResult<SpotifyArtist[]>).value)
        .filter(artist => artist.popularity > 70) // Only high popularity artists
        .sort((a, b) => b.popularity - a.popularity);

      return allArtists.slice(0, limit);
    } catch (error) {
      console.error('Error getting trending artists:', error);
      return [];
    }
  }

  // Get artist image URL (highest quality)
  getArtistImageUrl(artist: SpotifyArtist, size: 'small' | 'medium' | 'large' = 'large'): string {
    if (!artist.images || artist.images.length === 0) {
      return '/default-artist-image.jpg'; // Fallback image
    }

    const sizes = {
      small: 160,
      medium: 320,
      large: 640
    };

    const targetSize = sizes[size];
    const image = artist.images.find(img => img.width >= targetSize) || artist.images[0];
    
    return image.url;
  }

  // Format artist data for our community format
  formatArtistForCommunity(spotifyArtist: SpotifyArtist) {
    return {
      id: `spotify_${spotifyArtist.id}`,
      name: spotifyArtist.name,
      avatar: this.getArtistImageUrl(spotifyArtist, 'medium'),
      cover: this.getArtistImageUrl(spotifyArtist, 'large'),
      description: `${spotifyArtist.genres.slice(0, 3).join(', ')} • ${spotifyArtist.followers.total.toLocaleString()} followers`,
      type: 'musicArtist' as const,
      followers: spotifyArtist.followers.total,
      verified: spotifyArtist.popularity > 80,
      isActive: true,
      projects: [],
      tmdbId: parseInt(spotifyArtist.id.replace(/\D/g, '')) || 0,
      rating: spotifyArtist.popularity / 10,
      knownFor: spotifyArtist.genres.slice(0, 3),
      country: 'International',
      category: 'international'
    };
  }
}

// Create singleton instance
const spotifyApi = new SpotifyApiService();

export default spotifyApi;
export type { SpotifyArtist, SpotifyAlbum, SpotifyTrack }; 