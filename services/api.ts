import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  loginWithGoogle: async (idToken: string, userData: any) => {
    const response = await api.post('/auth/login', { idToken, userData });
    await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updatePremium: async (isPremium: boolean, expiresAt?: string) => {
    const response = await api.put('/auth/premium', { isPremium, expiresAt });
    return response.data;
  },
};

export const templateAPI = {
  getAll: async (type?: 'resume' | 'portfolio') => {
    const params = type ? { type } : {};
    const response = await api.get('/templates', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/templates/${id}`);
    return response.data;
  },

  create: async (templateData: any) => {
    const response = await api.post('/templates', templateData);
    return response.data;
  },
};

export const resumeAPI = {
  create: async (resumeData: any) => {
    const response = await api.post('/resumes', resumeData);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/resumes');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/resumes/${id}`);
    return response.data;
  },

  update: async (id: string, resumeData: any) => {
    const response = await api.put(`/resumes/${id}`, resumeData);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/resumes/${id}`);
    return response.data;
  },
};

export const portfolioAPI = {
  create: async (portfolioData: any) => {
    const response = await api.post('/portfolios', portfolioData);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/portfolios');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/portfolios/${id}`);
    return response.data;
  },

  update: async (id: string, portfolioData: any) => {
    const response = await api.put(`/portfolios/${id}`, portfolioData);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/portfolios/${id}`);
    return response.data;
  },
};

export const exportAPI = {
  exportResumePDF: async (resumeData: any, templateHTML: string) => {
    const response = await api.post('/export/resume/pdf', { resumeData, templateHTML }, { responseType: 'blob' });
    return response.data;
  },

  exportResumeDOCX: async (resumeData: any) => {
    const response = await api.post('/export/resume/docx', { resumeData }, { responseType: 'blob' });
    return response.data;
  },

  exportResumeImage: async (templateHTML: string) => {
    const response = await api.post('/export/resume/image', { templateHTML }, { responseType: 'blob' });
    return response.data;
  },

  exportPortfolioZIP: async (portfolioHTML: string, portfolioCSS: string, portfolioJS: string) => {
    const response = await api.post('/export/portfolio/zip', { portfolioHTML, portfolioCSS, portfolioJS }, { responseType: 'blob' });
    return response.data;
  },
};

export default api;
