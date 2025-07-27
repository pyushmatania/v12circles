require('dotenv').config();
const fs = require('fs');
const axios = require('axios');
const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
const https = require('https');
const http = require('http');

const OMDB_API_KEY = process.env.OMDB_API_KEY || 'http://www.omdbapi.com/?i=tt3896198&apikey=452457ab';
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || 'AIzaSyAn5g5nxNOE_2g-QXTgtJfnE0vTzyy6R0U';
const mockMode = true; // Set to false to keep current values for mock fields

const LAKH = 100000;
const CRORE = 10000000;
const MIN_TARGET = 10 * LAKH; // 10 lakhs
const MAX_TARGET = 10 * CRORE; // 10 crore

const argv = yargs(hideBin(process.argv))
  .option('mock', {
    alias: 'm',
    type: 'boolean',
    description: 'Enable mock mode (use fallback/random data)',
    default: process.env.MOCK_MODE === 'true',
  })
  .option('batchSize', {
    alias: 'b',
    type: 'number',
    description: 'Batch size for API requests',
    default: 10,
  })
  .option('throttleMs', {
    alias: 't',
    type: 'number',
    description: 'Throttle (ms) between batches',
    default: 1000,
  })
  .argv;

const BATCH_SIZE = argv.batchSize;
const THROTTLE_MS = argv.throttleMs;

function validateEnv() {
  if (!process.env.OMDB_API_KEY || process.env.OMDB_API_KEY === 'your_omdb_api_key') {
    console.warn('⚠️  OMDB_API_KEY is not set or is a placeholder. Real OMDb data will not be fetched.');
  }
  if (!process.env.YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY === 'your_youtube_api_key') {
    console.warn('⚠️  YOUTUBE_API_KEY is not set or is a placeholder. Real YouTube data will not be fetched.');
  }
}

function validatePosterUrl(url) {
  return new Promise((resolve) => {
    if (!url || url.includes('placeholder')) return resolve(false);
    const client = url.startsWith('https') ? https : http;
    const req = client.request(url, { method: 'HEAD' }, (res) => {
      resolve(res.statusCode >= 200 && res.statusCode < 400);
    });
    req.on('error', () => resolve(false));
    req.end();
  });
}

async function batchProcess(array, batchSize, fn, throttleMs) {
  let results = [];
  for (let i = 0; i < array.length; i += batchSize) {
    const batch = array.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(fn));
    results = results.concat(batchResults);
    if (i + batchSize < array.length) await new Promise(r => setTimeout(r, throttleMs));
  }
  return results;
}

function randomLakhCrore(min, max) {
  // Pick a random number of crores and lakhs for easy reading
  const crore = Math.floor(Math.random() * (max / CRORE - min / CRORE + 1)) + Math.floor(min / CRORE);
  let lakh = Math.floor(Math.random() * 100); // 0-99 lakhs
  if (crore === 0 && lakh < min / LAKH) lakh = Math.floor(min / LAKH);
  let amount = crore * CRORE + lakh * LAKH;
  if (amount < min) amount = min;
  if (amount > max) amount = max;
  return { amount, crore, lakh };
}

function humanAmountString(crore, lakh) {
  if (crore > 0 && lakh > 0) return `${crore} crore ${lakh} lakh`;
  if (crore > 0) return `${crore} crore`;
  if (lakh > 0) return `${lakh} lakh`;
  return '0';
}

function getFallbackData(title, type) {
  // Provide fallback data when OMDb is not available
  const fallbackPosters = {
    'film': 'https://via.placeholder.com/300x450/cccccc/666666?text=Movie+Poster',
    'webseries': 'https://via.placeholder.com/300x450/cccccc/666666?text=Series+Poster',
    'music': 'https://via.placeholder.com/300x300/cccccc/666666?text=Music+Album'
  };
  
  const fallbackDescriptions = {
    'film': `A compelling ${type} that explores themes of love, life, and human connection.`,
    'webseries': `An engaging ${type} that takes viewers on a journey through complex characters and intricate plotlines.`,
    'music': `A captivating ${type} that showcases musical talent and creative expression.`
  };
  
  return {
    poster: fallbackPosters[type] || fallbackPosters['film'],
    description: fallbackDescriptions[type] || fallbackDescriptions['film'],
    genre: type === 'film' ? 'Drama, Action' : type === 'webseries' ? 'Drama, Thriller' : 'Pop, Rock',
    rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3.0-5.0
    trailer: `https://www.youtube.com/results?search_query=${encodeURIComponent(title + ' trailer')}`
  };
}

