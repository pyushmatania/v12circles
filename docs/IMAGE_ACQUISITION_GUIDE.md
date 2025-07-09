# Official Poster & Image Acquisition Guide for Circles

## Legal Ways to Obtain Official Movie Posters & Album Covers

### 1. **Free APIs for Movie Posters**

#### The Movie Database (TMDb) - **RECOMMENDED**
- **Website**: https://www.themoviedb.org/
- **API**: https://developers.themoviedb.org/3
- **Cost**: Free (with attribution)
- **Features**: 
  - High-quality movie posters
  - Multiple poster sizes
  - Backdrop images
  - Cast photos
  - Movie metadata

**Setup Steps:**
1. Create account at TMDb
2. Request API key (instant approval)
3. Use their poster URLs directly
4. Add attribution: "This product uses the TMDB API but is not endorsed or certified by TMDB"

**Example API Call:**
```javascript
// Get movie details with poster
const response = await fetch(
  `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=Pathaan`
);
const data = await response.json();
const posterUrl = `https://image.tmdb.org/t/p/w500${data.results[0].poster_path}`;
```

#### OMDb API (Alternative)
- **Website**: http://www.omdbapi.com/
- **Cost**: Free tier (1000 requests/day)
- **Features**: Movie posters, plot, ratings

### 2. **Music Album Covers**

#### Spotify Web API - **RECOMMENDED**
- **Website**: https://developer.spotify.com/
- **Cost**: Free
- **Features**: 
  - High-quality album artwork
  - Artist images
  - Track information

**Setup Steps:**
1. Create Spotify Developer account
2. Create an app to get Client ID/Secret
3. Use Client Credentials flow for public data

**Example API Call:**
```javascript
// Search for album and get cover art
const response = await fetch(
  `https://api.spotify.com/v1/search?q=artist:A.R.Rahman&type=album`,
  {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  }
);
const data = await response.json();
const albumCover = data.albums.items[0].images[0].url;
```

#### Last.fm API (Alternative)
- **Website**: https://www.last.fm/api
- **Cost**: Free
- **Features**: Album artwork, artist info

#### Apple Music API (iTunes Search)
- **Website**: https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/
- **Cost**: Free (no authentication required)
- **Features**: Album artwork, metadata

### 3. **Official Studio Sources**

#### Direct Studio Websites
- **Bollywood**: Yash Raj Films, Dharma Productions, Excel Entertainment
- **Hollywood**: Disney, Warner Bros, Universal, Sony Pictures
- **Regional**: Lyca Productions, Hombale Films, Mythri Movie Makers

**How to Use:**
1. Visit official movie pages
2. Right-click and save promotional images
3. Ensure you have rights to use (usually allowed for promotional purposes)

#### Press Kits & Media Centers
- Most studios provide press kits with high-res images
- Usually free for editorial/promotional use
- Examples:
  - Disney Press: https://press.disney.com/
  - Warner Bros: https://www.warnerbros.com/company/divisions/motion-pictures

### 4. **Image Rights & Legal Considerations**

#### Fair Use Guidelines
- **Promotional Use**: Generally allowed for promoting the actual content
- **Editorial Use**: Reviews, news, educational content
- **Commercial Use**: Requires explicit permission

#### Attribution Requirements
- Always credit the source
- Include copyright notices when required
- Example: "© 2024 Yash Raj Films. All rights reserved."

#### Safe Practices
- Use official APIs when available
- Keep records of where images were obtained
- Include proper attribution
- Consider getting explicit permission for commercial use

### 5. **Implementation Strategy for Circles**

#### Phase 1: API Integration
```javascript
// Image service utility
class ImageService {
  async getMoviePoster(title, year) {
    // Try TMDb first
    const tmdbResult = await this.searchTMDb(title, year);
    if (tmdbResult) return tmdbResult;
    
    // Fallback to OMDb
    const omdbResult = await this.searchOMDb(title, year);
    return omdbResult;
  }
  
  async getAlbumCover(artist, album) {
    // Try Spotify first
    const spotifyResult = await this.searchSpotify(artist, album);
    if (spotifyResult) return spotifyResult;
    
    // Fallback to Last.fm
    const lastfmResult = await this.searchLastFm(artist, album);
    return lastfmResult;
  }
}
```

#### Phase 2: Manual Curation
- Create admin panel for manual image uploads
- Verify image rights before adding
- Maintain image metadata (source, rights, attribution)

#### Phase 3: Hybrid Approach
- Use APIs for popular content
- Manual curation for regional/independent content
- Community submissions with moderation

### 6. **Recommended Image Specifications**

#### Movie Posters
- **Aspect Ratio**: 2:3 (portrait)
- **Minimum Resolution**: 500x750px
- **Preferred Resolution**: 1000x1500px
- **Format**: JPEG or WebP
- **File Size**: Under 500KB

#### Album Covers
- **Aspect Ratio**: 1:1 (square)
- **Minimum Resolution**: 500x500px
- **Preferred Resolution**: 1000x1000px
- **Format**: JPEG or WebP
- **File Size**: Under 300KB

### 7. **Cost-Effective Solutions**

#### Free Tier Limits
- **TMDb**: Unlimited (with attribution)
- **Spotify**: 100 requests/hour
- **OMDb**: 1000 requests/day
- **Last.fm**: 5 requests/second

#### Paid Options (if needed)
- **OMDb**: $1/month for 100K requests
- **Getty Images**: Licensed stock photos
- **Shutterstock**: Licensed entertainment images

### 8. **Legal Compliance Checklist**

- [ ] API terms of service reviewed
- [ ] Attribution requirements implemented
- [ ] Image usage rights documented
- [ ] DMCA takedown process established
- [ ] Copyright notices included
- [ ] Fair use guidelines followed

### 9. **Next Steps for Implementation**

1. **Immediate**: Set up TMDb and Spotify API accounts
2. **Week 1**: Implement basic API integration
3. **Week 2**: Create image management system
4. **Week 3**: Add fallback mechanisms
5. **Week 4**: Implement caching and optimization

### 10. **Sample Implementation Code**

See the accompanying `ImageManager.js` file for a complete implementation example.

---

**Important Note**: Always consult with a legal professional for commercial use of copyrighted images. This guide provides general information but doesn't constitute legal advice.