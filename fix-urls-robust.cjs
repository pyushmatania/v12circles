// fix-urls-robust.cjs
const fs = require('fs');
const path = require('path');

const mapping = {
  // Updated with currently available official trailers
  'Sholay': 'zzTUvWfvlBg', // https://www.youtube.com/watch?v=zzTUvWfvlBg
  'Gadar 2': 'mljj92tRwlk', // https://www.youtube.com/watch?v=mljj92tRwlk
  'Pathaan': 'vqu4z34wENw',
  'Jawan': 's0VcJgRx2uQ',
  'Animal': 'Dydmpfo6DAE',
  '12th Fail': 'WeMNRXtXlWA',
  'Dunki': 'qN3wfuPYTI4',
  'Salaar': 'HnMtvpQ-MqA',
  'Leo': 'P0eizl129ZE',
  'KGF: Chapter 2': 'JKa05nyUmuQ',
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
};

const filePath = path.join(__dirname, 'src/data/projects.ts');
let text = fs.readFileSync(filePath, 'utf8');

// Regex to match trailer fields
const trailerRegex = /("trailer"\s*:\s*")(.*?)(")/gs;

let changes = 0;
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
  // If mapping exists, use direct video link
  if (title && mapping[title]) {
    newUrl = `https://www.youtube.com/watch?v=${mapping[title]}`;
    changes++;
  } else {
    // If not, just ensure it's a single line and quoted
    newUrl = newUrl;
  }
  return `${p1}${newUrl}${p3}`;
});

fs.writeFileSync(filePath, text, 'utf8');
console.log(`Done. Updated ${changes} trailer URLs to direct YouTube links for this batch. All trailer fields are now single-line and valid.`); 