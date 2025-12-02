// components/UserInformation.tsx

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator, 
  Linking, 
  Alert,
  ScrollView,
  Animated
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { informationAPI } from '@/services/api';
import { Crown, Star, LogOut, User, Sparkles, Upload, Edit3, Info } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Import the sub-components
import ManualProfileEditor from './MnaualEntry';
import DocumentedEntry from './DocumentedEntry';

// Type definition for the overall user profile structure
interface UserProfile {
  personalDetails: any;
  experience: any[];
  education: any[];
  projects: any[];
  achievements: any[];
  contactLinks: any[];
  displayName?: string;
  email?: string;
  photoURL?: string;
}

interface ExtractedData {
  personalDetails?: any;
  experience?: any[];
  education?: any[];
  projects?: any[];
  achievements?: any[];
  contactLinks?: any[];
}

export default function UserInformation() {
  const router = useRouter();
  const { user, signOut: authSignOut } = useAuth();
  const [dbUser, setDbUser] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));

  // --- Profile Data Fetching ---
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          setLoadingProfile(true);
          const response = await informationAPI.get();
          const profileFromDb = response.information || {};

          // Ensure all sections exist
          const completeProfile = {
            personalDetails: profileFromDb.personalDetails || {},
            experience: profileFromDb.experience || [],
            education: profileFromDb.education || [],
            projects: profileFromDb.projects || [],
            achievements: profileFromDb.achievements || [],
            contactLinks: profileFromDb.contactLinks || [],
          };

          // Merge Firebase user data as a fallback for personal details
          completeProfile.personalDetails.name = 
            completeProfile.personalDetails.name || user.displayName || '';
          
          setDbUser(completeProfile);
          
          // Fade in animation
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }).start();
        } catch (error) {
          console.error('❌ Failed to fetch user profile:', error);
          setDbUser({
            personalDetails: {}, 
            experience: [], 
            education: [],
            projects: [], 
            achievements: [], 
            contactLinks: [],
          });
        } finally {
          setLoadingProfile(false);
        }
      }
    };
    fetchUserProfile();
  }, [user]);

  // --- Generic handler to update a section of the user profile ---
  const handleSaveAll = async (updatedProfile: UserProfile) => {
    try {
      const response = await informationAPI.update(updatedProfile);
      setDbUser(response.information);
      Alert.alert('✓ Success', `Profile updated successfully!`);
    } catch (error) {
      console.error(`❌ Error updating profile:`, error);
      Alert.alert('Error', `Could not save your profile. Please try again.`);
    }
  };

  const handleUploadSuccess = (extractedData: ExtractedData) => {
    if (!dbUser) return; // Safety check

    // Merge the new data with the existing profile to ensure type consistency
    const updatedProfile: UserProfile = {
      ...dbUser,
      personalDetails: { ...dbUser.personalDetails, ...extractedData.personalDetails },
      experience: extractedData.experience || dbUser.experience,
      education: extractedData.education || dbUser.education,
      projects: extractedData.projects || dbUser.projects,
      achievements: extractedData.achievements || dbUser.achievements,
      contactLinks: extractedData.contactLinks || dbUser.contactLinks,
    };
    setDbUser(updatedProfile);
    Alert.alert('✓ Success', 'Your profile has been updated. You can now review the details.');
  };

  const handleRateApp = async () => {
    const playStoreUrl = 'https://play.google.com/store/apps';
    try {
      const supported = await Linking.canOpenURL(playStoreUrl);
      if (supported) {
        await Linking.openURL(playStoreUrl);
      } else {
        Alert.alert("Unable to Open", 'The Play Store link could not be opened.');
      }
    } catch (error) {
      console.error('Error opening Play Store:', error);
    }
  };

  const actionItems = [
    { 
      icon: Crown, 
      text: 'Upgrade to Premium', 
      subtitle: 'Unlock all features',
      action: () => Alert.alert('Premium', 'Navigate to premium screen.'), 
      colors: ['#FFD700', '#FFA500']
    },
    { 
      icon: Star, 
      text: 'Rate Us on Play Store', 
      subtitle: 'Share your experience',
      action: handleRateApp, 
      colors: ['#667eea', '#764ba2']
    },
    { 
      icon: LogOut, 
      text: 'Sign Out', 
      subtitle: 'See you again soon',
      action: () => authSignOut(), 
      colors: ['#e74c3c', '#c0392b']
    },
  ];

  if (loadingProfile || !dbUser) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <User size={32} color="#ffffff" />
            </View>
            <View style={styles.onlineBadge} />
          </View>
          <Text style={styles.userName}>
            {dbUser.personalDetails?.name || user?.displayName || 'User'}
          </Text>
          <Text style={styles.userEmail}>{user?.email || ''}</Text>
        </View>
      </LinearGradient>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Info Note */}
        <View style={styles.infoNote}>
          <View style={styles.infoIconContainer}>
            <Info size={18} color="#667eea" />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Two Ways to Build Your Profile</Text>
            <Text style={styles.infoDescription}>
              Upload your existing resume for quick AI extraction, or enter your details manually for more control.
            </Text>
          </View>
        </View>

        {/* Quick Method Cards */}
        <View style={styles.methodCards}>
          <View style={styles.methodCard}>
            <View style={[styles.methodIconContainer, { backgroundColor: '#eef2ff' }]}>
              <Upload size={20} color="#667eea" />
            </View>
            <Text style={styles.methodTitle}>Upload Resume</Text>
            <Text style={styles.methodDesc}>AI extracts info automatically</Text>
          </View>
          
          <View style={styles.methodCard}>
            <View style={[styles.methodIconContainer, { backgroundColor: '#fef3c7' }]}>
              <Edit3 size={20} color="#f59e0b" />
            </View>
            <Text style={styles.methodTitle}>Manual Entry</Text>
            <Text style={styles.methodDesc}>Fill in details yourself</Text>
          </View>
        </View>

        {/* Profile Management */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <User size={20} color="#667eea" />
            <Text style={styles.sectionTitle}>Profile Management</Text>
          </View>
          
          <View style={styles.profileManagement}>
            <DocumentedEntry onUploadSuccess={handleUploadSuccess} />
            <ManualProfileEditor
              dbUser={dbUser}
              firebaseUser={user}
              onSave={handleSaveAll}
              actionItems={actionItems}
            />
          </View>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  header: {
    paddingTop: 30,
    paddingBottom: 12,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    padding: 20,
  },
  infoNote: {
    flexDirection: 'row',
    backgroundColor: '#f0f4ff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  infoIconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 13,
    color: '#4b5563',
    lineHeight: 18,
  },
  methodCards: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  methodCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    padding: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  methodIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  methodTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  methodDesc: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  profileManagement: {
  backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
});