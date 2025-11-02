import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  getAuth,
  onAuthStateChanged,
  signInWithCredential,
  signOut as firebaseSignOut,
  type FirebaseAuthTypes,
} from '@react-native-firebase/auth';
import axios from 'axios';

interface AuthContextData {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
  signIn: (credential: any) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, (userState) => {
      setUser(userState);
      setLoading(false);
    });
    return subscriber;
  }, [auth]);

  const signIn = async (credential: any) => {
    try {
      console.log('🔄 Signing in with credential...');
      const userCredential = await signInWithCredential(auth, credential);
      console.log('✅ Firebase credential sign-in successful');

      if (userCredential?.user) {
        // After successful Firebase sign-in, get the ID token
        const idToken = await userCredential.user.getIdToken();
        console.log('✅ Got ID token');

        // Send the token to your backend to create/update the user in MongoDB
        try {
          const apiUrl = process.env.EXPO_PUBLIC_API_URL;
          
          if (!apiUrl) {
            console.error('❌ API URL is not configured');
            throw new Error('API URL is not configured in environment variables');
          }

          console.log('🔄 Syncing with backend:', `${apiUrl}/api/auth/sync`);
          
          const response = await axios.post(
            `${apiUrl}/api/auth/sync`,
            {
              token: idToken,
            },
            {
              timeout: 10000, // 10 second timeout
            }
          );
          
          console.log('✅ User synced with backend:', response.data);
        } catch (backendError: any) {
          console.error('❌ Backend sync error:', {
            message: backendError?.message,
            response: backendError?.response?.data,
            status: backendError?.response?.status,
            code: backendError?.code,
          });
          
          // If backend sync fails, sign the user out of Firebase
          await firebaseSignOut(auth);
          
          // Provide a user-friendly error message
          let errorMessage = 'Failed to sync user with server.';
          
          if (backendError?.response?.data?.message) {
            errorMessage = backendError.response.data.message;
          } else if (backendError?.message) {
            errorMessage = backendError.message;
          } else if (backendError?.code === 'ECONNABORTED') {
            errorMessage = 'Server connection timeout. Please try again.';
          } else if (backendError?.code === 'ERR_NETWORK') {
            errorMessage = 'Network error. Please check your connection.';
          }
          
          // Add the user-friendly message and re-throw
          backendError.message = errorMessage;
          throw backendError;
        }
      }
    } catch (error: any) {
      console.error('❌ Sign-in error:', {
        message: error?.message,
        code: error?.code,
        name: error?.name,
      });
      
      // Re-throw the error to be caught by the calling function in LoginScreen
      throw error;
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);