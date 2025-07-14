const fs = require('fs');
const path = require('path');

// Spotify API credentials
const SPOTIFY_CLIENT_ID = '4a91e1d58f6a436ab83b2e6170f428d7';
const SPOTIFY_CLIENT_SECRET = '601baa35b7014e55a076ab80f600eb03';

// YouTube API key
const YOUTUBE_API_KEY = 'AIzaSyAn5g5nxNOE_2g-QXTgtJfnE0vTzyy6R0U';

// Hindi Music (Individual Songs)
const hindiMusic = [
  { title: 'Chaiyya Chaiyya', artist: 'A.R. Rahman', year: 1998, genre: 'Film Soundtrack' },
  { title: 'Jai Ho', artist: 'A.R. Rahman', year: 2008, genre: 'Film Soundtrack' },
  { title: 'Tere Bina', artist: 'A.R. Rahman', year: 2006, genre: 'Film Soundtrack' },
  { title: 'Kun Faya Kun', artist: 'A.R. Rahman', year: 2011, genre: 'Film Soundtrack' },
  { title: 'Nadaan Parinde', artist: 'A.R. Rahman', year: 2011, genre: 'Film Soundtrack' },
  { title: 'Tum Hi Ho', artist: 'Arijit Singh', year: 2013, genre: 'Film Soundtrack' },
  { title: 'Raabta', artist: 'Pritam', year: 2012, genre: 'Film Soundtrack' },
  { title: 'Raataan Lambiyan', artist: 'Jubin Nautiyal', year: 2021, genre: 'Film Soundtrack' },
  { title: 'Kesariya', artist: 'Arijit Singh', year: 2022, genre: 'Film Soundtrack' },
  { title: 'Naatu Naatu', artist: 'M.M. Keeravani', year: 2022, genre: 'Film Soundtrack' },
  { title: 'Saami Saami', artist: 'Mounika Yadav', year: 2021, genre: 'Film Soundtrack' },
  { title: 'Oo Antava', artist: 'Indravathi Chauhan', year: 2021, genre: 'Film Soundtrack' },
  { title: 'Srivalli', artist: 'Sid Sriram', year: 2021, genre: 'Film Soundtrack' },
  { title: 'Saami Saami', artist: 'Mounika Yadav', year: 2021, genre: 'Film Soundtrack' },
  { title: 'Oo Antava', artist: 'Indravathi Chauhan', year: 2021, genre: 'Film Soundtrack' },
  { title: 'Srivalli', artist: 'Sid Sriram', year: 2021, genre: 'Film Soundtrack' },
  { title: 'Saami Saami', artist: 'Mounika Yadav', year: 2021, genre: 'Film Soundtrack' },
  { title: 'Oo Antava', artist: 'Indravathi Chauhan', year: 2021, genre: 'Film Soundtrack' },
  { title: 'Srivalli', artist: 'Sid Sriram', year: 2021, genre: 'Film Soundtrack' },
  { title: 'Saami Saami', artist: 'Mounika Yadav', year: 2021, genre: 'Film Soundtrack' },
  { title: 'Oo Antava', artist: 'Indravathi Chauhan', year: 2021, genre: 'Film Soundtrack' },
  { title: 'Srivalli', artist: 'Sid Sriram', year: 2021, genre: 'Film Soundtrack' },
  { title: 'Saami Saami', artist: 'Mounika Yadav', year: 2021, genre: 'Film Soundtrack' },
  { title: 'Oo Antava', artist: 'Indravathi Chauhan', year: 2021, genre: 'Film Soundtrack' },
  { title: 'Srivalli', artist: 'Sid Sriram', year: 2021, genre: 'Film Soundtrack' },
  { title: 'Saami Saami', artist: 'Mounika Yadav', year: 2021, genre: 'Film Soundtrack' },
  { title: 'Oo Antava', artist: 'Indravathi Chauhan', year: 2021, genre: 'Film Soundtrack' },
  { title: 'Srivalli', artist: 'Sid Sriram', year: 2021, genre: 'Film Soundtrack' }
];

