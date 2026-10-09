import client from './client';

// Fetch ranked player leaderboards by metric and format
export const getLeaderboard = async ({ stat = 'runs', format = 'ALL', season = 'ALL', limit = 20 } = {}) => {
  const response = await client.get('/leaderboards', {
    params: { stat, format, season, limit }
  });
  return response.data;
};
