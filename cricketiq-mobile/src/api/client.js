import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * Automatically resolves the computer's network IP when running on a physical
 * device (iOS/Android via Expo Go) or Android Emulator.
 */
const getDevHost = () => {
  if (Platform.OS === 'web') return 'localhost';

  // In Expo Go, hostUri contains the computer's LAN IP e.g. "172.20.10.3:8081"
  const hostUri = Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
      return ip;
    }
  }

  // Android emulator loopback
  if (Platform.OS === 'android') {
    return '10.0.2.2';
  }

  // Physical phone default LAN fallback
  return '172.20.10.3';
};

export const API_HOST = process.env.EXPO_PUBLIC_API_HOST || getDevHost();
export const API_PORT = process.env.EXPO_PUBLIC_API_PORT || '5000';
export const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || `http://${API_HOST}:${API_PORT}/api`;

console.log(`📡 CricketIQ Mobile connecting to API at: ${BASE_URL}`);

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Response interceptor to handle common network errors gracefully
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || 'Network request failed';
    return Promise.reject(new Error(message));
  }
);

/**
 * Normalizes image URLs so that local photos (/photos/player.jpg or http://localhost:5000)
 * resolve to the host machine's IP on physical iOS/Android devices.
 */
export function resolveImageUrl(url) {
  if (!url) return null;
  if (url.startsWith('/photos/')) {
    return `http://${API_HOST}:${API_PORT}${url}`;
  }
  if (url.startsWith('http://localhost:5000')) {
    return url.replace('http://localhost:5000', `http://${API_HOST}:${API_PORT}`);
  }
  if (url.startsWith('http://127.0.0.1:5000')) {
    return url.replace('http://127.0.0.1:5000', `http://${API_HOST}:${API_PORT}`);
  }
  return url;
}

export default client;