// Hollywood Music (Individual Songs)
const hollywoodMusic = [
  { title: 'Anti-Hero', artist: 'Taylor Swift', year: 2022, genre: 'Pop' },
  { title: 'Cruel Summer', artist: 'Taylor Swift', year: 2019, genre: 'Pop' },
  { title: 'Vampire', artist: 'Olivia Rodrigo', year: 2023, genre: 'Pop' },
  { title: 'Flowers', artist: 'Miley Cyrus', year: 2023, genre: 'Pop' },
  { title: 'Kill Bill', artist: 'SZA', year: 2022, genre: 'R&B' },
  { title: 'Unholy', artist: 'Sam Smith & Kim Petras', year: 2022, genre: 'Pop' },
  { title: 'As It Was', artist: 'Harry Styles', year: 2022, genre: 'Pop' },
  { title: 'Late Night Talking', artist: 'Harry Styles', year: 2022, genre: 'Pop' },
  { title: 'Shivers', artist: 'Ed Sheeran', year: 2021, genre: 'Pop' },
  { title: 'Bad Habit', artist: 'Steve Lacy', year: 2022, genre: 'R&B' },
  { title: 'About Damn Time', artist: 'Lizzo', year: 2022, genre: 'Pop' },
  { title: 'Break My Soul', artist: 'Beyoncé', year: 2022, genre: 'R&B' },
  { title: 'Hold Me Closer', artist: 'Elton John & Britney Spears', year: 2022, genre: 'Pop' },
  { title: 'I\'m Good (Blue)', artist: 'David Guetta & Bebe Rexha', year: 2022, genre: 'Pop' },
  { title: 'Lift Me Up', artist: 'Rihanna', year: 2022, genre: 'R&B' },
  { title: 'Unstoppable', artist: 'Sia', year: 2016, genre: 'Pop' },
  { title: 'Blinding Lights', artist: 'The Weeknd', year: 2019, genre: 'Pop' },
  { title: 'Dance Monkey', artist: 'Tones and I', year: 2019, genre: 'Pop' },
  { title: 'Old Town Road', artist: 'Lil Nas X', year: 2019, genre: 'Country' },
  { title: 'Shape of You', artist: 'Ed Sheeran', year: 2017, genre: 'Pop' },
  { title: 'Despacito', artist: 'Luis Fonsi & Daddy Yankee', year: 2017, genre: 'Reggaeton' },
  { title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars', year: 2014, genre: 'Pop' },
  { title: 'Happy', artist: 'Pharrell Williams', year: 2013, genre: 'Pop' },
  { title: 'Roar', artist: 'Katy Perry', year: 2013, genre: 'Pop' },
  { title: 'We Found Love', artist: 'Rihanna ft. Calvin Harris', year: 2011, genre: 'Pop' },
  { title: 'Rolling in the Deep', artist: 'Adele', year: 2010, genre: 'Pop' },
  { title: 'Someone Like You', artist: 'Adele', year: 2011, genre: 'Pop' },
  { title: 'Firework', artist: 'Katy Perry', year: 2010, genre: 'Pop' }
];

// Spotify API functions
async function getSpotifyToken() {
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      throw new Error(`Failed to get Spotify token: ${response.statusText}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting Spotify access token:', error);
    return null;
  }
}

async function searchSpotifyTrack(artist, track, token) {
  try {
    const query = `${artist} ${track}`;
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`,
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
    return data.tracks?.items?.[0] || null;
  } catch (error) {
    console.error(`Error searching Spotify for ${artist} - ${track}:`, error);
    return null;
  }
}

async function getSpotifyArtist(artistName, token) {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`,
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
    return data.artists?.items?.[0] || null;
  } catch (error) {
    console.error(`Error searching Spotify artist ${artistName}:`, error);
    return null;
  }
}

// YouTube API function
async function fetchYouTubeVideo(artist, track) {
  if (YOUTUBE_API_KEY === 'your_youtube_api_key') {
    console.log(`⚠️  No YouTube API key set for: ${track} - using fallback video URL`);
    return null;
  }

  const queries = [
    `${artist} ${track} official video`,
    `${artist} ${track} music video`,
    `${artist} ${track}`
  ];

  for (const searchQuery of queries) {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&videoDuration=short&maxResults=1&key=${YOUTUBE_API_KEY}`;
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if (data && data.items && data.items.length > 0) {
          const videoId = data.items[0].id.videoId;
          const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
          console.log(`🎬 Found YouTube video for: ${track} (query: ${searchQuery})`);
          return videoUrl;
        }
      }
    } catch (error) {
      console.error(`Error fetching YouTube video for: ${track} - ${error.message}`);
    }
  }
  return null;
}

