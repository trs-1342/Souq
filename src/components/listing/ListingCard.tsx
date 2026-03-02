import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../stores/themeStore';
import { Typography, Spacing, Radius } from '../../constants/theme';
import { Listing } from '../../types';
import { formatPrice, formatRelativeTime, conditionLabels } from '../../utils/format';
import { useAppStore } from '../../stores/appStore';

const { width } = Dimensions.get('window');

interface Props {
  listing: Listing;
  onPress: () => void;
  style?: object;
}

export function ListingCard({ listing, onPress, style }: Props) {
  const colors = useColors();
  const { isFavorite, toggleFavorite } = useAppStore();
  const fav = isFavorite(listing.id);
  const image = listing.images[0];
  const cardWidth = (width - Spacing.base * 2 - Spacing.sm) / 2;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}
      style={[{ width: cardWidth, backgroundColor: colors.bgCard, borderRadius: Radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: colors.border }, style]}>
      <View style={{ width: '100%', height: cardWidth * 0.85, position: 'relative' }}>
        {image ? (
          <Image source={{ uri: image.uri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
        ) : (
          <View style={{ width: '100%', height: '100%', backgroundColor: colors.bgElevated, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="image-outline" size={32} color={colors.textMuted} />
          </View>
        )}
        <TouchableOpacity
          style={{ position: 'absolute', top: Spacing.sm, right: Spacing.sm, backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 99, padding: 6 }}
          onPress={() => toggleFavorite(listing.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name={fav ? 'heart' : 'heart-outline'} size={18} color={fav ? colors.primary : '#fff'} />
        </TouchableOpacity>
        {listing.priceType === 'free' && (
          <View style={{ position: 'absolute', bottom: Spacing.sm, left: Spacing.sm, backgroundColor: colors.secondary, paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.sm }}>
            <Text style={{ color: '#fff', fontSize: Typography.xs, fontWeight: '700' }}>ÜCRETSİZ</Text>
          </View>
        )}
        {listing.priceType === 'swap' && (
          <View style={{ position: 'absolute', bottom: Spacing.sm, left: Spacing.sm, backgroundColor: colors.info, paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.sm }}>
            <Text style={{ color: '#fff', fontSize: Typography.xs, fontWeight: '700' }}>TAKAS</Text>
          </View>
        )}
      </View>
      <View style={{ padding: Spacing.md, gap: 4 }}>
        <Text style={{ color: colors.textPrimary, fontSize: Typography.sm, fontWeight: '500', lineHeight: 18 }} numberOfLines={2}>{listing.title}</Text>
        <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center', marginTop: 2 }}>
          <Text style={{ color: colors.textMuted, fontSize: Typography.xs, backgroundColor: colors.bgElevated, paddingHorizontal: 6, paddingVertical: 2, borderRadius: Radius.sm }}>
            {conditionLabels[listing.condition]}
          </Text>
          {listing.priceType === 'negotiable' && <Text style={{ color: colors.warning, fontSize: Typography.xs }}>Pazarlık</Text>}
        </View>
        <Text style={{ color: colors.primary, fontSize: Typography.md, fontWeight: '700', marginTop: 4 }}>
          {listing.priceType === 'free' ? 'Ücretsiz' : listing.priceType === 'swap' ? 'Takas' : formatPrice(listing.price, listing.currency)}
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2, flex: 1 }}>
            <Ionicons name="location-outline" size={11} color={colors.textMuted} />
            <Text style={{ color: colors.textMuted, fontSize: Typography.xs, flex: 1 }} numberOfLines={1}>
              {listing.location.district}, {listing.location.city}
            </Text>
          </View>
          <Text style={{ color: colors.textMuted, fontSize: Typography.xs }}>{formatRelativeTime(listing.createdAt)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
