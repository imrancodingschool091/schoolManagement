import axios from 'axios';

export const BaseUrl = import.meta.env.VITE_API_URL + '/api/';

const api = axios.create({
  baseURL: BaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to add token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers['x-auth-token'] = token;
  return config;
}, Promise.reject);

// Global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(error.response?.status || 'Request error');
    return Promise.reject(error);
  }
);

export default api;
