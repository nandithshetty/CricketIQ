import { query } from '../config/db.js';

export async function getLeaderboard({ stat = 'runs', format = 'ALL', season = 'ALL', limit = 20 }) {
  const statName = stat.toLowerCase();
  const limitVal = parseInt(limit);

  let seasonFilter = 'cs.season IS NULL';
  const params = [];

  if (season !== 'ALL' && season !== 'null') {
    if (season.endsWith('s')) {
      const startYr = parseInt(season);
      const endYr = startYr + 9;
      seasonFilter = 'CAST(cs.season AS INT) BETWEEN ? AND ?';
      params.push(startYr, endYr);
    } else {
      seasonFilter = 'cs.season = ?';
      params.push(season);
    }
  }

  if (format === 'ALL') {
    let orderBy = 'runs DESC';
    let havingClause = '';
    if (statName === 'wickets') orderBy = 'wickets DESC';
    else if (statName === 'hundreds') orderBy = 'hundreds DESC';
    else if (statName === 'fifties') orderBy = 'fifties DESC';
    else if (statName === 'highest_score') orderBy = 'highest_score DESC';
    else if (statName === 'average') orderBy = 'average DESC';
    else if (statName === 'strike_rate') orderBy = 'strike_rate DESC';
    else if (statName === 'bowling_average') {
      orderBy = 'bowling_average ASC';
      havingClause = 'HAVING SUM(cs.wickets) >= 20 AND bowling_average > 0';
    } else if (statName === 'economy') {
      orderBy = 'economy ASC';
      havingClause = 'HAVING SUM(cs.wickets) >= 20 AND economy > 0';
    }

    const sql = `
      SELECT p.id as player_id, p.name, p.country, p.role, p.photo_url,
             'ALL' as format,
             SUM(cs.matches) as matches,
             SUM(cs.runs) as runs,
             SUM(cs.wickets) as wickets,
             SUM(cs.hundreds) as hundreds,
             SUM(cs.fifties) as fifties,
             MAX(cs.highest_score) as highest_score,
             ROUND(AVG(cs.average), 2) as average,
             ROUND(AVG(cs.strike_rate), 2) as strike_rate,
             ROUND(SUM(cs.bowling_average * cs.wickets) / NULLIF(SUM(cs.wickets), 0), 2) as bowling_average,
             ROUND(SUM(cs.bowling_average * cs.wickets) / NULLIF(SUM(CASE WHEN cs.economy > 0 THEN (cs.bowling_average * cs.wickets / cs.economy) ELSE 0 END), 0), 2) as economy
      FROM players p
      JOIN career_stats cs ON p.id = cs.player_id AND ${seasonFilter}
      GROUP BY p.id
      ${havingClause}
      ORDER BY ${orderBy}
      LIMIT ?
    `;
    params.push(limitVal);
    return query(sql, params);
  }

  let orderBy = 'cs.runs DESC';
  let extraWhere = '';
  switch (statName) {
    case 'wickets': orderBy = 'cs.wickets DESC'; break;
    case 'average': orderBy = 'cs.average DESC'; break;
    case 'strike_rate': orderBy = 'cs.strike_rate DESC'; break;
    case 'bowling_average': 
      orderBy = 'cs.bowling_average ASC'; 
      extraWhere = ' AND cs.wickets >= 10 AND cs.bowling_average > 0';
      break;
    case 'economy': 
      orderBy = 'cs.economy ASC'; 
      extraWhere = ' AND cs.wickets >= 10 AND cs.economy > 0';
      break;
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
    WHERE ${seasonFilter} AND cs.format = ?${extraWhere}
    ORDER BY ${orderBy}
    LIMIT ?
  `;
  params.push(format, limitVal);
  return query(sql, params);
}