function isPlaceholderPoster(posterUrl) {
  return posterUrl && (
    posterUrl.includes('via.placeholder.com') ||
    posterUrl.includes('placeholder') ||
    posterUrl === '' ||
    posterUrl === null ||
    posterUrl === undefined
  );
}

async function fetchOMDbData(title) {
  if (OMDB_API_KEY === 'your_omdb_api_key') {
    console.log(`⚠️  No OMDb API key set for: ${title} - using fallback data`);
    return null;
  }
  
  const url = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(title)}`;
  try {
    const res = await axios.get(url);
    if (res.data && res.data.Response === 'True') {
      console.log(`✅ Found OMDb data for: ${title}`);
      return res.data;
    } else {
      console.log(`❌ No OMDb data for: ${title}`);
    }
  } catch (e) {
    if (e.response && e.response.status === 401) {
      console.log(`🔑 Invalid OMDb API key for: ${title} - using fallback data`);
    } else {
      console.log(`🚨 Error fetching OMDb data for: ${title} - ${e.message}`);
    }
  }
  return null;
}

async function fetchYouTubeTrailer(title, type) {
  if (YOUTUBE_API_KEY === 'your_youtube_api_key') {
    console.log(`⚠️  No YouTube API key set for: ${title} - using fallback trailer URL`);
    return null;
  }

  // Try multiple queries for broader fallback
  const queries = [
    `${title} ${type === 'film' ? 'movie' : type === 'webseries' ? 'series' : 'music'} trailer`,
    `${title} official`,
    `${title}`
  ];

  for (const searchQuery of queries) {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&videoDuration=short&maxResults=1&key=${YOUTUBE_API_KEY}`;
    try {
      const res = await axios.get(url);
      if (res.data && res.data.items && res.data.items.length > 0) {
        const videoId = res.data.items[0].id.videoId;
        const trailerUrl = `https://www.youtube.com/watch?v=${videoId}`;
        console.log(`🎬 Found YouTube trailer for: ${title} (query: ${searchQuery})`);
        return trailerUrl;
      } else {
        console.log(`❌ No YouTube trailer found for: ${title} (query: ${searchQuery})`);
      }
    } catch (e) {
      if (e.response && e.response.status === 403) {
        console.log(`🔑 Invalid YouTube API key for: ${title} - using fallback trailer URL`);
        break;
      } else {
        console.log(`🚨 Error fetching YouTube trailer for: ${title} (query: ${searchQuery}) - ${e.message}`);
      }
    }
  }
  return null;
}

async function validateYouTubeApiKey() {
  if (YOUTUBE_API_KEY === 'your_youtube_api_key') return false;
  const url = `https://www.googleapis.com/youtube/v3/videos?part=id&id=dQw4w9WgXcQ&key=${YOUTUBE_API_KEY}`;
  try {
    const res = await axios.get(url);
    if (res.data && res.data.items) {
      return true;
    }
  } catch (e) {
    if (e.response && e.response.data && e.response.data.error) {
      const reason = e.response.data.error.errors?.[0]?.reason;
      if (reason === 'keyInvalid' || reason === 'quotaExceeded') {
        console.warn(`⚠️  YouTube API key is invalid or quota exceeded: ${reason}`);
        return false;
      }
    }
    console.warn(`⚠️  Error validating YouTube API key: ${e.message}`);
    return false;
  }
  return false;
}

