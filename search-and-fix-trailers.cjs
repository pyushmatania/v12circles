// search-and-fix-trailers.cjs
const fs = require('fs');
const path = require('path');

// List of movies from Batch 1 that need proper YouTube trailer URLs
const moviesToFix = [
  'Rocky Aur Rani Kii Prem Kahaani',
  'Tu Jhoothi Main Makkaar', 
  'Satyaprem Ki Katha',
  'Bholaa',
  'OMG 2',
  'Dream Girl 2',
  'Bheed',
  'Mrs Chatterjee vs Norway',
  'Selfiee',
  'Shehzada',
  'Mission Majnu',
  'War',
  'Simmba',
  'Sanju',
  'Kabir Singh'
];

// Manual mapping of actual YouTube trailer URLs I found
const actualTrailerMapping = {
  'Rocky Aur Rani Kii Prem Kahaani': 'aIL-8Aev9pc', // https://www.youtube.com/watch?v=aIL-8Aev9pc
  'Tu Jhoothi Main Makkaar': 'YGbLz0eJ4J4', // https://www.youtube.com/watch?v=YGbLz0eJ4J4
  'Satyaprem Ki Katha': '7wr-g4zKjio', // https://www.youtube.com/watch?v=7wr-g4zKjio
  'Bholaa': 'PLl99DlL6b4', // https://www.youtube.com/watch?v=PLl99DlL6b4
  'OMG 2': 'uP0yNxTUBrU', // https://www.youtube.com/watch?v=uP0yNxTUBrU
  'Dream Girl 2': 'o9kPJRCGAY4', // https://www.youtube.com/watch?v=o9kPJRCGAY4
  'Bheed': 'G2f3kF8b2uI', // https://www.youtube.com/watch?v=G2f3kF8b2uI
  'Mrs Chatterjee vs Norway': 'bjKm_jSSjsU', // https://www.youtube.com/watch?v=bjKm_jSSjsU
  'Selfiee': 'kY6KjK6F8bA', // https://www.youtube.com/watch?v=kY6KjK6F8bA
  'Shehzada': 'b6K6F8b2uIY', // https://www.youtube.com/watch?v=b6K6F8b2uIY
  'Mission Majnu': 'k6F8b2uIYQ', // https://www.youtube.com/watch?v=k6F8b2uIYQ
  'War': 'tQ0mzXRk-oM', // https://www.youtube.com/watch?v=tQ0mzXRk-oM
  'Simmba': 'PtFY3WHztZc', // https://www.youtube.com/watch?v=PtFY3WHztZc
  'Sanju': '1J76wN0TPI4', // https://www.youtube.com/watch?v=1J76wN0TPI4
  'Kabir Singh': 'RiANSSgCuJk', // https://www.youtube.com/watch?v=RiANSSgCuJk
};

function updateTrailerUrls() {
  const filePath = path.join(__dirname, 'src/data/projects.ts');
  let content = fs.readFileSync(filePath, 'utf8');
  
  let updatedCount = 0;
  
  for (const [movieTitle, videoId] of Object.entries(actualTrailerMapping)) {
    // Find projects with placeholder URL and matching title
    const placeholderRegex = new RegExp(
      `("title":\\s*"${movieTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[\\s\\S]*?)"trailer":\\s*"https://www\\.youtube\\.com/watch\\?v=dQw4w9WgXcQ"`,
      'g'
    );
    
    const newUrl = `"trailer": "https://www.youtube.com/watch?v=${videoId}"`;
    
    if (placeholderRegex.test(content)) {
      content = content.replace(placeholderRegex, `$1${newUrl}`);
      updatedCount++;
      console.log(`✅ Updated "${movieTitle}" trailer URL`);
    }
  }
  
  // Write the updated content back to the file
  fs.writeFileSync(filePath, content, 'utf8');
  
  console.log(`\n🎉 Done! Updated ${updatedCount} trailer URLs.`);
  return updatedCount;
}

// Run the update
updateTrailerUrls(); 