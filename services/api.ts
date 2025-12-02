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
    console.log(`[API Interceptor] Making request to: ${config.url}`);
    const token = await SecureStore.getItemAsync('userToken');
    if (token) {
      // To debug, you can log a snippet of the token, but NEVER the full token.
      console.log(`[API Interceptor] Attaching token: Bearer ${token.substring(0, 15)}...`);
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
console.log('Requesting URL:', `${API_URL}/templates?type=${type}`);
      const response = await api.get(`/templates?type=${type}`);
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
  getById: async (id: string) => {
    try {
      console.log('Requesting URL:', `${API_URL}/templates/${id}`);
      const response = await api.get(`/templates/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Session expired. Please log in again.');
        }
        if (error.response?.status === 404) {
          throw new Error(`Template with ID ${id} not found.`);
        }
      }
      // Re-throw other errors to be handled by the caller
      throw error;
    }
  },
};

export const informationAPI = {
  get: async () => {
    try {
      console.log('📤 Making GET request to /information');
      const response = await api.get('/information');
      
      console.log('📥 Response received successfully');
      console.log('📥 Response data:', response.data);
      
      // Return the response data directly
      return response.data;
      
    } catch (error) {
      console.error('❌ Error in informationAPI.get:', error);
      
      if (axios.isAxiosError(error)) {
        console.log('🔍 Axios error detected');
        console.log('🔍 Error response status:', error.response?.status);
        console.log('🔍 Error response data:', error.response?.data);
        
        // For auth errors, re-throw to be handled by the caller (e.g., sign out)
        if (error.response?.status === 401) throw error;
        
        // If truly no data, return default structure
        if (error.response?.status === 404) {
          console.log('ℹ️ 404 - Returning default structure');
          return { 
            success: true, 
            information: {
              personalDetails: {
                name: '',
                phone: '',
                location: ''
              },
              experience: [],
              education: [],
              projects: [],
              achievements: [],
              contactLinks: []
            }
          };
        }
      }
      
      // For any other error, return default structure
      console.log('⚠️ Returning default structure due to unknown error');
      return { 
        success: true, 
        information: {
          personalDetails: {
            name: '',
            phone: '',
            location: ''
          },
          experience: [],
          education: [],
          projects: [],
          achievements: [],
          contactLinks: []
        }
      };
    }
  },
  
  update: async (data: any) => {
    try {
      console.log('📤 Making PUT request to /information with data:', data);
      const response = await api.put('/information', data);
      
      console.log('📥 Update response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('❌ Error updating user information:', error);
      if (axios.isAxiosError(error)) {
        console.error('❌ Update error details:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data
        });
      }
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