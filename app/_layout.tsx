// app/_layout.tsx
import { Stack, useRouter, useSegments, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useFirebaseTokenSync } from '@/hooks/useFirebaseTokenSync';

// Configure Google Sign-In once when the app loads
GoogleSignin.configure({
  webClientId: '554626942351-j20c4jvn6gbu7ocfbf96ssvuraqdagtp.apps.googleusercontent.com',
  offlineAccess: false,
});

function RootLayoutNav() {
  const { user, loading: authLoading } = useAuth();
  const { token, loading: tokenLoading } = useFirebaseTokenSync();
  const router = useRouter();
  const segments = useSegments();

  // Initialize AdMob when component mounts


  // Handle navigation based on auth state
  useEffect(() => {
    const isAppReady = !authLoading && !tokenLoading;
    if (!isAppReady) return;

    const inAuthGroup = segments[0] === '(tabs)';
    const inEditor = segments[0] === 'editor';

    if (user && token) {
      // Allow navigation to editor and tabs
      // Only redirect if user is at root or login page
      if (!inAuthGroup && !inEditor && segments[0] !== 'index') {
        router.replace('/(tabs)');
      }
    } else {
      // If not logged in, redirect to login (unless already there)
      if (segments[0] !== 'login') {
        router.replace('/login');
      }
    }
  }, [user, token, authLoading, tokenLoading, segments]);

  return (
    // SafeAreaView ensures the content is within the device's safe areas
    <SafeAreaView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* Editor folder - contains its own _layout.tsx */}
        <Stack.Screen name="editor" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </SafeAreaView>
  );
}

export default function RootLayout() {
  SplashScreen.preventAutoHideAsync();
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootLayoutNav />
        <StatusBar style="auto" />
      </AuthProvider>
    </SafeAreaProvider>
  );
}