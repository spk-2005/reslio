import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';

export default function EditorResumeScreen() {
  const { templateId } = useLocalSearchParams<{ templateId?: string }>();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: 'Resume Editor' }} />
      <Text style={styles.title}>Resume Editor</Text>
      <Text style={styles.subtitle}>Template ID: {templateId ?? 'N/A'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
  },
});
