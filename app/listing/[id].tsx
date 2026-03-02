import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Share, Dimensions, Alert, ActionSheetIOS, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../src/stores/themeStore';
import { useAppStore } from '../../src/stores/appStore';
import { Typography, Spacing, Radius } from '../../src/constants/theme';
import { formatPrice, formatRelativeTime } from '../../src/utils/format';
import { ListingStatus } from '../../src/types';

const { width } = Dimensions.get('window');

const STATUS_CONFIG: Record<ListingStatus, { label: string; color: string; icon: string }> = {
  active: { label: 'Yayında', color: '#007A3D', icon: 'checkmark-circle' },
  sold: { label: 'Satıldı', color: '#636E72', icon: 'bag-check' },
  'out-of-stock': { label: 'Stok Bitti', color: '#FF9F43', icon: 'alert-circle' },
  archived: { label: 'Arşivlendi', color: '#A0A0B0', icon: 'archive' },
  inactive: { label: 'Pasif', color: '#A0A0B0', icon: 'eye-off' },
};

const CF_LABELS: Record<string, string> = {
  squareMeters: 'Metrekare', roomCount: 'Oda', floor: 'Kat', floorCount: 'Bina Katı',
  buildingAge: 'Bina Yaşı', heatingType: 'Isıtma', hasElevator: 'Asansör', hasParking: 'Otopark',
  brand: 'Marka', vehicleModel: 'Model', year: 'Yıl', mileage: 'KM', fuelType: 'Yakıt',
  gearType: 'Vites', bodyType: 'Kasa', storageCapacity: 'Depolama', color: 'Renk',
  warrantyStatus: 'Garanti', size: 'Beden', gender: 'Cinsiyet', sportType: 'Spor Dalı',
};

