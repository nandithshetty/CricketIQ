/**
 * photo_mapper.js
 * 
 * Fetches REAL headshot photos for all players from Wikipedia's API.
 * Wikipedia has freely-licensed, genuinely correct photos for all these
 * cricket legends. We use the /api/rest_v1/page/summary/:title endpoint
 * which returns the official lead image for each Wikipedia article.
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Map player name → exact Wikipedia article title.
// These have been manually verified to resolve to the correct person's article.
const WIKIPEDIA_TITLES = {
  // India
  "Sachin Tendulkar":       "Sachin_Tendulkar",
  "MS Dhoni":               "MS_Dhoni",
  "Rahul Dravid":           "Rahul_Dravid",
  "Anil Kumble":            "Anil_Kumble",
  "Sourav Ganguly":         "Sourav_Ganguly",
  "Virender Sehwag":        "Virender_Sehwag",
  "Yuvraj Singh":           "Yuvraj_Singh",
  "Kapil Dev":              "Kapil_Dev",
  "Sunil Gavaskar":         "Sunil_Gavaskar",
  "Zaheer Khan":            "Zaheer_Khan_(cricketer)",
  "VVS Laxman":             "VVS_Laxman",
  "Gautam Gambhir":         "Gautam_Gambhir",
  "Harbhajan Singh":        "Harbhajan_Singh",
  "Irfan Pathan":           "Irfan_Pathan",
  "Mohammad Azharuddin":    "Mohammad_Azharuddin",
  "Shikhar Dhawan":         "Shikhar_Dhawan",
  "Suresh Raina":           "Suresh_Raina",
  "Ajit Agarkar":           "Ajit_Agarkar",
  "Javagal Srinath":        "Javagal_Srinath",

  // Australia
  "Ricky Ponting":          "Ricky_Ponting",
  "Shane Warne":            "Shane_Warne",
  "Adam Gilchrist":         "Adam_Gilchrist",
  "Glenn McGrath":          "Glenn_McGrath",
  "Brett Lee":              "Brett_Lee",
  "Matthew Hayden":         "Matthew_Hayden",
  "David Warner":           "David_Warner_(cricketer)",
  "Andrew Symonds":         "Andrew_Symonds",
  "Steve Waugh":            "Steve_Waugh",
  "Mark Waugh":             "Mark_Waugh",

  // England
  "James Anderson":         "James_Anderson_(cricketer)",
  "Stuart Broad":           "Stuart_Broad",
  "Alastair Cook":          "Alastair_Cook",
  "Kevin Pietersen":        "Kevin_Pietersen",
  "Andrew Flintoff":        "Andrew_Flintoff",
  "Nasser Hussain":         "Nasser_Hussain",

  // South Africa
  "AB de Villiers":         "AB_de_Villiers",
  "Jacques Kallis":         "Jacques_Kallis",
  "Hashim Amla":            "Hashim_Amla",
  "Dale Steyn":             "Dale_Steyn",
  "Graeme Smith":           "Graeme_Smith_(cricketer)",
  "Jonty Rhodes":           "Jonty_Rhodes",

  // Pakistan
  "Wasim Akram":            "Wasim_Akram",
  "Waqar Younis":           "Waqar_Younis",
  "Inzamam-ul-Haq":         "Inzamam-ul-Haq",
  "Shoaib Akhtar":          "Shoaib_Akhtar",
  "Imran Khan":             "Imran_Khan",
  "Javed Miandad":          "Javed_Miandad",
  "Misbah-ul-Haq":          "Misbah-ul-Haq",
  "Mohammad Yousuf":        "Mohammad_Yousuf_(cricketer)",
  "Younis Khan":            "Younis_Khan",

  // West Indies
  "Brian Lara":             "Brian_Lara",
  "Vivian Richards":        "Viv_Richards",
  "Chris Gayle":            "Chris_Gayle_(cricketer)",
  "Courtney Walsh":         "Courtney_Walsh",
  "Curtly Ambrose":         "Curtly_Ambrose",
  "Shivnarine Chanderpaul": "Shivnarine_Chanderpaul",

  // Sri Lanka
  "Kumar Sangakkara":       "Kumar_Sangakkara",
  "Muttiah Muralitharan":   "Muttiah_Muralitharan",
  "Mahela Jayawardene":     "Mahela_Jayawardene",
  "Lasith Malinga":         "Lasith_Malinga",
  "Sanath Jayasuriya":      "Sanath_Jayasuriya",

  // New Zealand
  "Ross Taylor":            "Ross_Taylor",
  "Brendon McCullum":       "Brendon_McCullum",

  // Bangladesh
  "Tamim Iqbal":            "Tamim_Iqbal",

  // Zimbabwe
  "Andy Flower":            "Andy_Flower",
};

// Direct Wikimedia Commons URLs for players whose Wikipedia REST summary
// returns no image. These are genuine real-person photos.
const HARDCODED_URLS = {
  // Found via pageimages API
  "Michael Clarke":         "https://upload.wikimedia.org/wikipedia/commons/b/b0/Pm_cricket_shots09_5995.jpg",
  "Ian Healy":              "https://upload.wikimedia.org/wikipedia/commons/3/38/Ian_Healy.jpg",
  "Graeme Swann":           "https://upload.wikimedia.org/wikipedia/commons/2/25/Graeme_Swann%2C_2009.jpg",
  "Shaun Pollock":          "https://upload.wikimedia.org/wikipedia/commons/3/3e/Shaun_Pollock.JPG",
  "Makhaya Ntini":          "https://upload.wikimedia.org/wikipedia/commons/3/37/Makhaya_Ntini_4.jpg",
  "Younis Khan":            "https://upload.wikimedia.org/wikipedia/commons/2/2d/Younus_Khan_2010.jpg",
  "Chaminda Vaas":          "https://upload.wikimedia.org/wikipedia/commons/b/be/Chaminda_Vaas.jpg",
  "Tillekeratne Dilshan":   "https://upload.wikimedia.org/wikipedia/commons/4/45/Tillakaratne_Dilshan_portrait.jpg",
  "Arjuna Ranatunga":       "https://upload.wikimedia.org/wikipedia/commons/2/22/Arjuna_Ranatunga.jpg",
  "Daniel Vettori":         "https://upload.wikimedia.org/wikipedia/commons/5/54/Daniel_Vettori_ONZM_%28cropped%29.jpg",
  "Martin Crowe":           "https://upload.wikimedia.org/wikipedia/commons/3/3f/Martin_Crowe_2011.jpg",
  // ESPN Cricinfo official headshots for players without Commons photos
  "Michael Bevan":          "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/313900/313997.jpg",
  "Saeed Anwar":            "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/313900/313968.jpg",
  "Stephen Fleming":        "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/313900/313924.jpg",
  "Carl Hooper":            "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/313900/313942.jpg",
  "Dennis Lillee":          "https://upload.wikimedia.org/wikipedia/commons/e/e3/Dennis_Keith_Lillee_%288121209028%29.jpg",
};

/**
 * Fetches the Wikipedia page summary and extracts the thumbnail URL.
 */
