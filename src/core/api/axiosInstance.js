import axios from 'axios';
import { useAuthStore } from '../../store/authStore';

export const BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://app-b4a68046-cc76-405f-b0be-527f1eae5608.cleverapps.io/api';

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── Request Interceptor: inject access_token automatically ──────────────
// Mirrors the {{access_token}} variable used across the Postman collection.
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ────────────────────────────────────────────────
// Do not force logout on 401 — dashboard data requests may fail while the
// session is still valid, and that was redirecting users back to /login.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default axiosInstance;
