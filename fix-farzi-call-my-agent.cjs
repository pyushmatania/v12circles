const fs = require('fs');
const path = require('path');

// Verified working URLs for specific projects
const specificFixes = {
  "153": "https://www.youtube.com/watch?v=jCvwNJPHUic", // Farzi - Official Trailer
  "119": "https://www.youtube.com/watch?v=S0KhTJlCiVk", // Call My Agent! - Official Trailer
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

async function main() {
  console.log('🎯 Focused Fix for Farzi and Call My Agent!');
  
  // First, validate our URLs
  console.log('\n📋 Validating URLs before applying fixes...');
  
  for (const [projectId, url] of Object.entries(specificFixes)) {
    const projectName = projectId === "153" ? "Farzi" : "Call My Agent!";
    console.log(`Testing ${projectName}: ${url}`);
    
    const result = await validateUrl(url);
    if (result.working) {
      console.log(`✅ WORKING: ${projectName} - "${result.title}"`);
    } else {
      console.log(`❌ BROKEN: ${projectName} - ${result.error}`);
    }
  }
  
  // Apply fixes
  console.log('\n🔧 Applying fixes...');
  
  const projectsPath = path.join(__dirname, 'src/data/projects.ts');
  let projectsContent = fs.readFileSync(projectsPath, 'utf8');
  
  // Create backup
  const backupPath = path.join(__dirname, 'src/data/projects.backup.specific-fix.ts');
  fs.writeFileSync(backupPath, projectsContent);
  console.log(`✅ Backup created: ${backupPath}`);
  
  let fixedCount = 0;
  
  for (const [projectId, newUrl] of Object.entries(specificFixes)) {
    const projectName = projectId === "153" ? "Farzi" : "Call My Agent!";
    
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
    
    for (const [projectId, expectedUrl] of Object.entries(specificFixes)) {
      const project = projects.find(p => p.id === projectId);
      const projectName = projectId === "153" ? "Farzi" : "Call My Agent!";
      
      if (project) {
        console.log(`\n📱 ${projectName}:`);
        console.log(`   Current URL: ${project.trailer}`);
        console.log(`   Expected URL: ${expectedUrl}`);
        console.log(`   Match: ${project.trailer === expectedUrl ? '✅' : '❌'}`);
        
        if (project.trailer === expectedUrl) {
          const result = await validateUrl(project.trailer);
          if (result.working) {
            console.log(`   Status: ✅ WORKING - "${result.title}"`);
          } else {
            console.log(`   Status: ❌ BROKEN - ${result.error}`);
          }
        }
      }
    }
  }
  
  console.log('\n✨ Specific fix process complete!');
  console.log('🎬 Please check Farzi and Call My Agent! trailers now');
}

main().catch(console.error); 