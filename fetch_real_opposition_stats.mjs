// Fetch REAL opposition stats from ESPNcricinfo Statsguru for ALL 41 retired cricket legends
// Parses batting & bowling stats by opposition for Test/ODI/T20 formats
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ESPNcricinfo Player IDs for all 41 retired legends
const PLAYER_ESPN_IDS = {
  "Sachin Tendulkar": 35320,
  "MS Dhoni": 28081,
  "Rahul Dravid": 28114,
  "Sourav Ganguly": 28779,
  "Virender Sehwag": 35263,
  "VVS Laxman": 30750,
  "Yuvraj Singh": 36084,
  "Anil Kumble": 30176,
  "Zaheer Khan": 36050,
  "Gautam Gambhir": 28763,
  "Sunil Gavaskar": 28794,
  "Kapil Dev": 30028,
  "Harbhajan Singh": 29264,
  "Shane Warne": 8166,
  "Ricky Ponting": 7088,
  "Adam Gilchrist": 5390,
  "Glenn McGrath": 6565,
  "Brett Lee": 6562,
  "Matthew Hayden": 5765,
  "Brian Lara": 52337,
  "Vivian Richards": 52812,
  "Chris Gayle": 51880,
  "Garfield Sobers": 52946,
  "Shivnarine Chanderpaul": 51469,
  "Wasim Akram": 43547,
  "Shoaib Akhtar": 42658,
  "Inzamam-ul-Haq": 40570,
  "AB de Villiers": 44936,
  "Dale Steyn": 47492,
  "Hashim Amla": 43906,
  "Jacques Kallis": 45789,
  "Graeme Smith": 47270,
  "Muttiah Muralitharan": 49636,
  "Kumar Sangakkara": 50710,
  "Mahela Jayawardene": 49289,
  "Sanath Jayasuriya": 49209,
  "Brendon McCullum": 37737,
  "Ross Taylor": 38699,
  "Richard Hadlee": 37224,
  "Andy Flower": 55428,
  "Heath Streak": 55430
};

const delay = (ms) => new Promise(r => setTimeout(r, ms));

async function fetchBattingByOpposition(espnId, classId) {
  const url = `https://stats.espncricinfo.com/ci/engine/player/${espnId}.html?class=${classId};filter=advanced;groupby=opposition;template=results;type=batting`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36' }
  });
  if (!res.ok) return [];
  const html = await res.text();
  
  const rows = html.match(/<tr[^>]*>([\s\S]*?)<\/tr>/g) || [];
  const results = [];
  
  for (const row of rows) {
    const cells = row.match(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g);
    if (!cells) continue;
    const values = cells.map(c => c.replace(/<[^>]+>/g, '').trim());
    
    if (values[0] && values[0].startsWith('v ')) {
      // Columns: Opposition, Span, Mat, Inns, NO, Runs, HS, Ave, 100, 50, 0
      results.push({
        opposition: values[0].replace('v ', '').trim(),
        matches: parseInt(values[2]) || 0,
        innings: parseInt(values[3]) || 0,
        not_outs: parseInt(values[4]) || 0,
        runs: parseInt(values[5]) || 0,
        highest_score: values[6] || '0',
        average: parseFloat(values[7]) || 0,
        hundreds: parseInt(values[8]) || 0,
        fifties: parseInt(values[9]) || 0,
        ducks: parseInt(values[10]) || 0
      });
    }
  }
  return results;
}

async function fetchBowlingByOpposition(espnId, classId) {
  const url = `https://stats.espncricinfo.com/ci/engine/player/${espnId}.html?class=${classId};filter=advanced;groupby=opposition;template=results;type=bowling`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36' }
  });
  if (!res.ok) return [];
  const html = await res.text();
  
  const rows = html.match(/<tr[^>]*>([\s\S]*?)<\/tr>/g) || [];
  const results = [];
  
  for (const row of rows) {
    const cells = row.match(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g);
    if (!cells) continue;
    const values = cells.map(c => c.replace(/<[^>]+>/g, '').trim());
    
    if (values[0] && values[0].startsWith('v ')) {
      // Columns: Opposition, Span, Mat, Inns, Balls/Overs, Mdns, Runs, Wkts, BBI, BBM, Ave, Econ, SR, 4, 5, 10
      results.push({
        opposition: values[0].replace('v ', '').trim(),
        matches: parseInt(values[2]) || 0,
        wickets: parseInt(values[7]) || 0,
        bowling_average: parseFloat(values[10]) || 0,
        economy: parseFloat(values[11]) || 0,
        five_wickets: parseInt(values[14]) || 0
      });
    }
  }
  return results;
}

async function main() {
  const FORMAT_MAP = { 1: 'Test', 2: 'ODI', 3: 'T20' };
  const allData = {};
  const playerNames = Object.keys(PLAYER_ESPN_IDS);
  
  console.log(`📊 Fetching REAL opposition stats for ${playerNames.length} players from ESPNcricinfo Statsguru...`);
  
  for (let pi = 0; pi < playerNames.length; pi++) {
    const name = playerNames[pi];
    const espnId = PLAYER_ESPN_IDS[name];
    allData[name] = { opposition_stats: [] };
    
    console.log(`\n[${pi + 1}/${playerNames.length}] ${name} (ESPN ID: ${espnId})...`);
    
    for (const classId of [1, 2, 3]) {
      const format = FORMAT_MAP[classId];
      
      await delay(1500); // Rate limit: 1.5s between requests
      
      try {
        const batting = await fetchBattingByOpposition(espnId, classId);
        await delay(1000);
        const bowling = await fetchBowlingByOpposition(espnId, classId);
        
        // Merge batting + bowling by opposition
        for (const bat of batting) {
          const bowl = bowling.find(b => b.opposition === bat.opposition) || {};
          allData[name].opposition_stats.push({
            format,
            opposition: bat.opposition,
            matches: bat.matches,
            innings: bat.innings,
            runs: bat.runs,
            highest_score: bat.highest_score,
            average: bat.average,
            hundreds: bat.hundreds,
            fifties: bat.fifties,
            wickets: bowl.wickets || 0,
            bowling_average: bowl.bowling_average || 0,
            economy: bowl.economy || 0
          });
        }
        
        // Add bowling-only oppositions (if any team had bowling data but no batting)
        for (const bowl of bowling) {
          if (!batting.find(b => b.opposition === bowl.opposition)) {
            allData[name].opposition_stats.push({
              format,
              opposition: bowl.opposition,
              matches: bowl.matches,
              innings: 0,
              runs: 0,
              highest_score: '0',
              average: 0,
              hundreds: 0,
              fifties: 0,
              wickets: bowl.wickets,
              bowling_average: bowl.bowling_average,
              economy: bowl.economy
            });
          }
        }
        
        console.log(`  ✅ ${format}: ${batting.length} opponents (batting), ${bowling.length} opponents (bowling)`);
      } catch (err) {
        console.log(`  ❌ ${format} failed: ${err.message}`);
      }
    }
  }
  
  // Save to JSON
  const outPath = path.resolve(__dirname, 'data/raw/real_opposition_stats.json');
  fs.writeFileSync(outPath, JSON.stringify(allData, null, 2), 'utf8');
  console.log(`\n🎉 Saved REAL opposition stats for all ${playerNames.length} players to ${outPath}`);
  
  // Print summary
  let totalRows = 0;
  for (const name of playerNames) {
    totalRows += allData[name].opposition_stats.length;
  }
  console.log(`📊 Total opposition stat rows: ${totalRows}`);
}

main();
