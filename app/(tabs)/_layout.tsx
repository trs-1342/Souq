import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../src/stores/themeStore';
import { Radius } from '../../src/constants/theme';

function TabIcon({ name, focused, color, isCenter }: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  focused: boolean; color: string; isCenter?: boolean;
}) {
  const colors = useColors();
  if (isCenter) {
    return (
      <View style={[styles.centerTab, { backgroundColor: colors.primary, shadowColor: colors.primary }]}>
        <Ionicons name="add" size={28} color={colors.white} />
      </View>
    );
  }
  return (
    <View style={styles.iconWrapper}>
      <Ionicons name={name} size={24} color={color} />
      {focused && <View style={[styles.dot, { backgroundColor: color }]} />}
    </View>
  );
}

export default function TabLayout() {
  const colors = useColors();
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor: colors.tabBar, borderTopColor: colors.border, borderTopWidth: 1, height: Platform.OS === 'ios' ? 85 : 65, paddingBottom: Platform.OS === 'ios' ? 24 : 10, paddingTop: 10 },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textMuted,
      tabBarShowLabel: false,
    }}>
      <Tabs.Screen name="index" options={{ tabBarIcon: ({ focused, color }) => <TabIcon name={focused ? 'home' : 'home-outline'} focused={focused} color={color} /> }} />
      <Tabs.Screen name="search" options={{ tabBarIcon: ({ focused, color }) => <TabIcon name={focused ? 'search' : 'search-outline'} focused={focused} color={color} /> }} />
      <Tabs.Screen name="post" options={{ tabBarIcon: ({ focused, color }) => <TabIcon name="add" focused={focused} color={color} isCenter /> }} />
      <Tabs.Screen name="favorites" options={{ tabBarIcon: ({ focused, color }) => <TabIcon name={focused ? 'heart' : 'heart-outline'} focused={focused} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ tabBarIcon: ({ focused, color }) => <TabIcon name={focused ? 'person' : 'person-outline'} focused={focused} color={color} /> }} />
      {/* messages gizli tab — doğrudan navigasyonla açılır */}
      <Tabs.Screen name="messages" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrapper: { alignItems: 'center', gap: 4 },
  dot: { width: 4, height: 4, borderRadius: 2 },
  centerTab: { width: 58, height: 58, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center', marginTop: -22, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8 },
});
