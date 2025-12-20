import axios, { type InternalAxiosRequestConfig } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://task-manager-6jz8.onrender.com/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cache for GET requests
const requestCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 30000; // 30 seconds

// Request interceptor with caching
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Only cache GET requests to /auth/me
    if (config.method === 'get' && config.url === '/auth/me') {
      const cacheKey = config.url;
      const cached = requestCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        // Return cached data immediately
        return Promise.reject({
          config,
          response: { data: cached.data, status: 200 },
          isCache: true
        });
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Cache successful GET responses to /auth/me
    if (response.config.method === 'get' && response.config.url === '/auth/me') {
      requestCache.set(response.config.url, {
        data: response.data,
        timestamp: Date.now()
      });
    }
    return response;
  },
  (error: any) => {
    // Handle cached responses
    if (error.isCache) {
      return Promise.resolve(error.response);
    }
    
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Clear cache on 401
      requestCache.clear();
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Clear cache on logout
export const clearAuthCache = () => {
  requestCache.clear();
};

export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error || error.message;
  }
  return 'An unexpected error occurred';
};