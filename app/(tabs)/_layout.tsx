
//app/(tabs)/_layout.tsx

import { Tabs } from 'expo-router';
import { Home, FileText, Briefcase, User } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#667eea',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="resume"
        options={{
          title: 'Resume',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <FileText color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="portfolio"
        options={{
          title: 'Portfolio',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <Briefcase color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}