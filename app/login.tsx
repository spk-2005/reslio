import React, { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { GoogleAuthProvider } from '@/services/firebase';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

const LoginScreen = () => {
  const { signIn } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    if (isSigningIn) return;
    setIsSigningIn(true);
    
    try {
      // 1. Check for Play Services
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      // 2. Sign in
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo);
      console.log('✅ User Info:', userInfo);
      
      if (!userInfo.idToken) {
        throw new Error('No ID token returned from Google Sign-In');
      }
      
      // 3. Create a Firebase credential with the Google ID token
      const googleCredential = GoogleAuthProvider.credential(userInfo.idToken);
      
      // 4. Sign in to Firebase with the credential
      await signIn(googleCredential);
      console.log('✅ Firebase sign-in successful');
      
    } catch (error: any) {
      console.error('❌ Google Sign-In Error:', error);

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // User cancelled - don't show error
        console.log('User cancelled sign-in');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Sign-In In Progress', 'Please wait for the current sign-in to complete.');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Play Services Required', 'Google Play Services is not available on this device.');
      } else {
        Alert.alert(
          'Sign-In Failed', 
          error.message || 'An error occurred. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Reslio</Text>
        <Text style={styles.subtitle}>Resume & Portfolio Builder</Text>
        
        {isSigningIn ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Signing in...</Text>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleSignIn}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Continue with Google</Text>
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 48, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
  subtitle: { fontSize: 18, color: '#fff', marginBottom: 50 },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
});

export default LoginScreen;