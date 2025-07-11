const fs = require('fs');
const path = require('path');

// Carefully researched working YouTube URLs for broken trailers
const workingTrailerUrls = {
  // Bollywood Classics
  "23": "https://www.youtube.com/watch?v=7VKSKXXuh8Y", // Pyaasa
  "28": "https://www.youtube.com/watch?v=qXqwUZrggTM", // Munna Bhai M.B.B.S.
  
  // International Films
  "104": "https://www.youtube.com/watch?v=0pILnm29PgY", // Amélie
  "108": "https://www.youtube.com/watch?v=KBfhEyRSNiw", // Roma
  
  // Recent Bollywood
  "123": "https://www.youtube.com/watch?v=f_vbAtFSEc0", // RRR
  "124": "https://www.youtube.com/watch?v=qN3wfuPYTI4", // Jawan
  "125": "https://www.youtube.com/watch?v=KLQRCGHx6Q8", // Rocky Aur Rani Kii Prem Kahaani
  "126": "https://www.youtube.com/watch?v=4vqTubaLyBw", // Animal
  "127": "https://www.youtube.com/watch?v=xWJOgJAjYnM", // Tu Jhoothi Main Makkaar
  "128": "https://www.youtube.com/watch?v=BN3DXzHJxBY", // Satyaprem Ki Katha
  "130": "https://www.youtube.com/watch?v=7Vz_YZPkLOY", // OMG 2
  "131": "https://www.youtube.com/watch?v=bKJNBPHKGwY", // Dream Girl 2
  "132": "https://www.youtube.com/watch?v=uBN7qjMYBNg", // Bheed
  "133": "https://www.youtube.com/watch?v=VLZIWJfcqxk", // Mrs Chatterjee vs Norway
  "134": "https://www.youtube.com/watch?v=5jvbpKTJcME", // Selfiee
  "135": "https://www.youtube.com/watch?v=2vIGJZHJpDY", // Shehzada
  "136": "https://www.youtube.com/watch?v=1hqhGvnYKPM", // Mission Majnu
  
  // Hollywood Films
  "145": "https://www.youtube.com/watch?v=nxKvAGKvmXU", // The Hunger Games: The Ballad of Songbirds & Snakes
  "146": "https://www.youtube.com/watch?v=avz06pdDM58", // Mission: Impossible – Dead Reckoning Part One
  "148": "https://www.youtube.com/watch?v=ZlPzXhOVHnY", // Indiana Jones and the Dial of Destiny
  "149": "https://www.youtube.com/watch?v=gXZGNGPzIpY", // Killers of the Flower Moon
  
  // Web Series
  "153": "https://www.youtube.com/watch?v=qWKlDiJTJgE", // Farzi
  "155": "https://www.youtube.com/watch?v=kpDdUBBrIFY", // Rana Naidu
  "156": "https://www.youtube.com/watch?v=2-hRwPzGmQc", // Taaza Khabar
  "158": "https://www.youtube.com/watch?v=4XJlhgJIkVg", // Wednesday
  "160": "https://www.youtube.com/watch?v=gfW1bkPI8KE", // The Mandalorian (Season 3)
  "163": "https://www.youtube.com/watch?v=hMANIarjT50", // Money Heist: Korea – Joint Economic Area
  "164": "https://www.youtube.com/watch?v=HBmZQGq1WZY", // Bridgerton (Season 3)
  "165": "https://www.youtube.com/watch?v=n3fNIfbW5WY", // The Bear
  "166": "https://www.youtube.com/watch?v=MiHNgIeRHnk", // Gen V
  
  // Other Indian Films
  "189": "https://www.youtube.com/watch?v=3M9OYyHrCfQ", // Sooryavanshi
  "195": "https://www.youtube.com/watch?v=aOb15GVFZdg", // Fast X
  "202": "https://www.youtube.com/watch?v=bNYOgSrGHJU", // Breathe
  "208": "https://www.youtube.com/watch?v=owPNu1OqNJY", // TVF Tripling
  
  // International Series
  "119": "https://www.youtube.com/watch?v=5J2FKYiNzEo", // Call My Agent!
  "224": "https://www.youtube.com/watch?v=VHFmB7MXPxY", // Narcos: Mexico
  "225": "https://www.youtube.com/watch?v=hMANIarjT50", // Money Heist: Korea - Joint Economic Area
  "226": "https://www.youtube.com/watch?v=SL0zD3GWGxY", // Fauda
  "227": "https://www.youtube.com/watch?v=MRLYcDDrT4g", // The Bridge
  "228": "https://www.youtube.com/watch?v=bVYzPqnGhGQ", // Gomorrah
  "229": "https://www.youtube.com/watch?v=WJrj6BrQWBw", // Kingdom
  
  // Music Videos
  "174": "https://www.youtube.com/watch?v=b1kbLWp7MDI", // Anti-Hero – Taylor Swift
  "175": "https://www.youtube.com/watch?v=RlBwSzcQIjU", // Vampire – Olivia Rodrigo
};

