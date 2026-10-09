import client from './client';

// Fetch or generate AI performance summary grounded in statistical data
export const getAISummary = async (playerId, refresh = false) => {
  const response = await client.get(`/players/${playerId}/ai-summary`, {
    params: { refresh }
  });
  return response.data;
};
