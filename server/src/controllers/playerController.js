import {
  searchPlayers,
  getPlayerById,
  getPlayerCareerStats,
  getPlayerTimeline,
  getPlayerOppositionStats,
  getPlayerVenueStats,
  getComparePlayers,
  getRecentMatchesForPlayer
} from '../models/playerModel.js';
import { getPlayerAISummary } from '../ai/geminiService.js';
import cache from '../cache/cacheManager.js';

export async function search(req, res) {
  try {
    const q = req.query.q || '';
    const cacheKey = `search:${q}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    const players = await searchPlayers(q);
    cache.set(cacheKey, players, 120);
    res.json(players);
  } catch (err) {
    console.error('Error searching players:', err);
    res.status(500).json({ error: 'Failed to search players' });
  }
}

export async function getProfile(req, res) {
  try {
    const { id } = req.params;
    const cacheKey = `player:${id}:profile`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    const player = await getPlayerById(id);
    if (!player) return res.status(404).json({ error: 'Player not found' });

    const careerStats = await getPlayerCareerStats(player.id);
    const timeline = await getPlayerTimeline(player.id);
    const recentMatches = await getRecentMatchesForPlayer(player.id);

    const payload = {
      player,
      careerStats,
      timeline,
      recentMatches
    };

    cache.set(cacheKey, payload, 300);
    res.json(payload);
  } catch (err) {
    console.error('Error fetching player profile:', err);
    res.status(500).json({ error: 'Failed to fetch player profile' });
  }
}

export async function getAISummary(req, res) {
  try {
    const { id } = req.params;
    const player = await getPlayerById(id);
    if (!player) return res.status(404).json({ error: 'Player not found' });

    const force = req.query.refresh === 'true';
    const result = await getPlayerAISummary(player.id, force);
    res.json(result);
  } catch (err) {
    console.error('Error fetching AI summary:', err);
    res.status(500).json({ error: err.message || 'Failed to generate AI summary' });
  }
}

export async function compare(req, res) {
  try {
    const idsParam = req.query.ids || '';
    const ids = idsParam
      .split(',')
      .map((i) => parseInt(i.trim()))
      .filter((i) => !isNaN(i) && i > 0);

    if (ids.length === 0) {
      return res.status(400).json({ error: 'Please provide valid player ids via ?ids=1,2' });
    }

    const cacheKey = `compare:${ids.sort().join('-')}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    const comparisonData = await getComparePlayers(ids);
    cache.set(cacheKey, comparisonData, 300);
    res.json(comparisonData);
  } catch (err) {
    console.error('Error comparing players:', err);
    res.status(500).json({ error: 'Failed to compare players' });
  }
}

export async function getOpposition(req, res) {
  try {
    const { id, teamId } = req.params;
    const player = await getPlayerById(id);
    if (!player) return res.status(404).json({ error: 'Player not found' });

    const stats = await getPlayerOppositionStats(player.id, teamId ? parseInt(teamId) : null);
    res.json(stats);
  } catch (err) {
    console.error('Error fetching opposition stats:', err);
    res.status(500).json({ error: 'Failed to fetch opposition stats' });
  }
}

export async function getVenues(req, res) {
  try {
    const { id } = req.params;
    const player = await getPlayerById(id);
    if (!player) return res.status(404).json({ error: 'Player not found' });

    const stats = await getPlayerVenueStats(player.id);
    res.json(stats);
  } catch (err) {
    console.error('Error fetching venue stats:', err);
    res.status(500).json({ error: 'Failed to fetch venue stats' });
  }
}
