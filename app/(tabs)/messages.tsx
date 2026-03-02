import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useNavigation } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../src/stores/themeStore';
import { Typography, Spacing } from '../../src/constants/theme';

export default function MessagesScreen() {
  const colors = useColors();
  const navigation = useNavigation();
  const canGoBack = navigation.canGoBack();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        {canGoBack && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4, marginRight: Spacing.md }}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        )}
        <Text style={{ flex: 1, color: colors.textPrimary, fontSize: Typography.xl, fontWeight: '800' }}>Mesajlar</Text>
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing['2xl'], gap: Spacing.md }}>
        <Ionicons name="chatbubbles-outline" size={64} color={colors.textMuted} />
        <Text style={{ color: colors.textPrimary, fontSize: Typography.lg, fontWeight: '700', textAlign: 'center' }}>Henüz mesajınız yok</Text>
        <Text style={{ color: colors.textMuted, fontSize: Typography.sm, textAlign: 'center', lineHeight: 22 }}>
          Bir ilanla ilgilendiğinizde satıcıyla buradan iletişime geçebilirsiniz.
        </Text>
      </View>
    </SafeAreaView>
  );
}
