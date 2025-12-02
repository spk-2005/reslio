// //editor/_layout.tsx

import { Stack } from 'expo-router';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React, { createContext, useContext, useState } from 'react';
import ResumeExportComponent from '@/components/ResumeExportComponent';

// --- Export Context Definition ---
interface ExportContextType {
  triggerExport: (() => void) | null;
  setTriggerExport: (func: (() => void) | null) => void;
}

const ExportContext = createContext<ExportContextType>({
  triggerExport: null,
  setTriggerExport: () => {},
});

export const useExportTrigger = () => useContext(ExportContext);

// --- CustomHeader Component (Consumes Context) ---
function CustomHeader() {
  const router = useRouter();
  const segments = useSegments(); 
  const currentRouteName = segments[segments.length - 1];
  const isResumeScreen = currentRouteName === 'resume';
  
  const { triggerExport } = useExportTrigger();

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      
      <View style={{ flex: 1 }} /> 

      {isResumeScreen && triggerExport && (
        <TouchableOpacity 
          style={styles.exportButton}
          onPress={triggerExport} // This function will now directly handle PDF creation/saving
        >
          <Ionicons name="download-outline" size={24} color="black" />
        </TouchableOpacity>
      )}
    </View>
  );
}

// --- EditorLayout Component (Provides Context) ---
export default function EditorLayout() {
  const [triggerExport, setTriggerExport] = useState<(() => void) | null>(null);

  return (
    <ExportContext.Provider value={{ triggerExport, setTriggerExport }}>
      <Stack
        screenOptions={{
          header: () => <CustomHeader />,
        }}
      >
        <Stack.Screen name="resume" 
          options={{ 
            title: '', 
          }} 
        />
        <Stack.Screen name="portfolio" />
      </Stack>
    </ExportContext.Provider>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    backgroundColor: '#ffffff', 
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  backButton: {
    padding: 8,
  },
  exportButton: {
    marginLeft: 16, 
    padding: 8,
  },
});