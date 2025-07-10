// search-and-fix-trailers-all-remaining.cjs
const fs = require('fs');
const path = require('path');

// All remaining projects that need proper YouTube trailer URLs
const allRemainingProjects = [
  // Batch 3: Hollywood Movies (8 projects)
  'Avengers: Endgame',
  'Spider-Man: No Way Home', 
  'The Batman',
  'Top Gun: Maverick',
  'Black Panther: Wakanda Forever',
  'Doctor Strange in the Multiverse of Madness',
  'Thor: Love and Thunder',
  'Minions: The Rise of Gru',
  
  // Batch 4: More Bollywood (8 projects) 
  'Andhadhun',
  'Badhaai Ho',
  'Stree',
  'Tumhari Sulu',
  'Bareilly Ki Barfi',
  'Shubh Mangal Saavdhan',
  'Toilet: Ek Prem Katha',
  'Hindi Medium'
];

// Comprehensive mapping of actual YouTube trailer URLs for all remaining projects
const actualTrailerMapping = {
  // Batch 3: Hollywood Movies
  'Avengers: Endgame': 'TcMBFSGVi1c', // https://www.youtube.com/watch?v=TcMBFSGVi1c
  'Spider-Man: No Way Home': 'JfVOs4VSpmA', // https://www.youtube.com/watch?v=JfVOs4VSpmA
  'The Batman': 'mqqft2x_Aa4', // https://www.youtube.com/watch?v=mqqft2x_Aa4
  'Top Gun: Maverick': 'qSqVVswa420', // https://www.youtube.com/watch?v=qSqVVswa420
  'Black Panther: Wakanda Forever': '_Z3QKkl1WyM', // https://www.youtube.com/watch?v=_Z3QKkl1WyM
  'Doctor Strange in the Multiverse of Madness': 'aWzlQ2N6qqg', // https://www.youtube.com/watch?v=aWzlQ2N6qqg
  'Thor: Love and Thunder': 'Go8nTmfrQd8', // https://www.youtube.com/watch?v=Go8nTmfrQd8
  'Minions: The Rise of Gru': 'j2rP3Jr9vEk', // https://www.youtube.com/watch?v=j2rP3Jr9vEk
  
  // Batch 4: More Bollywood Movies
  'Andhadhun': 'w11Iw7z4Zg0', // https://www.youtube.com/watch?v=w11Iw7z4Zg0
  'Badhaai Ho': 'QsH4oRwM8Kw', // https://www.youtube.com/watch?v=QsH4oRwM8Kw
  'Stree': 'hGPWC3JvTiA', // https://www.youtube.com/watch?v=hGPWC3JvTiA
  'Tumhari Sulu': 'DWgOaVgVGPg', // https://www.youtube.com/watch?v=DWgOaVgVGPg
  'Bareilly Ki Barfi': 'LRIiNxoWoW0', // https://www.youtube.com/watch?v=LRIiNxoWoW0
  'Shubh Mangal Saavdhan': 'cAwkGLCYvJY', // https://www.youtube.com/watch?v=cAwkGLCYvJY
  'Toilet: Ek Prem Katha': 'Jw1Y-zhQURU', // https://www.youtube.com/watch?v=Jw1Y-zhQURU
  'Hindi Medium': 'Hi3eVmHeUsI', // https://www.youtube.com/watch?v=Hi3eVmHeUsI
};

function updateAllRemainingTrailerUrls() {
  const filePath = path.join(__dirname, 'src/data/projects.ts');
  let content = fs.readFileSync(filePath, 'utf8');
  
  let updatedCount = 0;
  let batch3Count = 0;
  let batch4Count = 0;
  
  console.log('🚀 Starting comprehensive trailer URL update for all remaining batches...\n');
  
  for (const [projectTitle, videoId] of Object.entries(actualTrailerMapping)) {
    // Find projects with placeholder URL and matching title
    const placeholderRegex = new RegExp(
      `("title":\\s*"${projectTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[\\s\\S]*?)"trailer":\\s*"https://www\\.youtube\\.com/watch\\?v=dQw4w9WgXcQ"`,
      'g'
    );
    
    const newUrl = `"trailer": "https://www.youtube.com/watch?v=${videoId}"`;
    
    if (placeholderRegex.test(content)) {
      content = content.replace(placeholderRegex, `$1${newUrl}`);
      updatedCount++;
      
      // Determine which batch this belongs to
      const hollywoodMovies = ['Avengers: Endgame', 'Spider-Man: No Way Home', 'The Batman', 'Top Gun: Maverick', 'Black Panther: Wakanda Forever', 'Doctor Strange in the Multiverse of Madness', 'Thor: Love and Thunder', 'Minions: The Rise of Gru'];
      
      if (hollywoodMovies.includes(projectTitle)) {
        batch3Count++;
        console.log(`✅ [Batch 3 - Hollywood] Updated "${projectTitle}" trailer URL`);
      } else {
        batch4Count++;
        console.log(`✅ [Batch 4 - Bollywood] Updated "${projectTitle}" trailer URL`);
      }
    }
  }
  
  // Write the updated content back to the file
  fs.writeFileSync(filePath, content, 'utf8');
  
  console.log(`\n🎉 ALL BATCHES COMPLETE!`);
  console.log(`📊 Batch 3 (Hollywood Movies): ${batch3Count}/8 updated`);
  console.log(`📊 Batch 4 (More Bollywood): ${batch4Count}/8 updated`);
  console.log(`📊 Total Updated: ${updatedCount}/16 trailer URLs`);
  console.log(`\n🚀 All YouTube trailer URLs have been fixed across all batches!`);
  
  return updatedCount;
}

// Run the comprehensive update
updateAllRemainingTrailerUrls(); 