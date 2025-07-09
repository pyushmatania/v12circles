# Setting Up Official Image Integration

## Quick Start Guide

### 1. Get API Keys (5 minutes)

#### TMDb (The Movie Database) - **REQUIRED**
1. Go to https://www.themoviedb.org/
2. Create a free account
3. Go to Settings → API
4. Request an API key (instant approval)
5. Copy your API key

#### Spotify Web API - **REQUIRED**
1. Go to https://developer.spotify.com/dashboard
2. Log in with Spotify account
3. Create a new app
4. Copy Client ID and Client Secret

### 2. Environment Setup

1. Copy `.env.example` to `.env`
2. Add your API keys:
```env
VITE_TMDB_API_KEY=your_actual_tmdb_key
VITE_SPOTIFY_CLIENT_ID=your_actual_spotify_client_id
VITE_SPOTIFY_CLIENT_SECRET=your_actual_spotify_client_secret
```

### 3. Update Project Images

```bash
# Install dependencies (if not already done)
npm install

# Run the image update script
node src/utils/updateProjectImages.js
```

### 4. Integration in Components

```jsx
import ImageManager from '../utils/ImageManager';

const imageManager = new ImageManager();

// Get movie poster
const movieData = await imageManager.getMovieData('Pathaan', 2023);
console.log(movieData.url); // Official poster URL

// Get album cover
const albumData = await imageManager.getAlbumCover('A.R. Rahman', 'Roja');
console.log(albumData.url); // Official album cover URL
```

## API Limits & Costs

- **TMDb**: Unlimited requests (free with attribution)
- **Spotify**: 100 requests/hour (free)
- **OMDb**: 1000 requests/day (free tier)

## Legal Compliance

✅ **What's Allowed:**
- Using API-provided images for promotional purposes
- Displaying with proper attribution
- Editorial/review use

❌ **What's NOT Allowed:**
- Removing watermarks or attribution
- Using for unrelated commercial purposes
- Claiming ownership of images

## Attribution Requirements

Always include attribution when using API images:

```jsx
<ImageAttribution 
  attribution="The Movie Database (TMDb)"
  copyright="© The Movie Database (TMDb)"
/>
```

## Troubleshooting

### Common Issues:

1. **"API key invalid"**
   - Check your .env file
   - Ensure no extra spaces in API key
   - Restart development server

2. **"No images found"**
   - Check spelling of movie/artist names
   - Try different search terms
   - Some content may not be available

3. **"Rate limit exceeded"**
   - Add delays between requests
   - Use caching to reduce API calls
   - Consider upgrading to paid tiers

### Getting Help:

- TMDb API Docs: https://developers.themoviedb.org/3
- Spotify API Docs: https://developer.spotify.com/documentation/web-api/
- OMDb API Docs: http://www.omdbapi.com/

## Next Steps

1. **Phase 1**: Set up APIs and test with a few projects
2. **Phase 2**: Batch update all existing projects
3. **Phase 3**: Implement real-time image fetching for new projects
4. **Phase 4**: Add admin panel for manual image management

## Production Considerations

- Implement image caching/CDN
- Add fallback images for failed API calls
- Monitor API usage and costs
- Set up error tracking for failed image loads
- Consider image optimization (WebP, compression)