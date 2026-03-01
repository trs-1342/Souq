import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../../src/constants/theme';
import { useAppStore } from '../../src/stores/appStore';
import { ListingCard } from '../../src/components/listing/ListingCard';
import { CategoryPills } from '../../src/components/common/CategoryPills';
import { SearchBar } from '../../src/components/common/SearchBar';
import { CategorySlug } from '../../src/types';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { currentUser, getFilteredListings, setFilters, filters } = useAppStore();
  const [refreshing, setRefreshing] = useState(false);

  const listings = getFilteredListings();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleCategorySelect = (slug: CategorySlug | undefined) => {
    setFilters({ categorySlug: slug });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
        ListHeaderComponent={
          <View>
            {/* Header */}
            <View style={styles.header}>
              <View>
                <Text style={styles.greeting}>
                  Merhaba, {currentUser?.name.split(' ')[0]} 👋
                </Text>
                <Text style={styles.subtitle}>Ne arıyorsunuz bugün?</Text>
              </View>
              <TouchableOpacity style={styles.notifBtn} onPress={() => {}}>
                <Ionicons name="notifications-outline" size={22} color={Colors.textPrimary} />
                {/* Bildirim noktası */}
                <View style={styles.notifDot} />
              </TouchableOpacity>
            </View>

            {/* Arama */}
            <View style={styles.searchWrapper}>
              <SearchBar
                readOnly
                onFocus={() => router.push('/(tabs)/search')}
              />
            </View>

            {/* Kategoriler */}
            <View style={styles.categoryWrapper}>
              <CategoryPills
                selected={filters.categorySlug}
                onSelect={handleCategorySelect}
              />
            </View>

            {/* Öne Çıkan Banner */}
            <View style={styles.banner}>
              <View style={styles.bannerContent}>
                <Text style={styles.bannerTag}>✦ ÖNE ÇIKAN</Text>
                <Text style={styles.bannerTitle}>Günün En İyi{'\n'}Fırsatları</Text>
                <TouchableOpacity style={styles.bannerBtn}>
                  <Text style={styles.bannerBtnText}>Tümünü Gör</Text>
                  <Ionicons name="arrow-forward" size={14} color={Colors.primary} />
                </TouchableOpacity>
              </View>
              <View style={styles.bannerDecor}>
                <Text style={styles.bannerEmoji}>🏷️</Text>
              </View>
            </View>

            {/* Bölüm başlığı */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {filters.categorySlug
                  ? `${listings.length} ilan bulundu`
                  : 'Son İlanlar'}
              </Text>
              <TouchableOpacity onPress={() => {}}>
                <Text style={styles.sectionLink}>Filtrele</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        renderItem={({ item, index }) => (
          <ListingCard
            listing={item}
            onPress={() => router.push(`/listing/${item.id}` as any)}
            style={index % 2 === 0 ? { marginRight: Spacing.sm / 2 } : { marginLeft: Spacing.sm / 2 }}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>İlan bulunamadı</Text>
            <Text style={styles.emptyText}>Farklı bir kategori veya arama deneyebilirsiniz.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  listContent: {
    paddingBottom: Spacing['3xl'],
  },
  row: {
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.base,
  },
  greeting: {
    color: Colors.textPrimary,
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: Typography.sm,
    marginTop: 2,
  },
  notifBtn: {
    position: 'relative',
    padding: 6,
  },
  notifDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    borderWidth: 1.5,
    borderColor: Colors.bg,
  },
  searchWrapper: {
    marginBottom: Spacing.base,
  },
  categoryWrapper: {
    marginBottom: Spacing.base,
  },
  // Banner
  banner: {
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.base,
    backgroundColor: Colors.bgElevated,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
  },
  bannerContent: {
    flex: 1,
  },
  bannerTag: {
    color: Colors.primary,
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    letterSpacing: 1,
    marginBottom: 6,
  },
  bannerTitle: {
    color: Colors.textPrimary,
    fontSize: Typography['2xl'],
    fontWeight: Typography.heavy,
    lineHeight: 34,
    marginBottom: Spacing.md,
  },
  bannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bannerBtnText: {
    color: Colors.primary,
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
  },
  bannerDecor: {
    width: 72,
    height: 72,
    backgroundColor: Colors.bg,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.base,
  },
  bannerEmoji: {
    fontSize: 36,
  },
  // Section
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.md,
    fontWeight: Typography.bold,
  },
  sectionLink: {
    color: Colors.primary,
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
  },
  // Empty
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['3xl'],
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    marginTop: Spacing.base,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: Typography.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
});
