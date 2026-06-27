import axios from 'axios';
import { API_BASE } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    // Skip token for auth endpoints (login, register, refresh)
    if (config.url?.includes('/auth/login') || config.url?.includes('/auth/register')) {
      return config;
    }
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔵 Added token:', token.substring(0, 20) + '...');
    } else {
      console.warn('⚠️ No access token found');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('🔴 API Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default api;
