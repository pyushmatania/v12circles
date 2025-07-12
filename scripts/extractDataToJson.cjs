const fs = require('fs');
const path = require('path');

// Read the TypeScript file
const tsFilePath = path.join(__dirname, '../src/data/realCommunityData.ts');
const jsonFilePath = path.join(__dirname, '../src/data/realCommunityData.json');

function extractDataFromTS() {
  const content = fs.readFileSync(tsFilePath, 'utf-8');
  
  // Find the start of the data object
  const startIndex = content.indexOf('export const realCommunityData:');
  if (startIndex === -1) {
    throw new Error('Could not find realCommunityData export');
  }
  
  // Find the opening brace of the data object
  const dataStart = content.indexOf('{', startIndex);
  if (dataStart === -1) {
    throw new Error('Could not find data object start');
  }
  
  // Find the closing brace by counting braces
  let braceCount = 0;
  let dataEnd = -1;
  
  for (let i = dataStart; i < content.length; i++) {
    if (content[i] === '{') {
      braceCount++;
    } else if (content[i] === '}') {
      braceCount--;
      if (braceCount === 0) {
        dataEnd = i + 1;
        break;
      }
    }
  }
  
  if (dataEnd === -1) {
    throw new Error('Could not find data object end');
  }
  
  // Extract the data object
  const dataObject = content.substring(dataStart, dataEnd);
  
  // Remove TypeScript comments
  const cleanedData = dataObject
    .replace(/\/\/.*$/gm, '') // Remove single-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  // Parse as JSON
  try {
    const parsedData = eval('(' + cleanedData + ')');
    return parsedData;
  } catch (error) {
    console.error('Error parsing data:', error);
    throw error;
  }
}

try {
  console.log('Extracting data from TypeScript file...');
  const data = extractDataFromTS();
  
  // Write to JSON file
  fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2));
  console.log(`✅ Data successfully extracted to ${jsonFilePath}`);
  console.log(`📊 Found ${data.movies?.length || 0} movies`);
  console.log(`📊 Found ${data.productionHouses?.length || 0} production houses`);
  console.log(`📊 Found ${data.directors?.length || 0} directors`);
  console.log(`📊 Found ${data.actors?.length || 0} actors`);
  console.log(`📊 Found ${data.actresses?.length || 0} actresses`);
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
} 