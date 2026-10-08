import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('resumegpt_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('resumegpt_token');
      localStorage.removeItem('resumegpt_user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => {
    const params = new URLSearchParams();
    params.append('username', data.username || data.email);
    params.append('password', data.password);
    return api.post('/auth/login', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  },
  getMe: () => api.get('/auth/me'),
};

export const resumesAPI = {
  list: () => api.get('/resumes'),
  get: (id) => api.get(`/resumes/${id}`),
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/resumes/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  delete: (id) => api.delete(`/resumes/${id}`),
  downloadUrl: (id) => `${API_BASE_URL}/resumes/${id}/download`,
};

export const atsAPI = {
  match: (resumeId, data) => api.post(`/ats/match/${resumeId}`, data),
  getMatches: (resumeId) => api.get(`/ats/matches/${resumeId}`),
};

export const agentsAPI = {
  optimizeBullet: (data) => api.post('/agents/optimize-bullet', data),
  generateCoverLetter: (jobMatchId, data) => api.post(`/agents/generate-cover-letter/${jobMatchId}`, data),
  prepareInterview: (jobMatchId) => api.post(`/agents/prepare-interview/${jobMatchId}`),
};

export default api;
