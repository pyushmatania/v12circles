const { SpotifyApiService } = require('../src/services/spotifyApi.ts');

async function testBatchFetch() {
  console.log('Testing batch fetch functionality...');
  
  const spotifyApi = new SpotifyApiService();
  
  // Test with a small set of artist names
  const testArtists = [
    'Taylor Swift',
    'Ed Sheeran', 
    'Drake',
    'Ariana Grande',
    'Post Malone',
    'Billie Eilish',
    'The Weeknd',
    'Dua Lipa',
    'BTS',
    'Blackpink',
    'Arijit Singh',
    'Shreya Ghoshal'
  ];
  
  try {
    console.log(`Starting batch fetch for ${testArtists.length} artists...`);
    const startTime = Date.now();
    
    const results = await spotifyApi.fetchArtistImagesInBatches(testArtists, 5, 1000); // 5 at a time, 1 second delay
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    console.log(`\nBatch fetch completed in ${duration.toFixed(2)} seconds`);
    console.log(`Found ${results.size}/${testArtists.length} artists`);
    
    // Display results
    results.forEach((artist, name) => {
      console.log(`✓ ${name}: ${artist.name} (${artist.popularity} popularity)`);
    });
    
    // Show missing artists
    const missingArtists = testArtists.filter(name => !results.has(name));
    if (missingArtists.length > 0) {
      console.log(`\nMissing artists: ${missingArtists.join(', ')}`);
    }
    
  } catch (error) {
    console.error('Error in batch fetch test:', error);
  }
}

// Run the test
testBatchFetch(); 