import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  verifyEmail: (token) => api.get(`/auth/verify-email?token=${token}`),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  validateToken: () => api.post('/auth/validate-token'),
};

// User API
export const userAPI = {
  getCurrentUser: () => api.get('/users/me'),
};

// Request API
export const requestAPI = {
  getAllRequests: () => api.get('/requests'),
  getRequestById: (id) => api.get(`/requests/${id}`),
  createRequest: (data) => api.post('/requests', data),
  approveRequest: (id, comment = '') => api.put(`/requests/${id}/approve`, { comment }),
  rejectRequest: (id, comment = '') => api.put(`/requests/${id}/reject`, { comment }),
  completeRequest: (id, comment = '') => api.put(`/requests/${id}/complete`, { comment }),
  getRequestHistory: (id) => api.get(`/requests/${id}/history`),
};

export default api;