import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthChange, signInWithGoogle, signOutUser } from '../services/firebase';
import { authAPI } from '../services/api';

interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL: string;
  isPremium: boolean;
  premiumExpiresAt?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (idToken?: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        // Firebase user exists, so we are authenticated.
        // Fetch the full user profile from our backend to get the latest data.
        try {
          const response = await authAPI.getProfile();
          setUser(response.user);
          await AsyncStorage.setItem('userData', JSON.stringify(response.user));
        } catch (error) {
          console.error('Failed to fetch user profile on auth change:', error);
          // Optionally sign the user out if the profile call fails
          await signOutUser();
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (idToken?: string) => {
    try {
      setLoading(true);
      const { user: firebaseUser, idToken: firebaseToken } = await signInWithGoogle(idToken);

      const userData = {
        displayName: firebaseUser.displayName,
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL,
      };

      const response = await authAPI.loginWithGoogle(firebaseToken, userData);
      setUser(response.user);
      await AsyncStorage.setItem('userData', JSON.stringify(response.user));
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await signOutUser();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.user);
      await AsyncStorage.setItem('userData', JSON.stringify(response.user));
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
