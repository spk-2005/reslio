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
  signIn: (credential: any) => Promise<void>; // AuthCredential is not exported in v22
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, (userState) => {
      // This callback runs once the initial auth state is determined.
      setUser(userState);
      setLoading(false); // Always set loading to false after the check.
    });
    return subscriber; // unsubscribe on unmount
  }, [auth]);

  const signIn = async (credential: any) => {
    try {
      const userCredential = await signInWithCredential(auth, credential);

      if (userCredential.user) {
        // After successful Firebase sign-in, get the ID token
        const idToken = await userCredential.user.getIdToken();

        // Send the token to your backend to create/update the user in MongoDB
        try {
          const apiUrl = process.env.EXPO_PUBLIC_API_URL;
          await axios.post(`${apiUrl}/users/auth`, {}, {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          });
          console.log('✅ User synced with backend');
        } catch (error) {
          console.error('❌ Backend sync error:', error);
          // If backend sync fails, we should sign the user out of Firebase
          // to ensure a consistent state.
          await firebaseSignOut(auth);
          throw new Error('Failed to sync user with server.');
        }
      }
    } catch (error) {
      console.error('❌ Firebase sign-in error:', error);
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