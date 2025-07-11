const fs = require('fs');
const path = require('path');

// Multiple potential sources for each project with official channels
const smartTrailerSources = {
  // Farzi (Amazon Prime Video Original)
  "153": [
    "https://www.youtube.com/watch?v=5OUP8F75KG8", // Amazon Prime Video India
    "https://www.youtube.com/watch?v=RGHDkHTRUgE", // Amazon Prime Video Official
    "https://www.youtube.com/watch?v=CRbHwqaOz4M", // Amazon Prime Video Hindi
    "https://www.youtube.com/watch?v=gJoFUJJGk2M", // Official Farzi trailer
    "https://www.youtube.com/watch?v=gCPjLX-zVKk", // Prime Video channel
  ],
  
  // Call My Agent! (Netflix Original)
  "119": [
    "https://www.youtube.com/watch?v=8oLn2eKmBNY", // Netflix India
    "https://www.youtube.com/watch?v=uQqOt8k0whs", // Netflix Official
    "https://www.youtube.com/watch?v=QYjAJWbIfCY", // Netflix Global
    "https://www.youtube.com/watch?v=XQCwDPMWj4Y", // Call My Agent official
    "https://www.youtube.com/watch?v=PiYVKQ2-jUs", // Netflix France
  ]
};

async function validateUrl(url) {
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    const response = await fetch(oembedUrl);
    
    if (response.ok) {
      const data = await response.json();
      return { working: true, title: data.title, url: url };
    }
    
    return { working: false, error: `HTTP ${response.status}`, url: url };
  } catch (error) {
    return { working: false, error: error.message, url: url };
  }
}

async function findBestTrailer(projectId, projectName) {
  const sources = smartTrailerSources[projectId] || [];
  
  console.log(`\n🔍 Searching for ${projectName} trailer in ${sources.length} sources...`);
  
  for (let i = 0; i < sources.length; i++) {
    const url = sources[i];
    console.log(`   Testing source ${i + 1}/${sources.length}: ${url}`);
    
    const result = await validateUrl(url);
    
    if (result.working) {
      console.log(`   ✅ FOUND WORKING TRAILER: "${result.title}"`);
      return result;
    } else {
      console.log(`   ❌ Failed: ${result.error}`);
    }
    
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log(`   ❌ No working trailer found for ${projectName}`);
  return null;
}

async function main() {
  console.log('🎯 Smart Trailer Fix - Multiple Source Strategy');
  console.log('🔍 Searching official channels and verified sources...');
  
  const projectsToFix = {
    "153": "Farzi",
    "119": "Call My Agent!"
  };
  
  const workingTrailers = {};
  
  // Find working trailers
  for (const [projectId, projectName] of Object.entries(projectsToFix)) {
    const result = await findBestTrailer(projectId, projectName);
    if (result) {
      workingTrailers[projectId] = result.url;
      console.log(`✅ ${projectName}: Found working trailer`);
    } else {
      console.log(`❌ ${projectName}: No working trailer found`);
    }
  }
  
  if (Object.keys(workingTrailers).length === 0) {
    console.log('\n❌ No working trailers found from any source.');
    console.log('💡 This suggests the trailers may be geo-restricted or completely removed.');
    console.log('🔄 Consider using alternative video platforms or self-hosting trailers.');
    return;
  }
  
  // Apply fixes to the projects file
  console.log('\n🔧 Applying trailer fixes...');
  
  const projectsPath = path.join(__dirname, 'src/data/projects.ts');
  let projectsContent = fs.readFileSync(projectsPath, 'utf8');
  
  // Create backup
  const backupPath = path.join(__dirname, 'src/data/projects.backup.smart-fix.ts');
  fs.writeFileSync(backupPath, projectsContent);
  console.log(`✅ Backup created: ${backupPath}`);
  
  let fixedCount = 0;
  
  for (const [projectId, newUrl] of Object.entries(workingTrailers)) {
    const projectName = projectsToFix[projectId];
    
    // Use a more precise regex to find and replace the trailer URL
    const regex = new RegExp(`("id": "${projectId}"[\\s\\S]*?"trailer": ")([^"]+)(")`, 'g');
    const matches = [...projectsContent.matchAll(regex)];
    
    if (matches.length > 0) {
      const match = matches[0];
      const oldUrl = match[2];
      const replacement = match[1] + newUrl + match[3];
      
      projectsContent = projectsContent.replace(match[0], replacement);
      
      console.log(`✅ Fixed ${projectName}:`);
      console.log(`   Old: ${oldUrl}`);
      console.log(`   New: ${newUrl}`);
      fixedCount++;
    } else {
      console.log(`❌ Could not find ${projectName} (ID: ${projectId}) in projects file`);
    }
  }
  
  // Save the updated content
  fs.writeFileSync(projectsPath, projectsContent);
  
  console.log(`\n🎉 Applied ${fixedCount} trailer fixes!`);
  
  // Final verification
  console.log('\n🔍 Final verification...');
  
  const updatedContent = fs.readFileSync(projectsPath, 'utf8');
  const projectsMatch = updatedContent.match(/export const projects: Project\[\] = (\[[\s\S]*?\]);/);
  
  if (projectsMatch) {
    const projects = eval(projectsMatch[1]);
    
    for (const [projectId, expectedUrl] of Object.entries(workingTrailers)) {
      const project = projects.find(p => p.id === projectId);
      const projectName = projectsToFix[projectId];
      
      if (project && project.trailer === expectedUrl) {
        console.log(`✅ ${projectName}: Successfully updated and verified`);
        
        // Quick validation
        const result = await validateUrl(project.trailer);
        if (result.working) {
          console.log(`   ✅ CONFIRMED WORKING: "${result.title}"`);
        } else {
          console.log(`   ⚠️  Validation failed: ${result.error}`);
        }
      } else {
        console.log(`❌ ${projectName}: Update verification failed`);
      }
    }
  }
  
  console.log('\n✨ Smart trailer fix complete!');
  
  if (fixedCount > 0) {
    console.log(`🎬 ${fixedCount} trailer${fixedCount > 1 ? 's' : ''} fixed successfully!`);
    console.log('📱 Please test the trailers on your platform to confirm they work.');
  } else {
    console.log('⚠️ No trailers could be fixed. Consider alternative video sources.');
  }
  
  console.log('\n📊 Summary:');
  console.log(`✅ Fixed: ${fixedCount}`);
  console.log(`❌ Failed: ${Object.keys(projectsToFix).length - fixedCount}`);
}

main().catch(console.error); 