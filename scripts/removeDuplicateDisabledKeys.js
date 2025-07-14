// This script removes duplicate 'disabled' keys from src/data/projects.ts
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/projects.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Regex to match all 'disabled' keys in an object
// We'll use a state machine to keep only the last occurrence per object
function removeDuplicateDisabledKeys(tsContent) {
  // Split into lines for easier processing
  const lines = tsContent.split('\n');
  let result = [];
  let objectDepth = 0;
  let disabledLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Track object depth
    if (line.trim().endsWith('{')) objectDepth++;
    if (line.trim().endsWith('}')) objectDepth--;

    // If this line is a 'disabled' key
    if (line.match(/^[ \t]*"disabled"\s*:/)) {
      // If we're inside an object, store the line index
      disabledLines.push({ depth: objectDepth, idx: result.length });
      // Don't add this line yet
      continue;
    }
    result.push(line);
    // If closing an object, keep only the last 'disabled' at this depth
    if (line.trim().endsWith('}')) {
      const toKeep = disabledLines.filter(d => d.depth === objectDepth + 1);
      if (toKeep.length > 0) {
        // Only keep the last one
        const last = toKeep[toKeep.length - 1];
        // Insert it before the closing '}'
        result.splice(result.length - 1, 0, lines[last.idx]);
        // Remove all at this depth
        disabledLines = disabledLines.filter(d => d.depth !== objectDepth + 1);
      }
    }
  }
  return result.join('\n');
}

const newContent = removeDuplicateDisabledKeys(content);
fs.writeFileSync(filePath, newContent, 'utf-8');
console.log('Duplicate "disabled" keys removed from projects.ts'); 