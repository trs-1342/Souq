import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../src/stores/themeStore';
import { useAppStore } from '../../src/stores/appStore';
import { ListingCard } from '../../src/components/listing/ListingCard';
import { Typography, Spacing } from '../../src/constants/theme';

export default function FavoritesScreen() {
  const colors = useColors();
  const router = useRouter();
  const { getFavoriteListings } = useAppStore();
  const favorites = getFavoriteListings();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <FlatList
        data={favorites}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={{ paddingHorizontal: Spacing.base, marginBottom: Spacing.sm, gap: Spacing.sm }}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={{ paddingHorizontal: Spacing.base, paddingTop: Spacing.md, paddingBottom: Spacing.base }}>
            <Text style={{ color: colors.textPrimary, fontSize: Typography.xl, fontWeight: '800' }}>
              Favorilerim
            </Text>
            {favorites.length > 0 && (
              <Text style={{ color: colors.textMuted, fontSize: Typography.sm, marginTop: 4 }}>
                {favorites.length} ilan kaydedildi
              </Text>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <ListingCard listing={item} onPress={() => router.push(`/listing/${item.id}` as any)} style={{ flex: 1 }} />
        )}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 80, paddingHorizontal: Spacing['2xl'] }}>
            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: colors.bgElevated, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xl }}>
              <Ionicons name="heart-outline" size={36} color={colors.textMuted} />
            </View>
            <Text style={{ color: colors.textPrimary, fontSize: Typography.lg, fontWeight: '700', textAlign: 'center', marginBottom: Spacing.sm }}>
              Henüz favori yok
            </Text>
            <Text style={{ color: colors.textMuted, fontSize: Typography.sm, textAlign: 'center', lineHeight: 22, marginBottom: Spacing.xl }}>
              Beğendiğin ilanlardaki kalp ikonuna basarak buraya ekleyebilirsin.
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)')}
              style={{ backgroundColor: colors.primary, paddingHorizontal: Spacing.xl, paddingVertical: 14, borderRadius: 999 }}>
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: Typography.base }}>İlanları Keşfet</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}
