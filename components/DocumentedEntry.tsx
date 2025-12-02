// DocumentedEntry.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { Upload, CheckCircle, ExternalLink } from 'lucide-react-native';

// --- Interface Definitions ---
interface PersonalDetails {
  name?: string;
  phone?: string;
  location?: string;
}

interface Experience {
  position: string;
  company: string;
  type: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  salary?: string;
}

interface Education {
  institution: string;
  degree: string;
  field?: string;
  endDate?: string;
}

interface Project {
  name: string;
  description?: string;
  liveLink?: string;
  githubLink?: string;
}

interface Achievement {
  title: string;
  type: string;
  issuer?: string;
  date?: string;
}

interface ContactLink {
  type: string;
  url: string;
}

interface ExtractedData {
  personalDetails?: PersonalDetails;
  experience?: Experience[];
  education?: Education[];
  projects?: Project[];
  achievements?: Achievement[];
  contactLinks?: ContactLink[];
}

interface DocumentedEntryProps {
  onUploadSuccess: (data: ExtractedData) => void;
}

const DocumentedEntry = ({ onUploadSuccess }: DocumentedEntryProps) => {
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (extractedData) {
      onUploadSuccess(extractedData);
    }
  }, [extractedData]);

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'text/plain'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];
      setLoading(true);

      let base64Data = '';
      let mediaType = '';

      if (file.mimeType === 'application/pdf') {
        base64Data = await FileSystem.readAsStringAsync(file.uri, { encoding: 'base64' });
        mediaType = 'application/pdf';

        const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { inline_data: { mime_type: mediaType, data: base64Data } },
                { text: `Extract resume info and return ONLY JSON: {"personalDetails": {"name": "", "phone": "", "location": ""}, "experience": [{"position": "", "company": "", "type": "Job", "startDate": "", "endDate": "", "description": "", "salary": ""}], "education": [{"institution": "", "degree": "", "field": "", "endDate": ""}], "projects": [{"name": "", "description": "", "liveLink": "", "githubLink": ""}], "achievements": [{"title": "", "type": "Certification", "issuer": "", "date": ""}], "contactLinks": [{"type": "LinkedIn", "url": ""}]}` }
              ]
            }],
            generationConfig: { responseMimeType: 'application/json' }
          })
        });

        const data = await response.json();
        if (!response.ok || !data.candidates?.[0]?.content) throw new Error('API failed');
        const parsed = JSON.parse(data.candidates[0].content.parts[0].text.replace(/```json|```/g, '').trim());
        setExtractedData(parsed);

      } else if (file.mimeType === 'text/plain') {
        const fileContent = await FileSystem.readAsStringAsync(file.uri, { encoding: 'utf8' });
        const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `Extract resume info from:\n${fileContent}\n\nReturn ONLY JSON: {"personalDetails": {"name": "", "phone": "", "location": ""}, "experience": [{"position": "", "company": "", "type": "Job", "startDate": "", "endDate": "", "description": "", "salary": ""}], "education": [{"institution": "", "degree": "", "field": "", "endDate": ""}], "projects": [{"name": "", "description": "", "liveLink": "", "githubLink": ""}], "achievements": [{"title": "", "type": "Certification", "issuer": "", "date": ""}], "contactLinks": [{"type": "LinkedIn", "url": ""}]}` }] }],
            generationConfig: { responseMimeType: 'application/json' }
          })
        });

        const data = await response.json();
        if (!response.ok || !data.candidates?.[0]?.content) throw new Error('API failed');
        const parsed = JSON.parse(data.candidates[0].content.parts[0].text.replace(/```json|```/g, '').trim());
        setExtractedData(parsed);
      }
    } catch (err: any) {
      Alert.alert('Error', 'Failed to parse resume.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const openLink = (url: string) => Linking.openURL(url).catch(err => console.error(err));

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {!extractedData ? (
        <View style={styles.uploadSection}>
          <TouchableOpacity style={styles.uploadBtn} onPress={handleFileUpload} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#667eea" />
            ) : (
              <Upload size={20} color="#667eea" />
            )}
            <Text style={styles.uploadText}>{loading ? 'Parsing...' : 'Upload Resume (PDF/TXT)'}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.resultsSection}>
          <View style={styles.successBanner}>
            <CheckCircle size={18} color="#10b981" />
            <Text style={styles.successText}>Parsed Successfully</Text>
          </View>

          <TouchableOpacity style={styles.clearBtn} onPress={() => setExtractedData(null)}>
            <Text style={styles.clearText}>Clear & Upload New</Text>
          </TouchableOpacity>

          {/* Personal Details */}
          {extractedData.personalDetails && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Personal Details</Text>
              {extractedData.personalDetails.name && <Text style={styles.item}>Name: {extractedData.personalDetails.name}</Text>}
              {extractedData.personalDetails.phone && <Text style={styles.item}>Phone: {extractedData.personalDetails.phone}</Text>}
              {extractedData.personalDetails.location && <Text style={styles.item}>Location: {extractedData.personalDetails.location}</Text>}
            </View>
          )}

          {/* Experience */}
          {extractedData.experience && extractedData.experience.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Experience</Text>
              {extractedData.experience.map((exp, idx) => (
                <View key={idx} style={styles.card}>
                  <Text style={styles.cardTitle}>{exp.position}</Text>
                  <Text style={styles.cardSub}>{exp.company} • {exp.type}</Text>
                  <Text style={styles.cardDate}>{exp.startDate} - {exp.endDate || 'Present'}</Text>
                  {exp.description && <Text style={styles.cardDesc}>{exp.description}</Text>}
                  {exp.salary && <Text style={styles.salary}>💰 {exp.salary}</Text>}
                </View>
              ))}
            </View>
          )}

          {/* Education */}
          {extractedData.education && extractedData.education.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Education</Text>
              {extractedData.education.map((edu, idx) => (
                <View key={idx} style={styles.card}>
                  <Text style={styles.cardTitle}>{edu.degree}</Text>
                  <Text style={styles.cardSub}>{edu.institution}</Text>
                  {edu.field && <Text style={styles.cardDesc}>Field: {edu.field}</Text>}
                  {edu.endDate && <Text style={styles.cardDate}>{edu.endDate}</Text>}
                </View>
              ))}
            </View>
          )}

          {/* Projects */}
          {extractedData.projects && extractedData.projects.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Projects</Text>
              {extractedData.projects.map((proj, idx) => (
                <View key={idx} style={styles.card}>
                  <Text style={styles.cardTitle}>{proj.name}</Text>
                  {proj.description && <Text style={styles.cardDesc}>{proj.description}</Text>}
                  <View style={styles.links}>
                    {proj.liveLink && (
                      <TouchableOpacity style={styles.link} onPress={() => openLink(proj.liveLink!)}>
                        <ExternalLink size={12} color="#667eea" />
                        <Text style={styles.linkText}>Live</Text>
                      </TouchableOpacity>
                    )}
                    {proj.githubLink && (
                      <TouchableOpacity style={styles.link} onPress={() => openLink(proj.githubLink!)}>
                        <ExternalLink size={12} color="#667eea" />
                        <Text style={styles.linkText}>GitHub</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Achievements */}
          {extractedData.achievements && extractedData.achievements.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Achievements</Text>
              {extractedData.achievements.map((ach, idx) => (
                <View key={idx} style={styles.card}>
                  <Text style={styles.cardTitle}>{ach.title}</Text>
                  <Text style={styles.badge}>{ach.type}</Text>
                  {ach.issuer && <Text style={styles.cardSub}>Issued by: {ach.issuer}</Text>}
                  {ach.date && <Text style={styles.cardDate}>{ach.date}</Text>}
                </View>
              ))}
            </View>
          )}

          {/* Contact Links */}
          {extractedData.contactLinks && extractedData.contactLinks.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact Links</Text>
              <View style={styles.linkGrid}>
                {extractedData.contactLinks.map((link, idx) => (
                  <TouchableOpacity key={idx} style={styles.contactLink} onPress={() => openLink(link.url)}>
                    <Text style={styles.contactLinkText}>{link.type}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  uploadSection: {
    padding: 16,
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f4ff',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: '#667eea',
  },
  uploadText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
  },
  resultsSection: {
    padding: 16,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    padding: 10,
    borderRadius: 6,
    gap: 8,
    marginBottom: 12,
  },
  successText: {
    color: '#10b981',
    fontSize: 13,
    fontWeight: '600',
  },
  clearBtn: {
    backgroundColor: '#fee2e2',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 16,
  },
  clearText: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '600',
  },
  section: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 10,
  },
  item: {
    fontSize: 13,
    color: '#4b5563',
    marginBottom: 4,
  },
  card: {
    marginBottom: 12,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#667eea',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  cardSub: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 2,
  },
  cardDate: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 18,
    marginTop: 4,
  },
  salary: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
    marginTop: 4,
  },
  badge: {
    fontSize: 10,
    color: '#667eea',
    backgroundColor: '#eef2ff',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginVertical: 4,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  links: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  linkText: {
    fontSize: 11,
    color: '#667eea',
    fontWeight: '600',
  },
  linkGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  contactLink: {
    backgroundColor: '#667eea',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  contactLinkText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default DocumentedEntry;