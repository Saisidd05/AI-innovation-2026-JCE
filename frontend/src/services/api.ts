import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Request Interceptor: attach token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('network_hunter_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('network_hunter_token');
      localStorage.removeItem('network-hunter-auth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth API ───
export const authApi = {
  login: async (email: string, password: string) => {
    const res = await api.post('/api/auth/login', { email, password });
    if (res.data?.access_token) {
      localStorage.setItem('network_hunter_token', res.data.access_token);
    }
    return res.data;
  },
  
  register: async (data: { full_name: string; email: string; password: string; role?: string }) => {
    const res = await api.post('/api/auth/register', data);
    return res.data;
  },
  
  getMe: async () => {
    const res = await api.get('/api/auth/me');
    return res.data;
  },
  
  logout: async () => {
    try {
      await api.post('/api/auth/logout');
    } catch {}
    localStorage.removeItem('network_hunter_token');
    localStorage.removeItem('network-hunter-auth');
  },
};

// ─── Cases API ───
export const casesApi = {
  getAll: async () => {
    const res = await api.get('/api/cases');
    return res.data;
  },
  getOne: async (id: string) => {
    const res = await api.get(`/api/cases/${id}`);
    return res.data;
  },
  create: async (data: { case_name: string; description?: string; status?: string }) => {
    const res = await api.post('/api/cases', data);
    return res.data;
  },
  update: async (id: string, data: { case_name?: string; description?: string; status?: string }) => {
    const res = await api.patch(`/api/cases/${id}`, data);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await api.delete(`/api/cases/${id}`);
    return res.data;
  },
};

// ─── Hacker AI API ───
export const hackerAiApi = {
  uploadCsv: async (file: File, case_id?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    const url = case_id ? `/api/hacker-ai/upload-csv?case_id=${case_id}` : '/api/hacker-ai/upload-csv';
    const res = await api.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  
  search: async (query: string, top_k: number = 5, case_id?: string) => {
    const res = await api.post('/api/hacker-ai/search', { query, top_k, case_id });
    return res.data;
  },
  
  ask: async (question: string, case_id?: string) => {
    const res = await api.post('/api/hacker-ai/ask', { question, case_id });
    return res.data;
  },
};

// ─── Evidence API ───
export const evidenceApi = {
  getAll: async (caseId?: string, status?: string) => {
    const params = new URLSearchParams();
    if (caseId) params.append('case_id', caseId);
    if (status) params.append('status_filter', status);
    const res = await api.get(`/api/evidence?${params.toString()}`);
    return res.data;
  },
  verify: async (evidenceId: string, status: string, comment: string = '') => {
    const res = await api.put(`/api/evidence/${evidenceId}/verify`, { status, comment });
    return res.data;
  }
};

// ─── Graph API ───
export const graphApi = {
  get: async (caseId?: string) => {
    const url = caseId ? `/api/graph?case_id=${caseId}` : '/api/graph';
    const res = await api.get(url);
    return res.data;
  }
};

// ─── Timeline API ───
export const timelineApi = {
  get: async (caseId?: string) => {
    const url = caseId ? `/api/timeline?case_id=${caseId}` : '/api/timeline';
    const res = await api.get(url);
    return res.data;
  }
};

// ─── Audit API ───
export const auditApi = {
  getAll: async () => {
    const res = await api.get('/api/audit');
    return res.data;
  }
};

// Backwards compatibility aliases
export const authAPI = authApi;
export const casesAPI = casesApi;
export const hackerAIAPI = hackerAiApi;

export default api;
