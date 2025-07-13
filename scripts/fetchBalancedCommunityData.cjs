const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const TMDB_API_KEY = "00c8935eeb21058413bf54ae11048768";
const TMDB_ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMGM4OTM1ZWViMjEwNTg0MTNiZjU0YWUxMTA0ODc2OCIsIm5iZiI6MTc1MjIwNzkwMi44ODksInN1YiI6IjY4NzA5MjFlNWFiYmI2OWUzZDlhNTgxYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7udmAb8IF7qfjyIxOLB1UguBBRUFgh04DvN2TLk6WMM";
const OUTPUT_PATH = path.join(__dirname, '../src/data/balancedCommunityData.json');
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

// Bollywood names to search for
const BOLLYWOOD_ACTORS = [
  'Shah Rukh Khan', 'Aamir Khan', 'Salman Khan', 'Akshay Kumar', 'Hrithik Roshan',
  'Ranbir Kapoor', 'Ranveer Singh', 'Ajay Devgn', 'Amitabh Bachchan', 'Saif Ali Khan',
  'Shahid Kapoor', 'Varun Dhawan', 'Tiger Shroff', 'Kartik Aaryan', 'Ayushmann Khurrana',
  'Rajkummar Rao', 'Vicky Kaushal', 'Sidharth Malhotra', 'Arjun Kapoor', 'Aditya Roy Kapur'
];

const BOLLYWOOD_ACTRESSES = [
  'Deepika Padukone', 'Priyanka Chopra', 'Alia Bhatt', 'Katrina Kaif', 'Kareena Kapoor',
  'Anushka Sharma', 'Sonam Kapoor', 'Shraddha Kapoor', 'Jacqueline Fernandez', 'Disha Patani',
  'Kiara Advani', 'Tara Sutaria', 'Janhvi Kapoor', 'Sara Ali Khan', 'Ananya Panday',
  'Bhumi Pednekar', 'Taapsee Pannu', 'Kriti Sanon', 'Yami Gautam', 'Mouni Roy'
];

const BOLLYWOOD_DIRECTORS = [
  'Rajkumar Hirani', 'Sanjay Leela Bhansali', 'Karan Johar', 'Rohit Shetty', 'Kabir Khan',
  'Imtiaz Ali', 'Zoya Akhtar', 'Anurag Kashyap', 'Vishal Bhardwaj', 'Farhan Akhtar',
  'Ayan Mukerji', 'Akshay Kumar', 'Siddharth Anand', 'Ali Abbas Zafar', 'Abhishek Varman',
  'Shashank Khaitan', 'Punit Malhotra', 'Tarun Mansukhani', 'Karan Malhotra', 'Remo D\'Souza'
];

const BOLLYWOOD_MOVIES = [
  'Dangal', 'PK', '3 Idiots', 'Bajrangi Bhaijaan', 'Sultan',
  'Tiger Zinda Hai', 'War', 'Kabir Singh', 'Uri: The Surgical Strike', 'Gully Boy',
  'Kesari', 'Mission Mangal', 'Chhichhore', 'Dream Girl', 'Good Newwz',
  'Tanhaji: The Unsung Warrior', 'Malang', 'Street Dancer 3D', 'Baaghi 3', 'Coolie No. 1'
];

const BOLLYWOOD_PRODUCTION_HOUSES = [
  'Yash Raj Films', 'Dharma Productions', 'Excel Entertainment', 'T-Series', 'Eros International',
  'Reliance Entertainment', 'Fox Star Studios', 'Viacom18 Motion Pictures', 'Zee Studios', 'Pen India',
  'Balaji Motion Pictures', 'Tips Industries', 'Sajid Nadiadwala Grandson Entertainment', 'Nadiadwala Grandson Entertainment', 'Red Chillies Entertainment',
  'Excel Entertainment', 'Hirani Films', 'Vinod Chopra Films', 'UTV Motion Pictures', 'Eros International'
];

// Hollywood names (already have some, adding more)
const HOLLYWOOD_ACTORS = [
  'Tom Hanks', 'Leonardo DiCaprio', 'Brad Pitt', 'Johnny Depp', 'Robert Downey Jr.',
  'Chris Hemsworth', 'Chris Evans', 'Ryan Reynolds', 'Dwayne Johnson', 'Will Smith',
  'Tom Cruise', 'Matt Damon', 'Ben Affleck', 'Jake Gyllenhaal', 'Ryan Gosling',
  'Bradley Cooper', 'Christian Bale', 'Hugh Jackman', 'Daniel Radcliffe', 'Robert Pattinson'
];

