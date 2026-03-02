import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Dimensions, Alert, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../src/stores/themeStore';
import { useAppStore } from '../../src/stores/appStore';
import { Typography, Spacing, Radius } from '../../src/constants/theme';
import { formatPrice, formatRelativeTime, conditionLabels } from '../../src/utils/format';

const { width } = Dimensions.get('window');

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useColors();
  const { listings, isFavorite, toggleFavorite, currentUser } = useAppStore();
  const [activeImage, setActiveImage] = useState(0);

  const listing = listings.find(l => l.id === id);

  if (!listing) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name="alert-circle-outline" size={64} color={colors.textMuted} />
        <Text style={{ color: colors.textPrimary, fontSize: Typography.lg, marginTop: Spacing.md }}>İlan bulunamadı</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: Spacing.xl }}>
          <Text style={{ color: colors.primary, fontSize: Typography.base }}>Geri Dön</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const fav = isFavorite(listing.id);
  const isOwner = listing.userId === currentUser?.id;
  const s = makeStyles(colors);

  const handleShare = async () => {
    await Share.share({ message: `${listing.title} - ${formatPrice(listing.price, listing.currency)}\nSouq'da satışta!` });
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.headerBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={s.headerActions}>
          <TouchableOpacity onPress={handleShare} style={s.headerBtn}>
            <Ionicons name="share-outline" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleFavorite(listing.id)} style={s.headerBtn}>
            <Ionicons name={fav ? 'heart' : 'heart-outline'} size={22} color={fav ? colors.primary : colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Fotoğraflar */}
        <View>
          {listing.images.length > 0 ? (
            <>
              <Image source={{ uri: listing.images[activeImage]?.uri }} style={s.mainImage} resizeMode="cover" />
              {listing.images.length > 1 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.thumbScroll} contentContainerStyle={{ paddingHorizontal: Spacing.base, gap: Spacing.sm }}>
                  {listing.images.map((img, i) => (
                    <TouchableOpacity key={img.id} onPress={() => setActiveImage(i)}>
                      <Image source={{ uri: img.uri }} style={[s.thumb, i === activeImage && { borderColor: colors.primary, borderWidth: 2 }]} resizeMode="cover" />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
              {/* Dot indicator */}
              {listing.images.length > 1 && (
                <View style={s.dots}>
                  {listing.images.map((_, i) => (
                    <View key={i} style={[s.dot, { backgroundColor: i === activeImage ? colors.primary : colors.border }]} />
                  ))}
                </View>
              )}
            </>
          ) : (
            <View style={[s.mainImage, { backgroundColor: colors.bgElevated, alignItems: 'center', justifyContent: 'center' }]}>
              <Ionicons name="image-outline" size={64} color={colors.textMuted} />
            </View>
          )}
        </View>

        {/* İçerik */}
        <View style={s.content}>
          {/* Başlık & Fiyat */}
          <View style={s.titleRow}>
            <Text style={s.title}>{listing.title}</Text>
            <View style={s.badges}>
              <View style={[s.badge, { backgroundColor: `${colors.info}20` }]}>
                <Text style={[s.badgeText, { color: colors.info }]}>{conditionLabels[listing.condition]}</Text>
              </View>
              {listing.priceType === 'negotiable' && (
                <View style={[s.badge, { backgroundColor: `${colors.warning}20` }]}>
                  <Text style={[s.badgeText, { color: colors.warning }]}>Pazarlık</Text>
                </View>
              )}
            </View>
          </View>

          <Text style={s.price}>
            {listing.priceType === 'free' ? 'Ücretsiz' : listing.priceType === 'swap' ? 'Takas' : formatPrice(listing.price, listing.currency)}
          </Text>

          {/* Meta */}
          <View style={s.metaRow}>
            <View style={s.metaItem}>
              <Ionicons name="location-outline" size={16} color={colors.textMuted} />
              <Text style={s.metaText}>{listing.location.district}, {listing.location.city}</Text>
            </View>
            <View style={s.metaItem}>
              <Ionicons name="time-outline" size={16} color={colors.textMuted} />
              <Text style={s.metaText}>{formatRelativeTime(listing.createdAt)}</Text>
            </View>
            <View style={s.metaItem}>
              <Ionicons name="eye-outline" size={16} color={colors.textMuted} />
              <Text style={s.metaText}>{listing.viewCount} görüntülenme</Text>
            </View>
          </View>

          <View style={s.divider} />

          {/* Açıklama */}
          <Text style={s.sectionTitle}>Açıklama</Text>
          <Text style={s.description}>{listing.description}</Text>

          {listing.tags && listing.tags.length > 0 && (
            <View style={s.tagRow}>
              {listing.tags.map(tag => (
                <View key={tag} style={[s.tag, { backgroundColor: colors.bgElevated }]}>
                  <Text style={[s.tagText, { color: colors.textSecondary }]}>#{tag}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={s.divider} />

          {/* Satıcı */}
          <Text style={s.sectionTitle}>Satıcı</Text>
          <TouchableOpacity style={[s.sellerCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
            <View style={[s.sellerAvatar, { backgroundColor: colors.primary }]}>
              <Text style={[s.sellerAvatarText, { color: colors.white }]}>
                {listing.userId === 'u1' ? 'AY' : 'SK'}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[s.sellerName, { color: colors.textPrimary }]}>
                {listing.userId === 'u1' ? 'Ahmet Yılmaz' : 'Selin Kaya'}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Ionicons name="star" size={14} color={colors.gold} />
                <Text style={[s.sellerRating, { color: colors.textMuted }]}>
                  {listing.userId === 'u1' ? '4.8' : '4.2'} puan
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Alt Butonlar */}
      {!isOwner && (
        <View style={[s.footer, { backgroundColor: colors.bg, borderTopColor: colors.border }]}>
          <TouchableOpacity style={[s.msgBtn, { backgroundColor: colors.bgElevated, borderColor: colors.border }]}
            onPress={() => router.push('/(tabs)/messages')}>
            <Ionicons name="chatbubble-outline" size={20} color={colors.textPrimary} />
            <Text style={[s.msgBtnText, { color: colors.textPrimary }]}>Mesaj Gönder</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.callBtn, { backgroundColor: colors.primary }]}
            onPress={() => Alert.alert('Telefon', 'Bu özellik yakında aktif olacak.')}>
            <Ionicons name="call-outline" size={20} color="#fff" />
            <Text style={s.callBtnText}>Ara</Text>
          </TouchableOpacity>
        </View>
      )}
      {isOwner && (
        <View style={[s.footer, { backgroundColor: colors.bg, borderTopColor: colors.border }]}>
          <TouchableOpacity style={[s.callBtn, { backgroundColor: colors.primary, flex: 1 }]}
            onPress={() => Alert.alert('Düzenle', 'İlan düzenleme yakında aktif olacak.')}>
            <Ionicons name="create-outline" size={20} color="#fff" />
            <Text style={s.callBtnText}>İlanı Düzenle</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const makeStyles = (colors: any) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.base, paddingVertical: Spacing.md },
  headerBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.bgCard, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  headerActions: { flexDirection: 'row', gap: Spacing.sm },
  mainImage: { width, height: width * 0.75 },
  thumbScroll: { marginTop: Spacing.sm },
  thumb: { width: 64, height: 64, borderRadius: Radius.md, borderWidth: 1, borderColor: colors.border },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: Spacing.sm },
  dot: { width: 6, height: 6, borderRadius: 3 },
  content: { padding: Spacing.base },
  titleRow: { marginBottom: Spacing.sm },
  title: { color: colors.textPrimary, fontSize: Typography.xl, fontWeight: '700', lineHeight: 28, marginBottom: Spacing.sm },
  badges: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  badge: { paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: Radius.full },
  badgeText: { fontSize: Typography.xs, fontWeight: '600' },
  price: { color: colors.primary, fontSize: Typography['2xl'], fontWeight: '800', marginBottom: Spacing.base },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, marginBottom: Spacing.base },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { color: colors.textMuted, fontSize: Typography.sm },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: Spacing.lg },
  sectionTitle: { color: colors.textPrimary, fontSize: Typography.md, fontWeight: '700', marginBottom: Spacing.md },
  description: { color: colors.textSecondary, fontSize: Typography.base, lineHeight: 24 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginTop: Spacing.md },
  tag: { paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: Radius.full },
  tagText: { fontSize: Typography.xs },
  sellerCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.base, borderRadius: Radius.xl, borderWidth: 1 },
  sellerAvatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  sellerAvatarText: { fontSize: Typography.base, fontWeight: '700' },
  sellerName: { fontSize: Typography.base, fontWeight: '600', marginBottom: 2 },
  sellerRating: { fontSize: Typography.sm },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', gap: Spacing.sm, padding: Spacing.base, borderTopWidth: 1 },
  msgBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, borderRadius: Radius.lg, paddingVertical: 14, borderWidth: 1 },
  msgBtnText: { fontSize: Typography.base, fontWeight: '600' },
  callBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, borderRadius: Radius.lg, paddingVertical: 14 },
  callBtnText: { color: '#fff', fontSize: Typography.base, fontWeight: '700' },
});
