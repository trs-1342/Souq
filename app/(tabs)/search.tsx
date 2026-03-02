import { useState, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  Image, ScrollView, Modal, Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../src/stores/themeStore';
import { useAppStore } from '../../src/stores/appStore';
import { CATEGORIES } from '../../src/constants/categories';
import { Typography, Spacing, Radius } from '../../src/constants/theme';
import { formatPrice, formatRelativeTime } from '../../src/utils/format';
import { CategorySlug, ListingCondition } from '../../src/types';

type Tab = 'listings' | 'users';

const CONDS: { value: ListingCondition; label: string }[] = [
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

export default function SearchScreen() {
  const colors = useColors();
  const router = useRouter();
  const { listings, allUsers, currentUser, filters, setFilters, resetFilters } = useAppStore();
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<Tab>('listings');
  const [filterModal, setFilterModal] = useState(false);

  // Filter state (local, applied on button press)
  const [localCategory, setLocalCategory] = useState<CategorySlug | undefined>(filters.categorySlug);
  const [localConditions, setLocalConditions] = useState<ListingCondition[]>(filters.condition ?? []);
  const [localMinPrice, setLocalMinPrice] = useState(filters.minPrice?.toString() ?? '');
  const [localMaxPrice, setLocalMaxPrice] = useState(filters.maxPrice?.toString() ?? '');
  const [localSort, setLocalSort] = useState(filters.sortBy ?? 'newest');

  const activeFilterCount = [
    localCategory,
    localConditions.length > 0,
    localMinPrice,
    localMaxPrice,
    localSort !== 'newest',
  ].filter(Boolean).length;

  // Filtered listings
  const filteredListings = useMemo(() => {
    const q = query.toLowerCase();
    return listings.filter(l => {
      if (l.status !== 'active') return false;
      if (q && !l.title.toLowerCase().includes(q) && !l.description.toLowerCase().includes(q)) return false;
      if (filters.categorySlug && l.categorySlug !== filters.categorySlug) return false;
      if (filters.condition?.length && !filters.condition.includes(l.condition)) return false;
      if (filters.minPrice !== undefined && l.price < filters.minPrice) return false;
      if (filters.maxPrice !== undefined && l.price > filters.maxPrice) return false;
      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'most-viewed': return b.viewCount - a.viewCount;
        default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [query, listings, filters]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allUsers
      .filter(u => u.id !== currentUser?.id)
      .filter(u =>
        u.name.toLowerCase().includes(q) ||
        (u.username ?? '').toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      )
      .slice(0, 20);
  }, [query, allUsers, currentUser]);

  const applyFilters = () => {
    setFilters({
      categorySlug: localCategory,
      condition: localConditions.length ? localConditions : undefined,
      minPrice: localMinPrice ? Number(localMinPrice) : undefined,
      maxPrice: localMaxPrice ? Number(localMaxPrice) : undefined,
      sortBy: localSort as any,
    });
    setFilterModal(false);
  };

  const resetAll = () => {
    setLocalCategory(undefined);
    setLocalConditions([]);
    setLocalMinPrice('');
    setLocalMaxPrice('');
    setLocalSort('newest');
    resetFilters();
    setFilterModal(false);
  };

  const toggleCond = (c: ListingCondition) =>
    setLocalConditions(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      {/* Filter Modal */}
      <Modal visible={filterModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setFilterModal(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'bottom']}>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}>
            <TouchableOpacity onPress={() => setFilterModal(false)} style={{ padding: 4, marginRight: Spacing.md }}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={{ flex: 1, color: colors.textPrimary, fontSize: Typography.lg, fontWeight: '700' }}>Filtrele & Sırala</Text>
            <TouchableOpacity onPress={resetAll}>
              <Text style={{ color: colors.primary, fontSize: Typography.sm, fontWeight: '600' }}>Sıfırla</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ padding: Spacing.base, gap: Spacing.xl, paddingBottom: 120 }} keyboardShouldPersistTaps="handled">
            {/* Sıralama */}
            <View>
              <Text style={{ color: colors.textMuted, fontSize: Typography.xs, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: Spacing.md }}>Sıralama</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
                {SORTS.map(s => {
                  const active = localSort === s.value;
                  return (
                    <TouchableOpacity key={s.value} onPress={() => setLocalSort(s.value)}
                      style={{ paddingHorizontal: Spacing.md, paddingVertical: 10, borderRadius: Radius.full, borderWidth: 1.5, borderColor: active ? colors.primary : colors.border, backgroundColor: active ? `${colors.primary}15` : 'transparent' }}>
                      <Text style={{ color: active ? colors.primary : colors.textSecondary, fontSize: Typography.sm, fontWeight: active ? '700' : '500' }}>{s.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Kategori */}
            <View>
              <Text style={{ color: colors.textMuted, fontSize: Typography.xs, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: Spacing.md }}>Kategori</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: Spacing.sm }}>
                <TouchableOpacity onPress={() => setLocalCategory(undefined)}
                  style={{ paddingHorizontal: Spacing.md, paddingVertical: 10, borderRadius: Radius.full, borderWidth: 1.5, borderColor: !localCategory ? colors.primary : colors.border, backgroundColor: !localCategory ? `${colors.primary}15` : 'transparent' }}>
                  <Text style={{ color: !localCategory ? colors.primary : colors.textSecondary, fontSize: Typography.sm, fontWeight: !localCategory ? '700' : '500' }}>Tümü</Text>
                </TouchableOpacity>
                {CATEGORIES.map(cat => {
                  const active = localCategory === cat.slug;
                  return (
                    <TouchableOpacity key={cat.slug} onPress={() => setLocalCategory(cat.slug)}
                      style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: Spacing.md, paddingVertical: 10, borderRadius: Radius.full, borderWidth: 1.5, borderColor: active ? cat.color : colors.border, backgroundColor: active ? `${cat.color}15` : 'transparent' }}>
                      <Ionicons name={cat.icon as any} size={14} color={active ? cat.color : colors.textMuted} />
                      <Text style={{ color: active ? cat.color : colors.textSecondary, fontSize: Typography.sm, fontWeight: active ? '700' : '500' }}>{cat.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Fiyat Aralığı */}
            <View>
              <Text style={{ color: colors.textMuted, fontSize: Typography.xs, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: Spacing.md }}>Fiyat Aralığı (₺)</Text>
              <View style={{ flexDirection: 'row', gap: Spacing.md }}>
                {[
                  { label: 'Min', value: localMinPrice, set: setLocalMinPrice },
                  { label: 'Max', value: localMaxPrice, set: setLocalMaxPrice },
                ].map(field => (
                  <View key={field.label} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bgInput, borderRadius: Radius.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: Spacing.base, height: 52, gap: Spacing.sm }}>
                    <Text style={{ color: colors.textMuted }}>₺</Text>
                    <TextInput style={{ flex: 1, color: colors.textPrimary, fontSize: Typography.base, paddingVertical: 0 }}
                      value={field.value} onChangeText={v => field.set(v.replace(/[^0-9]/g, ''))}
                      placeholder={field.label} placeholderTextColor={colors.textMuted} keyboardType="numeric" />
                  </View>
                ))}
              </View>
            </View>

            {/* Durum */}
            <View>
              <Text style={{ color: colors.textMuted, fontSize: Typography.xs, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: Spacing.md }}>Ürün Durumu</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
                {CONDS.map(c => {
                  const active = localConditions.includes(c.value);
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
            <TouchableOpacity onPress={applyFilters}
              style={{ backgroundColor: colors.primary, borderRadius: Radius.lg, paddingVertical: 16, alignItems: 'center' }}>
              <Text style={{ color: '#fff', fontSize: Typography.base, fontWeight: '700' }}>Filtreleri Uygula</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Search Bar */}
      <View style={{ paddingHorizontal: Spacing.base, paddingTop: Spacing.md, paddingBottom: Spacing.sm }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bgInput, borderRadius: Radius.lg, borderWidth: 1, borderColor: colors.border, paddingHorizontal: Spacing.md, height: 48, gap: Spacing.sm }}>
            <Ionicons name="search" size={18} color={colors.textMuted} />
            <TextInput
              style={{ flex: 1, color: colors.textPrimary, fontSize: Typography.base, paddingVertical: 0 }}
              value={query} onChangeText={setQuery}
              placeholder={tab === 'listings' ? 'İlan ara...' : 'Kullanıcı ara...'}
              placeholderTextColor={colors.textMuted}
              autoFocus returnKeyType="search" autoCorrect={false}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')}>
                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity onPress={() => setFilterModal(true)}
            style={{ position: 'relative', width: 48, height: 48, borderRadius: Radius.lg, backgroundColor: activeFilterCount > 0 ? `${colors.primary}15` : colors.bgInput, borderWidth: 1, borderColor: activeFilterCount > 0 ? colors.primary : colors.border, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="options-outline" size={20} color={activeFilterCount > 0 ? colors.primary : colors.textSecondary} />
            {activeFilterCount > 0 && (
              <View style={{ position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: 9, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 10, fontWeight: '800' }}>{activeFilterCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={{ flexDirection: 'row', marginTop: Spacing.md, backgroundColor: colors.bgElevated, borderRadius: Radius.lg, padding: 3 }}>
          {([
            { key: 'listings', label: 'İlanlar', count: filteredListings.length },
            { key: 'users', label: 'Kullanıcılar', count: filteredUsers.length },
          ] as { key: Tab; label: string; count: number }[]).map(t => (
            <TouchableOpacity key={t.key} onPress={() => setTab(t.key)}
              style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: Radius.md, backgroundColor: tab === t.key ? colors.bgCard : 'transparent' }}>
              <Text style={{ color: tab === t.key ? colors.textPrimary : colors.textMuted, fontSize: Typography.sm, fontWeight: tab === t.key ? '700' : '500' }}>{t.label}</Text>
              {query.length > 0 && (
                <View style={{ backgroundColor: tab === t.key ? colors.primary : colors.bgElevated, paddingHorizontal: 7, paddingVertical: 2, borderRadius: Radius.full, minWidth: 20, alignItems: 'center' }}>
                  <Text style={{ color: tab === t.key ? '#fff' : colors.textMuted, fontSize: 10, fontWeight: '700' }}>{t.count}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Content */}
      {tab === 'listings' ? (
        <FlatList
          data={filteredListings}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: Spacing.base, gap: Spacing.sm, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View style={{ alignItems: 'center', paddingVertical: 60, gap: Spacing.md }}>
              <Ionicons name="search-outline" size={56} color={colors.textMuted} />
              <Text style={{ color: colors.textPrimary, fontSize: Typography.lg, fontWeight: '700' }}>
                {query ? 'İlan bulunamadı' : 'Aramaya başlayın'}
              </Text>
              <Text style={{ color: colors.textMuted, fontSize: Typography.sm, textAlign: 'center' }}>
                {query ? 'Farklı anahtar kelimeler veya filtreler deneyin.' : 'Başlık veya açıklama ile arama yapabilirsiniz.'}
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const cat = CATEGORIES.find(c => c.slug === item.categorySlug);
            return (
              <TouchableOpacity onPress={() => router.push(`/listing/${item.id}` as any)}
                style={{ flexDirection: 'row', gap: Spacing.md, backgroundColor: colors.bgCard, borderRadius: Radius.lg, borderWidth: 1, borderColor: colors.border, padding: Spacing.md, overflow: 'hidden' }}>
                <View style={{ width: 90, height: 90, borderRadius: Radius.md, overflow: 'hidden', backgroundColor: colors.bgElevated, flexShrink: 0 }}>
                  {item.images[0]
                    ? <Image source={{ uri: item.images[0].uri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                    : <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Ionicons name="image-outline" size={28} color={colors.textMuted} /></View>
                  }
                </View>
                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                  <Text style={{ color: colors.textPrimary, fontSize: Typography.base, fontWeight: '600', lineHeight: 20 }} numberOfLines={2}>{item.title}</Text>
                  <Text style={{ color: colors.primary, fontSize: Typography.md, fontWeight: '700' }}>
                    {item.priceType === 'free' ? 'Ücretsiz' : item.priceType === 'swap' ? 'Takas' : formatPrice(item.price, item.currency)}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
                    {cat && (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: `${cat.color}15`, paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full }}>
                        <Ionicons name={cat.icon as any} size={11} color={cat.color} />
                        <Text style={{ color: cat.color, fontSize: 11, fontWeight: '600' }}>{cat.label}</Text>
                      </View>
                    )}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                      <Ionicons name="location-outline" size={11} color={colors.textMuted} />
                      <Text style={{ color: colors.textMuted, fontSize: 11 }}>{item.location.district}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: Spacing.base, gap: Spacing.sm, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View style={{ alignItems: 'center', paddingVertical: 60, gap: Spacing.md }}>
              <Ionicons name="people-outline" size={56} color={colors.textMuted} />
              <Text style={{ color: colors.textPrimary, fontSize: Typography.lg, fontWeight: '700' }}>
                {query ? 'Kullanıcı bulunamadı' : 'Kullanıcı arayın'}
              </Text>
              <Text style={{ color: colors.textMuted, fontSize: Typography.sm, textAlign: 'center' }}>
                İsim veya kullanıcı adı ile arama yapabilirsiniz.
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const initials = item.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
            const userListings = listings.filter(l => l.userId === item.id && l.status === 'active');
            return (
              <TouchableOpacity onPress={() => router.push(`/user/${item.id}` as any)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: colors.bgCard, borderRadius: Radius.xl, borderWidth: 1, borderColor: colors.border, padding: Spacing.base }}>
                <View style={{ position: 'relative' }}>
                  <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#fff', fontSize: Typography.lg, fontWeight: '800' }}>{initials}</Text>
                  </View>
                  {item.isVerified && (
                    <View style={{ position: 'absolute', bottom: 0, right: 0, width: 18, height: 18, borderRadius: 9, backgroundColor: '#007A3D', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.bgCard }}>
                      <Ionicons name="checkmark" size={9} color="#fff" />
                    </View>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.textPrimary, fontSize: Typography.base, fontWeight: '700' }}>{item.name}</Text>
                  {item.username && <Text style={{ color: colors.primary, fontSize: Typography.xs, fontWeight: '600' }}>@{item.username}</Text>}
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginTop: 4 }}>
                    {item.rating > 0 && (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                        <Ionicons name="star" size={12} color="#FFD700" />
                        <Text style={{ color: colors.textMuted, fontSize: Typography.xs }}>{item.rating.toFixed(1)}</Text>
                      </View>
                    )}
                    <Text style={{ color: colors.textMuted, fontSize: Typography.xs }}>{userListings.length} aktif ilan</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}
