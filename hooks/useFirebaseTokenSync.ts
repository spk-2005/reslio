import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/services/firebase'; // Import the initialized auth instance
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const TOKEN_KEY = 'userToken';

/**
 * A hook that listens to Firebase auth state changes and automatically
 * syncs the user with the backend, storing the resulting JWT in SecureStore.
 * This ensures the API token is always available when the user is logged in.
 */
export const useFirebaseTokenSync = (): { token: string | null; loading: boolean } => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    SecureStore.getItemAsync(TOKEN_KEY).then(setToken);
  }, []);

  useEffect(() => {
    const syncUserAndToken = async (firebaseUser: any) => {
      if (firebaseUser) {
        try {
          // 1. Get Firebase ID token
          const idToken = await firebaseUser.getIdToken(true); // Use getIdToken() as recommended
          console.log('🔄 [TokenSync] Firebase user detected, getting backend token...');

          // 2. Send to backend to get our API's JWT
          const response = await axios.post(`${API_URL}/auth/sync`, {
            token: idToken,
          });

          // 3. Store the backend JWT securely
          if (response.data?.token) {
            const backendToken = response.data.token;
            await SecureStore.setItemAsync(TOKEN_KEY, backendToken);
            setToken(backendToken);
            console.log('✅ [TokenSync] Backend JWT stored in SecureStore.');
          } else {
            // If backend doesn't return a token, clear any old one
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            setToken(null);
          }
        } catch (error) {
          console.error('❌ [TokenSync] Failed to sync user and get backend token:', error);
          // Clear any potentially stale token on error
          await SecureStore.deleteItemAsync(TOKEN_KEY);
          setToken(null);
        }
      } else {
        // User is signed out, remove the token
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        setToken(null);
        console.log('🗑️ [TokenSync] User signed out, backend token removed.');
      }
      setLoading(false);
    };

    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, syncUserAndToken);

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]); // Re-run effect if auth instance changes

  return { token, loading };
};