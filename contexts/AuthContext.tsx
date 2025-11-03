import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithCredential,
  signOut,
  type FirebaseAuthTypes,
} from 'firebase/auth';
import { auth } from '@/services/firebase'; // Import the initialized auth instance

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
      console.log('✅ Firebase credential sign-in successful.');
      // The useFirebaseTokenSync hook will now handle syncing with the backend
      // and storing the token automatically.
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
    await signOut(auth);
    // The useFirebaseTokenSync hook will automatically remove the
    // backend token from SecureStore upon sign-out.
    console.log('✅ Firebase sign-out successful.');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);