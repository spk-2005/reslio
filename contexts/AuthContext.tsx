import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithCredential,
  signOut as firebaseSignOut,
  type User,
  type AuthCredential,
} from 'firebase/auth';
import { auth } from '@/services/firebase'; // Firebase auth instance
import api from '@/services/api'; // Your backend API client
import * as SecureStore from 'expo-secure-store'; // To store the backend token

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (credential: AuthCredential) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userState) => {
      setUser(userState);
      setLoading(false);
    });

    return unsubscribe;
  }, []); // no auth in deps

  const signIn = async (credential: AuthCredential) => {
    try {
      console.log('🔄 Signing in with credential...');
      const userCredential = await signInWithCredential(auth, credential);
      const firebaseUser = userCredential.user;
      console.log('✅ Firebase sign-in successful.');

      if (firebaseUser) {
        console.log('🔄 Getting Firebase ID token...');
        const idToken = await firebaseUser.getIdToken();

        console.log('🔄 Syncing with backend at /auth/login...');
        const response = await api.post('/auth/login', { token: idToken });
        const { token: backendToken } = response.data;

        if (backendToken) {
          await SecureStore.setItemAsync('userToken', backendToken);
          console.log('✅ Backend token stored successfully.');
        }
      }
    } catch (error: any) {
      console.error('❌ Sign-in or backend sync error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    console.log('✅ Firebase sign-out successful.');
    // Also clear the backend token from storage
    await SecureStore.deleteItemAsync('userToken');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
