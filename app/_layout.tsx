import { Stack, useRouter, useSegments, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useFirebaseTokenSync } from '@/hooks/useFirebaseTokenSync';

// Configure Google Sign-In once when the app loads.
GoogleSignin.configure({
  // For Firebase, this must be the Web Client ID from your google-services.json (client_type: 3)
  webClientId: '554626942351-j20c4jvn6gbu7ocfbf96ssvuraqdagtp.apps.googleusercontent.com',
  offlineAccess: false,
});

function RootLayoutNav() {
  const { user, loading: authLoading } = useAuth();
  const { token, loading: tokenLoading } = useFirebaseTokenSync();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const isAppReady = !authLoading && !tokenLoading;
    if (!isAppReady) {
      return; // Wait until both Firebase auth and our token sync are done
    }

    const inAuthGroup = segments[0] === '(tabs)';

    // User is logged in with Firebase AND we have a backend token
    if (user && token) {
      // User is signed in but not in the main (tabs) group.
      // Redirect them to the home screen of the tabs.
      if (!inAuthGroup) {
        router.replace('/(tabs)');
      }
    } else {
        // If user is not signed in and the initial route is in the (tabs) group,
        // redirect to the login screen
        router.replace('/login');
      
      // If user is not signed in and not in (tabs) group, stay on the current screen (login/signup)
    }
  }, [user, token, authLoading, tokenLoading, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  // Keep the splash screen visible until we are ready to render.
  // The logic in RootLayoutNav will handle hiding it.
  // Note: useFrameworkReady is deprecated in favor of SplashScreen.preventAutoHideAsync
  SplashScreen.preventAutoHideAsync();

  return (
    <AuthProvider>
      <RootLayoutNav />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}