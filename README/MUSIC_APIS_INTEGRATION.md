# Music APIs Integration Guide

This document outlines the music APIs integrated into the v12-circles project for enhanced music artist data, videos, and images.

## 🎵 Spotify API Integration

### Configuration
- **Client ID**: `4a91e1d58f6a436ab83b2e6170f428d7`
- **Client Secret**: `601baa35b7014e55a076ab80f600eb03`
- **Base URL**: `https://api.spotify.com/v1`
- **Rate Limit**: 25 requests/second (free tier)

### Features Available
- ✅ Artist profiles and images
- ✅ Albums and tracks
- ✅ Audio features and analysis
- ✅ Playlists and recommendations
- ✅ Real-time popularity metrics
- ✅ Genre classification
- ✅ Related artists

### Authentication Flow
```typescript
// 1. Get Access Token
const getSpotifyToken = async () => {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)
    },
    body: 'grant_type=client_credentials'
  });
  return response.json();
};

// 2. Search for Artists
const searchSpotifyArtist = async (query: string) => {
  const token = await getSpotifyToken();
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${query}&type=artist&limit=5`,
    {
      headers: {
        'Authorization': `Bearer ${token.access_token}`
      }
    }
  );
  return response.json();
};
```

### Example API Endpoints

#### Search Artists
```
GET https://api.spotify.com/v1/search?q=arjit%20singh&type=artist&limit=5
```

#### Get Artist Details
```
GET https://api.spotify.com/v1/artists/{id}
```

#### Get Artist Albums
```
GET https://api.spotify.com/v1/artists/{id}/albums?include_groups=album,single
```

#### Get Artist Top Tracks
```
GET https://api.spotify.com/v1/artists/{id}/top-tracks?market=IN
```

## 🎬 YouTube Data API v3

### Configuration
- **API Key**: [Add your YouTube API key here]
- **Base URL**: `https://www.googleapis.com/youtube/v3`
- **Rate Limit**: 10,000 units/day (free tier)

### Features Available
- ✅ Music videos
- ✅ Artist channels
- ✅ Playlists
- ✅ Live performances
- ✅ Behind-the-scenes content

### Example Usage
```typescript
const searchYouTubeVideos = async (query: string) => {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=10&key=${YOUTUBE_API_KEY}`
  );
  return response.json();
};
```

## 🖼️ Image APIs

### Unsplash API
- **API Key**: [Add your Unsplash API key here]
- **Rate Limit**: 5,000 requests/hour
- **Features**: High-quality artist photos, concert images

### Pexels API
- **API Key**: [Add your Pexels API key here]
- **Rate Limit**: 200 requests/hour
- **Features**: Artist photos, music-related images

## 📊 Last.fm API

### Configuration
- **API Key**: [Add your Last.fm API key here]
- **Base URL**: `https://ws.audioscrobbler.com/2.0/`
- **Rate Limit**: 5 requests/second

### Features Available
- ✅ Artist info and bio
- ✅ Track scrobbles
- ✅ User listening history
- ✅ Music recommendations
- ✅ Genre information

### Example Usage
```typescript
const getLastfmArtistInfo = async (artistName: string) => {
  const response = await fetch(
    `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artistName}&api_key=${LASTFM_API_KEY}&format=json`
  );
  return response.json();
};
```

## 🎵 iTunes Search API

### Configuration
- **Base URL**: `https://itunes.apple.com`
- **Rate Limit**: No limits
- **Authentication**: None required

### Features Available
- ✅ Music, movies, podcasts
- ✅ Artist information
- ✅ Album artwork
- ✅ Preview URLs

### Example Usage
```typescript
const searchiTunes = async (query: string) => {
  const response = await fetch(
    `https://itunes.apple.com/search?term=${query}&entity=musicArtist&limit=10`
  );
  return response.json();
};
```

## 🔧 Implementation Guide

### 1. Environment Variables
Create a `.env` file in your project root:
```env
# Spotify API
VITE_SPOTIFY_CLIENT_ID=4a91e1d58f6a436ab83b2e6170f428d7
VITE_SPOTIFY_CLIENT_SECRET=601baa35b7014e55a076ab80f600eb03

# YouTube API
VITE_YOUTUBE_API_KEY=your_youtube_api_key_here

# Last.fm API
VITE_LASTFM_API_KEY=your_lastfm_api_key_here

# Unsplash API
VITE_UNSPLASH_API_KEY=your_unsplash_api_key_here

