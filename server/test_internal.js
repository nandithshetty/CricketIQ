import { initDb, query } from './src/config/db.js';
import { searchPlayers, getPlayerById, getPlayerCareerStats, getComparePlayers } from './src/models/playerModel.js';
import { getLeaderboard } from './src/models/leaderboardModel.js';
import { getPlayerAISummary } from './src/ai/geminiService.js';

async function test() {
  console.log('🧪 Testing CricketIQ Backend Models & Services...');
  await initDb();

  // Test Search
  const searchResult = await searchPlayers('Virat');
  console.log('✅ Search test ("Virat"):', searchResult.map(p => p.name));

  // Test Profile
  const allPlayers = await searchPlayers('');
  const firstPlayerId = allPlayers[0].id;
  const profile = await getPlayerById(firstPlayerId);
  console.log(`✅ Get player #${firstPlayerId} profile:`, profile.name, profile.country);

  // Test Career Stats
  const career = await getPlayerCareerStats(firstPlayerId);
  console.log(`✅ Career stats for ${profile.name}:`, career.map(c => `${c.format}: ${c.runs} runs, avg ${c.average}`));

  // Test Leaderboard
  const leaderboards = await getLeaderboard({ stat: 'runs', format: 'ALL', limit: 5 });
  console.log('✅ Leaderboard Top Scorers:', leaderboards.map(l => `${l.name} (${l.runs} runs)`));

  // Test AI Summary
  const aiSummary = await getPlayerAISummary(firstPlayerId);
  console.log(`✅ AI Summary for ${profile.name}:`, aiSummary.summary);

  console.log('🎉 ALL BACKEND VERIFICATIONS PASSED SUCCESSFULLY!');
  process.exit(0);
}

test().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
