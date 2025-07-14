const fs = require('fs');
const path = require('path');

// Spotify API credentials
const clientId = '4a91e1d58f6a436ab83b2e6170f428d7';
const clientSecret = '601baa35b7014e55a076ab80f600eb03';

class SpotifyImageFetcher {
  constructor() {
    this.baseUrl = 'https://api.spotify.com/v1';
    this.token = null;
    this.tokenExpiry = 0;
  }

  // Get access token
  async getAccessToken() {
    if (this.token && Date.now() < this.tokenExpiry) {
      return this.token;
    }

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
        },
        body: 'grant_type=client_credentials'
      });

      if (!response.ok) {
        throw new Error(`Failed to get Spotify token: ${response.statusText}`);
      }

      const data = await response.json();
      this.token = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000;
      return this.token;
    } catch (error) {
      console.error('Error getting Spotify access token:', error);
      throw error;
    }
  }

  // Search for artist
  async searchArtist(artistName) {
    try {
      const token = await this.getAccessToken();
      const response = await fetch(
        `${this.baseUrl}/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`,
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
      return data.artists.items[0] || null;
    } catch (error) {
      console.error(`Error searching artist ${artistName}:`, error);
      return null;
    }
  }

  // Get artist image URL
  getArtistImageUrl(artist, size = 'large') {
    if (!artist || !artist.images || artist.images.length === 0) {
      return null;
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

  // Fetch images for all artists
  async fetchAllArtistImages(artistNames, batchSize = 10, delayMs = 2000) {
    const results = {};
    const batches = this.chunkArray(artistNames, batchSize);
    
    console.log(`Starting batch fetch for ${artistNames.length} artists in ${batches.length} batches of ${batchSize}`);
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`Processing batch ${i + 1}/${batches.length} with ${batch.length} artists`);
      
      try {
        const batchPromises = batch.map(async (artistName) => {
          try {
            const artist = await this.searchArtist(artistName);
            if (artist) {
              return {
                name: artistName,
                spotifyData: {
                  id: artist.id,
                  name: artist.name,
                  avatar: this.getArtistImageUrl(artist, 'medium'),
                  cover: this.getArtistImageUrl(artist, 'large'),
                  popularity: artist.popularity,
                  followers: artist.followers?.total || 0,
                  genres: artist.genres || [],
                  spotifyUrl: artist.external_urls?.spotify
                }
              };
            }
            return { name: artistName, spotifyData: null };
          } catch (error) {
            console.error(`Error fetching artist ${artistName}:`, error);
            return { name: artistName, spotifyData: null };
          }
        });
        
        const batchResults = await Promise.all(batchPromises);
        
        batchResults.forEach(({ name, spotifyData }) => {
          if (spotifyData) {
            results[name] = spotifyData;
          }
        });
        
        console.log(`Batch ${i + 1} completed. Found ${batchResults.filter(r => r.spotifyData).length}/${batch.length} artists`);
        
        if (i < batches.length - 1) {
          console.log(`Waiting ${delayMs}ms before next batch...`);
          await this.delay(delayMs);
        }
        
      } catch (error) {
        console.error(`Error processing batch ${i + 1}:`, error);
      }
    }
    
    console.log(`Batch fetch completed. Total artists found: ${Object.keys(results).length}/${artistNames.length}`);
    return results;
  }

  chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

async function fetchAndSaveSpotifyImages() {
  console.log('🎵 Starting Spotify image fetch and save process...\n');
  
  // Get all music artist names from the comprehensive data
  const comprehensiveDataPath = path.join(__dirname, '../src/data/comprehensiveCommunityData.ts');
  const comprehensiveDataContent = fs.readFileSync(comprehensiveDataPath, 'utf8');
  
  // Extract music artist names using regex
  const musicArtistMatches = comprehensiveDataContent.match(/name:\s*['"`]([^'"`]+)['"`]/g);
  const musicArtistNames = musicArtistMatches 
    ? musicArtistMatches.map(match => match.match(/name:\s*['"`]([^'"`]+)['"`]/)[1])
    : [];
  
  console.log(`Found ${musicArtistNames.length} music artists to process`);
  
  // Add some additional popular artists
  const additionalArtists = [
    'Taylor Swift', 'Ed Sheeran', 'Drake', 'Ariana Grande', 'Post Malone',
    'Billie Eilish', 'The Weeknd', 'Dua Lipa', 'BTS', 'Blackpink',
    'Yo Yo Honey Singh', 'Badshah', 'Raftaar', 'Neha Kakkar', 'Atif Aslam',
    'Shreya Ghoshal', 'Arijit Singh', 'Pritam', 'Sunidhi Chauhan', 'Kumar Sanu'
  ];
  
  const allArtistNames = [...new Set([...musicArtistNames, ...additionalArtists])];
  console.log(`Total unique artists to process: ${allArtistNames.length}\n`);
  
  const fetcher = new SpotifyImageFetcher();
  
  try {
    const startTime = Date.now();
    const spotifyData = await fetcher.fetchAllArtistImages(allArtistNames, 10, 2000);
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    console.log(`\n✅ Fetch completed in ${duration.toFixed(2)} seconds`);
    console.log(`📊 Found data for ${Object.keys(spotifyData).length}/${allArtistNames.length} artists`);
    
    // Save to JSON file
    const outputPath = path.join(__dirname, '../src/data/spotifyArtistImages.json');
    const outputData = {
      fetchedAt: new Date().toISOString(),
      totalArtists: allArtistNames.length,
      foundArtists: Object.keys(spotifyData).length,
      duration: duration,
      artists: spotifyData
    };
    
    fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));
    console.log(`💾 Saved to: ${outputPath}`);
    
    // Show summary
    console.log('\n📋 Summary:');
    Object.entries(spotifyData).forEach(([name, data]) => {
      console.log(`✓ ${name}: ${data.popularity} popularity, ${data.followers.toLocaleString()} followers`);
    });
    
    // Show missing artists
    const missingArtists = allArtistNames.filter(name => !spotifyData[name]);
    if (missingArtists.length > 0) {
      console.log(`\n❌ Missing artists (${missingArtists.length}):`);
      missingArtists.forEach(name => console.log(`  - ${name}`));
    }
    
  } catch (error) {
    console.error('❌ Error in fetch process:', error);
  }
}

// Run the script
fetchAndSaveSpotifyImages(); 