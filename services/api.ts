import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const templateAPI = {
  getAll: async (type: 'resume' | 'portfolio') => {
    const response = await api.get(`/templates?type=${type}`);
    return response.data;
  },
};

export const informationAPI = {
  get: async () => {
    try {
      const response = await api.get('/information');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        // If no information is found, it's not a critical error.
        // Return a default structure.
        return { success: true, information: null };
      }
      console.error('Error fetching user information:', error);
      throw error;
    }
  },
  
  // The 'data' payload should match the structure of your Information model
  // e.g., { personalDetails: { ... } } or { experience: [ ... ] }
  update: async (data: any) => {
    try {
      const response = await api.put('/information', data);
      return response.data;
    } catch (error) {
      console.error('Error updating user information:', error);
      throw error;
    }
  },
};

export const onboardingAPI = {
  check: async (): Promise<{ completed: boolean; currentStep: number }> => {
    try {
      const response = await api.get('/auth/check-onboarding');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return { completed: false, currentStep: 1 };
      }
      console.error('Error checking onboarding status:', error);
      throw error;
    }
  },
  
  completeStep: async (step: number, data: Record<string, any> = {}): Promise<{ success: boolean; user: any }> => {
    try {
      const response = await api.post('/auth/complete-onboarding-step', { step, ...data });
      return response.data;
    } catch (error) {
      console.error('Error completing onboarding step:', error);
      throw error;
    }
  }
};

// You can add other api groups here, like authAPI, resumeAPI, etc.