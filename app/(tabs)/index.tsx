import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function HomeTab() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome, {user?.displayName || 'User'}!</Text>
          <Text style={styles.welcomeText}>
            Create professional resumes and stunning portfolio websites with ease. Choose from our
            collection of templates and customize them to match your style.
          </Text>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Features</Text>

          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>📄 Resume Builder</Text>
            <Text style={styles.featureDescription}>
              Create ATS-friendly resumes with professional templates
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>🌐 Portfolio Websites</Text>
            <Text style={styles.featureDescription}>
              Build beautiful portfolio websites to showcase your work
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>📤 Multiple Export Options</Text>
            <Text style={styles.featureDescription}>
              Export as PDF, Word, Image, or ZIP file
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>✨ Premium Features</Text>
            <Text style={styles.featureDescription}>
              Edit templates, remove ads, and get early access to new features
            </Text>
          </View>
        </View>

        <Text style={styles.version}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    paddingTop: 70,
  },
  welcomeSection: {
    marginBottom: 30,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  featuresSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  featureCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  version: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginTop: 10,
  },
});