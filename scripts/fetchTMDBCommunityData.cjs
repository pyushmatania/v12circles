const fs = require('fs');
const path = require('path');

// TMDB API Configuration
const TMDB_API_KEY = '00c8935eeb21058413bf54ae11048768';
const TMDB_ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMGM4OTM1ZWViMjEwNTg0MTNiZjU0YWUxMTA0ODc2OCIsIm5iZiI6MTc1MjIwNzkwMi44ODksInN1YiI6IjY4NzA5MjFlNWFiYmI2OWUzZDlhNTgxYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7udmAb8IF7qfjyIxOLB1UguBBRUFgh04DvN2TLk6WMM';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Helper function to make TMDB API requests
async function makeTMDBRequest(endpoint, params = {}) {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', TMDB_API_KEY);
  url.searchParams.append('language', 'en-US');
  
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value.toString());
  });

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`);
  }

  return response.json();
}

// Helper function to get image URL
function getImageUrl(path, size = 'w500') {
  if (!path) return '';
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

function getBackdropUrl(path, size = 'w1280') {
  if (!path) return '';
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

// Fetch popular movies
async function fetchPopularMovies() {
  console.log('Fetching popular movies...');
  const [popularMovies, topRatedMovies, nowPlayingMovies] = await Promise.all([
    makeTMDBRequest('/movie/popular', { page: 1 }),
    makeTMDBRequest('/movie/top_rated', { page: 1 }),
    makeTMDBRequest('/movie/now_playing', { page: 1 })
  ]);

  const allMovies = [
    ...popularMovies.results,
    ...topRatedMovies.results,
    ...nowPlayingMovies.results
  ];

  // Remove duplicates based on movie ID
  const uniqueMovies = allMovies.filter((movie, index, self) => 
    index === self.findIndex(m => m.id === movie.id)
  );

  return uniqueMovies.slice(0, 30).map(movie => ({
    id: `movie_${movie.id}`,
    name: movie.title,
    avatar: getImageUrl(movie.poster_path, 'w500'),
    cover: getBackdropUrl(movie.backdrop_path, 'w1280'),
    description: `${Math.round(movie.popularity / 1000)}K+ fans worldwide`,
    type: 'movie',
    followers: Math.round(movie.popularity * 1000),
    verified: true,
    isActive: true,
    projects: [],
    tmdbId: movie.id,
    rating: movie.vote_average,
    releaseDate: movie.release_date
  }));
}

// Fetch popular actors
async function fetchPopularActors() {
  console.log('Fetching popular actors...');
  const popularActors = await makeTMDBRequest('/person/popular', { page: 1 });
  
  return popularActors.results.slice(0, 20).map(actor => ({
    id: `actor_${actor.id}`,
    name: actor.name,
    avatar: getImageUrl(actor.profile_path, 'w500'),
    cover: actor.known_for[0] ? getBackdropUrl(actor.known_for[0].backdrop_path, 'w1280') : '',
    description: `${Math.round(actor.popularity / 100)}K+ followers`,
    type: 'actor',
    followers: Math.round(actor.popularity * 100),
    verified: true,
    isActive: true,
    projects: [],
    tmdbId: actor.id,
    knownFor: actor.known_for.map(movie => movie.title).slice(0, 3)
  }));
}

// Fetch popular actresses (using different pages for variety)
async function fetchPopularActresses() {
  console.log('Fetching popular actresses...');
  const popularActors = await makeTMDBRequest('/person/popular', { page: 2 });
  
  return popularActors.results.slice(0, 20).map(actor => ({
    id: `actress_${actor.id}`,
    name: actor.name,
    avatar: getImageUrl(actor.profile_path, 'w500'),
    cover: actor.known_for[0] ? getBackdropUrl(actor.known_for[0].backdrop_path, 'w1280') : '',
    description: `${Math.round(actor.popularity / 100)}K+ followers`,
    type: 'actress',
    followers: Math.round(actor.popularity * 100),
    verified: true,
    isActive: true,
    projects: [],
    tmdbId: actor.id,
    knownFor: actor.known_for.map(movie => movie.title).slice(0, 3)
  }));
}

// Fetch directors
async function fetchDirectors() {
  console.log('Fetching directors...');
  
  // Search for specific famous directors
  const directorNames = [
    'Christopher Nolan',
    'Steven Spielberg',
    'Martin Scorsese',
    'Quentin Tarantino',
    'James Cameron',
    'Ridley Scott',
    'David Fincher',
    'Alfred Hitchcock',
    'Stanley Kubrick',
    'Francis Ford Coppola',
    'Peter Jackson',
    'Tim Burton',
    'Wes Anderson',
    'Denis Villeneuve',
    'Damien Chazelle'
  ];

  const directorPromises = directorNames.map(name => 
    makeTMDBRequest('/search/person', { query: name, page: 1 })
  );

  const directorResults = await Promise.all(directorPromises);
  
  const allDirectors = directorResults
    .flatMap(result => result.results)
    .filter((director, index, self) => 
      index === self.findIndex(d => d.id === director.id)
    )
    .filter(director => director.known_for_department === 'Directing' || director.known_for.some(movie => movie.media_type === 'movie'))
    .slice(0, 15);

  return allDirectors.map(director => ({
    id: `director_${director.id}`,
    name: director.name,
    avatar: getImageUrl(director.profile_path, 'w500'),
    cover: director.known_for[0] ? getBackdropUrl(director.known_for[0].backdrop_path, 'w1280') : '',
    description: `${Math.round(director.popularity / 100)}K+ followers`,
    type: 'director',
    followers: Math.round(director.popularity * 100),
    verified: true,
    isActive: true,
    projects: [],
    tmdbId: director.id,
    knownFor: director.known_for.map(movie => movie.title).slice(0, 3)
  }));
}

// Fetch production houses
async function fetchProductionHouses() {
  console.log('Fetching production houses...');
  
  // Search for major production companies
  const companies = [
    'Marvel Studios',
    'Warner Bros. Pictures',
    'Universal Pictures',
    'Paramount Pictures',
    '20th Century Studios',
    'Sony Pictures',
    'Lionsgate',
    'A24',
    'Netflix',
    'Disney',
    'Columbia Pictures',
    'MGM',
    'New Line Cinema',
    'DreamWorks',
    'Pixar'
  ];

  const companyPromises = companies.map(name => 
    makeTMDBRequest('/search/company', { query: name, page: 1 })
  );

  const companyResults = await Promise.all(companyPromises);
  
  const allCompanies = companyResults
    .flatMap(result => result.results)
    .filter((company, index, self) => 
      index === self.findIndex(c => c.id === company.id)
    );

  return allCompanies.slice(0, 15).map(company => ({
    id: `productionHouse_${company.id}`,
    name: company.name,
    avatar: company.logo_path ? getImageUrl(company.logo_path, 'w500') : '',
    cover: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=1280',
    description: 'Production Company',
    type: 'productionHouse',
    followers: Math.floor(Math.random() * 1000000) + 100000, // Random followers for demo
    verified: true,
    isActive: true,
    projects: [],
    tmdbId: company.id,
    country: company.origin_country
  }));
}

// Main function to fetch all data
async function fetchAllCommunityData() {
  try {
    console.log('Starting to fetch TMDB community data...');
    
    const [movies, actors, actresses, directors, productionHouses] = await Promise.all([
      fetchPopularMovies(),
      fetchPopularActors(),
      fetchPopularActresses(),
      fetchDirectors(),
      fetchProductionHouses()
    ]);

    const communityData = {
      movies,
      actors,
      actresses,
      directors,
      productionHouses
    };

    // Write to file
    const outputPath = path.join(__dirname, '../src/data/tmdbCommunityData.ts');
    const fileContent = `// Auto-generated TMDB Community Data