const HOLLYWOOD_ACTRESSES = [
  'Scarlett Johansson', 'Jennifer Lawrence', 'Emma Stone', 'Sandra Bullock', 'Julia Roberts',
  'Meryl Streep', 'Charlize Theron', 'Angelina Jolie', 'Cate Blanchett', 'Nicole Kidman',
  'Reese Witherspoon', 'Anne Hathaway', 'Amy Adams', 'Natalie Portman', 'Emma Watson',
  'Margot Robbie', 'Gal Gadot', 'Brie Larson', 'Zoe Saldana', 'Jennifer Aniston'
];

const HOLLYWOOD_DIRECTORS = [
  'Christopher Nolan', 'Steven Spielberg', 'James Cameron', 'Quentin Tarantino', 'Martin Scorsese',
  'Ridley Scott', 'Peter Jackson', 'J.J. Abrams', 'Joss Whedon', 'Zack Snyder',
  'Tim Burton', 'Guy Ritchie', 'Michael Bay', 'Roland Emmerich', 'Brett Ratner',
  'McG', 'Shawn Levy', 'Jon Favreau', 'Joss Whedon', 'Zack Snyder'
];

const HOLLYWOOD_MOVIES = [
  'Avengers: Endgame', 'Avatar', 'Titanic', 'Star Wars: The Force Awakens', 'Jurassic World',
  'The Lion King', 'Frozen II', 'Incredibles 2', 'The Dark Knight', 'Interstellar',
  'Inception', 'The Matrix', 'Forrest Gump', 'Pulp Fiction', 'Goodfellas',
  'The Godfather', 'Schindler\'s List', 'Saving Private Ryan', 'Gladiator', 'The Lord of the Rings'
];

const HOLLYWOOD_PRODUCTION_HOUSES = [
  'Warner Bros. Pictures', 'Walt Disney Pictures', 'Universal Pictures', 'Sony Pictures', 'Paramount Pictures',
  '20th Century Fox', 'Lionsgate', 'MGM', 'DreamWorks Pictures', 'New Line Cinema',
  'Touchstone Pictures', 'Miramax', 'Focus Features', 'A24', 'Searchlight Pictures',
  'Columbia Pictures', 'TriStar Pictures', 'Screen Gems', 'Sony Pictures Classics', 'Open Road Films'
];

// World/Regional names
const WORLD_ACTORS = [
  'Jackie Chan', 'Jet Li', 'Donnie Yen', 'Tony Jaa', 'Iko Uwais',
  'Bruce Lee', 'Chow Yun-fat', 'Andy Lau', 'Tony Leung', 'Ken Watanabe'
];

const WORLD_ACTRESSES = [
  'Maggie Q', 'Michelle Yeoh', 'Zhang Ziyi', 'Gong Li', 'Fan Bingbing',
  'Shu Qi', 'Zhou Xun', 'Tang Wei', 'Liu Yifei', 'Dilraba Dilmurat'
];

const WORLD_DIRECTORS = [
  'Ang Lee', 'Wong Kar-wai', 'Zhang Yimou', 'Park Chan-wook', 'Bong Joon-ho',
  'Hayao Miyazaki', 'Akira Kurosawa', 'Federico Fellini', 'Ingmar Bergman', 'Pedro Almodóvar'
];

const WORLD_MOVIES = [
  'Crouching Tiger, Hidden Dragon', 'Parasite', 'Oldboy', 'Spirited Away', 'Seven Samurai',
  'Life Is Beautiful', 'Amélie', 'Pan\'s Labyrinth', 'The Secret in Their Eyes', 'City of God'
];

const WORLD_PRODUCTION_HOUSES = [
  'CJ Entertainment', 'Toho Company', 'Studio Ghibli', 'Pathé', 'Gaumont',
  'Canal+', 'TF1 Films', 'Mediaset', 'Rai Cinema', 'ZDF'
];

