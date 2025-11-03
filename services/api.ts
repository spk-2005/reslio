import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Validate API URL is configured
if (!API_URL) {
  console.error('EXPO_PUBLIC_API_URL is not defined in environment variables');
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
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

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        // Network error
        console.error('Network error:', error.message);
        throw new Error('Network error. Please check your internet connection.');
      }
    }
    return Promise.reject(error);
  }
);

export const templateAPI = {
  getAll: async (type: 'resume' | 'portfolio') => {
    try {
      const response = await api.get(`/templates?type=${type}`);
console.log('Requesting URL:', `${API_URL}/templates?type=${type}`);
      // Handle the backend response structure { success: true, templates: [] }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Session expired. Please log in again.');
        }
        if (error.response?.status === 500) {
          throw new Error('Server error. Please try again later.');
        }
      }
      throw error;
    }
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

export default api;