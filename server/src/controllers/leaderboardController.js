import { getLeaderboard } from '../models/leaderboardModel.js';
import cache from '../cache/cacheManager.js';

export async function getLeaderboards(req, res) {
  try {
    const { stat = 'runs', format = 'ALL', season = 'ALL', limit = 20 } = req.query;

    const cacheKey = `leaderboard:${stat}:${format}:${season}:${limit}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    const data = await getLeaderboard({ stat, format, season, limit });
    cache.set(cacheKey, data, 300);
    res.json(data);
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    res.status(500).json({ error: 'Failed to fetch leaderboard data' });
  }
}