export default function ListingDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const router = useRouter();
  const { listings, currentUser, toggleFavorite, isFavorite, updateListing, deleteListing, getUserById } = useAppStore();
  const [imgIndex, setImgIndex] = useState(0);

  const listing = listings.find(l => l.id === id);
  const isOwner = listing?.userId === currentUser?.id;
  const seller = listing ? getUserById(listing.userId) : undefined;
  const fav = listing ? isFavorite(listing.id) : false;

  useEffect(() => {
    if (listing && !isOwner) updateListing(listing.id, { viewCount: listing.viewCount + 1 });
  }, [id]);

  if (!listing) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.textMuted} />
        <Text style={{ color: colors.textMuted, marginTop: Spacing.md, fontSize: Typography.base }}>İlan bulunamadı.</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: Spacing.xl }}>
          <Text style={{ color: colors.primary, fontSize: Typography.base }}>Geri Dön</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const statusCfg = STATUS_CONFIG[listing.status];
  const conditionLabel: Record<string, string> = { new: 'Sıfır', 'like-new': 'Sıfır Gibi', good: 'İyi', fair: 'Orta', poor: 'Kötü' };
  const cfEntries = listing.categoryFields
    ? Object.entries(listing.categoryFields).filter(([, v]) => v !== undefined && v !== null && v !== '')
    : [];

  const handleShare = async () => {
    try { await Share.share({ message: `${listing.title} - Souq'da gör!` }); } catch {}
  };

  const handleOwnerActions = () => {
    const isArchived = listing.status === 'archived';
    const opts = ['Düzenle', isArchived ? 'Arşivden Çıkar' : 'Arşivle', 'Satıldı İşaretle', 'Stok Bitti', 'Pasif Yap', 'İlanı Sil', 'İptal'];
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions({ options: opts, destructiveButtonIndex: 5, cancelButtonIndex: 6 }, doAction);
    } else {
      Alert.alert('İlan İşlemleri', '', [
        { text: 'Düzenle', onPress: () => doAction(0) },
        { text: opts[1], onPress: () => doAction(1) },
        { text: 'Satıldı İşaretle', onPress: () => doAction(2) },
        { text: 'Stok Bitti', onPress: () => doAction(3) },
        { text: 'Pasif Yap', onPress: () => doAction(4) },
        { text: 'İlanı Sil', style: 'destructive', onPress: () => doAction(5) },
        { text: 'İptal', style: 'cancel' },
      ]);
    }
  };

  const doAction = (idx: number) => {
    const isArchived = listing.status === 'archived';
    switch (idx) {
      case 0: router.push(`/listing/edit?id=${listing.id}` as any); break;
      case 1:
        updateListing(listing.id, { status: isArchived ? 'active' : 'archived' });
        Alert.alert('Güncellendi', isArchived ? 'İlan tekrar yayına alındı.' : 'İlan arşivlendi, sadece siz görebilirsiniz.');
        break;
      case 2:
        Alert.alert('Satıldı?', 'İlanı satıldı olarak işaretlemek istiyor musunuz?', [
          { text: 'İptal', style: 'cancel' },
          { text: 'Evet', onPress: () => { updateListing(listing.id, { status: 'sold' }); Alert.alert('🎉 Tebrikler!', 'İlanınız satıldı olarak işaretlendi.'); } },
        ]);
        break;
      case 3: updateListing(listing.id, { status: 'out-of-stock' }); Alert.alert('Güncellendi', 'Stok bitti olarak işaretlendi.'); break;
      case 4: updateListing(listing.id, { status: 'inactive' }); Alert.alert('Güncellendi', 'İlan pasife alındı.'); break;
      case 5:
        Alert.alert('İlanı Sil', 'Bu ilanı kalıcı olarak silmek istiyor musunuz?', [
          { text: 'İptal', style: 'cancel' },
          { text: 'Sil', style: 'destructive', onPress: () => { deleteListing(listing.id); router.replace('/(tabs)'); } },
        ]);
        break;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      {/* Header */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm }}>
                <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/");
            }
          }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.bgElevated,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
          <TouchableOpacity onPress={handleShare} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.bgElevated, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="share-outline" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleFavorite(listing.id)} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.bgElevated, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name={fav ? 'heart' : 'heart-outline'} size={20} color={fav ? colors.error : colors.textPrimary} />
            </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Görseller */}
        <View style={{ height: width * 0.85, backgroundColor: colors.bgElevated, position: 'relative' }}>
          {listing.images.length > 0 ? (
            <>
              <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={e => setImgIndex(Math.round(e.nativeEvent.contentOffset.x / width))}>
                {listing.images.map(img => (
                  <Image key={img.id} source={{ uri: img.uri }} style={{ width, height: width * 0.85 }} resizeMode="cover" />
                ))}
              </ScrollView>
              {listing.images.length > 1 && (
                <View style={{ position: 'absolute', bottom: Spacing.md, alignSelf: 'center', flexDirection: 'row', gap: 5 }}>
                  {listing.images.map((_, i) => (
                    <View key={i} style={{ width: i === imgIndex ? 16 : 6, height: 6, borderRadius: 3, backgroundColor: i === imgIndex ? '#fff' : 'rgba(255,255,255,0.5)' }} />
                  ))}
                </View>
              )}
            </>
          ) : (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="image-outline" size={64} color={colors.textMuted} />
            </View>
          )}
          {listing.status !== 'active' && (
            <View style={{ position: 'absolute', top: Spacing.md, left: Spacing.md, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: `${statusCfg.color}DD`, paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full }}>
              <Ionicons name={statusCfg.icon as any} size={14} color="#fff" />
              <Text style={{ color: '#fff', fontSize: Typography.sm, fontWeight: '700' }}>{statusCfg.label}</Text>
            </View>
          )}
        </View>

        <View style={{ padding: Spacing.base }}>
          {/* Fiyat & Başlık */}
          <View style={{ marginBottom: Spacing.xl }}>
            <Text style={{ color: colors.textPrimary, fontSize: Typography.xl, fontWeight: '800', lineHeight: 30, marginBottom: Spacing.sm }}>{listing.title}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.md }}>
              {listing.priceType === 'free' ? (
                <Text style={{ color: colors.secondary, fontSize: Typography['2xl'], fontWeight: '800' }}>Ücretsiz</Text>
              ) : listing.priceType === 'swap' ? (
                <Text style={{ color: colors.warning, fontSize: Typography.xl, fontWeight: '800' }}>Takas</Text>
              ) : (
                <Text style={{ color: colors.primary, fontSize: Typography['2xl'], fontWeight: '800' }}>{formatPrice(listing.price, listing.currency)}</Text>
              )}
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
              {listing.priceType === 'negotiable' && (
                <View style={{ backgroundColor: `${colors.info}20`, paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full }}>
                  <Text style={{ color: colors.info, fontSize: Typography.xs, fontWeight: '700' }}>Pazarlık Payı Var</Text>
                </View>
              )}
              <View style={{ backgroundColor: colors.bgElevated, paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full }}>
                <Text style={{ color: colors.textSecondary, fontSize: Typography.xs, fontWeight: '600' }}>{conditionLabel[listing.condition]}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                <Ionicons name="location-outline" size={13} color={colors.textMuted} />
                <Text style={{ color: colors.textMuted, fontSize: Typography.xs }}>{listing.location.district}, {listing.location.city}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                <Ionicons name="eye-outline" size={13} color={colors.textMuted} />
                <Text style={{ color: colors.textMuted, fontSize: Typography.xs }}>{listing.viewCount} görüntülenme</Text>
              </View>
              <Text style={{ color: colors.textMuted, fontSize: Typography.xs }}>{formatRelativeTime(listing.createdAt)}</Text>
            </View>
          </View>

          {/* Özellikler */}
          {cfEntries.length > 0 && (
            <View style={{ backgroundColor: colors.bgCard, borderRadius: Radius.xl, borderWidth: 1, borderColor: colors.border, padding: Spacing.base, marginBottom: Spacing.xl }}>
              <Text style={{ color: colors.textPrimary, fontSize: Typography.md, fontWeight: '700', marginBottom: Spacing.md }}>Özellikler</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
                {cfEntries.map(([key, value]) => (
                  <View key={key} style={{ backgroundColor: colors.bgElevated, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.md, minWidth: '45%', flexGrow: 1 }}>
                    <Text style={{ color: colors.textMuted, fontSize: Typography.xs, marginBottom: 2 }}>{CF_LABELS[key] ?? key}</Text>
                    <Text style={{ color: colors.textPrimary, fontSize: Typography.sm, fontWeight: '600' }}>
                      {typeof value === 'boolean' ? (value ? 'Var' : 'Yok') : String(value)}{key === 'mileage' ? ' km' : key === 'squareMeters' ? ' m²' : ''}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Açıklama */}
          <View style={{ marginBottom: Spacing.xl }}>
            <Text style={{ color: colors.textPrimary, fontSize: Typography.md, fontWeight: '700', marginBottom: Spacing.md }}>Açıklama</Text>
            <Text style={{ color: colors.textSecondary, fontSize: Typography.base, lineHeight: 26 }}>{listing.description}</Text>
            {listing.tags && listing.tags.length > 0 && (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginTop: Spacing.md }}>
                {listing.tags.map(t => (
                  <Text key={t} style={{ color: colors.textMuted, fontSize: Typography.xs, backgroundColor: colors.bgElevated, paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full }}>#{t}</Text>
                ))}
              </View>
            )}
          </View>

          {/* Satıcı Kartı */}
          {seller && (
            <TouchableOpacity onPress={() => isOwner ? null : router.push(`/user/${seller.id}` as any)}
              activeOpacity={isOwner ? 1 : 0.7}
              style={{ backgroundColor: colors.bgCard, borderRadius: Radius.xl, borderWidth: 1, borderColor: colors.border, padding: Spacing.base, marginBottom: Spacing.xl }}>
              <Text style={{ color: colors.textMuted, fontSize: Typography.xs, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: Spacing.md }}>
                {isOwner ? 'Bu İlan Sana Ait' : 'Satıcı'}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
                <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: '#fff', fontSize: Typography.lg, fontWeight: '800' }}>
                    {seller.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={{ color: colors.textPrimary, fontSize: Typography.md, fontWeight: '700' }}>{seller.name}</Text>
                    {seller.isVerified && <Ionicons name="checkmark-circle" size={16} color={colors.primary} />}
                  </View>
                  {seller.username && <Text style={{ color: colors.textMuted, fontSize: Typography.sm }}>@{seller.username}</Text>}
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                    <Ionicons name="star" size={12} color="#FFD700" />
                    <Text style={{ color: colors.textSecondary, fontSize: Typography.sm }}>
                      {seller.rating > 0 ? seller.rating.toFixed(1) : 'Yeni'} • {seller.reviewCount} yorum
                    </Text>
                  </View>
                </View>
                {!isOwner && <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />}
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Alt butonlar */}
      {!isOwner && listing.status === 'active' && (
        <View style={{ flexDirection: 'row', padding: Spacing.base, gap: Spacing.sm, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.bg }}>
          <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: colors.bgElevated, borderRadius: Radius.lg, paddingVertical: 14, borderWidth: 1, borderColor: colors.border }}>
            <Ionicons name="call-outline" size={20} color={colors.textPrimary} />
            <Text style={{ color: colors.textPrimary, fontSize: Typography.base, fontWeight: '600' }}>Ara</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: colors.primary, borderRadius: Radius.lg, paddingVertical: 14 }}>
            <Ionicons name="chatbubble-outline" size={20} color="#fff" />
            <Text style={{ color: '#fff', fontSize: Typography.base, fontWeight: '700' }}>Mesaj Gönder</Text>
          </TouchableOpacity>
        </View>
      )}
      {isOwner && (
        <View style={{ flexDirection: 'row', padding: Spacing.base, gap: Spacing.sm, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.bg }}>
          <TouchableOpacity onPress={() => router.push(`/listing/edit?id=${listing.id}` as any)}
            style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: colors.bgElevated, borderRadius: Radius.lg, paddingVertical: 14, borderWidth: 1, borderColor: colors.border }}>
            <Ionicons name="create-outline" size={20} color={colors.textPrimary} />
            <Text style={{ color: colors.textPrimary, fontSize: Typography.base, fontWeight: '600' }}>Düzenle</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleOwnerActions}
            style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: colors.primary, borderRadius: Radius.lg, paddingVertical: 14 }}>
            <Ionicons name="ellipsis-horizontal" size={20} color="#fff" />
            <Text style={{ color: '#fff', fontSize: Typography.base, fontWeight: '700' }}>İşlemler</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
