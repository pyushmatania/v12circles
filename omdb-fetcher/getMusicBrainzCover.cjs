const fetch = require('node-fetch');

async function getMusicBrainzCover(artist, album) {
  // Step 1: Search for the release
  const searchUrl = `https://musicbrainz.org/ws/2/release/?query=album:"${encodeURIComponent(album)}" AND artist:"${encodeURIComponent(artist)}"&fmt=json`;
  const searchRes = await fetch(searchUrl, { headers: { 'User-Agent': 'YourApp/1.0 (your@email.com)' } });
  const searchData = await searchRes.json();

  if (!searchData.releases || searchData.releases.length === 0) {
    console.log('No releases found.');
    return;
  }

  const mbid = searchData.releases[0].id;
  const coverUrl = `https://coverartarchive.org/release/${mbid}/front`;

  // Step 2: Use the coverUrl as the album poster
  console.log('Cover Art URL:', coverUrl);
}

// Example usage:
// Replace with your desired artist and album
getMusicBrainzCover('Taylor Swift', '1989'); 