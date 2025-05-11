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
  if (token) {
    // Add Bearer prefix to the token
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific status codes
      if (error.response.status === 401) {
        // Token expired or invalid
        console.error('Authentication error:', error.response.data);
        // Optionally: clear token and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      console.error(`API Error [${error.response.status}]:`, error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;