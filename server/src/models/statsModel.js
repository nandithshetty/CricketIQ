import { query } from '../config/db.js';
import cache from '../cache/cacheManager.js';

export async function recomputePlayerCareerStats(playerId) {
  // Recompute seasonal breakdowns from match logs without overwriting official all-time career totals

  // 2. Yearly / Season breakdown
  const seasonStats = await query(
    `SELECT strftime('%Y', m.match_date) as season, m.format,
            COUNT(DISTINCT pms.match_id) as matches,
            SUM(pms.runs) as total_runs,
            SUM(pms.balls_faced) as total_balls,
            SUM(CASE WHEN pms.dismissal_type != 'not out' THEN 1 ELSE 0 END) as outs,
            SUM(CASE WHEN pms.runs >= 100 THEN 1 ELSE 0 END) as hundreds,
            SUM(CASE WHEN pms.runs >= 50 AND pms.runs < 100 THEN 1 ELSE 0 END) as fifties,
            MAX(pms.runs) as highest_score,
            SUM(pms.wickets) as total_wickets,
            SUM(pms.runs_conceded) as total_runs_conceded,
            SUM(pms.overs_bowled) as total_overs,
            SUM(pms.catches) as total_catches
     FROM player_match_stats pms
     JOIN matches m ON pms.match_id = m.id
     WHERE pms.player_id = ?
     GROUP BY season, m.format`,
    [playerId]
  );

  for (const s of seasonStats) {
    if (!s.season) continue;
    const outs = s.outs || 0;
    const runs = s.total_runs || 0;
    const balls = s.total_balls || 0;
    const wickets = s.total_wickets || 0;
    const runsConceded = s.total_runs_conceded || 0;
    const overs = s.total_overs || 0;

    const battingAvg = outs > 0 ? parseFloat((runs / outs).toFixed(2)) : runs;
    const strikeRate = balls > 0 ? parseFloat(((runs / balls) * 100).toFixed(2)) : 0;
    const bowlingAvg = wickets > 0 ? parseFloat((runsConceded / wickets).toFixed(2)) : 0;
    const economy = overs > 0 ? parseFloat((runsConceded / overs).toFixed(2)) : 0;

    const existing = await query(
      `SELECT id FROM career_stats WHERE player_id = ? AND format = ? AND season = ?`,
      [playerId, s.format, s.season]
    );

    if (existing.length > 0) {
      await query(
        `UPDATE career_stats 
         SET matches = ?, runs = ?, average = ?, strike_rate = ?, hundreds = ?, fifties = ?, 
             highest_score = ?, wickets = ?, bowling_average = ?, economy = ?, catches = ?, last_computed_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [
          s.matches, runs, battingAvg, strikeRate, s.hundreds || 0, s.fifties || 0,
          s.highest_score || 0, wickets, bowlingAvg, economy, s.total_catches || 0,
          existing[0].id
        ]
      );
    } else {
      await query(
        `INSERT INTO career_stats 
         (player_id, format, season, matches, runs, average, strike_rate, hundreds, fifties, highest_score, wickets, bowling_average, economy, catches)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          playerId, s.format, s.season, s.matches, runs, battingAvg, strikeRate,
          s.hundreds || 0, s.fifties || 0, s.highest_score || 0, wickets,
          bowlingAvg, economy, s.total_catches || 0
        ]
      );
    }
  }

  // Invalidate cache for player
  cache.invalidatePlayer(playerId);
  return true;
}

export async function recomputeAllCareerStats() {
  const players = await query(`SELECT id FROM players`);
  for (const p of players) {
    await recomputePlayerCareerStats(p.id);
  }
  return players.length;
}
