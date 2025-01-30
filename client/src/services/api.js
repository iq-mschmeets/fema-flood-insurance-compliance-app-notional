import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const policyAPI = {
  getAll: () => api.get('/policies'),
  getById: (id) => api.get(`/policies/${id}`),
  create: (policyData) => api.post('/policies', policyData),
  update: (id, policyData) => api.put(`/policies/${id}`, policyData),
  delete: (id) => api.delete(`/policies/${id}`),
};

export const claimAPI = {
  getAll: () => api.get('/claims'),
  getById: (id) => api.get(`/claims/${id}`),
  create: (claimData) => api.post('/claims', claimData),
  update: (id, claimData) => api.put(`/claims/${id}`, claimData),
  delete: (id) => api.delete(`/claims/${id}`),
};

export default api;
