import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAppStore } from '../src/stores/appStore';
import { useColors } from '../src/stores/themeStore';

function AuthGate() {
  const { isAuthenticated } = useAppStore();
  const segments = useSegments();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => { setReady(true); }, []);

  useEffect(() => {
    if (!ready) return;
    const inAuth = segments[0] === '(auth)';
    if (!isAuthenticated && !inAuth) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuth) {
      router.replace('/(tabs)');
    }
  }, [ready, isAuthenticated, segments]);

  return null;
}

export default function RootLayout() {
  const colors = useColors();

  return (
    <>
      <StatusBar style={colors.statusBar} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg }, animation: 'slide_from_right' }}>
        {/* Auth ekranları — geri gesture tamamen kapalı */}
        <Stack.Screen name="(auth)" options={{ gestureEnabled: false, animation: 'none' }} />
        {/* Ana ekranlar */}
        <Stack.Screen name="(tabs)" options={{ gestureEnabled: false, animation: 'none' }} />
        <Stack.Screen name="listing/[id]" options={{ gestureEnabled: true, animation: 'slide_from_right' }} />
        <Stack.Screen name="listing/edit" options={{ gestureEnabled: true, animation: 'slide_from_right' }} />
        <Stack.Screen name="profile/edit" options={{ gestureEnabled: true, animation: 'slide_from_right' }} />
        <Stack.Screen name="profile/listings" options={{ gestureEnabled: true, animation: 'slide_from_right' }} />
        <Stack.Screen name="profile/notifications" options={{ gestureEnabled: true, animation: 'slide_from_right' }} />
        <Stack.Screen name="profile/security" options={{ gestureEnabled: true, animation: 'slide_from_right' }} />
        <Stack.Screen name="profile/payment" options={{ gestureEnabled: true, animation: 'slide_from_right' }} />
        <Stack.Screen name="profile/help" options={{ gestureEnabled: true, animation: 'slide_from_right' }} />
        <Stack.Screen name="profile/contact" options={{ gestureEnabled: true, animation: 'slide_from_right' }} />
        <Stack.Screen name="profile/privacy" options={{ gestureEnabled: true, animation: 'slide_from_right' }} />
        <Stack.Screen name="profile/about" options={{ gestureEnabled: true, animation: 'slide_from_right' }} />
        {/*<Stack.Screen name="profile/settings" options={{ gestureEnabled: true, animation: 'slide_from_right' }} />*/}
        <Stack.Screen name="user/[id]" options={{ gestureEnabled: true, animation: 'slide_from_right' }} />
      </Stack>
      <AuthGate />
    </>
  );
}
