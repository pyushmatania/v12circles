const fs = require('fs');
const path = require('path');

// TMDB API Configuration
const TMDB_API_KEY = '00c8935eeb21058413bf54ae11048768';
const TMDB_ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMGM4OTM1ZWViMjEwNTg0MTNiZjU0YWUxMTA0ODc2OCIsIm5iZiI6MTc1MjIwNzkwMi44ODksInN1YiI6IjY4NzA5MjFlNWFiYmI2OWUzZDlhNTgxYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7udmAb8IF7qfjyIxOLB1UguBBRUFgh04DvN2TLk6WMM';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Helper function to make TMDB API requests with retry logic
async function makeTMDBRequest(endpoint, params = {}, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
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
        timeout: 10000, // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.log(`  Attempt ${attempt} failed for ${endpoint}: ${error.message}`);
      if (attempt === retries) {
        throw error;
      }
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
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

// Convert TMDB person to community item
function convertPersonToCommunityItem(person, type, knownFor = []) {
  return {
    id: `${type}_${person.id}`,
    name: person.name,
    avatar: getImageUrl(person.profile_path, 'w500'),
    cover: knownFor[0] ? getBackdropUrl(knownFor[0].backdrop_path, 'w1280') : '',
    description: `${Math.round(person.popularity / 100)}K+ followers`,
    type: type,
    followers: Math.round(person.popularity * 100),
    verified: true,
    isActive: true,
    projects: [],
    tmdbId: person.id,
    knownFor: knownFor.map(movie => movie.title).slice(0, 3)
  };
}

// Convert TMDB movie to community item
function convertMovieToCommunityItem(movie, category = 'movie') {
  return {
    id: `${category}_${movie.id}`,
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
    releaseDate: movie.release_date,
    category: category
  };
}

// Convert TMDB company to community item
function convertCompanyToCommunityItem(company) {
  return {
    id: `productionHouse_${company.id}`,
    name: company.name,
    avatar: company.logo_path ? getImageUrl(company.logo_path, 'w500') : '',
    cover: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=1280',
    description: 'Production Company',
    type: 'productionHouse',
    followers: Math.floor(Math.random() * 1000000) + 100000,
    verified: true,
    isActive: true,
    projects: [],
    tmdbId: company.id,
    country: company.origin_country
  };
}

// Fetch 50 popular actors
async function fetchActors() {
  console.log('Fetching 50 popular actors...');
  const actors = [];
  
  // Fetch from multiple pages to get variety
  for (let page = 1; page <= 3; page++) {
    const response = await makeTMDBRequest('/person/popular', { page });
    actors.push(...response.results);
    await new Promise(resolve => setTimeout(resolve, 500)); // Rate limiting
  }
  
  // Remove duplicates and take first 50
  const uniqueActors = actors.filter((actor, index, self) => 
    index === self.findIndex(a => a.id === actor.id)
  ).slice(0, 50);
  
  return uniqueActors.map(actor => convertPersonToCommunityItem(actor, 'actor'));
}

// Fetch 50 popular actresses
async function fetchActresses() {
  console.log('Fetching 50 popular actresses...');
  const actresses = [];
  
  // Fetch from different pages for variety
  for (let page = 4; page <= 6; page++) {
    const response = await makeTMDBRequest('/person/popular', { page });
    actresses.push(...response.results);
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  const uniqueActresses = actresses.filter((actress, index, self) => 
    index === self.findIndex(a => a.id === actress.id)
  ).slice(0, 50);
  
  return uniqueActresses.map(actress => convertPersonToCommunityItem(actress, 'actress'));
}

// Fetch 50 directors
async function fetchDirectors() {
  console.log('Fetching 50 directors...');
  
  // Famous directors to search for
  const directorNames = [
    // Hollywood Directors
    'Christopher Nolan', 'Steven Spielberg', 'Martin Scorsese', 'Quentin Tarantino', 'James Cameron',
    'Ridley Scott', 'David Fincher', 'Alfred Hitchcock', 'Stanley Kubrick', 'Francis Ford Coppola',
    'Peter Jackson', 'Tim Burton', 'Wes Anderson', 'Denis Villeneuve', 'Damien Chazelle',
    'Greta Gerwig', 'Jordan Peele', 'Bong Joon-ho', 'Chloé Zhao', 'Spike Lee',
    'Clint Eastwood', 'Ron Howard', 'Robert Zemeckis', 'Sam Mendes', 'Danny Boyle',
    'Darren Aronofsky', 'Paul Thomas Anderson', 'Coen Brothers', 'David Lynch', 'Terrence Malick',
    
    // Bollywood Directors
    'Rajkumar Hirani', 'Sanjay Leela Bhansali', 'Karan Johar', 'Rohit Shetty', 'Aamir Khan',
    'Farhan Akhtar', 'Zoya Akhtar', 'Anurag Kashyap', 'Vishal Bhardwaj', 'Imtiaz Ali',
    'Kabir Khan', 'Shoojit Sircar', 'Neeraj Pandey', 'Sriram Raghavan', 'Rakeysh Omprakash Mehra',
    'Ashutosh Gowariker', 'Mani Ratnam', 'Priyadarshan', 'Subhash Ghai', 'Yash Chopra',
    
    // International Directors
    'Pedro Almodóvar', 'Wong Kar-wai', 'Akira Kurosawa', 'Federico Fellini', 'Ingmar Bergman',
    'Jean-Luc Godard', 'François Truffaut', 'Lars von Trier', 'Michael Haneke', 'Paolo Sorrentino'
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
    .slice(0, 50);

  return allDirectors.map(director => convertPersonToCommunityItem(director, 'director'));
}

// Fetch 50 production houses
async function fetchProductionHouses() {
  console.log('Fetching 50 production houses...');
  
  const companyNames = [
    // Hollywood Studios
    'Marvel Studios', 'Warner Bros. Pictures', 'Universal Pictures', 'Paramount Pictures',
    '20th Century Studios', 'Sony Pictures', 'Lionsgate', 'A24', 'Netflix', 'Disney',
    'Columbia Pictures', 'MGM', 'New Line Cinema', 'DreamWorks', 'Pixar',
    'Focus Features', 'Searchlight Pictures', 'Miramax', 'The Weinstein Company', 'Legendary Pictures',
    'Blumhouse Productions', 'Bad Robot', 'Plan B Entertainment', 'Annapurna Pictures', 'Neon',
    
    // Bollywood Production Houses
    'Yash Raj Films', 'Dharma Productions', 'Excel Entertainment', 'Eros International', 'T-Series',
    'Reliance Entertainment', 'UTV Motion Pictures', 'Balaji Motion Pictures', 'Red Chillies Entertainment', 'Excel Entertainment',
    'Nadiadwala Grandson Entertainment', 'Hari Om Entertainment', 'Viacom18 Motion Pictures', 'Tips Industries', 'Shemaroo Entertainment',
    'Zee Studios', 'Pen India Limited', 'Pooja Entertainment', 'Boney Kapoor Productions', 'Mukta Arts',
    
    // International Production Houses
    'Studio Ghibli', 'Toho Company', 'CJ Entertainment', 'Lotte Entertainment', 'Showbox',
    'Pathé', 'Gaumont', 'Canal+', 'TF1 Films Production', 'EuropaCorp',
    'Working Title Films', 'BBC Films', 'Film4', 'StudioCanal', 'Entertainment One'
  ];

  const companyPromises = companyNames.map(name => 
    makeTMDBRequest('/search/company', { query: name, page: 1 })
  );

  const companyResults = await Promise.all(companyPromises);
  
  const allCompanies = companyResults
    .flatMap(result => result.results)
    .filter((company, index, self) => 
      index === self.findIndex(c => c.id === company.id)
    )
    .slice(0, 50);

  return allCompanies.map(company => convertCompanyToCommunityItem(company));
}

// Fetch Hollywood movies (20 new/famous + 10 all-time greats)
async function fetchHollywoodMovies() {
  console.log('Fetching Hollywood movies...');
  
  // All-time greats (search by specific titles)
  const allTimeGreats = [
    'The Godfather', 'The Shawshank Redemption', 'The Dark Knight', 'Pulp Fiction', 'Fight Club',
    'Forrest Gump', 'Inception', 'The Matrix', 'Interstellar', 'Titanic'
  ];
  
  const allTimeMovies = [];
  for (const title of allTimeGreats) {
    const response = await makeTMDBRequest('/search/movie', { query: title, page: 1 });
    if (response.results.length > 0) {
      allTimeMovies.push(response.results[0]);
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // New and famous movies (from popular, top-rated, now-playing)
  const [popularMovies, topRatedMovies, nowPlayingMovies] = await Promise.all([
    makeTMDBRequest('/movie/popular', { page: 1 }),
    makeTMDBRequest('/movie/top_rated', { page: 1 }),
    makeTMDBRequest('/movie/now_playing', { page: 1 })
  ]);
  
  const newFamousMovies = [
    ...popularMovies.results,
    ...topRatedMovies.results,
    ...nowPlayingMovies.results
  ].filter((movie, index, self) => 
    index === self.findIndex(m => m.id === movie.id)
  ).slice(0, 20);
  
  const allTimeConverted = allTimeMovies.map(movie => convertMovieToCommunityItem(movie, 'hollywood_alltime'));
  const newFamousConverted = newFamousMovies.map(movie => convertMovieToCommunityItem(movie, 'hollywood_new'));
  
  return [...allTimeConverted, ...newFamousConverted];
}

// Fetch Bollywood movies (20 new/famous + 20 very famous)
async function fetchBollywoodMovies() {
  console.log('Fetching Bollywood movies...');
  
  // Very famous Bollywood movies
  const veryFamousMovies = [
    'Sholay', 'Dilwale Dulhania Le Jayenge', 'Mughal-e-Azam', 'Mother India', 'Pyaasa',
    'Guide', 'Awaara', 'Deewaar', 'Zanjeer', 'Amar Akbar Anthony',
    'Hum Aapke Hain Koun..!', 'Dil To Pagal Hai', 'Kuch Kuch Hota Hai', 'Kabhi Khushi Kabhie Gham', 'Lagaan',
    'Rang De Basanti', '3 Idiots', 'PK', 'Dangal', 'Bajrangi Bhaijaan'
  ];
  
  const veryFamousResults = [];
  for (const title of veryFamousMovies) {
    const response = await makeTMDBRequest('/search/movie', { query: title, page: 1 });
    if (response.results.length > 0) {
      veryFamousResults.push(response.results[0]);
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // New and famous Bollywood movies (search by popular titles)
  const newFamousTitles = [
    'Pathaan', 'Jawan', 'Animal', '12th Fail', 'Sam Bahadur',
    'Dunki', 'Tiger 3', 'Rocky Aur Rani Kii Prem Kahaani', 'OMG 2', 'Dream Girl 2',
    'Gadar 2', 'Tu Jhoothi Main Makkaar', 'Bholaa', 'Kisi Ka Bhai Kisi Ki Jaan', 'Selfiee',
    'Shehzada', 'Antim: The Final Truth', 'Sooryavanshi', '83', 'Shershaah'
  ];
  
  const newFamousResults = [];
  for (const title of newFamousTitles) {
    const response = await makeTMDBRequest('/search/movie', { query: title, page: 1 });
    if (response.results.length > 0) {
      newFamousResults.push(response.results[0]);
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  const veryFamousConverted = veryFamousResults.map(movie => convertMovieToCommunityItem(movie, 'bollywood_veryfamous'));
  const newFamousConverted = newFamousResults.map(movie => convertMovieToCommunityItem(movie, 'bollywood_new'));
  
  return [...veryFamousConverted, ...newFamousConverted];
}

// Fetch Tollywood movies (10)
async function fetchTollywoodMovies() {
  console.log('Fetching Tollywood movies...');
  
  const tollywoodTitles = [
    'RRR', 'Baahubali: The Beginning', 'Baahubali 2: The Conclusion', 'Pushpa: The Rise', 'KGF: Chapter 1',
    'KGF: Chapter 2', 'Kantara', 'Salaar: Part 1 – Cease Fire', 'Leo', 'Jailer'
  ];
  
  const tollywoodResults = [];
  for (const title of tollywoodTitles) {
    const response = await makeTMDBRequest('/search/movie', { query: title, page: 1 });
    if (response.results.length > 0) {
      tollywoodResults.push(response.results[0]);
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  return tollywoodResults.map(movie => convertMovieToCommunityItem(movie, 'tollywood'));
}

// Main function to fetch all comprehensive data
async function createComprehensiveCommunityData() {
  try {
    console.log('Starting to create comprehensive community data...');
    
    // Process in sequence to avoid overwhelming the API
    console.log('\n1. Fetching actors...');
    const actors = await fetchActors();
    
    console.log('\n2. Fetching actresses...');
    const actresses = await fetchActresses();
    
    console.log('\n3. Fetching directors...');
    const directors = await fetchDirectors();
    
    console.log('\n4. Fetching production houses...');
    const productionHouses = await fetchProductionHouses();
    
    console.log('\n5. Fetching Hollywood movies...');
    const hollywoodMovies = await fetchHollywoodMovies();
    
    console.log('\n6. Fetching Bollywood movies...');
    const bollywoodMovies = await fetchBollywoodMovies();
    
    console.log('\n7. Fetching Tollywood movies...');
    const tollywoodMovies = await fetchTollywoodMovies();
    
    // Combine all movies
    const allMovies = [...hollywoodMovies, ...bollywoodMovies, ...tollywoodMovies];
    
    const comprehensiveData = {
      movies: allMovies,
      actors,
      actresses,
      directors,
      productionHouses
    };
    
    // Write to file
    const outputPath = path.join(__dirname, '../src/data/comprehensiveCommunityData.ts');
    const fileContent = `// Comprehensive Community Data - Auto-generated from TMDB
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
  category?: string;
};

export const comprehensiveCommunityData: {
  movies: RealCommunityItem[];
  productionHouses: RealCommunityItem[];
  directors: RealCommunityItem[];
  actors: RealCommunityItem[];
  actresses: RealCommunityItem[];
} = ${JSON.stringify(comprehensiveData, null, 2)};

// Helper function to get movies by category
export const getMoviesByCategory = (category: string): RealCommunityItem[] => {
  return comprehensiveCommunityData.movies.filter(movie => movie.category === category);
};

// Helper function to get all Hollywood movies
export const getHollywoodMovies = (): RealCommunityItem[] => {
  return comprehensiveCommunityData.movies.filter(movie => 
    movie.category === 'hollywood_alltime' || movie.category === 'hollywood_new'
  );
};

// Helper function to get all Bollywood movies
export const getBollywoodMovies = (): RealCommunityItem[] => {
  return comprehensiveCommunityData.movies.filter(movie => 
    movie.category === 'bollywood_veryfamous' || movie.category === 'bollywood_new'
  );
};

// Helper function to get all Tollywood movies
export const getTollywoodMovies = (): RealCommunityItem[] => {
  return comprehensiveCommunityData.movies.filter(movie => movie.category === 'tollywood');
};

export const getCommunityDataByType = (type: string): RealCommunityItem[] => {
  switch (type) {
    case 'movie':
      return comprehensiveCommunityData.movies;
    case 'actor':
      return comprehensiveCommunityData.actors;
    case 'actress':
      return comprehensiveCommunityData.actresses;
    case 'director':
      return comprehensiveCommunityData.directors;
    case 'productionHouse':
      return comprehensiveCommunityData.productionHouses;
    default:
      return [];
  }
};
`;

    fs.writeFileSync(outputPath, fileContent);
    console.log(`✅ Successfully generated comprehensive community data at: ${outputPath}`);
    console.log(`📊 Data summary:`);
    console.log(`   - Movies: ${allMovies.length} (Hollywood: ${hollywoodMovies.length}, Bollywood: ${bollywoodMovies.length}, Tollywood: ${tollywoodMovies.length})`);
    console.log(`   - Actors: ${actors.length}`);
    console.log(`   - Actresses: ${actresses.length}`);
    console.log(`   - Directors: ${directors.length}`);
    console.log(`   - Production Houses: ${productionHouses.length}`);

  } catch (error) {
    console.error('❌ Error creating comprehensive data:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  createComprehensiveCommunityData();
}

module.exports = {
  createComprehensiveCommunityData,
  fetchActors,
  fetchActresses,
  fetchDirectors,
  fetchProductionHouses,
  fetchHollywoodMovies,
  fetchBollywoodMovies,
  fetchTollywoodMovies
}; 