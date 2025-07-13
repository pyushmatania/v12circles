const fs = require('fs');
const path = require('path');
const TMDB_API_KEY = '00c8935eeb21058413bf54ae11048768';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

function getImageUrl(path, size = 'w500') {
  if (!path) return '';
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

function convertPersonToCommunityItem(person) {
  return {
    id: `actor_${person.id}`,
    name: person.name,
    avatar: getImageUrl(person.profile_path, 'w500'),
    description: `${Math.round(person.popularity / 100)}K+ followers`,
    type: 'actor',
    followers: Math.round(person.popularity * 100),
    verified: true,
    isActive: true,
    projects: [],
    tmdbId: person.id,
    knownFor: person.known_for ? person.known_for.map(movie => movie.title).slice(0, 3) : []
  };
}

async function fetchActorsBatch(total = 50, batchSize = 10, delayMs = 1000) {
  const actors = [];
  let page = 1;
  while (actors.length < total) {
    const url = `${TMDB_BASE_URL}/person/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`;
    try {
      const response = await fetch(url, { timeout: 10000 });
      if (!response.ok) throw new Error(`TMDB API error: ${response.status}`);
      const data = await response.json();
      actors.push(...data.results);
      console.log(`Fetched page ${page}, total actors so far: ${actors.length}`);
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error.message);
    }
    if (actors.length < total) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
    page++;
  }
  // Remove duplicates and trim to total
  const uniqueActors = actors.filter((actor, idx, self) => idx === self.findIndex(a => a.id === actor.id)).slice(0, total);
  return uniqueActors.map(convertPersonToCommunityItem);
}

(async () => {
  const actors = await fetchActorsBatch(50, 10, 1000);
  const outputPath = path.join(__dirname, '../src/data/actorsBatch.json');
  fs.writeFileSync(outputPath, JSON.stringify(actors, null, 2));
  console.log(`✅ Saved ${actors.length} actors to ${outputPath}`);
})(); 