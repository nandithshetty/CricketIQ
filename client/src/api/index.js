import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cricketiq_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const searchPlayers = async (query = '') => {
  const res = await api.get(`/players/search?q=${encodeURIComponent(query)}`);
  return res.data;
};

export const getPlayerProfile = async (id) => {
  const res = await api.get(`/players/${id}`);
  return res.data;
};

export const getAISummary = async (id, refresh = false) => {
  const res = await api.get(`/players/${id}/ai-summary?refresh=${refresh}`);
  return res.data;
};

export const comparePlayers = async (playerIds) => {
  const ids = Array.isArray(playerIds) ? playerIds.join(',') : playerIds;
  const res = await api.get(`/players/compare?ids=${ids}`);
  return res.data;
};

export const getLeaderboards = async ({ stat = 'runs', format = 'ALL', season = 'ALL', limit = 20 }) => {
  const res = await api.get(`/leaderboards?stat=${stat}&format=${format}&season=${season}&limit=${limit}`);
  return res.data;
};

export const getPlayerOpposition = async (id, teamId = '') => {
  const res = await api.get(`/players/${id}/opposition/${teamId}`);
  return res.data;
};

export const getPlayerVenues = async (id) => {
  const res = await api.get(`/players/${id}/venues`);
  return res.data;
};

export const loginUser = async (credentials) => {
  const res = await api.post('/auth/login', credentials);
  if (res.data.token) {
    localStorage.setItem('cricketiq_token', res.data.token);
    localStorage.setItem('cricketiq_user', JSON.stringify(res.data.user));
  }
  return res.data;
};

export const registerUser = async (userData) => {
  const res = await api.post('/auth/register', userData);
  if (res.data.token) {
    localStorage.setItem('cricketiq_token', res.data.token);
    localStorage.setItem('cricketiq_user', JSON.stringify(res.data.user));
  }
  return res.data;
};

export const triggerAdminImport = async (type = 'career_stats_recompute', payload = {}) => {
  const res = await api.post('/admin/import', { type, payload });
  return res.data;
};

export const getAdminJobs = async () => {
  const res = await api.get('/admin/jobs');
  return res.data;
};

export const getJobStatus = async (jobId) => {
  const res = await api.get(`/admin/import/${jobId}`);
  return res.data;
};

export const getCacheStats = async () => {
  const res = await api.get('/admin/cache');
  return res.data;
};

export default api;
