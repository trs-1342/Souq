import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColors, useThemeStore } from '../../src/stores/themeStore';
import { useAppStore } from '../../src/stores/appStore';
import { Typography, Spacing, Radius } from '../../src/constants/theme';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

export default function ProfileScreen() {
  const colors = useColors();
  const router = useRouter();
  const { currentUser, logout, getFavoriteListings, listings } = useAppStore();
  const { mode, toggleTheme } = useThemeStore();
  const isDark = mode === 'dark';
  const [notifications, setNotifications] = useState(true);
  const myListings = listings.filter(l => l.userId === currentUser?.id);

  const handleDownloadData = () => {
    Alert.alert(
      'Verilerimi İndir',
      'Profil ve ilan verileriniz JSON formatında hazırlanacak ve tarayıcı üzerinden indirilecek.',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'İndir',
          onPress: () => {
            const data = {
              exportDate: new Date().toISOString(),
              profile: {
                id: currentUser?.id,
                name: currentUser?.name,
                username: currentUser?.username,
                email: currentUser?.email,
                phone: currentUser?.phone,
                bio: currentUser?.bio,
                createdAt: currentUser?.createdAt,
                rating: currentUser?.rating,
                reviewCount: currentUser?.reviewCount,
                listingCount: currentUser?.listingCount,
              },
              listings: myListings.map(l => ({
                id: l.id, title: l.title, description: l.description,
                price: l.price, priceType: l.priceType, currency: l.currency,
                condition: l.condition, status: l.status, categorySlug: l.categorySlug,
                location: l.location, viewCount: l.viewCount, favoriteCount: l.favoriteCount,
                createdAt: l.createdAt, updatedAt: l.updatedAt,
              })),
            };
            const json = JSON.stringify(data, null, 2);
            const encoded = encodeURIComponent(json);
            Linking.openURL(`data:application/json;charset=utf-8,${encoded}`).catch(() =>
              Alert.alert('Hata', 'Veriler indirilemedi. Tarayıcınız bu özelliği desteklemiyor olabilir.')
            );
          },
        },
      ]
    );
  };

  const sections = [
    {
      title: 'Hesabım',
      items: [
        { icon: 'list-outline' as IconName, label: 'İlanlarım', badge: myListings.length, onPress: () => router.push('/profile/listings' as any) },
        { icon: 'chatbubbles-outline' as IconName, label: 'Mesajlar', onPress: () => router.push('/(tabs)/messages') },
        { icon: 'shield-checkmark-outline' as IconName, label: 'Güvenlik & Şifre', iconColor: colors.info, onPress: () => router.push('/profile/security' as any) },
        { icon: 'card-outline' as IconName, label: 'Ödeme Yöntemleri', onPress: () => router.push('/profile/payment' as any) },
      ],
    },
    {
      title: 'Tercihler',
      items: [
        { icon: 'notifications-outline' as IconName, label: 'Bildirimler', isToggle: true, value: notifications, onToggle: setNotifications },
        { icon: 'moon-outline' as IconName, label: 'Karanlık Mod', isToggle: true, value: isDark, onToggle: () => toggleTheme() },
      ],
    },
    {
      title: 'Destek',
      items: [
        { icon: 'help-circle-outline' as IconName, label: 'Yardım & SSS', onPress: () => router.push('/profile/help' as any) },
        { icon: 'chatbubble-outline' as IconName, label: 'Bize Ulaşın', onPress: () => router.push('/profile/contact' as any) },
        { icon: 'document-text-outline' as IconName, label: 'Gizlilik Politikası', onPress: () => router.push('/profile/privacy' as any) },
        { icon: 'information-circle-outline' as IconName, label: 'Hakkında', onPress: () => router.push('/profile/about' as any) },
      ],
    },
    {
      title: 'Veriler & Hesap',
      items: [
        { icon: 'download-outline' as IconName, label: 'Verilerimi İndir', iconColor: colors.info, onPress: handleDownloadData },
        { icon: 'log-out-outline' as IconName, label: 'Çıkış Yap', isDanger: true, onPress: () => Alert.alert('Çıkış Yap', 'Hesabınızdan çıkmak istediğinizden emin misiniz?', [{ text: 'İptal', style: 'cancel' }, { text: 'Çıkış Yap', style: 'destructive', onPress: logout }]) },
      ],
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.base, paddingTop: Spacing.md, paddingBottom: Spacing.base }}>
          <Text style={{ color: colors.textPrimary, fontSize: Typography.xl, fontWeight: '800' }}>Hesabım</Text>
          <TouchableOpacity onPress={() => router.push('/profile/notifications' as any)} style={{ position: 'relative', padding: 6 }}>
            <Ionicons name="notifications-outline" size={22} color={colors.textSecondary} />
            <View style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, borderWidth: 1.5, borderColor: colors.bg }} />
          </TouchableOpacity>
        </View>

        {/* Kullanıcı Kartı */}
        <View style={{ marginHorizontal: Spacing.base, backgroundColor: colors.bgCard, borderRadius: Radius.xl, borderWidth: 1, borderColor: colors.border, padding: Spacing.xl, alignItems: 'center', marginBottom: Spacing.base }}>
          <View style={{ position: 'relative', marginBottom: Spacing.md }}>
            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#fff', fontSize: Typography['2xl'], fontWeight: '800' }}>
                {currentUser?.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </Text>
            </View>
            {currentUser?.isVerified && (
              <View style={{ position: 'absolute', bottom: 0, right: 0, width: 22, height: 22, borderRadius: 11, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.bgCard }}>
                <Ionicons name="checkmark" size={10} color="#fff" />
              </View>
            )}
          </View>
          <Text style={{ color: colors.textPrimary, fontSize: Typography.xl, fontWeight: '700' }}>{currentUser?.name}</Text>
          {currentUser?.username && <Text style={{ color: colors.primary, fontSize: Typography.sm, fontWeight: '600', marginTop: 2 }}>@{currentUser.username}</Text>}
          <Text style={{ color: colors.textMuted, fontSize: Typography.sm, marginTop: 2, marginBottom: Spacing.lg }}>{currentUser?.email}</Text>
          <View style={{ flexDirection: 'row', width: '100%', marginBottom: Spacing.lg }}>
            {[{ label: 'İlan', value: myListings.length }, { label: 'Puan', value: currentUser?.rating ? currentUser.rating.toFixed(1) : '—' }, { label: 'Yorum', value: currentUser?.reviewCount ?? 0 }].map((stat, i) => (
              <View key={stat.label} style={{ flex: 1, alignItems: 'center' }}>
                {i > 0 && <View style={{ position: 'absolute', left: 0, top: 4, bottom: 4, width: 1, backgroundColor: colors.border }} />}
                <Text style={{ color: colors.textPrimary, fontSize: Typography.xl, fontWeight: '800' }}>{stat.value}</Text>
                <Text style={{ color: colors.textMuted, fontSize: Typography.xs, marginTop: 2 }}>{stat.label}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity onPress={() => router.push('/profile/edit' as any)}
            style={{ paddingHorizontal: Spacing.xl, paddingVertical: 10, borderRadius: Radius.full, borderWidth: 1.5, borderColor: colors.border }}>
            <Text style={{ color: colors.textSecondary, fontSize: Typography.sm, fontWeight: '600' }}>Profili Düzenle</Text>
          </TouchableOpacity>
        </View>

        {/* Hızlı Erişim */}
        <View style={{ flexDirection: 'row', marginHorizontal: Spacing.base, backgroundColor: colors.bgCard, borderRadius: Radius.xl, borderWidth: 1, borderColor: colors.border, padding: Spacing.base, marginBottom: Spacing.base }}>
          {[
            { icon: 'list-outline' as IconName, label: 'İlanlarım', count: myListings.length, onPress: () => router.push('/profile/listings' as any) },
            { icon: 'chatbubbles-outline' as IconName, label: 'Mesajlar', count: 0, onPress: () => router.push('/(tabs)/messages') },
          ].map(qa => (
            <TouchableOpacity key={qa.label} onPress={qa.onPress} style={{ flex: 1, alignItems: 'center', gap: 6, position: 'relative' }}>
              <View style={{ width: 48, height: 48, borderRadius: Radius.md, backgroundColor: `${colors.primary}15`, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name={qa.icon} size={22} color={colors.primary} />
              </View>
              <Text style={{ color: colors.textSecondary, fontSize: Typography.xs, fontWeight: '500' }}>{qa.label}</Text>
              {!!qa.count && <View style={{ position: 'absolute', top: -4, right: '15%', minWidth: 18, height: 18, borderRadius: 9, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 }}><Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>{qa.count}</Text></View>}
            </TouchableOpacity>
          ))}
        </View>

        {/* Ayarlar */}
        {sections.map(section => (
          <View key={section.title} style={{ marginBottom: Spacing.base, paddingHorizontal: Spacing.base }}>
            <Text style={{ color: colors.textMuted, fontSize: Typography.xs, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: Spacing.sm, marginLeft: 4 }}>{section.title}</Text>
            <View style={{ backgroundColor: colors.bgCard, borderRadius: Radius.xl, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' }}>
              {section.items.map((item, idx) => (
                <TouchableOpacity key={item.label}
                  style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.base, paddingVertical: 16, borderBottomWidth: idx < section.items.length - 1 ? 1 : 0, borderBottomColor: colors.border }}
                  onPress={!(item as any).isToggle ? item.onPress : undefined}
                  activeOpacity={(item as any).isToggle ? 1 : 0.7}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
                    <Ionicons name={item.icon} size={20} color={(item as any).isDanger ? colors.error : ((item as any).iconColor ?? colors.textSecondary)} />
                    <Text style={{ color: (item as any).isDanger ? colors.error : colors.textPrimary, fontSize: Typography.base }}>{item.label}</Text>
                    {(item as any).badge > 0 && <View style={{ minWidth: 18, height: 18, borderRadius: 9, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 }}><Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>{(item as any).badge}</Text></View>}
                  </View>
                  {(item as any).isToggle ? (
                    <Switch value={(item as any).value} onValueChange={(item as any).onToggle} trackColor={{ false: colors.border, true: `${colors.primary}60` }} thumbColor={(item as any).value ? colors.primary : colors.textMuted} ios_backgroundColor={colors.border} />
                  ) : (
                    <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
        <Text style={{ color: colors.textMuted, fontSize: Typography.xs, textAlign: 'center', paddingVertical: Spacing.xl }}>Souq v1.0.0 • MIT Lisansı</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
