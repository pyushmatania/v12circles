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
    // Bollywood (15)
    "film|Bollywood|Jawan",
    "film|Bollywood|Pathaan",
    "film|Bollywood|Rocky Aur Rani Kii Prem Kahaani",
    "film|Bollywood|Gadar 2",
    "film|Bollywood|Animal",
    "film|Bollywood|Tu Jhoothi Main Makkaar",
    "film|Bollywood|Satyaprem Ki Katha",
    "film|Bollywood|Bholaa",
    "film|Bollywood|OMG 2",
    "film|Bollywood|Dream Girl 2",
    "film|Bollywood|Bheed",
    "film|Bollywood|Mrs Chatterjee vs Norway",
    "film|Bollywood|Selfiee",
    "film|Bollywood|Shehzada",
    "film|Bollywood|Mission Majnu",
    // Hollywood (15)
    "film|Hollywood|Oppenheimer",
    "film|Hollywood|Barbie",
    "film|Hollywood|John Wick: Chapter 4",
    "film|Hollywood|Guardians of the Galaxy Vol. 3",
    "film|Hollywood|Spider-Man: Across the Spider-Verse",
    "film|Hollywood|The Marvels",
    "film|Hollywood|Dune: Part Two",
    "film|Hollywood|Wonka",
    "film|Hollywood|The Hunger Games: The Ballad of Songbirds & Snakes",
    "film|Hollywood|Mission: Impossible – Dead Reckoning Part One",
    "film|Hollywood|The Flash",
    "film|Hollywood|Indiana Jones and the Dial of Destiny",
    "film|Hollywood|Killers of the Flower Moon",
    "film|Hollywood|Napoleon",
    "film|Hollywood|The Creator",
    // Webseries (15)
    "webseries|Webseries|The Night Manager (India)",
    "webseries|Webseries|Farzi",
    "webseries|Webseries|Asur 2",
    "webseries|Webseries|Rana Naidu",
    "webseries|Webseries|Taaza Khabar",
    "webseries|Webseries|The Last of Us",
    "webseries|Webseries|Wednesday",
    "webseries|Webseries|The Mandalorian (Season 3)",
    "webseries|Webseries|You (Season 4)",
    "webseries|Webseries|Loki (Season 2)",
    "webseries|Webseries|Squid Game",
    "webseries|Webseries|Money Heist: Korea – Joint Economic Area",
    "webseries|Webseries|Bridgerton (Season 3)",
    "webseries|Webseries|The Bear",
    "webseries|Webseries|Gen V",
    // Music (15)
    "music|Music|Flowers – Miley Cyrus",
    "music|Music|Calm Down – Rema & Selena Gomez",
    "music|Music|Unholy – Sam Smith & Kim Petras",
    "music|Music|As It Was – Harry Styles",
    "music|Music|Anti-Hero – Taylor Swift",
    "music|Music|Cupid – FIFTY FIFTY",
    "music|Music|Seven – Jungkook ft. Latto",
    "music|Music|Vampire – Olivia Rodrigo",
    "music|Music|Paint The Town Red – Doja Cat",
    "music|Music|Dance The Night – Dua Lipa",
    "music|Music|Fast Car – Luke Combs",
    "music|Music|Ella Baila Sola – Eslabon Armado & Peso Pluma",
    "music|Music|Creepin' – Metro Boomin, The Weeknd & 21 Savage",
    "music|Music|La Bebe – Yng Lvcas & Peso Pluma",
    "music|Music|Tattoo – Loreen"
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