import { useState, useCallback, useRef } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, RefreshControl,
  Dimensions, ScrollView, Modal, Switch, TextInput,
} from 'react-native';
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

const CAMPAIGNS = [
  {
    id: 'c1', emoji: '🏷️', tag: 'ÖNE ÇIKAN',
    title: 'Günün En İyi\nFırsatları',
    color: '#007A3D', categorySlug: undefined as CategorySlug | undefined,
    desc: 'Tüm kategorilerde günün öne çıkan ilanları',
  },
  {
    id: 'c2', emoji: '📱', tag: 'TEKNOLOJİ',
    title: 'Elektronik\nFırsatları',
    color: '#2ED573', categorySlug: 'elektronik' as CategorySlug,
    desc: 'Telefon, bilgisayar ve daha fazlası',
  },
  {
    id: 'c3', emoji: '🏠', tag: 'EMLAK',
    title: 'Kiralık & Satılık\nDaireler',
    color: '#4A9EFF', categorySlug: 'emlak' as CategorySlug,
    desc: 'Şehrin dört bir yanındaki ilanlar',
  },
  {
    id: 'c4', emoji: '🚗', tag: 'VASITA',
    title: 'Araç\nPazarı',
    color: '#FF9F43', categorySlug: 'vasita' as CategorySlug,
    desc: 'Sıfır ve ikinci el araçlar',
  },
];

function FilterModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const colors = useColors();
  const { filters, setFilters, resetFilters } = useAppStore();
  const [minPrice, setMinPrice] = useState(filters.minPrice?.toString() ?? '');
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice?.toString() ?? '');
  const [conditions, setConditions] = useState<string[]>(filters.condition ?? []);

  const CONDS = [
    { value: 'new', label: 'Sıfır' },
    { value: 'like-new', label: 'Sıfır Gibi' },
    { value: 'good', label: 'İyi' },
    { value: 'fair', label: 'Orta' },
    { value: 'poor', label: 'Kötü' },
  ];

  const SORTS = [
    { value: 'newest', label: 'En Yeni' },
    { value: 'price-asc', label: 'Fiyat (Artan)' },
    { value: 'price-desc', label: 'Fiyat (Azalan)' },
    { value: 'most-viewed', label: 'En Çok Görüntülenen' },
  ];

  const toggleCond = (v: string) => setConditions(prev => prev.includes(v) ? prev.filter(c => c !== v) : [...prev, v]);

  const apply = () => {
    setFilters({
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      condition: conditions.length ? conditions as any[] : undefined,
    });
    onClose();
  };

  const reset = () => { resetFilters(); setMinPrice(''); setMaxPrice(''); setConditions([]); onClose(); };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'bottom']}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <TouchableOpacity onPress={onClose} style={{ padding: 4, marginRight: Spacing.md }}>
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={{ flex: 1, color: colors.textPrimary, fontSize: Typography.lg, fontWeight: '700' }}>Filtrele</Text>
          <TouchableOpacity onPress={reset}>
            <Text style={{ color: colors.primary, fontSize: Typography.sm, fontWeight: '600' }}>Sıfırla</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ padding: Spacing.base, gap: Spacing.xl, paddingBottom: 100 }}>

          {/* Sıralama */}
          <View>
            <Text style={{ color: colors.textMuted, fontSize: Typography.xs, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: Spacing.md }}>Sıralama</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
              {SORTS.map(s => (
                <TouchableOpacity key={s.value} onPress={() => setFilters({ sortBy: s.value as any })}
                  style={{ paddingHorizontal: Spacing.md, paddingVertical: 10, borderRadius: Radius.full, borderWidth: 1.5, borderColor: filters.sortBy === s.value ? colors.primary : colors.border, backgroundColor: filters.sortBy === s.value ? `${colors.primary}15` : 'transparent' }}>
                  <Text style={{ color: filters.sortBy === s.value ? colors.primary : colors.textSecondary, fontSize: Typography.sm, fontWeight: filters.sortBy === s.value ? '700' : '500' }}>{s.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Fiyat */}
          <View>
            <Text style={{ color: colors.textMuted, fontSize: Typography.xs, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: Spacing.md }}>Fiyat Aralığı (₺)</Text>
            <View style={{ flexDirection: 'row', gap: Spacing.md }}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bgInput, borderRadius: Radius.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: Spacing.base, height: 52, gap: Spacing.sm }}>
                <Text style={{ color: colors.textMuted }}>₺</Text>
                <TextInput style={{ flex: 1, color: colors.textPrimary, fontSize: Typography.base, paddingVertical: 0 }}
                  value={minPrice} onChangeText={setMinPrice} placeholder="Min" placeholderTextColor={colors.textMuted} keyboardType="numeric" />
              </View>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bgInput, borderRadius: Radius.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: Spacing.base, height: 52, gap: Spacing.sm }}>
                <Text style={{ color: colors.textMuted }}>₺</Text>
                <TextInput style={{ flex: 1, color: colors.textPrimary, fontSize: Typography.base, paddingVertical: 0 }}
                  value={maxPrice} onChangeText={setMaxPrice} placeholder="Max" placeholderTextColor={colors.textMuted} keyboardType="numeric" />
              </View>
            </View>
          </View>

          {/* Durum */}
          <View>
            <Text style={{ color: colors.textMuted, fontSize: Typography.xs, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: Spacing.md }}>Ürün Durumu</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
              {CONDS.map(c => {
                const active = conditions.includes(c.value);
                return (
                  <TouchableOpacity key={c.value} onPress={() => toggleCond(c.value)}
                    style={{ paddingHorizontal: Spacing.md, paddingVertical: 10, borderRadius: Radius.full, borderWidth: 1.5, borderColor: active ? colors.primary : colors.border, backgroundColor: active ? `${colors.primary}15` : 'transparent' }}>
                    <Text style={{ color: active ? colors.primary : colors.textSecondary, fontSize: Typography.sm, fontWeight: active ? '700' : '500' }}>{c.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

        </ScrollView>

        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: Spacing.base, backgroundColor: colors.bg, borderTopWidth: 1, borderTopColor: colors.border }}>
          <TouchableOpacity onPress={apply} style={{ backgroundColor: colors.primary, borderRadius: Radius.lg, paddingVertical: 16, alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: Typography.base, fontWeight: '700' }}>Filtreleri Uygula</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const { currentUser, getFilteredListings, setFilters, filters } = useAppStore();
  const [refreshing, setRefreshing] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [activeCampaign, setActiveCampaign] = useState(CAMPAIGNS[0]);
  const listings = getFilteredListings();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  const handleCampaign = (campaign: typeof CAMPAIGNS[0]) => {
    setActiveCampaign(campaign);
    setFilters({ categorySlug: campaign.categorySlug });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <FilterModal visible={filterVisible} onClose={() => setFilterVisible(false)} />
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
              <TouchableOpacity onPress={() => router.push('/profile/notifications' as any)} style={{ position: 'relative', padding: 6 }}>
                <Ionicons name="notifications-outline" size={22} color={colors.textPrimary} />
                <View style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, borderWidth: 1.5, borderColor: colors.bg }} />
              </TouchableOpacity>
            </View>

            {/* Search */}
            <View style={{ marginBottom: Spacing.base }}>
              <SearchBar readOnly onFocus={() => router.push('/(tabs)/search')} onFilterPress={() => setFilterVisible(true)} />
            </View>

            {/* Kategori */}
            <View style={{ marginBottom: Spacing.base }}>
              <CategoryPills selected={filters.categorySlug} onSelect={(slug: CategorySlug | undefined) => setFilters({ categorySlug: slug })} />
            </View>

            {/* Kampanya Slider */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: Spacing.base, gap: Spacing.sm, paddingBottom: 4 }}
              style={{ marginBottom: Spacing.base }}>
              {CAMPAIGNS.map(camp => {
                const active = activeCampaign.id === camp.id;
                return (
                  <TouchableOpacity key={camp.id} onPress={() => handleCampaign(camp)}
                    style={{ width: width * 0.72, backgroundColor: colors.bgElevated, borderRadius: Radius.xl, borderWidth: 1.5, borderColor: active ? camp.color : colors.border, padding: Spacing.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: camp.color, fontSize: Typography.xs, fontWeight: '700', letterSpacing: 1, marginBottom: 6 }}>✦ {camp.tag}</Text>
                      <Text style={{ color: colors.textPrimary, fontSize: Typography.xl, fontWeight: '800', lineHeight: 28, marginBottom: Spacing.sm }}>{camp.title}</Text>
                      <TouchableOpacity onPress={() => handleCampaign(camp)} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Text style={{ color: camp.color, fontSize: Typography.sm, fontWeight: '600' }}>İlanları Gör</Text>
                        <Ionicons name="arrow-forward" size={14} color={camp.color} />
                      </TouchableOpacity>
                    </View>
                    <View style={{ width: 64, height: 64, backgroundColor: colors.bg, borderRadius: Radius.xl, alignItems: 'center', justifyContent: 'center', marginLeft: Spacing.base }}>
                      <Text style={{ fontSize: 32 }}>{camp.emoji}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Kampanya dots */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: Spacing.base }}>
              {CAMPAIGNS.map(c => (
                <View key={c.id} style={{ width: activeCampaign.id === c.id ? 16 : 6, height: 6, borderRadius: 3, backgroundColor: activeCampaign.id === c.id ? colors.primary : colors.border }} />
              ))}
            </View>

            {/* Bölüm başlığı */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.base, marginBottom: Spacing.md }}>
              <Text style={{ color: colors.textPrimary, fontSize: Typography.md, fontWeight: '700' }}>
                {filters.categorySlug ? `${listings.length} ilan bulundu` : 'Son İlanlar'}
              </Text>
              <TouchableOpacity onPress={() => setFilterVisible(true)} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Ionicons name="options-outline" size={16} color={colors.primary} />
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
            <Text style={{ color: colors.textMuted, fontSize: Typography.sm, textAlign: 'center', lineHeight: 20 }}>Farklı bir kategori veya filtre deneyebilirsiniz.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
