const TMDB_API_KEY = '00c8935eeb21058413bf54ae11048768';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

async function testFetch() {
  try {
    const url = `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`;
    const response = await fetch(url, { timeout: 10000 });
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }
    const data = await response.json();
    console.log('TMDB popular movies sample:', data.results ? data.results.slice(0, 3) : data);
  } catch (error) {
    console.error('Fetch failed:', error);
  }
}

testFetch(); 