function fetchWikipediaPhoto(title) {
  return new Promise((resolve) => {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    https.get(url, { headers: { 'User-Agent': 'CricketIQ/1.0 (educational project)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const img = json.originalimage?.source || json.thumbnail?.source || null;
          resolve(img);
        } catch {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function main() {
  const rawPath = path.resolve(__dirname, '../raw/real_cricket_stats.json');
  if (!fs.existsSync(rawPath)) {
    console.error(`❌ File not found: ${rawPath}`);
    process.exit(1);
  }

  const players = JSON.parse(fs.readFileSync(rawPath, 'utf8'));
  console.log(`🔍 Fetching REAL Wikipedia photos for ${players.length} players...\n`);

  let successCount = 0;
  let hardcodedCount = 0;
  let localCount = 0;

  for (const player of players) {
    const cleanName = player.name.split(' (')[0];
    const slug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    const localPhotoPath = path.resolve(__dirname, `../../client/public/photos/${slug}.jpg`);

    // 1. Check if we have a locally downloaded verified photo
    if (fs.existsSync(localPhotoPath)) {
      player.photo_url = `/photos/${slug}.jpg`;
      localCount++;
      console.log(`  📁 [LOCAL]      ${cleanName}`);
      continue;
    }

    // 2. Try Wikipedia REST API using exact article title
    const wikiTitle = WIKIPEDIA_TITLES[cleanName];
    if (wikiTitle) {
      const wikiUrl = await fetchWikipediaPhoto(wikiTitle);
      if (wikiUrl) {
        player.photo_url = wikiUrl;
        successCount++;
        console.log(`  ✅ [WIKIPEDIA]  ${cleanName}`);
        continue;
      }
    }

    // 3. Use hardcoded direct Wikimedia/ESPN URL for known cases
    if (HARDCODED_URLS[cleanName]) {
      player.photo_url = HARDCODED_URLS[cleanName];
      hardcodedCount++;
      console.log(`  🔗 [HARDCODED]  ${cleanName}`);
      continue;
    }

    // 4. Keep existing photo if it's already not an Unsplash stock photo
    if (player.photo_url && !player.photo_url.includes('unsplash.com')) {
      console.log(`  ➡️  [KEPT]       ${cleanName}`);
      continue;
    }

    console.warn(`  ⚠️  [MISSING]    ${cleanName} — no real photo found`);
  }

  fs.writeFileSync(rawPath, JSON.stringify(players, null, 2), 'utf8');

  console.log(`\n📸 Done!`);
  console.log(`   Local photos:      ${localCount}`);
  console.log(`   Wikipedia photos:  ${successCount}`);
  console.log(`   Hardcoded direct:  ${hardcodedCount}`);
  console.log(`   Total players:     ${players.length}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
