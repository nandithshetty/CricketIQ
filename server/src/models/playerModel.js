import { query } from '../config/db.js';

export async function searchPlayers(q = '') {
  if (!q.trim()) {
    return query(`
      SELECT p.id, p.name, p.country, p.role, p.batting_style, p.bowling_style, p.photo_url, COALESCE(SUM(cs.runs), 0) as total_runs
      FROM players p
      LEFT JOIN career_stats cs ON p.id = cs.player_id AND cs.season IS NULL
      GROUP BY p.id
      ORDER BY total_runs DESC, p.id ASC
      LIMIT 100
    `);
  }
  const term = `%${q.trim()}%`;
  return query(
    `SELECT id, name, country, role, batting_style, bowling_style, photo_url 
     FROM players 
     WHERE name LIKE ? OR country LIKE ? OR role LIKE ? 
     ORDER BY name ASC LIMIT 50`,
    [term, term, term]
  );
}

export async function getPlayerById(id) {
  if (!isNaN(id)) {
    const players = await query(`SELECT * FROM players WHERE id = ?`, [id]);
    if (players.length > 0) return players[0];
  }
  const cleanTerm = decodeURIComponent(id).replace(/-/g, ' ').trim();
  const playersByName = await query(`SELECT * FROM players WHERE LOWER(name) LIKE LOWER(?) LIMIT 1`, [`%${cleanTerm}%`]);
  return playersByName.length > 0 ? playersByName[0] : null;
}

export async function getPlayerCareerStats(playerId) {
  return query(
    `SELECT format, season, matches, runs, average, strike_rate, hundreds, fifties, highest_score, wickets, bowling_average, economy, catches, last_computed_at
     FROM career_stats 
     WHERE player_id = ?
     ORDER BY format, season DESC`,
    [playerId]
  );
}

export async function getPlayerTimeline(playerId) {
  // Aggregate runs & wickets by year from player_match_stats & matches
  return query(
    `SELECT strftime('%Y', m.match_date) as year, m.format,
            SUM(pms.runs) as runs, 
            SUM(pms.balls_faced) as balls_faced,
            SUM(pms.wickets) as wickets,
            COUNT(DISTINCT pms.match_id) as matches,
            MAX(pms.runs) as highest_runs
     FROM player_match_stats pms
     JOIN matches m ON pms.match_id = m.id
     WHERE pms.player_id = ?
     GROUP BY year, m.format
     ORDER BY year ASC, m.format ASC`,
    [playerId]
  );
}

export async function getPlayerOppositionStats(playerId, teamId = null) {
  let sql = `
    SELECT opposition as team_name, opposition as team_country,
           format,
           matches,
           runs as total_runs,
           highest_score,
           average,
           hundreds,
           fifties,
           wickets as total_wickets,
           bowling_average as bowling_avg,
           economy
    FROM opposition_stats
    WHERE player_id = ?
  `;
  const params = [playerId];
  if (teamId) {
    sql += ` AND opposition = (SELECT country FROM teams WHERE id = ?)`;
    params.push(teamId);
  }
  sql += ` ORDER BY total_runs DESC`;
  return query(sql, params);
}

export async function getPlayerVenueStats(playerId) {
  return query(
    `SELECT m.venue,
            COUNT(DISTINCT pms.match_id) as matches,
            SUM(pms.runs) as total_runs,
            MAX(pms.runs) as highest_score,
            ROUND(AVG(pms.runs), 2) as batting_avg,
            SUM(pms.wickets) as total_wickets,
            ROUND(AVG(pms.runs_conceded) / NULLIF(SUM(pms.wickets), 0), 2) as bowling_avg
     FROM player_match_stats pms
     JOIN matches m ON pms.match_id = m.id
     WHERE pms.player_id = ?
     GROUP BY m.venue
     ORDER BY total_runs DESC`,
    [playerId]
  );
}

export async function getComparePlayers(playerIds = []) {
  if (!playerIds || playerIds.length === 0) return [];
  const placeholders = playerIds.map(() => '?').join(',');
  
  const players = await query(
    `SELECT id, name, country, role, batting_style, bowling_style, photo_url FROM players WHERE id IN (${placeholders})`,
    playerIds
  );

  const careerStats = await query(
    `SELECT player_id, format, season, matches, runs, average, strike_rate, hundreds, fifties, highest_score, wickets, bowling_average, economy, catches
     FROM career_stats 
     WHERE player_id IN (${placeholders}) AND season IS NULL`,
    playerIds
  );

  return players.map((p) => {
    const stats = careerStats.filter((cs) => cs.player_id === p.id);
    return {
      ...p,
      formats: {
        Test: stats.find((s) => s.format === 'Test') || null,
        ODI: stats.find((s) => s.format === 'ODI') || null,
        T20: stats.find((s) => s.format === 'T20') || null
      }
    };
  });
}

export async function getRecentMatchesForPlayer(playerId) {
  return query(
    `SELECT m.id as match_id, m.format, m.match_date, m.venue,
            th.name as home_team, ta.name as away_team,
            pms.runs, pms.balls_faced, pms.fours, pms.sixes, pms.dismissal_type,
            pms.overs_bowled, pms.runs_conceded, pms.wickets, pms.catches
     FROM player_match_stats pms
     JOIN matches m ON pms.match_id = m.id
     LEFT JOIN teams th ON m.team_home_id = th.id
     LEFT JOIN teams ta ON m.team_away_id = ta.id
     WHERE pms.player_id = ?
     ORDER BY m.match_date DESC
     LIMIT 10`,
    [playerId]
  );
}
