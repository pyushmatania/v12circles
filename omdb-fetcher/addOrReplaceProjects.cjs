const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv))
  .option('titlesFile', {
    alias: 'f',
    type: 'string',
    description: 'Path to file containing titles (one per line, format: <type>|<category>|<title>)',
  })
  .option('add', {
    alias: 'a',
    type: 'boolean',
    description: 'Add mode (append to existing projects)',
    default: true,
  })
  .argv;

let titles = [];
if (argv.titlesFile) {
  const lines = fs.readFileSync(argv.titlesFile, 'utf8').split('\n').map(l => l.trim()).filter(Boolean);
  titles = lines;
} else {
  // fallback to hardcoded titles array
  titles = [
    // Famous Hollywood movies
    "film|Hollywood|The Shawshank Redemption",
    "film|Hollywood|The Godfather",
    "film|Hollywood|The Dark Knight",
    "film|Hollywood|Pulp Fiction",
    "film|Hollywood|Forrest Gump",
    "film|Hollywood|Inception",
    "film|Hollywood|Fight Club",
    "film|Hollywood|The Matrix",
    "film|Hollywood|Interstellar",
    "film|Hollywood|Gladiator",
    "film|Hollywood|Titanic",
    "film|Hollywood|Jurassic Park",
    "film|Hollywood|Avatar",
    "film|Hollywood|The Lord of the Rings: The Return of the King",
    "film|Hollywood|Star Wars: Episode V - The Empire Strikes Back",
    "film|Hollywood|Back to the Future",
    "film|Hollywood|The Silence of the Lambs",
    "film|Hollywood|Saving Private Ryan",
    "film|Hollywood|The Lion King",
    "film|Hollywood|Schindler's List"
  ];
}
const addMode = argv.add;

function parseTitleLine(line) {
  // Format: <type>|<category>|<title>
  const [type, category, ...titleParts] = line.split('|');
  const title = titleParts.join('|').trim();
  return { type: type?.trim() || 'film', category: category?.trim() || 'Hollywood', title };
}

function getNextId(projects) {
  if (!projects.length) return 1;
  return Math.max(...projects.map(p => parseInt(p.id, 10))) + 1;
}

function makeProject(id, { title, type, category }) {
  const now = new Date().toISOString();
  if (!title) throw new Error('Title is required');
  if (!type) throw new Error('Type is required');
  if (!category) throw new Error('Category is required');
  return {
    id: String(id),
    title: title.trim(),
    type,
    category,
    status: 'active',
    fundedPercentage: 0,
    targetAmount: 0,
    raisedAmount: 0,
    createdAt: now,
    updatedAt: now,
    poster: '',
    description: '',
    director: '',
    genre: '',
    tags: [],
    perks: ['Behind-the-scenes', 'Signed Poster', 'Premiere Invite'],
    rating: 0,
    trailer: '',
    movie: title.trim(),
    keyPeople: [],
    actor: '',
    actress: '',
    productionHouse: '',
    targetAmountHuman: '',
    raisedAmountHuman: '',
    keyCommunityData: [
      {
        id: `kc_${id}`,
        movieId: String(id),
        movieName: title.trim(),
        productionHouse: '',
        keyPeople: [],
        actor: '',
        actress: '',
        director: ''
      }
    ]
  };
}

function main() {
  if (!Array.isArray(titles) || titles.length === 0) {
    console.log('Please provide movie titles via --titlesFile or in the titles array.');
    process.exit(1);
  }
  const filePath = path.join(__dirname, 'projects.json');
  let projects = [];
  if (fs.existsSync(filePath) && addMode) {
    projects = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  let nextId = getNextId(projects);
  const existingTitles = new Set(projects.map(p => p.title.toLowerCase()));
  const newProjects = [];
  for (const line of titles) {
    const { type, category, title } = parseTitleLine(line);
    if (addMode && existingTitles.has(title.toLowerCase())) continue;
    newProjects.push(makeProject(nextId++, { title, type, category }));
  }
  let finalProjects;
  if (addMode) {
    finalProjects = [...projects, ...newProjects];
  } else {
    finalProjects = newProjects;
  }
  fs.writeFileSync(filePath, JSON.stringify(finalProjects, null, 2));
  console.log(`projects.json updated. Mode: ${addMode ? 'add' : 'replace'}. Added/replaced ${newProjects.length} projects.`);
}

if (require.main === module) {
  main();
} 