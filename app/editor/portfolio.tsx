import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useEffect, useState, useRef } from 'react';
import WebView from 'react-native-webview';
import { useAuth } from '@/contexts/AuthContext';
import { templateAPI,informationAPI } from '@/services/api';

interface Template {
  _id: string;
  name: string;
  structure: {
    html: string;
    css: string;
  };
}

export default function EditorPortfolioScreen() {
  const { templateId } = useLocalSearchParams<{ templateId?: string }>();
  const { user } = useAuth();

  const [template, setTemplate] = useState<Template | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [htmlContent, setHtmlContent] = useState<string>('');

  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    const fetchTemplateDetails = async () => {
      if (!templateId || !user) {
        setError('No template ID was provided.');
        setLoading(false);
        return;
      }

      try {
        const [templateResponse, profileResponse] = await Promise.all([
          // @ts-ignore
          templateAPI.getById(templateId),
          // @ts-ignore
          informationAPI.get(),
        ]);

        setTemplate(templateResponse.template);
        setUserProfile(profileResponse.information);
      } catch (err) {
        console.error('❌ Failed to fetch portfolio template:', err);
        setError('Could not load the template. Please go back and try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplateDetails();
  }, [templateId, user]);

  useEffect(() => {
    if (template && userProfile) {
      const finalHtml = generateFullHtml(template, userProfile);
      setHtmlContent(finalHtml);
    }
  }, [template, userProfile]);

  const escapeHtml = (text: string | undefined | null): string => {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const generateFullHtml = (templateData: Template, profileData: any) => {
    let html = templateData.structure.html;

    // --- Replace Personal Details ---
    const name = escapeHtml(profileData.personalDetails?.name);
    const location = escapeHtml(profileData.personalDetails?.location);
    const summary = escapeHtml(profileData.summary || 'A passionate developer building amazing things.');
    const professionalTitle = escapeHtml(profileData.experience?.[0]?.position || 'Full Stack Developer');

    html = html.replace(/MichaelScott\.dev/g, `${name.replace(/\s+/g, '')}.dev`);
    html = html.replace(/Hello, I'm <span class="text-accent">Michael Scott<\/span>/g, `Hello, I'm <span class="text-accent">${name}</span>`);
    html = html.replace(/Regional Manager of Full Stack Development \| Design Thinker \| World's Best Boss/g, professionalTitle);
    html = html.replace(/I am a passionate Full Stack Developer with over 5 years of experience building and deploying scalable web applications. My expertise lies in the MERN stack, complemented by a strong eye for UI\/UX design and commitment to clean, efficient code. I thrive in dynamic environments and love turning complex problems into simple, elegant digital solutions./g, summary);

    // --- Replace Experience Section ---
    if (profileData.experience && profileData.experience.length > 0) {
      const experienceHtml = profileData.experience.map((exp: any) => `
        <div class="sub-section-card">
            <h3 class="text-xl font-bold mb-1 text-primary-dark">${escapeHtml(exp.position)}</h3>
            <p class="text-accent font-medium">${escapeHtml(exp.company)} | ${escapeHtml(location)}</p>
            <p class="text-sm text-gray-500 mb-3">${escapeHtml(exp.startDate)} - ${escapeHtml(exp.endDate)}</p>
            <ul class="list-disc list-outside ml-5 space-y-1 text-gray-600 text-sm">
                ${exp.description ? `<li>${escapeHtml(exp.description)}</li>` : ''}
            </ul>
        </div>
      `).join('');
      const expRegex = /<section id="experience"[\s\S]*?<div class="space-y-6">[\s\S]*?<\/div>[\s\S]*?<\/section>/;
      html = html.replace(expRegex, `
        <section id="experience" class="section-card">
            <h2 class="section-title">Professional Experience</h2>
            <div class="space-y-6">${experienceHtml}</div>
        </section>
      `);
    }

    // --- Replace Projects Section ---
    if (profileData.projects && profileData.projects.length > 0) {
      const projectsHtml = profileData.projects.map((proj: any) => `
        <div class="project-card">
            <h3 class="text-xl font-bold mb-2 text-accent">${escapeHtml(proj.name)}</h3>
            <p class="text-gray-600 mb-4 text-sm">${escapeHtml(proj.description)}</p>
            ${proj.liveLink ? `<a href="${escapeHtml(proj.liveLink)}" class="btn-primary">Live Demo</a>` : ''}
            ${proj.githubLink ? `<a href="${escapeHtml(proj.githubLink)}" class="btn-primary ml-2">GitHub</a>` : ''}
        </div>
      `).join('');
      const projRegex = /<section id="projects"[\s\S]*?<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">[\s\S]*?<\/div>[\s\S]*?<\/section>/;
      html = html.replace(projRegex, `
        <section id="projects" class="section-card">
            <h2 class="section-title">Featured Projects</h2>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">${projectsHtml}</div>
        </section>
      `);
    }

    // --- Replace Education Section ---
    if (profileData.education && profileData.education.length > 0) {
      const educationHtml = profileData.education.map((edu: any) => `
        <div class="sub-section-card">
            <h3 class="text-xl font-bold mb-1 text-primary-dark">${escapeHtml(edu.degree)}</h3>
            <p class="text-accent font-medium">${escapeHtml(edu.institution)}</p>
            <p class="text-sm text-gray-500">${escapeHtml(edu.endDate)}</p>
        </div>
      `).join('');
      const eduRegex = /<section id="education"[\s\S]*?<div class="grid md:grid-cols-2 gap-6">[\s\S]*?<\/div>[\s\S]*?<\/section>/;
      html = html.replace(eduRegex, `
        <section id="education" class="section-card">
            <h2 class="section-title">Education</h2>
            <div class="grid md:grid-cols-2 gap-6">${educationHtml}</div>
        </section>
      `);
    }

    // --- Replace Contact Info ---
    html = html.replace(/<input type="email" placeholder="Your Email" required/g, `<input type="email" value="${escapeHtml(profileData.email)}" required`);

    return html;
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Building Your Portfolio...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: template?.name || 'Portfolio Preview' }} />
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : htmlContent ? (
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html: htmlContent }}
          style={styles.webview}
          javaScriptEnabled={true}
        />
      ) : (
        <Text style={styles.errorText}>Could not generate portfolio preview.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  webview: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
