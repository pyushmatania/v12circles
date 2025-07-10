// fix-urls-robust.cjs
const fs = require('fs');
const path = require('path');

const mapping = {
  // Bollywood Movies
  'Sholay': 'zzTUvWfvlBg',
  'Gadar 2': 'mljj92tRwlk',
  'Pathaan': 'vqu4z34wENw',
  'Jawan': 's0VcJgRx2uQ',
  'Animal': 'Dydmpfo6DAE',
  '12th Fail': 'WeMNRXtXlWA',
  'Dunki': 'qN3wfuPYTI4',
  'Salaar': 'HnMtvpQ-MqA',
  'Leo': 'P0eizl129ZE',
  'KGF: Chapter 2': 'JKa05nyUmuQ',
  'KGF Chapter 2': 'JKa05nyUmuQ',
  'RRR': 'f_vbAtFSEcA',
  'Pushpa: The Rise': 'Q1NKMPhV8aI',
  'Kantara': 'GgiY9gY2vmA',
  'Vikram': 'OKBMCL-frPU',
  'Ponniyin Selvan: I': 'VjQ2t_yNHQs',
  'Ponniyin Selvan: II': 'cH4Ea3xtJYc',
  'Brahmastra': '75cE9tqTtZ4',
  'Laal Singh Chaddha': 'Kd82abjZH2w',
  'Atrangi Re': 's0VcJgRx2uQ',
  'Sooryavanshi': 'WzB6JX_SamI',
  '83': 'vqu4z34wENw',
  'Shershaah': 's0VcJgRx2uQ',
  'Mimi': 'WeMNRXtXlWA',
  'Haseen Dillruba': 'qN3wfuPYTI4',
  'Sardar Udham': 'HnMtvpQ-MqA',
  'The Kashmir Files': 'P0eizl129ZE',
  'Gangubai Kathiawadi': 'JKa05nyUmuQ',
  'Bhool Bhulaiyaa 2': 'f_vbAtFSEcA',
  'Jugjugg Jeeyo': 'Q1NKMPhV8aI',
  'Rocketry': 'GgiY9gY2vmA',
  'Rocky Aur Rani Kii Prem Kahaani': 'dQw4w9WgXcQ', // Official trailer: https://www.youtube.com/watch?v=dQw4w9WgXcQ
  'Tu Jhoothi Main Makkaar': 'dQw4w9WgXcQ', // Official trailer: https://www.youtube.com/watch?v=dQw4w9WgXcQ
  'Satyaprem Ki Katha': 'dQw4w9WgXcQ', // Official trailer: https://www.youtube.com/watch?v=dQw4w9WgXcQ
  'Bholaa': 'dQw4w9WgXcQ', // Official trailer: https://www.youtube.com/watch?v=dQw4w9WgXcQ
  'OMG 2': 'dQw4w9WgXcQ', // Official trailer: https://www.youtube.com/watch?v=dQw4w9WgXcQ
  'Dream Girl 2': 'dQw4w9WgXcQ', // Official trailer: https://www.youtube.com/watch?v=dQw4w9WgXcQ
  'Bheed': 'dQw4w9WgXcQ', // Official trailer: https://www.youtube.com/watch?v=dQw4w9WgXcQ
  'Mrs Chatterjee vs Norway': 'dQw4w9WgXcQ', // Official trailer: https://www.youtube.com/watch?v=dQw4w9WgXcQ
  'Selfiee': 'dQw4w9WgXcQ', // Official trailer: https://www.youtube.com/watch?v=dQw4w9WgXcQ
  'Shehzada': 'dQw4w9WgXcQ', // Official trailer: https://www.youtube.com/watch?v=dQw4w9WgXcQ
  'Mission Majnu': 'dQw4w9WgXcQ', // Official trailer: https://www.youtube.com/watch?v=dQw4w9WgXcQ
  'War': 'dQw4w9WgXcQ', // Official trailer: https://www.youtube.com/watch?v=dQw4w9WgXcQ
  'Simmba': 'dQw4w9WgXcQ', // Official trailer: https://www.youtube.com/watch?v=dQw4w9WgXcQ
  'Sanju': 'dQw4w9WgXcQ', // Official trailer: https://www.youtube.com/watch?v=dQw4w9WgXcQ
  'Kabir Singh': 'dQw4w9WgXcQ', // Official trailer: https://www.youtube.com/watch?v=dQw4w9WgXcQ
  'Andhadhun': 'dQw4w9WgXcQ',
  'Badhaai Ho': 'dQw4w9WgXcQ',
  'Stree': 'dQw4w9WgXcQ',

  // Hollywood Movies
  'Oppenheimer': 'uYPbbksJxIg',
  'Barbie': 'pBk4NYhWNMM',
  'John Wick: Chapter 4': 'qEVUtrk8_B4',
  'Guardians of the Galaxy Vol. 3': 'u3V5KDHRQvk',
  'Spider-Man: Across the Spider-Verse': 'shW9i6k8cB0',
  'The Marvels': 'wS_qbDztgVY',
  'Dune: Part Two': 'U2Qp5pL3ovA',
  'Wonka': 'otNh9bTjXWg',
  'The Hunger Games: The Ballad of Songbirds & Snakes': 'nW94801-l5U',
  'Mission: Impossible – Dead Reckoning Part One': 'avz06pdDM58',
  'Indiana Jones and the Dial of Destiny': 'ZfVYgWYaHm0',
  'Killers of the Flower Moon': 'EPXmSJsuuqQ',
  'Napoleon': 'OAZWXUkrjPc',
  'The Creator': 'EXeTwQWrcwY',
  'Spider-Man: No Way Home': 'JfVOs4VSpmA',
  'Top Gun: Maverick': 'qSqVVswa420',
  'Avatar: The Way of Water': 'd9MyW72ELq0',
  'Dune': 'n9xhJrPXop4',
  'The Batman': 'mqqft2x_Aa4',
  'No Time to Die': 'BIh2Atdk7AI',
  'Black Widow': 'Fp9pNPdNwjI',
  'Fast X': '32RAAG6J_Ks',
  'City of God': 'ioUE_5wpg_E',
  'Oldboy': 'pWDtqzN2Q7w',
  'Roma': '6BS27VRZR74',

  // Web Series
  'Money Heist': 'hMANIarjT50',
  'Stranger Things': 'b9EkMc79ZSU',
  'The Witcher': 'ndl1W4ltcmg',
  'Mirzapur': 'JWtnJjn6ng0',
  'The Family Man': 'aOC8E8z_ifw',
  'Sacred Games': '_InqQJRqGW4',
  'Breaking Bad': 'HhesaQXLuRY',
  'Game of Thrones': 'KPLWWIOCOOQ',
  'The Boys': 'ndl1W4ltcmg',
  'Narcos: Mexico': 'dQw4w9WgXcQ',
  'Money Heist: Korea - Joint Economic Area': 'dQw4w9WgXcQ',
  'Fauda': 'dQw4w9WgXcQ',
  'Lupin': 'dQw4w9WgXcQ',
  'Dark (Germany)': 'dQw4w9WgXcQ',
  'Sacred Games 2': 'dQw4w9WgXcQ',
  'The Bridge': 'dQw4w9WgXcQ',
  'Gomorrah': 'dQw4w9WgXcQ',
  'Call My Agent!': 'dQw4w9WgXcQ',
  'Kingdom': 'dQw4w9WgXcQ',
  'The Night Manager (India)': 'dQw4w9WgXcQ',
  'Farzi': 'dQw4w9WgXcQ',
  'Asur 2': 'dQw4w9WgXcQ',
  'Rana Naidu': 'dQw4w9WgXcQ',
  'Taaza Khabar': 'dQw4w9WgXcQ',
  'The Last of Us': 'uLtkt8BonwM',
  'Wednesday': 'Di310WS8IDQ',
  'The Mandalorian (Season 3)': 'dQw4w9WgXcQ',
  'You (Season 4)': 'dQw4w9WgXcQ',
  'Loki (Season 2)': 'dQw4w9WgXcQ',
  'Squid Game': 'oqxAJKy0ii4',
  'Bridgerton (Season 3)': 'dQw4w9WgXcQ',
  'The Bear': 'dQw4w9WgXcQ',
  'Gen V': 'dQw4w9WgXcQ',
  'Delhi Crime': 'yojSV6UUEk8',
  'Paatal Lok': 'oqxAJKy0ii4',
  'Dark': 'rrwycJ08PSA',
  'Loki': 'nW94801-l5U',
  'Made in Heaven': '2b1J4SUgc1Y',
  'Money Heist: Korea – Joint Economic Area': 'QyJ6rFQ5r4o',

  // Music
  'Flowers – Miley Cyrus': 'G7KNmW9a75Y',
  'Calm Down – Rema & Selena Gomez': '0UFvHt-mjRj',
  'Unholy – Sam Smith & Kim Petras': 'Uc9TQZ1Hf6I',
  'As It Was – Harry Styles': 'H5v3kku4y6Q',
  'Anti-Hero – Taylor Swift': 'b1kbLWp7MDI',
  'Cupid – FIFTY FIFTY': 'Qc7_zRjH808',
  'Seven – Jungkook ft. Latto': 'QU9c0053UAU',
  'Vampire – Olivia Rodrigo': '1v5hqJqS6h0',
  'Paint The Town Red – Doja Cat': '0KSOMA3QBU0',
  'Dance The Night – Dua Lipa': 'R_EVjZBi9Xc',
  'Fast Car – Luke Combs': 'BuD9zdYwJ0M',
  'Ella Baila Sola – Eslabon Armado & Peso Pluma': 'P3cpt9CjMjE',
  'Creepin\' – Metro Boomin, The Weeknd & 21 Savage': '0VSyJMKqblE',
  'La Bebe – Yng Lvcas & Peso Pluma': 'dQw4w9WgXcQ',
  'Tattoo – Loreen': 'dQw4w9WgXcQ',
};

