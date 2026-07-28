import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fetchWikiPhoto(name) {
  const titlesToTry = [
    name.replace(/ /g, '_'),
    `${name.replace(/ /g, '_')}_(cricketer)`,
    `${name.replace(/ /g, '_')}_(cricketer,_born_1982)`
  ];

  for (const title of titlesToTry) {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    const photo = await new Promise((resolve) => {
      https.get(url, { headers: { 'User-Agent': 'CricketIQ/1.0 (contact@cricketiq.local)' } }, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          try {
            const data = JSON.parse(body);
            if (data.thumbnail && data.thumbnail.source && !data.title.includes('disambiguation')) {
              resolve(data.thumbnail.source);
            } else {
              resolve(null);
            }
          } catch (e) {
            resolve(null);
          }
        });
      }).on('error', () => resolve(null));
    });

    if (photo) return photo;
  }
  return null;
}

async function run() {
  const rawPath = path.resolve(__dirname, '../raw/real_cricket_stats.json');
  if (!fs.existsSync(rawPath)) return;

  const players = JSON.parse(fs.readFileSync(rawPath, 'utf8'));
  console.log(`🌐 Querying Wikipedia API with disambiguation fallbacks for ${players.length} players...`);

  let fetchedCount = 0;
  for (const p of players) {
    const cleanName = p.name.split(' (')[0];
    const wikiPhoto = await fetchWikiPhoto(cleanName);
    if (wikiPhoto) {
      p.photo_url = wikiPhoto;
      console.log(`✅ [${cleanName}]: ${wikiPhoto}`);
      fetchedCount++;
    } else {
      const encodedName = encodeURIComponent(cleanName);
      p.photo_url = `https://ui-avatars.com/api/?name=${encodedName}&background=0D8ABC&color=fff&size=256&bold=true`;
      console.log(`ℹ️ [${cleanName}]: Using avatar fallback`);
    }
  }

  fs.writeFileSync(rawPath, JSON.stringify(players, null, 2), 'utf8');
  console.log(`🎉 Wikipedia Photo Mapper complete! Successfully assigned ${fetchedCount}/${players.length} official player face photos!`);
}

run();
