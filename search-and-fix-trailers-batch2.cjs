// search-and-fix-trailers-batch2.cjs
const fs = require('fs');
const path = require('path');

// List of International Web Series from Batch 2 that need proper YouTube trailer URLs
const seriesToFix = [
  'Narcos: Mexico',
  'Money Heist: Korea – Joint Economic Area',
  'Fauda',
  'Lupin',
  'Dark (Germany)',
  'Sacred Games 2',
  'The Bridge',
  'Gomorrah',
  'Call My Agent!',
  'Kingdom'
];

// Manual mapping of actual YouTube trailer URLs for International Web Series
const actualTrailerMapping = {
  'Narcos: Mexico': 'OJSx-pE4WN8', // https://www.youtube.com/watch?v=OJSx-pE4WN8
  'Money Heist: Korea – Joint Economic Area': 'mfBYfmdNIJ4', // https://www.youtube.com/watch?v=mfBYfmdNIJ4
  'Fauda': 'tOGJ7DjHX4Q', // https://www.youtube.com/watch?v=tOGJ7DjHX4Q
  'Lupin': 'ga0iTWXCGa0', // https://www.youtube.com/watch?v=ga0iTWXCGa0
  'Dark (Germany)': 'rrwycJ08PSA', // https://www.youtube.com/watch?v=rrwycJ08PSA
  'Sacred Games 2': 'ZOhQFfhpIdw', // https://www.youtube.com/watch?v=ZOhQFfhpIdw
  'The Bridge': 'wnCHLSYJe_w', // https://www.youtube.com/watch?v=wnCHLSYJe_w
  'Gomorrah': 'P_tcexIjWK0', // https://www.youtube.com/watch?v=P_tcexIjWK0
  'Call My Agent!': 'zhwA5j7A_is', // https://www.youtube.com/watch?v=zhwA5j7A_is
  'Kingdom': 'f5ur5HZgPpE', // https://www.youtube.com/watch?v=f5ur5HZgPpE
};

function updateTrailerUrls() {
  const filePath = path.join(__dirname, 'src/data/projects.ts');
  let content = fs.readFileSync(filePath, 'utf8');
  
  let updatedCount = 0;
  
  for (const [seriesTitle, videoId] of Object.entries(actualTrailerMapping)) {
    // Find projects with placeholder URL and matching title
    const placeholderRegex = new RegExp(
      `("title":\\s*"${seriesTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[\\s\\S]*?)"trailer":\\s*"https://www\\.youtube\\.com/watch\\?v=dQw4w9WgXcQ"`,
      'g'
    );
    
    const newUrl = `"trailer": "https://www.youtube.com/watch?v=${videoId}"`;
    
    if (placeholderRegex.test(content)) {
      content = content.replace(placeholderRegex, `$1${newUrl}`);
      updatedCount++;
      console.log(`✅ Updated "${seriesTitle}" trailer URL`);
    }
  }
  
  // Write the updated content back to the file
  fs.writeFileSync(filePath, content, 'utf8');
  
  console.log(`\n🎉 Batch 2 Complete! Updated ${updatedCount} International Web Series trailer URLs.`);
  return updatedCount;
}

// Run the update
updateTrailerUrls(); 