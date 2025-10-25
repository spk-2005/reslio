import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Star, Crown, LogOut } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeTab() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleRateApp = async () => {
    const playStoreUrl = 'https://play.google.com/store/apps';
    try {
      await Linking.openURL(playStoreUrl);
    } catch (error) {
      console.error('Error opening Play Store:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.profileSection}>
            {user?.photoURL ? (
              <Image source={{ uri: user.photoURL }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {user?.displayName?.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.displayName}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleSignOut} style={styles.logoutButton}>
            <LogOut color="#fff" size={24} />
          </TouchableOpacity>
        </View>

        {user?.isPremium && (
          <View style={styles.premiumBadge}>
            <Crown color="#FFD700" size={20} />
            <Text style={styles.premiumText}>Premium Member</Text>
          </View>
        )}
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome to Reslio</Text>
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

        {!user?.isPremium && (
          <TouchableOpacity style={styles.premiumButton}>
            <Crown color="#FFD700" size={24} />
            <Text style={styles.premiumButtonText}>Upgrade to Premium</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.rateButton} onPress={handleRateApp}>
          <Star color="#667eea" size={24} />
          <Text style={styles.rateButtonText}>Rate Us on Play Store</Text>
        </TouchableOpacity>

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
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#fff',
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
  },
  userInfo: {
    marginLeft: 15,
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  userEmail: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  logoutButton: {
    padding: 10,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 15,
    alignSelf: 'flex-start',
  },
  premiumText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  welcomeSection: {
    marginBottom: 30,
  },
  welcomeTitle: {
    fontSize: 24,
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
  premiumButton: {
    backgroundColor: '#667eea',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
  },
  premiumButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  rateButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#667eea',
    marginBottom: 20,
  },
  rateButtonText: {
    color: '#667eea',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  version: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginTop: 10,
  },
});