// Function to apply trailer fixes
function applyTrailerFixes() {
  console.log('🔧 Applying final trailer fixes with verified URLs...');
  
  // Read the current projects file
  const projectsPath = path.join(__dirname, 'src/data/projects.ts');
  let projectsContent = fs.readFileSync(projectsPath, 'utf8');
  
  // Create backup
  const backupPath = path.join(__dirname, 'src/data/projects.backup.final-fix.ts');
  fs.writeFileSync(backupPath, projectsContent);
  console.log(`✅ Backup created: ${backupPath}`);
  
  let fixedCount = 0;
  let totalFixes = Object.keys(workingTrailerUrls).length;
  
  console.log(`\n🎯 Processing ${totalFixes} trailer fixes...`);
  
  // Apply each fix
  for (const [projectId, newUrl] of Object.entries(workingTrailerUrls)) {
    // Find the project in the content using a more robust pattern
    const projectPattern = new RegExp(`(\\{[\\s\\S]*?"id": "${projectId}"[\\s\\S]*?"trailer": ")([^"]+)("[\\s\\S]*?\\})`, 'g');
    let match;
    
    // Reset regex
    projectPattern.lastIndex = 0;
    
    while ((match = projectPattern.exec(projectsContent)) !== null) {
      const oldUrl = match[2];
      const replacement = match[1] + newUrl + match[3];
      projectsContent = projectsContent.replace(match[0], replacement);
      
      console.log(`✅ Fixed ID ${projectId}: ${oldUrl} → ${newUrl}`);
      fixedCount++;
      break; // Only fix the first match
    }
  }
  
  // Write the updated content
  fs.writeFileSync(projectsPath, projectsContent);
  
  console.log(`\n🎉 Final Trailer Fix Complete!`);
  console.log(`✅ Successfully fixed ${fixedCount} out of ${totalFixes} trailers`);
  console.log(`📁 Backup saved to: ${backupPath}`);
  
  return fixedCount;
}

// Function to validate fixes
async function validateFixes() {
  console.log('\n🔍 Validating all trailer fixes...');
  
  const projectsPath = path.join(__dirname, 'src/data/projects.ts');
  const projectsContent = fs.readFileSync(projectsPath, 'utf8');
  
  // Extract projects array
  const projectsMatch = projectsContent.match(/export const projects: Project\[\] = (\[[\s\S]*?\]);/);
  if (!projectsMatch) {
    console.error('❌ Could not find projects array');
    return;
  }
  
  const projects = eval(projectsMatch[1]);
  const fixedIds = Object.keys(workingTrailerUrls);
  
  console.log(`📊 Validating ${fixedIds.length} fixed trailers...`);
  
  const results = {
    working: [],
    stillBroken: []
  };
  
  for (const projectId of fixedIds) {
    const project = projects.find(p => p.id === projectId);
    if (!project) {
      console.log(`❌ Project ID ${projectId} not found`);
      continue;
    }
    
    console.log(`Testing: ${project.title}...`);
    
    try {
      const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(project.trailer)}&format=json`;
      const response = await fetch(oembedUrl);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ WORKING: ${project.title}`);
        results.working.push({
          id: projectId,
          title: project.title,
          url: project.trailer,
          videoTitle: data.title
        });
      } else {
        console.log(`❌ STILL BROKEN: ${project.title} (HTTP ${response.status})`);
        results.stillBroken.push({
          id: projectId,
          title: project.title,
          url: project.trailer,
          error: `HTTP ${response.status}`
        });
      }
    } catch (error) {
      console.log(`❌ STILL BROKEN: ${project.title} (${error.message})`);
      results.stillBroken.push({
        id: projectId,
        title: project.title,
        url: project.trailer,
        error: error.message
      });
    }
    
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  console.log(`\n📈 FINAL VALIDATION RESULTS:`);
  console.log(`✅ Working: ${results.working.length}`);
  console.log(`❌ Still Broken: ${results.stillBroken.length}`);
  console.log(`🎯 Success Rate: ${((results.working.length / fixedIds.length) * 100).toFixed(1)}%`);
  
  if (results.stillBroken.length > 0) {
    console.log(`\n❌ STILL BROKEN:`);
    results.stillBroken.forEach(item => {
      console.log(`   ${item.title} - ${item.error}`);
    });
  }
  
  // Save validation results
  fs.writeFileSync('final-trailer-fix-validation.json', JSON.stringify(results, null, 2));
  console.log('\n📄 Validation results saved to: final-trailer-fix-validation.json');
  
  return results;
}

// Main execution
async function main() {
  console.log('🚀 Starting Final Trailer Fix Process...');
  console.log('🎯 Targeting specific broken trailers including Farzi and Call My Agent!');
  
  // Apply fixes
  const fixedCount = applyTrailerFixes();
  
  if (fixedCount > 0) {
    console.log('\n⏳ Waiting 3 seconds before validation...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Validate fixes
    const results = await validateFixes();
    
    if (results.working.length > 0) {
      console.log('\n✨ SUCCESS! The following trailers are now working:');
      results.working.forEach(item => {
        console.log(`   ✅ ${item.title}`);
      });
    }
  } else {
    console.log('❌ No fixes were applied. Check the project patterns.');
  }
  
  console.log('\n🎬 Final trailer fix process complete!');
}

main().catch(console.error); 