async function tmdbSearch(endpoint, query, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const url = `https://api.themoviedb.org/3/search/${endpoint}?query=${encodeURIComponent(query)}&api_key=${TMDB_API_KEY}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${TMDB_ACCESS_TOKEN}` }
      });
      if (!res.ok) throw new Error(`TMDB search failed: ${res.status}`);
      const data = await res.json();
      return data.results && data.results.length > 0 ? data.results[0] : null;
    } catch (e) {
      console.error(`Attempt ${i + 1} failed for ${query}:`, e.message);
      if (i === retries - 1) return null;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

async function fetchImageForItem(type, name, category) {
  try {
    let result = null;
    if (type === 'movie') {
      result = await tmdbSearch('movie', name);
    } else if (type === 'productionHouse') {
      result = await tmdbSearch('company', name);
    } else if (['actor', 'actress', 'director'].includes(type)) {
      result = await tmdbSearch('person', name);
    }
    
    if (result) {
      const imagePath = type === 'movie' ? result.poster_path : 
                       type === 'productionHouse' ? result.logo_path : 
                       result.profile_path;
      return imagePath ? TMDB_IMAGE_BASE + imagePath : null;
    }
  } catch (e) {
    console.error(`Error fetching image for ${type} '${name}':`, e.message);
  }
  return null;
}

async function processCategory(names, type, category, startId = 1) {
  const results = [];
  let idCounter = startId;
  
  for (const name of names) {
    console.log(`Processing ${category} ${type}: ${name}`);
    const avatar = await fetchImageForItem(type, name, category);
    
    if (avatar) {
      const item = {
        id: `${type}_${idCounter}`,
        name: name,
        avatar: avatar,
        cover: '', // Will be added later if needed
        description: `${Math.floor(Math.random() * 10) + 1}K+ followers`,
        type: type,
        followers: Math.floor(Math.random() * 5000) + 1000,
        verified: true,
        isActive: true,
        projects: [],
        category: category,
        country: category === 'bollywood' ? 'India' : 
                category === 'hollywood' ? 'USA' : 'International'
      };
      
      if (type === 'movie') {
        item.rating = Math.floor(Math.random() * 3) + 6;
        item.releaseDate = '2024-01-01'; // Placeholder
      }
      
      results.push(item);
      console.log(`✓ Added ${category} ${type}: ${name}`);
    } else {
      console.log(`✗ Failed to find ${category} ${type}: ${name}`);
    }
    
    idCounter++;
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  return results;
}

async function main() {
  console.log('Starting balanced community data fetch...');
  
  const data = {
    actors: [],
    actresses: [],
    directors: [],
    movies: [],
    productionHouses: []
  };
  
  // Process Bollywood (20 each)
  console.log('\n=== Processing Bollywood Data ===');
  data.actors.push(...await processCategory(BOLLYWOOD_ACTORS, 'actor', 'bollywood', 1));
  data.actresses.push(...await processCategory(BOLLYWOOD_ACTRESSES, 'actress', 'bollywood', 1));
  data.directors.push(...await processCategory(BOLLYWOOD_DIRECTORS, 'director', 'bollywood', 1));
  data.movies.push(...await processCategory(BOLLYWOOD_MOVIES, 'movie', 'bollywood', 1));
  data.productionHouses.push(...await processCategory(BOLLYWOOD_PRODUCTION_HOUSES, 'productionHouse', 'bollywood', 1));
  
  // Process Hollywood (20 each)
  console.log('\n=== Processing Hollywood Data ===');
  data.actors.push(...await processCategory(HOLLYWOOD_ACTORS, 'actor', 'hollywood', 21));
  data.actresses.push(...await processCategory(HOLLYWOOD_ACTRESSES, 'actress', 'hollywood', 21));
  data.directors.push(...await processCategory(HOLLYWOOD_DIRECTORS, 'director', 'hollywood', 21));
  data.movies.push(...await processCategory(HOLLYWOOD_MOVIES, 'movie', 'hollywood', 21));
  data.productionHouses.push(...await processCategory(HOLLYWOOD_PRODUCTION_HOUSES, 'productionHouse', 'hollywood', 21));
  
  // Process World/Regional (10 each)
  console.log('\n=== Processing World/Regional Data ===');
  data.actors.push(...await processCategory(WORLD_ACTORS, 'actor', 'world', 41));
  data.actresses.push(...await processCategory(WORLD_ACTRESSES, 'actress', 'world', 41));
  data.directors.push(...await processCategory(WORLD_DIRECTORS, 'director', 'world', 41));
  data.movies.push(...await processCategory(WORLD_MOVIES, 'movie', 'world', 41));
  data.productionHouses.push(...await processCategory(WORLD_PRODUCTION_HOUSES, 'productionHouse', 'world', 41));
  
  // Save the data
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2));
  
  console.log('\n=== Summary ===');
  console.log(`Actors: ${data.actors.length} (Target: 50)`);
  console.log(`Actresses: ${data.actresses.length} (Target: 50)`);
  console.log(`Directors: ${data.directors.length} (Target: 50)`);
  console.log(`Movies: ${data.movies.length} (Target: 50)`);
  console.log(`Production Houses: ${data.productionHouses.length} (Target: 50)`);
  
  console.log(`\nData saved to: ${OUTPUT_PATH}`);
}

main().catch(console.error); 