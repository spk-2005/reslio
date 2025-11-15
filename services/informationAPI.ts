import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const axiosInstance = axios.create({
  baseURL: `${API_URL}/information`, // Base URL for the information endpoint
});

// Add a request interceptor to include the auth token
axiosInstance.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('backend_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Export the configured instance
export const informationAPI = axiosInstance;