# Pexels API
VITE_PEXELS_API_KEY=your_pexels_api_key_here
```

### 2. API Service Structure
```typescript
// src/services/musicApi.ts
export class MusicApiService {
  // Spotify methods
  async getSpotifyArtist(id: string) { /* ... */ }
  async searchSpotifyArtists(query: string) { /* ... */ }
  async getSpotifyArtistAlbums(id: string) { /* ... */ }
  
  // YouTube methods
  async searchYouTubeVideos(query: string) { /* ... */ }
  async getArtistChannel(artistName: string) { /* ... */ }
  
  // Last.fm methods
  async getLastfmArtistInfo(artistName: string) { /* ... */ }
  async getArtistTopTracks(artistName: string) { /* ... */ }
  
  // iTunes methods
  async searchiTunes(query: string) { /* ... */ }
  async getiTunesArtistInfo(artistId: string) { /* ... */ }
}
```

### 3. React Hook Integration
```typescript
// src/hooks/useMusicData.ts
export const useMusicData = (artistName: string) => {
  const [spotifyData, setSpotifyData] = useState(null);
  const [youtubeData, setYoutubeData] = useState(null);
  const [lastfmData, setLastfmData] = useState(null);
  
  useEffect(() => {
    // Fetch data from multiple APIs
    const fetchMusicData = async () => {
      const musicApi = new MusicApiService();
      
      // Parallel API calls
      const [spotify, youtube, lastfm] = await Promise.allSettled([
        musicApi.searchSpotifyArtists(artistName),
        musicApi.searchYouTubeVideos(artistName),
        musicApi.getLastfmArtistInfo(artistName)
      ]);
      
      setSpotifyData(spotify.status === 'fulfilled' ? spotify.value : null);
      setYoutubeData(youtube.status === 'fulfilled' ? youtube.value : null);
      setLastfmData(lastfm.status === 'fulfilled' ? lastfm.value : null);
    };
    
    fetchMusicData();
  }, [artistName]);
  
  return { spotifyData, youtubeData, lastfmData };
};
```

## 🎯 Use Cases in v12-circles

### 1. Enhanced Music Artist Profiles
- Real-time Spotify popularity metrics
- Latest album releases
- Top tracks and audio features
- High-quality artist images from multiple sources

### 2. Music Video Integration
- YouTube music videos
- Live performances
- Behind-the-scenes content
- Official music channels

### 3. Rich Content Discovery
- Related artists recommendations
- Genre-based suggestions
- User listening history (if authenticated)
- Trending music content

### 4. Community Features
- Music discussions
- Playlist sharing
- Concert announcements
- Artist fan communities

## 🔒 Security Considerations

### 1. API Key Protection
- Never expose API keys in client-side code
- Use environment variables
- Implement server-side proxy for sensitive operations

### 2. Rate Limiting
- Implement request caching
- Use exponential backoff for retries
- Monitor API usage

### 3. Data Privacy
- Respect user privacy settings
- Implement proper data retention policies
- Follow GDPR compliance

## 📈 Performance Optimization

### 1. Caching Strategy
```typescript
// Implement Redis or localStorage caching
const cacheKey = `spotify_artist_${artistId}`;
const cached = localStorage.getItem(cacheKey);

if (cached) {
  return JSON.parse(cached);
}

// Fetch and cache
const data = await fetchSpotifyArtist(artistId);
localStorage.setItem(cacheKey, JSON.stringify(data));
return data;
```

### 2. Lazy Loading
- Load music data on demand
- Implement infinite scrolling for large datasets
- Use skeleton loading states

### 3. Image Optimization
- Use appropriate image sizes
- Implement progressive loading
- Cache images with service workers

## 🚀 Getting Started

1. **Set up environment variables** with your API keys
2. **Install required dependencies**:
   ```bash
   npm install axios @types/spotify-web-api-node
   ```
3. **Create API service files** following the structure above
4. **Integrate with React components** using custom hooks
5. **Test API endpoints** and implement error handling
6. **Deploy with proper environment configuration**

## 📚 Additional Resources

- [Spotify Web API Documentation](https://developer.spotify.com/documentation/web-api/)
- [YouTube Data API Documentation](https://developers.google.com/youtube/v3)
- [Last.fm API Documentation](https://www.last.fm/api)
- [iTunes Search API](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/)

## 🔄 API Status Monitoring

Monitor API health and rate limits:
- Spotify: Check response headers for rate limit info
- YouTube: Monitor quota usage in Google Cloud Console
- Last.fm: Check API status at https://status.last.fm

---

**Note**: Keep your API keys secure and never commit them to version control. Use environment variables and proper security practices in production. 