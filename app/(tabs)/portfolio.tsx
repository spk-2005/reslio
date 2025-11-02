import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { templateAPI } from '@/services/api';
import { AdMob } from '@/services/admob';
import { Plus } from 'lucide-react-native';

interface Template {
  _id: string;
  name: string;
  description: string;
  thumbnail: string;
  isPremium: boolean;
}

export default function PortfolioTab() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const response = await templateAPI.getAll('portfolio');
      setTemplates(response.templates || getMockTemplates());
    } catch (error) {
      console.error('Error loading templates:', error);
      setTemplates(getMockTemplates());
    } finally {
      setLoading(false);
    }
  };

  const getMockTemplates = (): Template[] => [
    {
      _id: '1',
      name: 'Modern Portfolio',
      description: 'Contemporary design with smooth animations',
      thumbnail: 'https://images.pexels.com/photos/326503/pexels-photo-326503.jpeg?auto=compress&w=400',
      isPremium: false,
    },
    {
      _id: '2',
      name: 'Developer Portfolio',
      description: 'Perfect for showcasing your code projects',
      thumbnail: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&w=400',
      isPremium: false,
    },
    {
      _id: '3',
      name: 'Designer Portfolio',
      description: 'Visual-first design for creatives',
      thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&w=400',
      isPremium: true,
    },
    {
      _id: '4',
      name: 'Photography Portfolio',
      description: 'Gallery-focused layout for photographers',
      thumbnail: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&w=400',
      isPremium: false,
    },
  ];

  const handleTemplateSelect = async (template: Template) => {
    try {
      await AdMob.showInterstitial();
      
      // In a real implementation, you would navigate to a data entry screen,
      // passing the template ID as a parameter.
      router.push({ pathname: '/editor/portfolio', params: { templateId: template._id } });
    } catch (error) {
      console.error('Error selecting template:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Portfolio Templates</Text>
        <Text style={styles.headerSubtitle}>Build your professional website</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.grid}>
          {templates.map((template) => (
            <TouchableOpacity
              key={template._id}
              style={styles.templateCard}
              onPress={() => handleTemplateSelect(template)}
            >
              <Image source={{ uri: template.thumbnail }} style={styles.thumbnail} />
              <View style={styles.templateInfo}>
                <Text style={styles.templateName}>{template.name}</Text>
                <Text style={styles.templateDescription}>{template.description}</Text>
                {template.isPremium && (
                  <View style={styles.premiumBadge}>
                    <Text style={styles.premiumBadgeText}>Premium</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab}>
        <Plus color="#fff" size={28} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  content: {
    flex: 1,
  },
  grid: {
    padding: 15,
  },
  templateCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  thumbnail: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  templateInfo: {
    padding: 15,
  },
  templateName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  templateDescription: {
    fontSize: 14,
    color: '#666',
  },
  premiumBadge: {
    backgroundColor: '#FFD700',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  premiumBadgeText: {
    color: '#333',
    fontSize: 12,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
