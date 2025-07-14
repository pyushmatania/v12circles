import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../src/data/projects.ts');
let content = fs.readFileSync(filePath, 'utf8');

// This regex matches objects and finds duplicate 'disabled' keys inside them
// It is a best-effort approach for large, non-standard JSON files
const objectRegex = /\{[\s\S]*?\}/g;

function removeDuplicateDisabledKeys(objStr) {
  // Find all 'disabled' keys and their values
  const disabledRegex = /"disabled"\s*:\s*(true|false),?/g;
  let matches = [...objStr.matchAll(disabledRegex)];
  if (matches.length <= 1) return objStr; // No duplicates
  // Remove all but the last occurrence
  let lastIndex = matches[matches.length - 1].index;
  let cleaned = objStr.replace(disabledRegex, (match, val, offset) => {
    if (offset === lastIndex) return match; // keep last
    return '';
  });
  // Clean up any extra commas
  cleaned = cleaned.replace(/,\s*,/g, ',');
  cleaned = cleaned.replace(/,\s*}/g, '}');
  return cleaned;
}

// Replace each object in the file
let newContent = content.replace(objectRegex, (objStr) => removeDuplicateDisabledKeys(objStr));

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Duplicate "disabled" keys removed from projects.ts'); 