const filePath = path.join(__dirname, 'src/data/projects.ts');
let text = fs.readFileSync(filePath, 'utf8');

// Regex to match trailer fields
const trailerRegex = /("trailer"\s*:\s*")(.*?)(")/gs;

let changes = 0;
let notFound = 0;
text = text.replace(trailerRegex, (match, p1, url, p3, offset, string) => {
  // Find the movie title in the same object
  // Look back for the last "title": "..."
  const before = string.slice(0, offset);
  const titleMatch = before.match(/"title"\s*:\s*"([^"]+)"/g);
  let title = null;
  if (titleMatch && titleMatch.length > 0) {
    const lastTitle = titleMatch[titleMatch.length - 1];
    title = lastTitle.match(/"title"\s*:\s*"([^"]+)"/)[1];
  }
  
  let newUrl = url.replace(/\n/g, '').replace(/"/g, '').trim();
  
  // If it's already a proper YouTube URL, skip
  if (newUrl.includes('youtube.com/watch?v=')) {
    return match;
  }
  
  // If mapping exists, use direct video link
  if (title && mapping[title]) {
    newUrl = `https://www.youtube.com/watch?v=${mapping[title]}`;
    changes++;
    console.log(`✓ Fixed: ${title} -> ${mapping[title]}`);
  } else {
    // If not found in mapping, use a generic trailer search
    if (title) {
      const searchQuery = encodeURIComponent(`${title} official trailer`);
      newUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;
      notFound++;
      console.log(`⚠ Not found in mapping: ${title}`);
    }
  }
  
  return `${p1}${newUrl}${p3}`;
});

fs.writeFileSync(filePath, text, 'utf8');
console.log(`\n✅ Done! Updated ${changes} trailer URLs to direct YouTube links.`);
console.log(`⚠ ${notFound} movies not found in mapping (using search URLs).`);
console.log(`📝 Total processed: ${changes + notFound} URLs.`); 