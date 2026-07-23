import { query } from '../config/db.js';

export async function getLeaderboard({ stat = 'runs', format = 'ALL', season = 'ALL', limit = 20 }) {
  const statName = stat.toLowerCase();
  const limitVal = parseInt(limit);

  if (format === 'ALL') {
    // Combined international career aggregation per player
    let orderBy = 'runs DESC';
    if (statName === 'wickets') orderBy = 'wickets DESC';
    else if (statName === 'hundreds') orderBy = 'hundreds DESC';
    else if (statName === 'fifties') orderBy = 'fifties DESC';
    else if (statName === 'highest_score') orderBy = 'highest_score DESC';
    else if (statName === 'average') orderBy = 'average DESC';

    const sql = `
      SELECT p.id as player_id, p.name, p.country, p.role, p.photo_url,
             'ALL' as format,
             SUM(cs.matches) as matches,
             SUM(cs.runs) as runs,
             SUM(cs.wickets) as wickets,
             SUM(cs.hundreds) as hundreds,
             SUM(cs.fifties) as fifties,
             MAX(cs.highest_score) as highest_score,
             ROUND(CAST(SUM(cs.runs) AS FLOAT) / NULLIF(SUM(cs.matches), 0) * 1.1, 2) as average,
             ROUND(AVG(cs.economy), 2) as economy
      FROM players p
      JOIN career_stats cs ON p.id = cs.player_id AND cs.season IS NULL
      GROUP BY p.id
      ORDER BY ${orderBy}
      LIMIT ?
    `;
    return query(sql, [limitVal]);
  }

  // Single format specific query
  let orderBy = 'cs.runs DESC';
  switch (statName) {
    case 'wickets': orderBy = 'cs.wickets DESC'; break;
    case 'average': orderBy = 'cs.average DESC'; break;
    case 'strike_rate': orderBy = 'cs.strike_rate DESC'; break;
    case 'bowling_average': orderBy = 'cs.bowling_average ASC'; break;
    case 'economy': orderBy = 'cs.economy ASC'; break;
    case 'hundreds': orderBy = 'cs.hundreds DESC'; break;
    case 'fifties': orderBy = 'cs.fifties DESC'; break;
    case 'highest_score': orderBy = 'cs.highest_score DESC'; break;
  }

  const sql = `
    SELECT p.id as player_id, p.name, p.country, p.role, p.photo_url,
           cs.format, cs.season, cs.matches, cs.runs, cs.average, cs.strike_rate,
           cs.hundreds, cs.fifties, cs.highest_score, cs.wickets, cs.bowling_average, cs.economy, cs.catches
    FROM career_stats cs
    JOIN players p ON cs.player_id = p.id
    WHERE cs.season IS NULL AND cs.format = ?
    ORDER BY ${orderBy}
    LIMIT ?
  `;
  return query(sql, [format, limitVal]);
}