// Generated on: ${new Date().toISOString()}

export type RealCommunityItem = {
  id: string;
  name: string;
  avatar: string;
  cover: string;
  description: string;
  type: 'movie' | 'productionHouse' | 'director' | 'actor' | 'actress';
  followers: number;
  verified: boolean;
  isActive: boolean;
  projects: any[];
  tmdbId?: number;
  rating?: number;
  releaseDate?: string;
  knownFor?: string[];
  country?: string;
};

export const tmdbCommunityData: {
  movies: RealCommunityItem[];
  productionHouses: RealCommunityItem[];
  directors: RealCommunityItem[];
  actors: RealCommunityItem[];
  actresses: RealCommunityItem[];
} = ${JSON.stringify(communityData, null, 2)};

export const getCommunityDataByType = (type: string): RealCommunityItem[] => {
  switch (type) {
    case 'movie':
      return tmdbCommunityData.movies;
    case 'actor':
      return tmdbCommunityData.actors;
    case 'actress':
      return tmdbCommunityData.actresses;
    case 'director':
      return tmdbCommunityData.directors;
    case 'productionHouse':
      return tmdbCommunityData.productionHouses;
    default:
      return [];
  }
};
`;

    fs.writeFileSync(outputPath, fileContent);
    console.log(`✅ Successfully generated TMDB community data at: ${outputPath}`);
    console.log(`📊 Data summary:`);
    console.log(`   - Movies: ${movies.length}`);
    console.log(`   - Actors: ${actors.length}`);
    console.log(`   - Actresses: ${actresses.length}`);
    console.log(`   - Directors: ${directors.length}`);
    console.log(`   - Production Houses: ${productionHouses.length}`);

  } catch (error) {
    console.error('❌ Error fetching TMDB data:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  fetchAllCommunityData();
}

module.exports = {
  fetchAllCommunityData,
  fetchPopularMovies,
  fetchPopularActors,
  fetchPopularActresses,
  fetchDirectors,
  fetchProductionHouses
}; 