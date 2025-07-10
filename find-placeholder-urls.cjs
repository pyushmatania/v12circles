// find-placeholder-urls.cjs
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/data/projects.ts');
let text = fs.readFileSync(filePath, 'utf8');

// Find all projects with placeholder URLs
const placeholderRegex = /"trailer":\s*"https:\/\/www\.youtube\.com\/watch\?v=dQw4w9WgXcQ"/g;
const titleRegex = /"title":\s*"([^"]+)"/g;

let matches = [];
let match;
let lineNumber = 1;
let currentTitle = '';

// Split text into lines to track line numbers
const lines = text.split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Check for title
  const titleMatch = line.match(/"title":\s*"([^"]+)"/);
  if (titleMatch) {
    currentTitle = titleMatch[1];
  }
  
  // Check for placeholder trailer URL
  if (line.includes('"trailer": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"')) {
    matches.push({
      lineNumber: i + 1,
      title: currentTitle,
      type: getProjectType(lines, i),
      category: getProjectCategory(lines, i)
    });
  }
}

function getProjectType(lines, currentIndex) {
  // Look back a few lines for type
  for (let i = Math.max(0, currentIndex - 10); i < currentIndex; i++) {
    const typeMatch = lines[i].match(/"type":\s*"([^"]+)"/);
    if (typeMatch) return typeMatch[1];
  }
  return 'Unknown';
}

function getProjectCategory(lines, currentIndex) {
  // Look back a few lines for category
  for (let i = Math.max(0, currentIndex - 10); i < currentIndex; i++) {
    const categoryMatch = lines[i].match(/"category":\s*"([^"]+)"/);
    if (categoryMatch) return categoryMatch[1];
  }
  return 'Unknown';
}

console.log('📋 PROJECTS WITH PLACEHOLDER YOUTUBE URLs');
console.log('==========================================');
console.log(`Total projects found: ${matches.length}\n`);

// Group by type
const groupedByType = {};
matches.forEach(match => {
  if (!groupedByType[match.type]) {
    groupedByType[match.type] = [];
  }
  groupedByType[match.type].push(match);
});

Object.keys(groupedByType).forEach(type => {
  console.log(`\n🎬 ${type.toUpperCase()} (${groupedByType[type].length} projects):`);
  console.log('─'.repeat(50));
  
  groupedByType[type].forEach((match, index) => {
    console.log(`${index + 1}. ${match.title} (Line: ${match.lineNumber}, Category: ${match.category})`);
  });
});

console.log('\n📝 SUMMARY FOR BATCH FIXING:');
console.log('=============================');
console.log('Projects that need proper YouTube trailer URLs:');
matches.forEach((match, index) => {
  console.log(`${index + 1}. "${match.title}"`);
});

// Save to file for easy reference
const outputData = {
  totalCount: matches.length,
  projects: matches,
  groupedByType: groupedByType
};

fs.writeFileSync('placeholder-urls-list.json', JSON.stringify(outputData, null, 2));
console.log(`\n💾 Detailed list saved to: placeholder-urls-list.json`); 