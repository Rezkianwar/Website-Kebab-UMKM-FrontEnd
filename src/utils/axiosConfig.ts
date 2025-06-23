// src/utils/axiosConfig.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://website-kebab-umkm-backend-api-production.up.railway.app/api',
  timeout: 60000,
});

// Interceptor otomatis tambah token
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default apiClient;