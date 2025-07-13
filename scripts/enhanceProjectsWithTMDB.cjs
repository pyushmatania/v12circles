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

// Search for movie in TMDB
async function searchMovie(title) {
  try {
    const response = await makeTMDBRequest('/search/movie', { 
      query: title, 
      page: 1,
      include_adult: false
    });
    
    if (response.results && response.results.length > 0) {
      return response.results[0]; // Return the first (most relevant) result
    }
    return null;
  } catch (error) {
    console.error(`Error searching for movie "${title}":`, error.message);
    return null;
  }
}

// Get detailed movie information
async function getMovieDetails(tmdbId) {
  try {
    const response = await makeTMDBRequest(`/movie/${tmdbId}`, { 
      append_to_response: 'credits,images' 
    });
    return response;
  } catch (error) {
    console.error(`Error getting details for movie ID ${tmdbId}:`, error.message);
    return null;
  }
}

// Enhance a single project with TMDB data
async function enhanceProject(project) {
  console.log(`Enhancing project: ${project.title}`);
  
  // Search for the movie in TMDB
  const tmdbMovie = await searchMovie(project.title);
  
  if (!tmdbMovie) {
    console.log(`  No TMDB data found for: ${project.title}`);
    return project;
  }
  
  // Get detailed movie information
  const movieDetails = await getMovieDetails(tmdbMovie.id);
  
  // Extract cast and crew information
  let actors = [];
  let actresses = [];
  let director = '';
  let productionHouse = '';
  
  if (movieDetails && movieDetails.credits) {
    // Get top 3 actors and actresses
    const cast = movieDetails.credits.cast || [];
    actors = cast.slice(0, 3).map(person => person.name);
    
    // Get director
    const crew = movieDetails.credits.crew || [];
    const directorInfo = crew.find(person => person.job === 'Director');
    if (directorInfo) {
      director = directorInfo.name;
    }
    
    // Get production company
    if (movieDetails.production_companies && movieDetails.production_companies.length > 0) {
      productionHouse = movieDetails.production_companies[0].name;
    }
  }
  
  // Update project with TMDB data
  const enhancedProject = {
    ...project,
    poster: tmdbMovie.poster_path ? getImageUrl(tmdbMovie.poster_path, 'w500') : project.poster,
    backdrop: tmdbMovie.backdrop_path ? getBackdropUrl(tmdbMovie.backdrop_path, 'w1280') : '',
    tmdbId: tmdbMovie.id,
    tmdbRating: tmdbMovie.vote_average,
    runtime: movieDetails ? movieDetails.runtime : null,
    releaseYear: tmdbMovie.release_date ? new Date(tmdbMovie.release_date).getFullYear() : null,
    country: movieDetails && movieDetails.production_countries && movieDetails.production_countries.length > 0 
      ? movieDetails.production_countries[0].name : null,
    revenue: movieDetails ? movieDetails.revenue : null,
    tmdbGenres: movieDetails && movieDetails.genres ? movieDetails.genres.map(g => g.name) : [],
    spokenLanguages: movieDetails && movieDetails.spoken_languages ? movieDetails.spoken_languages.map(l => l.name) : [],
    tmdbOverview: tmdbMovie.overview || project.description,
    tagline: movieDetails ? movieDetails.tagline : '',
    imdbId: movieDetails ? movieDetails.imdb_id : null,
    actor: actors.length > 0 ? actors[0] : project.actor,
    actress: actresses.length > 0 ? actresses[0] : project.actress,
    productionHouse: productionHouse || project.productionHouse,
    director: director || project.director,
    // Update keyCommunityData
    keyCommunityData: [{
      id: `kc_${project.id}`,
      movieId: project.id,
      movieName: project.title,
      productionHouse: productionHouse || project.productionHouse || '',
      keyPeople: [...actors, ...actresses, director].filter(Boolean),
      actor: actors.length > 0 ? actors[0] : project.actor || '',
      actress: actresses.length > 0 ? actresses[0] : project.actress || '',
      director: director || project.director || ''
    }]
  };
  
  console.log(`  ✅ Enhanced with TMDB data (ID: ${tmdbMovie.id})`);
  return enhancedProject;
}

// Main function to enhance all projects
async function enhanceAllProjects() {
  try {
    console.log('Starting to enhance projects with TMDB data...');
    
    // Read existing projects
    const projectsPath = path.join(__dirname, '../omdb-fetcher/projects.json');
    const projects = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
    
    console.log(`Found ${projects.length} projects to enhance`);
    
    // Enhance projects with rate limiting to avoid API limits
    const enhancedProjects = [];
    for (let i = 0; i < projects.length; i++) {
      const project = projects[i];
      console.log(`\nProcessing ${i + 1}/${projects.length}: ${project.title}`);
      
      const enhancedProject = await enhanceProject(project);
      enhancedProjects.push(enhancedProject);
      
      // Add delay to avoid rate limiting
      if (i < projects.length - 1) {
        console.log('  Waiting 1 second before next request...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // Write enhanced projects back to file
    const outputPath = path.join(__dirname, '../omdb-fetcher/enhancedProjects.json');
    fs.writeFileSync(outputPath, JSON.stringify(enhancedProjects, null, 2));
    
    console.log(`\n✅ Successfully enhanced ${enhancedProjects.length} projects`);
    console.log(`📁 Enhanced data saved to: ${outputPath}`);
    
    // Generate summary
    const enhancedCount = enhancedProjects.filter(p => p.tmdbId).length;
    const withPosters = enhancedProjects.filter(p => p.poster && p.poster.includes('tmdb.org')).length;
    const withRatings = enhancedProjects.filter(p => p.tmdbRating).length;
    
    console.log(`\n📊 Enhancement Summary:`);
    console.log(`   - Total projects: ${enhancedProjects.length}`);
    console.log(`   - Enhanced with TMDB data: ${enhancedCount}`);
    console.log(`   - With real posters: ${withPosters}`);
    console.log(`   - With ratings: ${withRatings}`);
    
  } catch (error) {
    console.error('❌ Error enhancing projects:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  enhanceAllProjects();
}

module.exports = {
  enhanceAllProjects,
  enhanceProject,
  searchMovie,
  getMovieDetails
}; 