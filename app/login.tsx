import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);

  // Construct Expo auth proxy URL manually
  // Replace 'YOUR_EXPO_USERNAME' with your actual Expo username from 'npx expo whoami'
  const getRedirectUri = () => {
    // For Expo Go, use the auth proxy
    const expoUsername = Constants.expoConfig?.owner || 'YOUR_EXPO_USERNAME';
    const slug = Constants.expoConfig?.slug || 'reslio-app';
    return `https://auth.expo.io/@${expoUsername}/${slug}`;
  };

  const redirectUri = getRedirectUri();

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:'268788624301-ph26nv5g5m8a0q1m8n04h6slrqah8flr.apps.googleusercontent.com',
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID,
    redirectUri: redirectUri,
  });

  // Log the redirect URI for Google Console setup
  useEffect(() => {
    console.log('📋 Add this URI to Google Console Authorized Redirect URIs:');
    console.log(redirectUri);
    if (request?.redirectUri) {
      console.log('Actual request redirect URI:', request.redirectUri);
    }
  }, [request, redirectUri]);

  useEffect(() => {
    const handleResponse = async () => {
      if (response?.type === 'success') {
        setLoading(true);
        const { id_token } = response.params;
        try {
          await signIn(id_token);
          router.replace('/(tabs)');
        } catch (error: any) {
          Alert.alert('Sign In Failed', error.message || 'An unexpected error occurred.');
          setLoading(false);
        }
      } else if (response?.type === 'error') {
        Alert.alert('Sign In Error', response.params.error_description || 'Could not complete sign in.');
        setLoading(false);
      }
    };

    handleResponse();
  }, [response]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await promptAsync();
    } catch (error) {
      console.error('Sign in error:', error);
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Reslio</Text>
          <Text style={styles.subtitle}>Resume & Portfolio Builder</Text>
        </View>

        <View style={styles.features}>
          <Text style={styles.featureText}>✓ Create Professional Resumes</Text>
          <Text style={styles.featureText}>✓ Build Stunning Portfolios</Text>
          <Text style={styles.featureText}>✓ Export to PDF, Word & More</Text>
          <Text style={styles.featureText}>✓ Multiple Templates Available</Text>
        </View>

        <TouchableOpacity
          style={[styles.button, (loading || !request) && styles.buttonDisabled]}
          onPress={handleGoogleSignIn}
          disabled={loading || !request}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Signing in...' : 'Continue with Google'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.terms}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.9,
  },
  features: {
    marginBottom: 60,
  },
  featureText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 12,
    opacity: 0.95,
  },
  button: {
    backgroundColor: '#fff',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 280,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#667eea',
    textAlign: 'center',
  },
  terms: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 30,
    paddingHorizontal: 20,
  },
});