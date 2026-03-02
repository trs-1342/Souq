import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../src/stores/themeStore';
import { useAppStore } from '../../src/stores/appStore';
import { Typography, Spacing, Radius } from '../../src/constants/theme';
import { formatPrice, formatRelativeTime, conditionLabels } from '../../src/utils/format';
import { Listing } from '../../src/types';

export default function MyListingsScreen() {
  const colors = useColors();
  const router = useRouter();
  const { listings, currentUser } = useAppStore();
  const myListings = listings.filter(l => l.userId === currentUser?.id);

  const statusLabel: Record<string, { label: string; color: string }> = {
    active: { label: 'Yayında', color: colors.secondary },
    sold: { label: 'Satıldı', color: colors.textMuted },
    pending: { label: 'Beklemede', color: colors.warning },
    inactive: { label: 'Pasif', color: colors.error },
  };

  const renderItem = ({ item }: { item: Listing }) => {
    const status = statusLabel[item.status] ?? statusLabel.active;
    return (
      <TouchableOpacity
        onPress={() => router.push(`/listing/${item.id}` as any)}
        style={{ flexDirection: 'row', gap: Spacing.md, backgroundColor: colors.bgCard, borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, borderColor: colors.border }}>
        <View style={{ width: 80, height: 80, borderRadius: Radius.md, overflow: 'hidden', backgroundColor: colors.bgElevated }}>
          {item.images[0]
            ? <Image source={{ uri: item.images[0].uri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            : <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Ionicons name="image-outline" size={28} color={colors.textMuted} /></View>
          }
        </View>
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          <Text style={{ color: colors.textPrimary, fontSize: Typography.base, fontWeight: '600' }} numberOfLines={2}>{item.title}</Text>
          <Text style={{ color: colors.primary, fontSize: Typography.md, fontWeight: '700' }}>
            {item.priceType === 'free' ? 'Ücretsiz' : item.priceType === 'swap' ? 'Takas' : formatPrice(item.price, item.currency)}
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: status.color }} />
              <Text style={{ color: status.color, fontSize: Typography.xs, fontWeight: '600' }}>{status.label}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: Spacing.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                <Ionicons name="eye-outline" size={13} color={colors.textMuted} />
                <Text style={{ color: colors.textMuted, fontSize: Typography.xs }}>{item.viewCount}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                <Ionicons name="heart-outline" size={13} color={colors.textMuted} />
                <Text style={{ color: colors.textMuted, fontSize: Typography.xs }}>{item.favoriteCount}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4, marginRight: Spacing.md }}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={{ flex: 1, color: colors.textPrimary, fontSize: Typography.lg, fontWeight: '700' }}>İlanlarım</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/post')} style={{ backgroundColor: colors.primary, paddingHorizontal: Spacing.md, paddingVertical: 8, borderRadius: Radius.full, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Ionicons name="add" size={16} color="#fff" />
          <Text style={{ color: '#fff', fontSize: Typography.sm, fontWeight: '700' }}>Yeni</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={myListings}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: Spacing.base, paddingBottom: 40 }}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingVertical: 80, gap: Spacing.lg }}>
            <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: colors.bgElevated, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="list-outline" size={32} color={colors.textMuted} />
            </View>
            <Text style={{ color: colors.textPrimary, fontSize: Typography.lg, fontWeight: '700' }}>Henüz ilanın yok</Text>
            <Text style={{ color: colors.textMuted, fontSize: Typography.sm, textAlign: 'center' }}>İlk ilanını oluşturarak satmaya başla.</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/post')} style={{ backgroundColor: colors.primary, paddingHorizontal: Spacing.xl, paddingVertical: 14, borderRadius: Radius.full }}>
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: Typography.base }}>İlan Ver</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}
