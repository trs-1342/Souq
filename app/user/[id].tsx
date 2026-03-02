import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Modal, TextInput, Alert, ActionSheetIOS, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../src/stores/themeStore';
import { useAppStore } from '../../src/stores/appStore';
import { Typography, Spacing, Radius } from '../../src/constants/theme';
import { formatPrice, formatRelativeTime } from '../../src/utils/format';

function StarRow({ rating, onRate, readonly = false }: { rating: number; onRate?: (n: number) => void; readonly?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', gap: 4 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <TouchableOpacity key={n} onPress={() => onRate?.(n)} disabled={readonly} activeOpacity={readonly ? 1 : 0.7}>
          <Ionicons name={n <= rating ? 'star' : 'star-outline'} size={readonly ? 13 : 28} color="#FFD700" />
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function UserProfileScreen() {
  const colors = useColors();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { currentUser, getUserById, listings, getUserRatings, addRating, hasRated, blockUser, unblockUser, isBlocked } = useAppStore();
  const user = getUserById(id);
  const isSelf = currentUser?.id === id;
  const blocked = isBlocked(id);
  const [ratingModal, setRatingModal] = useState(false);
  const [starScore, setStarScore] = useState(5);
  const [comment, setComment] = useState('');

  if (!user) return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }} edges={['top']}>
      <Ionicons name="person-outline" size={64} color={colors.textMuted} />
      <Text style={{ color: colors.textMuted, marginTop: Spacing.md }}>Kullanici bulunamadi.</Text>
      <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
        <Text style={{ color: colors.primary }}>Geri Don</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );

  const userListings = listings.filter((l: any) => l.userId === id && (isSelf ? true : l.status === 'active'));
  const userRatings = getUserRatings(id);
  const alreadyRated = hasRated(id);
  const initials = user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  const handleMoreActions = () => {
    if (isSelf) return;
    const opts = blocked ? ['Engeli Kaldir', 'Iptal'] : ['Puan Ver', 'Engelle', 'Iptal'];
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        { options: opts, destructiveButtonIndex: blocked ? 0 : 1, cancelButtonIndex: opts.length - 1 },
        idx => {
          if (blocked) { if (idx === 0) doUnblock(); }
          else { if (idx === 0) setRatingModal(true); if (idx === 1) doBlock(); }
        }
      );
    } else {
      Alert.alert('Islemler', '', [
        ...(!blocked ? [{ text: 'Puan Ver', onPress: () => setRatingModal(true) }] : []),
        blocked
          ? { text: 'Engeli Kaldir', onPress: doUnblock }
          : { text: 'Engelle', style: 'destructive' as const, onPress: doBlock },
        { text: 'Iptal', style: 'cancel' as const },
      ]);
    }
  };

  const doBlock = () => Alert.alert('Engelle', '', [
    { text: 'Iptal', style: 'cancel' },
    { text: 'Engelle', style: 'destructive', onPress: () => blockUser(id) },
  ]);
  const doUnblock = () => Alert.alert('Engeli Kaldir', '', [
    { text: 'Iptal', style: 'cancel' },
    { text: 'Kaldir', onPress: () => unblockUser(id) },
  ]);

  const submitRating = () => {
    if (!comment.trim()) { Alert.alert('Yorum Gerekli', 'Lutfen bir yorum ekleyin.'); return; }
    addRating(id, starScore, comment.trim());
    setRatingModal(false); setComment(''); setStarScore(5);
    Alert.alert('Tesekkurler!', 'Puaniniz kaydedildi.');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <Modal visible={ratingModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setRatingModal(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'bottom']}>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}>
            <TouchableOpacity onPress={() => setRatingModal(false)} style={{ padding: 4, marginRight: Spacing.md }}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={{ flex: 1, color: colors.textPrimary, fontSize: Typography.lg, fontWeight: '700' }}>Puan Ver</Text>
          </View>
          <ScrollView contentContainerStyle={{ padding: Spacing.xl, gap: Spacing.xl, alignItems: 'center' }} keyboardShouldPersistTaps="handled">
            <View style={{ alignItems: 'center', gap: Spacing.sm }}>
              <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#fff', fontSize: Typography.xl, fontWeight: '800' }}>{initials}</Text>
              </View>
              <Text style={{ color: colors.textPrimary, fontSize: Typography.xl, fontWeight: '700' }}>{user.name}</Text>
            </View>
            <View style={{ alignItems: 'center', gap: Spacing.md }}>
              <Text style={{ color: colors.textSecondary, fontSize: Typography.base }}>Puaniniz</Text>
              <StarRow rating={starScore} onRate={setStarScore} />
              <Text style={{ color: colors.primary, fontSize: Typography.lg, fontWeight: '700' }}>
                {['', 'Cok Kotu', 'Kotu', 'Orta', 'Iyi', 'Mukemmel'][starScore]}
              </Text>
            </View>
            <View style={{ width: '100%' }}>
              <Text style={{ color: colors.textSecondary, fontSize: Typography.sm, fontWeight: '600', marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 }}>Yorum *</Text>
              <TextInput style={{ backgroundColor: colors.bgInput, borderWidth: 1, borderColor: colors.border, borderRadius: Radius.md, padding: Spacing.base, color: colors.textPrimary, fontSize: Typography.base, height: 120, textAlignVertical: 'top' }}
                value={comment} onChangeText={setComment} placeholder="Deneyiminizi paylasin..." placeholderTextColor={colors.textMuted} multiline maxLength={500} />
              <Text style={{ color: colors.textMuted, fontSize: Typography.xs, textAlign: 'right', marginTop: 4 }}>{comment.length}/500</Text>
            </View>
            <TouchableOpacity onPress={submitRating} style={{ width: '100%', backgroundColor: colors.primary, borderRadius: Radius.lg, paddingVertical: 16, alignItems: 'center' }}>
              <Text style={{ color: '#fff', fontSize: Typography.base, fontWeight: '700' }}>Puani Gonder</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.base, paddingVertical: Spacing.md }}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 4, marginRight: Spacing.md }}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={{ flex: 1, color: colors.textPrimary, fontSize: Typography.lg, fontWeight: '700' }}>Satici Profili</Text>
          {!isSelf && (
            <TouchableOpacity onPress={handleMoreActions} style={{ padding: 4 }}>
              <Ionicons name="ellipsis-vertical" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {blocked && (
          <View style={{ marginHorizontal: Spacing.base, marginBottom: Spacing.base, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: colors.error + '12', borderWidth: 1, borderColor: colors.error + '30', borderRadius: Radius.lg, padding: Spacing.base }}>
            <Ionicons name="ban-outline" size={20} color={colors.error} />
            <Text style={{ flex: 1, color: colors.error, fontSize: Typography.sm }}>Bu kullaniciy engelleiniz.</Text>
            <TouchableOpacity onPress={doUnblock}>
              <Text style={{ color: colors.error, fontSize: Typography.sm, fontWeight: '700' }}>Kaldir</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ alignItems: 'center', paddingVertical: Spacing.xl, paddingHorizontal: Spacing.base }}>
          <View style={{ position: 'relative', marginBottom: Spacing.md }}>
            <View style={{ width: 90, height: 90, borderRadius: 45, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', shadowColor: colors.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 8 }}>
              <Text style={{ color: '#fff', fontSize: Typography['2xl'], fontWeight: '800' }}>{initials}</Text>
            </View>
            {user.isVerified && (
              <View style={{ position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: 13, backgroundColor: '#007A3D', alignItems: 'center', justifyContent: 'center', borderWidth: 2.5, borderColor: colors.bg }}>
                <Ionicons name="checkmark" size={13} color="#fff" />
              </View>
            )}
          </View>
          <Text style={{ color: colors.textPrimary, fontSize: Typography.xl, fontWeight: '800' }}>{user.name}</Text>
          {user.username && <Text style={{ color: colors.primary, fontSize: Typography.sm, fontWeight: '600', marginTop: 2 }}>@{user.username}</Text>}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: Spacing.sm }}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={{ color: colors.textSecondary, fontSize: Typography.sm }}>
              {user.rating > 0 ? `${user.rating.toFixed(1)} - ${user.reviewCount} degerlendirme` : 'Henuz degerlendirme yok'}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
            <Ionicons name="time-outline" size={14} color={colors.textMuted} />
            <Text style={{ color: colors.textMuted, fontSize: Typography.xs }}>{formatRelativeTime(user.createdAt)} uye</Text>
          </View>
          <View style={{ flexDirection: 'row', marginTop: Spacing.xl, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: Spacing.xl, width: '100%', justifyContent: 'space-around' }}>
            {[{ label: 'Ilan', value: userListings.length }, { label: 'Puan', value: user.rating > 0 ? user.rating.toFixed(1) : '-' }, { label: 'Yorum', value: user.reviewCount }].map((stat) => (
              <View key={stat.label} style={{ alignItems: 'center' }}>
                <Text style={{ color: colors.textPrimary, fontSize: Typography.xl, fontWeight: '800' }}>{stat.value}</Text>
                <Text style={{ color: colors.textMuted, fontSize: Typography.xs, marginTop: 2 }}>{stat.label}</Text>
              </View>
            ))}
          </View>
          {!isSelf && !blocked && (
            <TouchableOpacity onPress={() => alreadyRated ? Alert.alert('Zaten Puanladiniz', '') : setRatingModal(true)}
              style={{ marginTop: Spacing.lg, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: Spacing.xl, paddingVertical: 10, borderRadius: Radius.full, borderWidth: 1.5, borderColor: alreadyRated ? colors.border : colors.primary, backgroundColor: alreadyRated ? 'transparent' : colors.primary + '10' }}>
              <Ionicons name={alreadyRated ? 'star' : 'star-outline'} size={16} color={alreadyRated ? '#FFD700' : colors.primary} />
              <Text style={{ color: alreadyRated ? colors.textMuted : colors.primary, fontSize: Typography.sm, fontWeight: '600' }}>
                {alreadyRated ? 'Puanlandi' : 'Puan Ver'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ paddingHorizontal: Spacing.base }}>
          <Text style={{ color: colors.textPrimary, fontSize: Typography.md, fontWeight: '700', marginBottom: Spacing.md }}>Ilanlari ({userListings.length})</Text>
          {userListings.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: Spacing['2xl'], gap: Spacing.md }}>
              <Ionicons name="list-outline" size={48} color={colors.textMuted} />
              <Text style={{ color: colors.textMuted }}>Aktif ilan yok.</Text>
            </View>
          ) : (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
              {userListings.map((l: any) => (
                <TouchableOpacity key={l.id} onPress={() => router.push('/listing/' + l.id as any)}
                  style={{ width: '47%', backgroundColor: colors.bgCard, borderRadius: Radius.lg, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' }}>
                  <View style={{ height: 110, backgroundColor: colors.bgElevated, alignItems: 'center', justifyContent: 'center' }}>
                    {l.images[0] ? <Image source={{ uri: l.images[0].uri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" /> : <Ionicons name="image-outline" size={32} color={colors.textMuted} />}
                  </View>
                  <View style={{ padding: Spacing.sm }}>
                    <Text style={{ color: colors.textPrimary, fontSize: Typography.sm, fontWeight: '600' }} numberOfLines={1}>{l.title}</Text>
                    <Text style={{ color: colors.primary, fontSize: Typography.base, fontWeight: '700', marginTop: 2 }}>
                      {l.priceType === 'free' ? 'Ucretsiz' : l.priceType === 'swap' ? 'Takas' : formatPrice(l.price, l.currency)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {userRatings.length > 0 && (
          <View style={{ paddingHorizontal: Spacing.base, marginTop: Spacing.xl }}>
            <Text style={{ color: colors.textPrimary, fontSize: Typography.md, fontWeight: '700', marginBottom: Spacing.md }}>Degerlendirmeler ({userRatings.length})</Text>
            <View style={{ gap: Spacing.sm }}>
              {userRatings.slice(0, 5).map((r: any, i: number) => {
                const reviewer = getUserById(r.fromUserId);
                return (
                  <View key={i} style={{ backgroundColor: colors.bgCard, borderRadius: Radius.lg, borderWidth: 1, borderColor: colors.border, padding: Spacing.base }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm }}>
                      <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.bgElevated, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: colors.textSecondary, fontSize: Typography.sm, fontWeight: '700' }}>{reviewer?.name.charAt(0).toUpperCase() ?? '?'}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: colors.textPrimary, fontSize: Typography.sm, fontWeight: '600' }}>{reviewer?.name ?? 'Bilinmeyen'}</Text>
                        <StarRow rating={r.score} readonly />
                      </View>
                      <Text style={{ color: colors.textMuted, fontSize: Typography.xs }}>{formatRelativeTime(r.createdAt)}</Text>
                    </View>
                    <Text style={{ color: colors.textSecondary, fontSize: Typography.sm, lineHeight: 20 }}>{r.comment}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
