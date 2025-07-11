const fs = require('fs');
const path = require('path');

// Most recent working URLs from popular channels
const finalFixes = {
  // Farzi - Amazon Prime Video Official
  "153": "https://www.youtube.com/watch?v=4oNLDSzwTsU",
  // Call My Agent! - Netflix Official
  "119": "https://www.youtube.com/watch?v=w7KZRNLfzjY",
  // Alternative URLs as backup
  "153_alt": "https://www.youtube.com/watch?v=fJeJsrQzLcY",
  "119_alt": "https://www.youtube.com/watch?v=Jm6wUUxPLp8",
};

async function validateUrl(url) {
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    const response = await fetch(oembedUrl);
    if (response.ok) {
      const data = await response.json();
      return { working: true, title: data.title };
    }
    return { working: false, error: `HTTP ${response.status}` };
  } catch (error) {
    return { working: false, error: error.message };
  }
}

async function findWorkingUrl(projectId) {
  const urls = [finalFixes[projectId], finalFixes[projectId + '_alt']].filter(Boolean);
  
  for (const url of urls) {
    const result = await validateUrl(url);
    if (result.working) {
      return { url, title: result.title };
    }
  }
  return null;
}

async function main() {
  console.log('🎯 Final Targeted Fix for Farzi and Call My Agent!');
  
  const projectsToFix = {
    "153": "Farzi",
    "119": "Call My Agent!"
  };
  
  // Find working URLs
  const workingUrls = {};
  
  console.log('\n📋 Finding working URLs...');
  
  for (const [projectId, name] of Object.entries(projectsToFix)) {
    console.log(`Searching for ${name}...`);
    
    const result = await findWorkingUrl(projectId);
    if (result) {
      workingUrls[projectId] = result.url;
      console.log(`✅ Found working URL for ${name}: "${result.title}"`);
    } else {
      console.log(`❌ No working URL found for ${name}`);
    }
  }
  
  if (Object.keys(workingUrls).length === 0) {
    console.log('❌ No working URLs found. YouTube may have removed these trailers.');
    return;
  }
  
  // Apply fixes
  console.log('\n🔧 Applying fixes...');
  
  const projectsPath = path.join(__dirname, 'src/data/projects.ts');
  let projectsContent = fs.readFileSync(projectsPath, 'utf8');
  
  // Create backup
  const backupPath = path.join(__dirname, 'src/data/projects.backup.final-targeted.ts');
  fs.writeFileSync(backupPath, projectsContent);
  console.log(`✅ Backup created: ${backupPath}`);
  
  let fixedCount = 0;
  
  for (const [projectId, newUrl] of Object.entries(workingUrls)) {
    const projectName = projectsToFix[projectId];
    
    // Find and replace the trailer URL
    const regex = new RegExp(`("id": "${projectId}"[\\s\\S]*?"trailer": ")([^"]+)(")`, 'g');
    const match = regex.exec(projectsContent);
    
    if (match) {
      const oldUrl = match[2];
      const replacement = match[1] + newUrl + match[3];
      projectsContent = projectsContent.replace(match[0], replacement);
      
      console.log(`✅ Fixed ${projectName}: ${oldUrl} → ${newUrl}`);
      fixedCount++;
    } else {
      console.log(`❌ Could not find ${projectName} (ID: ${projectId})`);
    }
  }
  
  // Write the updated content
  fs.writeFileSync(projectsPath, projectsContent);
  
  console.log(`\n🎉 Applied ${fixedCount} fixes`);
  
  // Final validation
  console.log('\n🔍 Final validation...');
  
  const updatedContent = fs.readFileSync(projectsPath, 'utf8');
  const projectsMatch = updatedContent.match(/export const projects: Project\[\] = (\[[\s\S]*?\]);/);
  
  if (projectsMatch) {
    const projects = eval(projectsMatch[1]);
    
    for (const [projectId, expectedUrl] of Object.entries(workingUrls)) {
      const project = projects.find(p => p.id === projectId);
      const projectName = projectsToFix[projectId];
      
      if (project) {
        console.log(`\n📱 ${projectName}:`);
        console.log(`   URL: ${project.trailer}`);
        
        const result = await validateUrl(project.trailer);
        if (result.working) {
          console.log(`   Status: ✅ WORKING - "${result.title}"`);
        } else {
          console.log(`   Status: ❌ BROKEN - ${result.error}`);
        }
      }
    }
  }
  
  console.log('\n✨ Final targeted fix complete!');
  
  if (fixedCount > 0) {
    console.log('✅ Some trailers have been fixed. Please test them on your platform.');
  } else {
    console.log('⚠️ No fixes could be applied. YouTube may have removed these trailers.');
    console.log('💡 Consider using alternative video sources or contacting content owners.');
  }
}

main().catch(console.error); 