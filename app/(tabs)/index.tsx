import { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../src/stores/themeStore';
import { useAppStore } from '../../src/stores/appStore';
import { ListingCard } from '../../src/components/listing/ListingCard';
import { CategoryPills } from '../../src/components/common/CategoryPills';
import { SearchBar } from '../../src/components/common/SearchBar';
import { Typography, Spacing, Radius } from '../../src/constants/theme';
import { CategorySlug } from '../../src/types';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const { currentUser, getFilteredListings, setFilters, filters } = useAppStore();
  const [refreshing, setRefreshing] = useState(false);
  const listings = getFilteredListings();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <FlatList
        data={listings}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={{ paddingHorizontal: Spacing.base, marginBottom: Spacing.sm, gap: Spacing.sm }}
        contentContainerStyle={{ paddingBottom: Spacing['3xl'] }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        ListHeaderComponent={
          <View>
            {/* Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: Spacing.base, paddingTop: Spacing.md, paddingBottom: Spacing.base }}>
              <View>
                <Text style={{ color: colors.textPrimary, fontSize: Typography.lg, fontWeight: '700' }}>
                  Merhaba, {currentUser?.name.split(' ')[0]} 👋
                </Text>
                <Text style={{ color: colors.textMuted, fontSize: Typography.sm, marginTop: 2 }}>Ne arıyorsunuz bugün?</Text>
              </View>
              <TouchableOpacity style={{ position: 'relative', padding: 6 }}>
                <Ionicons name="notifications-outline" size={22} color={colors.textPrimary} />
                <View style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, borderWidth: 1.5, borderColor: colors.bg }} />
              </TouchableOpacity>
            </View>

            <View style={{ marginBottom: Spacing.base }}>
              <SearchBar readOnly onFocus={() => router.push('/(tabs)/search')} />
            </View>
            <View style={{ marginBottom: Spacing.base }}>
              <CategoryPills
                selected={filters.categorySlug}
                onSelect={(slug: CategorySlug | undefined) => setFilters({ categorySlug: slug })}
              />
            </View>

            {/* Banner */}
            <View style={{ marginHorizontal: Spacing.base, marginBottom: Spacing.base, backgroundColor: colors.bgElevated, borderRadius: Radius.xl, borderWidth: 1, borderColor: colors.border, padding: Spacing.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.primary, fontSize: Typography.xs, fontWeight: '700', letterSpacing: 1, marginBottom: 6 }}>✦ ÖNE ÇIKAN</Text>
                <Text style={{ color: colors.textPrimary, fontSize: Typography['2xl'], fontWeight: '800', lineHeight: 34, marginBottom: Spacing.md }}>Günün En İyi{'\n'}Fırsatları</Text>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Text style={{ color: colors.primary, fontSize: Typography.sm, fontWeight: '600' }}>Tümünü Gör</Text>
                  <Ionicons name="arrow-forward" size={14} color={colors.primary} />
                </TouchableOpacity>
              </View>
              <View style={{ width: 72, height: 72, backgroundColor: colors.bg, borderRadius: Radius.xl, alignItems: 'center', justifyContent: 'center', marginLeft: Spacing.base }}>
                <Text style={{ fontSize: 36 }}>🏷️</Text>
              </View>
            </View>

            {/* Bölüm başlığı */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.base, marginBottom: Spacing.md }}>
              <Text style={{ color: colors.textPrimary, fontSize: Typography.md, fontWeight: '700' }}>
                {filters.categorySlug ? `${listings.length} ilan bulundu` : 'Son İlanlar'}
              </Text>
              <TouchableOpacity>
                <Text style={{ color: colors.primary, fontSize: Typography.sm, fontWeight: '600' }}>Filtrele</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <ListingCard listing={item} onPress={() => router.push(`/listing/${item.id}` as any)} style={{ flex: 1 }} />
        )}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing['3xl'], paddingHorizontal: Spacing.xl }}>
            <Ionicons name="search-outline" size={48} color={colors.textMuted} />
            <Text style={{ color: colors.textPrimary, fontSize: Typography.lg, fontWeight: '700', marginTop: Spacing.base, marginBottom: Spacing.sm }}>İlan bulunamadı</Text>
            <Text style={{ color: colors.textMuted, fontSize: Typography.sm, textAlign: 'center', lineHeight: 20 }}>Farklı bir kategori veya arama deneyebilirsiniz.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
