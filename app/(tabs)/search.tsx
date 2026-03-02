import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColors } from '../../src/stores/themeStore';
import { useAppStore } from '../../src/stores/appStore';
import { SearchBar } from '../../src/components/common/SearchBar';
import { CategoryPills } from '../../src/components/common/CategoryPills';
import { ListingCard } from '../../src/components/listing/ListingCard';
import { Typography, Spacing } from '../../src/constants/theme';
import { CategorySlug } from '../../src/types';

export default function SearchScreen() {
  const colors = useColors();
  const router = useRouter();
  const { getFilteredListings, filters, setFilters } = useAppStore();
  const listings = getFilteredListings();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <FlatList
        data={listings}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={{ paddingHorizontal: Spacing.base, marginBottom: Spacing.sm, gap: Spacing.sm }}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <Text style={{ color: colors.textPrimary, fontSize: Typography.xl, fontWeight: '800', paddingHorizontal: Spacing.base, paddingTop: Spacing.md, paddingBottom: Spacing.base }}>Arama</Text>
            <View style={{ marginBottom: Spacing.base }}><SearchBar /></View>
            <View style={{ marginBottom: Spacing.base }}>
              <CategoryPills selected={filters.categorySlug} onSelect={(slug: CategorySlug | undefined) => setFilters({ categorySlug: slug })} />
            </View>
            <Text style={{ color: colors.textMuted, fontSize: Typography.sm, paddingHorizontal: Spacing.base, marginBottom: Spacing.md }}>{listings.length} sonuç</Text>
          </View>
        }
        renderItem={({ item }) => (
          <ListingCard listing={item} onPress={() => router.push(`/listing/${item.id}` as any)} style={{ flex: 1 }} />
        )}
      />
    </SafeAreaView>
  );
}