function makeKeyCommunityData(project, omdb, uniqueId) {
  let actor = omdb && omdb.Actors ? omdb.Actors.split(',')[0].trim() : project.actor || '';
  let actress = omdb && omdb.Actors ? omdb.Actors.split(',')[1]?.trim() : project.actress || '';
  let productionHouse = omdb && omdb.Production && omdb.Production !== 'N/A' ? omdb.Production : project.productionHouse || '';
  let keyPeople = [];
  if (omdb) {
    if (omdb.Actors && omdb.Actors !== 'N/A') keyPeople.push(...omdb.Actors.split(',').map(s => s.trim()));
    if (omdb.Director && omdb.Director !== 'N/A') keyPeople.push(...omdb.Director.split(',').map(s => s.trim()));
    if (omdb.Writer && omdb.Writer !== 'N/A') keyPeople.push(...omdb.Writer.split(',').map(s => s.trim()));
    keyPeople = Array.from(new Set(keyPeople));
  }
  let director = omdb && omdb.Director && omdb.Director !== 'N/A' ? omdb.Director : project.director || '';
  return [{
    id: uniqueId,
    movieId: project.id,
    movieName: project.title,
    productionHouse,
    keyPeople,
    actor,
    actress,
    director
  }];
}

const isValidPoster = (poster) => poster && !isPlaceholderPoster(poster) && !poster.includes('placeholder') && !poster.includes('via.placeholder.com');

const isValidString = (val) => val && val !== '' && val !== 'N/A';

const isValidRating = (val) => typeof val === 'number' && val > 0;

const isValidTrailer = (trailer) => trailer && trailer.startsWith('https://www.youtube.com/watch?v=');

async function generateEnterCircleData() {
  validateEnv();
  const ytApiValid = await validateYouTubeApiKey();
  if (!ytApiValid) {
    console.warn('⚠️  YouTube API key is not valid or quota exceeded. Trailers will use fallback search URLs.');
  }
  const data = JSON.parse(fs.readFileSync('projects.json', 'utf8'));
  let uniqueCounter = 1;
  let realCount = 0;
  let fallbackCount = 0;

  const processProject = async (project) => {
    // Only fetch OMDb if any of these fields are missing or fallback
    const needsOmdb = !isValidPoster(project.poster) || !isValidString(project.description) || !isValidString(project.director) || !isValidString(project.genre) || !isValidRating(project.rating);
    let omdb = null;
    if (needsOmdb) {
      omdb = await fetchOMDbData(project.title);
    }
    const fallback = getFallbackData(project.title, project.type);

    // Only fetch YouTube trailer if trailer is missing or not a real video URL
    let trailer = null;
    if (!isValidTrailer(project.trailer)) {
      trailer = await fetchYouTubeTrailer(project.title, project.type);
    }

    let finalPoster = isValidPoster(project.poster) ? project.poster : (omdb?.Poster && omdb.Poster !== 'N/A' ? omdb.Poster : fallback.poster);
    let posterValid = await validatePosterUrl(finalPoster);
    if (!posterValid) finalPoster = fallback.poster;

    return {
      ...project,
      poster: finalPoster,
      description: isValidString(project.description) ? project.description : (omdb?.Plot && omdb.Plot !== 'N/A' ? omdb.Plot : fallback.description),
      director: isValidString(project.director) ? project.director : (omdb?.Director && omdb.Director !== 'N/A' ? omdb.Director : ''),
      genre: isValidString(project.genre) ? project.genre : (omdb?.Genre && omdb.Genre !== 'N/A' ? omdb.Genre : fallback.genre),
      rating: isValidRating(project.rating) ? project.rating : (omdb?.imdbRating && omdb.imdbRating !== 'N/A' ? parseFloat(omdb.imdbRating) : parseFloat(fallback.rating)),
      trailer: isValidTrailer(project.trailer) ? project.trailer : (trailer !== null ? trailer : fallback.trailer),
      keyCommunityData: makeKeyCommunityData(project, omdb, `kc_${project.id || ''}`)
    };
  };

  const updated = await batchProcess(data, BATCH_SIZE, processProject, THROTTLE_MS);
  fs.writeFileSync('projects.json', JSON.stringify(updated, null, 2));
  console.log(`✅ projects.json updated with enrichment (OMDb + YouTube + fallback data)!`);
  console.log('💡 To get real data, set your API keys:');
  console.log('   export OMDB_API_KEY=your_omdb_api_key');
  console.log('   export YOUTUBE_API_KEY=your_youtube_api_key');
}

if (require.main === module) {
  generateEnterCircleData();
}

module.exports = { generateEnterCircleData };