// Generate music data
async function generateMusicAlbums() {
  console.log('🎵 Generating music tracks with Spotify and YouTube API integration...');
  
  const token = await getSpotifyToken();
  if (!token) {
    console.error('❌ Failed to get Spotify token. Using fallback data.');
  }

  const musicTracks = [];
  let idCounter = 1000; // Start from 1000 to avoid conflicts with existing projects

  // Process Hindi music
  for (const track of hindiMusic) {
    console.log(`Processing Hindi track: ${track.artist} - ${track.title}`);
    
    let spotifyData = null;
    let artistData = null;
    let youtubeVideo = null;
    
    if (token) {
      spotifyData = await searchSpotifyTrack(track.artist, track.title, token);
      artistData = await getSpotifyArtist(track.artist, token);
      
      // Add delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    youtubeVideo = await fetchYouTubeVideo(track.artist, track.title);

    const poster = spotifyData?.album?.images?.[0]?.url || 
                   `https://via.placeholder.com/500x750/1DB954/FFFFFF?text=${encodeURIComponent(track.title)}`;
    
    const artistImage = artistData?.images?.[0]?.url || 
                       `https://via.placeholder.com/300x300/1DB954/FFFFFF?text=${encodeURIComponent(track.artist)}`;

    const musicTrack = {
      id: (idCounter++).toString(),
      title: track.title,
      type: "music",
      category: "Hindi Music",
      language: "Hindi",
      status: "active",
      fundedPercentage: Math.floor(Math.random() * 80) + 10,
      targetAmount: Math.floor(Math.random() * 50000000) + 10000000,
      raisedAmount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      poster: poster,
      description: `${track.title} is a ${track.genre.toLowerCase()} song by ${track.artist}, released in ${track.year}. This captivating track showcases ${track.artist}'s musical brilliance and has become a cultural phenomenon.`,
      artist: track.artist,
      genre: track.genre,
      tags: [track.genre, track.artist, "Hindi", "Music", "Song"],
      perks: [
        "Digital Song Download",
        "Exclusive Behind-the-Scenes Content",
        "Meet & Greet with Artist",
        "Limited Edition Vinyl",
        "Concert Tickets",
        "Studio Session Experience"
      ],
      rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 to 5.0
      trailer: youtubeVideo || `https://www.youtube.com/results?search_query=${encodeURIComponent(track.artist + ' ' + track.title)}`,
      movie: track.title,
      keyPeople: [
        {
          id: `${track.artist.toLowerCase().replace(/\s+/g, '_')}_artist`,
          name: track.artist,
          role: "artist",
          isMainCast: true,
          orderIndex: 0,
          profileImage: artistImage
        }
      ],
      actor: track.artist,
      actress: "",
      productionHouse: track.artist,
      targetAmountHuman: `${Math.floor((Math.floor(Math.random() * 50000000) + 10000000) / 100000)} crore`,
      raisedAmountHuman: "0",
      keyCommunityData: [
        {
          id: `kc_${idCounter}`,
          movieId: (idCounter - 1).toString(),
          movieName: track.title,
          productionHouse: track.artist,
          keyPeople: [track.artist],
          actor: track.artist,
          actress: "",
          director: track.artist
        }
      ],
      disabled: false,
      featured: Math.random() > 0.7,
      releaseYear: track.year,
      country: "India",
      tmdbGenres: [track.genre],
      spokenLanguages: ["Hindi"],
      tmdbOverview: `${track.title} represents a milestone in ${track.artist}'s career, showcasing their evolution as a musician and their ability to create timeless melodies that resonate with audiences across generations.`,
      tagline: `Experience the magic of ${track.artist}'s ${track.title}`,
      spotifyId: spotifyData?.id || null,
      spotifyUrl: spotifyData?.external_urls?.spotify || null,
      artistSpotifyId: artistData?.id || null,
      artistSpotifyUrl: artistData?.external_urls?.spotify || null,
      albumType: "single",
      totalTracks: 1,
      popularity: artistData?.popularity || Math.floor(Math.random() * 100),
      followers: artistData?.followers?.total || Math.floor(Math.random() * 10000000)
    };

    musicTracks.push(musicTrack);
  }

  // Process Hollywood music
  for (const track of hollywoodMusic) {
    console.log(`Processing Hollywood track: ${track.artist} - ${track.title}`);
    
    let spotifyData = null;
    let artistData = null;
    let youtubeVideo = null;
    
    if (token) {
      spotifyData = await searchSpotifyTrack(track.artist, track.title, token);
      artistData = await getSpotifyArtist(track.artist, token);
      
      // Add delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    youtubeVideo = await fetchYouTubeVideo(track.artist, track.title);

    const poster = spotifyData?.album?.images?.[0]?.url || 
                   `https://via.placeholder.com/500x750/1DB954/FFFFFF?text=${encodeURIComponent(track.title)}`;
    
    const artistImage = artistData?.images?.[0]?.url || 
                       `https://via.placeholder.com/300x300/1DB954/FFFFFF?text=${encodeURIComponent(track.artist)}`;

    const musicTrack = {
      id: (idCounter++).toString(),
      title: track.title,
      type: "music",
      category: "Hollywood Music",
      language: "English",
      status: "active",
      fundedPercentage: Math.floor(Math.random() * 80) + 10,
      targetAmount: Math.floor(Math.random() * 100000000) + 20000000,
      raisedAmount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      poster: poster,
      description: `${track.title} is a ${track.genre.toLowerCase()} song by ${track.artist}, released in ${track.year}. This critically acclaimed track showcases ${track.artist}'s artistic vision and has achieved global success.`,
      artist: track.artist,
      genre: track.genre,
      tags: [track.genre, track.artist, "English", "Music", "Song", "International"],
      perks: [
        "Digital Song Download",
        "Exclusive Behind-the-Scenes Content",
        "Meet & Greet with Artist",
        "Limited Edition Vinyl",
        "Concert Tickets",
        "Studio Session Experience",
        "International Tour Access"
      ],
      rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 to 5.0
      trailer: youtubeVideo || `https://www.youtube.com/results?search_query=${encodeURIComponent(track.artist + ' ' + track.title)}`,
      movie: track.title,
      keyPeople: [
        {
          id: `${track.artist.toLowerCase().replace(/\s+/g, '_')}_artist`,
          name: track.artist,
          role: "artist",
          isMainCast: true,
          orderIndex: 0,
          profileImage: artistImage
        }
      ],
      actor: track.artist,
      actress: "",
      productionHouse: track.artist,
      targetAmountHuman: `${Math.floor((Math.floor(Math.random() * 100000000) + 20000000) / 1000000)} million USD`,
      raisedAmountHuman: "0",
      keyCommunityData: [
        {
          id: `kc_${idCounter}`,
          movieId: (idCounter - 1).toString(),
          movieName: track.title,
          productionHouse: track.artist,
          keyPeople: [track.artist],
          actor: track.artist,
          actress: "",
          director: track.artist
        }
      ],
      disabled: false,
      featured: Math.random() > 0.7,
      releaseYear: track.year,
      country: "United States",
      tmdbGenres: [track.genre],
      spokenLanguages: ["English"],
      tmdbOverview: `${track.title} represents a defining moment in ${track.artist}'s career, demonstrating their growth as an artist and their ability to create music that transcends cultural boundaries.`,
      tagline: `Experience the evolution of ${track.artist}'s ${track.title}`,
      spotifyId: spotifyData?.id || null,
      spotifyUrl: spotifyData?.external_urls?.spotify || null,
      artistSpotifyId: artistData?.id || null,
      artistSpotifyUrl: artistData?.external_urls?.spotify || null,
      albumType: "single",
      totalTracks: 1,
      popularity: artistData?.popularity || Math.floor(Math.random() * 100),
      followers: artistData?.followers?.total || Math.floor(Math.random() * 10000000)
    };

    musicTracks.push(musicTrack);
  }

  // Calculate raised amounts based on funded percentage
  musicTracks.forEach(track => {
    track.raisedAmount = Math.floor((track.fundedPercentage / 100) * track.targetAmount);
    track.raisedAmountHuman = track.category === "Hindi Music" 
      ? `${Math.floor(track.raisedAmount / 100000)} lakh`
      : `${Math.floor(track.raisedAmount / 1000000)} million USD`;
  });

  console.log(`✅ Generated ${musicTracks.length} music tracks`);
  console.log(`📊 Hindi Tracks: ${hindiMusic.length}`);
  console.log(`📊 Hollywood Tracks: ${hollywoodMusic.length}`);

  return musicTracks;
}

// Main execution
async function main() {
  try {
    const musicTracks = await generateMusicAlbums();
    
    // Save to file
    const outputPath = path.join(__dirname, '..', 'src', 'data', 'musicAlbums.ts');
    const content = `// Auto-generated music tracks with Spotify and YouTube API integration
// Generated on: ${new Date().toISOString()}

import { Project } from '../types';

export const musicAlbums: Project[] = ${JSON.stringify(musicTracks, null, 2)};

export default musicAlbums;
`;

    fs.writeFileSync(outputPath, content);
    console.log(`💾 Music tracks saved to: ${outputPath}`);
    
    // Also save as JSON for backup
    const jsonPath = path.join(__dirname, '..', 'src', 'data', 'musicAlbums.json');
    fs.writeFileSync(jsonPath, JSON.stringify(musicTracks, null, 2));
    console.log(`💾 JSON backup saved to: ${jsonPath}`);
    
    console.log('🎉 Music track generation completed successfully!');
    
  } catch (error) {
    console.error('❌ Error generating music tracks:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { generateMusicAlbums }; 