// Parse opposition stats from ESPNcricinfo Statsguru HTML page
// Specifically extract rows matching "v TeamName" pattern

async function fetchOppositionStats(playerId, classId) {
  const url = `https://stats.espncricinfo.com/ci/engine/player/${playerId}.html?class=${classId};filter=advanced;groupby=opposition;template=results;type=batting`;
  
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  const html = await res.text();
  
  // Find ALL table rows
  const rows = html.match(/<tr[^>]*>([\s\S]*?)<\/tr>/g) || [];
  const results = [];
  
  for (const row of rows) {
    const cells = row.match(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g);
    if (!cells) continue;
    const values = cells.map(c => c.replace(/<[^>]+>/g, '').trim());
    
    // Opposition rows start with "v TeamName"
    if (values[0] && values[0].startsWith('v ')) {
      results.push({
        opposition: values[0].replace('v ', ''),
        span: values[1],
        matches: parseInt(values[2]) || 0,
        innings: parseInt(values[3]) || 0,
        notOuts: parseInt(values[4]) || 0,
        runs: parseInt(values[5]) || 0,
        highestScore: values[6],
        average: parseFloat(values[7]) || 0,
        hundreds: parseInt(values[8]) || 0,
        fifties: parseInt(values[9]) || 0,
        ducks: parseInt(values[10]) || 0
      });
    }
  }
  
  return results;
}

async function fetchBowlingOppositionStats(playerId, classId) {
  const url = `https://stats.espncricinfo.com/ci/engine/player/${playerId}.html?class=${classId};filter=advanced;groupby=opposition;template=results;type=bowling`;
  
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  const html = await res.text();
  
  const rows = html.match(/<tr[^>]*>([\s\S]*?)<\/tr>/g) || [];
  const results = [];
  
  for (const row of rows) {
    const cells = row.match(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g);
    if (!cells) continue;
    const values = cells.map(c => c.replace(/<[^>]+>/g, '').trim());
    
    if (values[0] && values[0].startsWith('v ')) {
      results.push({
        opposition: values[0].replace('v ', ''),
        span: values[1],
        matches: parseInt(values[2]) || 0,
        innings: parseInt(values[3]) || 0,
        overs: parseFloat(values[4]) || 0,
        maidens: parseInt(values[5]) || 0,
        runs: parseInt(values[6]) || 0,
        wickets: parseInt(values[7]) || 0,
        bestInnings: values[8],
        bestMatch: values[9],
        average: parseFloat(values[10]) || 0,
        economy: parseFloat(values[11]) || 0,
        strikeRate: parseFloat(values[12]) || 0,
        fourWickets: parseInt(values[13]) || 0,
        fiveWickets: parseInt(values[14]) || 0
      });
    }
  }
  
  return results;
}

// Test with Sachin Tendulkar (35320)
async function main() {
  const formatNames = { 1: 'Test', 2: 'ODI', 3: 'T20' };
  
  for (const classId of [1, 2, 3]) {
    console.log(`\n=== ${formatNames[classId]} BATTING BY OPPOSITION ===`);
    const batting = await fetchOppositionStats(35320, classId);
    for (const row of batting) {
      console.log(`${row.opposition}: M=${row.matches} Runs=${row.runs} Avg=${row.average} HS=${row.highestScore} 100s=${row.hundreds} 50s=${row.fifties}`);
    }
    
    console.log(`\n=== ${formatNames[classId]} BOWLING BY OPPOSITION ===`);
    const bowling = await fetchBowlingOppositionStats(35320, classId);
    for (const row of bowling) {
      console.log(`${row.opposition}: M=${row.matches} W=${row.wickets} Avg=${row.average} Eco=${row.economy}`);
    }
  }
}

main();
