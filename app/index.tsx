import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function SplashScreen() {
  // This screen is now just a loading indicator.
  // The navigation logic is handled in the root layout.
  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Reslio</Text>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading your workspace...</Text>
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
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  loadingText: {
    color: '#fff',
    marginTop: 15,
    fontSize: 16,
  },
});