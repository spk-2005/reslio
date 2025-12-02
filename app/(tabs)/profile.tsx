// app/(tabs)/profile.tsx

import React from 'react';
import { Stack } from 'expo-router';
import UserInformation from '../../components/UserInformation';

export default function ProfileContainer() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <UserInformation />
    </>
  );
}