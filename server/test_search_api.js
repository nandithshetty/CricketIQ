import { initDb, query } from './src/config/db.js';
import { searchPlayers, getComparePlayers } from './src/models/playerModel.js';

async function runTest() {
  await initDb();
  const all = await searchPlayers('');
  console.log('Players found with empty query:', all.length, all.map(p => ({ id: p.id, name: p.name })));

  const searchVirat = await searchPlayers('Virat');
  console.log('Search "Virat":', searchVirat);

  const searchLower = await searchPlayers('virat kohli');
  console.log('Search "virat kohli":', searchLower);

  if (all.length >= 2) {
    const compareRes = await getComparePlayers([all[0].id, all[1].id]);
    console.log('Compare response:', compareRes.length, compareRes.map(c => ({ id: c.id, name: c.name, formats: c.formats })));
  }

  process.exit(0);
}

runTest().catch(err => {
  console.error('API Test Error:', err);
  process.exit(1);
});
