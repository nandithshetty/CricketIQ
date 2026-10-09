import client from './client';

// Search players by query string
export const searchPlayers = async (query = '') => {
  const response = await client.get('/players/search', {
    params: { q: query },
  });
  return response.data;
};

// Fetch full player profile (details, career stats, timeline, recent matches)
export const getPlayerProfile = async (id) => {
  const response = await client.get(`/players/${id}`);
  return response.data;
};

// Compare head-to-head performance across player IDs (array or comma-separated string)
export const comparePlayers = async (playerIds) => {
  const ids = Array.isArray(playerIds) ? playerIds.join(',') : playerIds;
  const response = await client.get('/players/compare', {
    params: { ids },
  });
  return response.data;
};

// Fetch opposition breakdown statistics
export const getPlayerOpposition = async (id, teamId = '') => {
  const endpoint = teamId ? `/players/${id}/opposition/${teamId}` : `/players/${id}/opposition`;
  const response = await client.get(endpoint);
  return response.data;
};

// Fetch venue performance statistics
export const getPlayerVenues = async (id) => {
  const response = await client.get(`/players/${id}/venues`);
  return response.data;
};
