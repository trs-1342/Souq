import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
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
  const { currentUser, logout, getFavoriteListings } = useAppStore();
  const { mode, toggleTheme } = useThemeStore();
  const isDark = mode === 'dark';
  const [notifications, setNotifications] = useState(true);
  const favCount = getFavoriteListings().length;

  const sections = [
    {
      title: 'Hesabım',
      items: [
        { icon: 'shield-checkmark-outline' as IconName, label: 'Güvenlik & Şifre', iconColor: colors.secondary, onPress: () => {} },
        { icon: 'card-outline' as IconName, label: 'Ödeme Yöntemleri', onPress: () => {} },
        // { icon: 'star-outline' as IconName, label: "Pro'ya Geç", iconColor: colors.gold, onPress: () => {} },
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
        { icon: 'help-circle-outline' as IconName, label: 'Yardım & SSS', onPress: () => {} },
        { icon: 'chatbubble-outline' as IconName, label: 'Bize Ulaşın', onPress: () => {} },
        { icon: 'document-text-outline' as IconName, label: 'Gizlilik Politikası', onPress: () => {} },
        { icon: 'information-circle-outline' as IconName, label: 'Hakkında', onPress: () => {} },
      ],
    },
    {
      title: 'Hesap İşlemleri',
      items: [
        {
          icon: 'log-out-outline' as IconName, label: 'Çıkış Yap', isDanger: true,
          onPress: () => Alert.alert('Çıkış Yap', 'Hesabınızdan çıkmak istediğinizden emin misiniz?', [
            { text: 'İptal', style: 'cancel' },
            { text: 'Çıkış Yap', style: 'destructive', onPress: logout },
          ]),
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.base, paddingTop: Spacing.md, paddingBottom: Spacing.base }}>
          <Text style={{ color: colors.textPrimary, fontSize: Typography.xl, fontWeight: '800' }}>Profil</Text>
          <TouchableOpacity onPress={() => router.push('/profile/edit')} style={{ padding: 4 }}>
            <Ionicons name="create-outline" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Kullanıcı Kartı */}
        <View style={{ marginHorizontal: Spacing.base, backgroundColor: colors.bgCard, borderRadius: Radius.xl, borderWidth: 1, borderColor: colors.border, padding: Spacing.xl, alignItems: 'center', marginBottom: Spacing.base }}>
          <View style={{ position: 'relative', marginBottom: Spacing.md }}>
            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', shadowColor: colors.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 8 }}>
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
          <Text style={{ color: colors.textMuted, fontSize: Typography.sm, marginTop: 4, marginBottom: Spacing.lg }}>{currentUser?.email}</Text>

          {/* Stats */}
          <View style={{ flexDirection: 'row', width: '100%', marginBottom: Spacing.lg }}>
            {[
              { label: 'İlan', value: currentUser?.listingCount ?? 0 },
              { label: 'Puan', value: currentUser?.rating ? currentUser.rating.toFixed(1) : '—' },
              { label: 'Yorum', value: currentUser?.reviewCount ?? 0 },
            ].map((stat, i) => (
              <View key={stat.label} style={{ flex: 1, alignItems: 'center' }}>
                {i > 0 && <View style={{ position: 'absolute', left: 0, top: 4, bottom: 4, width: 1, backgroundColor: colors.border }} />}
                <Text style={{ color: colors.textPrimary, fontSize: Typography.xl, fontWeight: '800' }}>{stat.value}</Text>
                <Text style={{ color: colors.textMuted, fontSize: Typography.xs, marginTop: 2 }}>{stat.label}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity onPress={() => router.push('/profile/edit')}
            style={{ paddingHorizontal: Spacing.xl, paddingVertical: 10, borderRadius: Radius.full, borderWidth: 1.5, borderColor: colors.border }}>
            <Text style={{ color: colors.textSecondary, fontSize: Typography.sm, fontWeight: '600' }}>Profili Düzenle</Text>
          </TouchableOpacity>
        </View>

        {/* Hızlı Erişim */}
        <View style={{ flexDirection: 'row', marginHorizontal: Spacing.base, backgroundColor: colors.bgCard, borderRadius: Radius.xl, borderWidth: 1, borderColor: colors.border, padding: Spacing.base, marginBottom: Spacing.base }}>
          {[
            { icon: 'list-outline' as IconName, label: 'İlanlarım', count: currentUser?.listingCount, onPress: () => {} },
            { icon: 'heart-outline' as IconName, label: 'Favoriler', count: favCount, onPress: () => router.push('/(tabs)/favorites') },
            { icon: 'chatbubbles-outline' as IconName, label: 'Mesajlar', count: 0, onPress: () => router.push('/(tabs)/messages') },
          ].map(qa => (
            <TouchableOpacity key={qa.label} onPress={qa.onPress} style={{ flex: 1, alignItems: 'center', gap: 6, position: 'relative' }}>
              <View style={{ width: 48, height: 48, borderRadius: Radius.md, backgroundColor: `${colors.primary}15`, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name={qa.icon} size={22} color={colors.primary} />
              </View>
              <Text style={{ color: colors.textSecondary, fontSize: Typography.xs, fontWeight: '500' }}>{qa.label}</Text>
              {!!qa.count && (
                <View style={{ position: 'absolute', top: -4, right: 10, minWidth: 18, height: 18, borderRadius: 9, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 }}>
                  <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>{qa.count}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Ayarlar */}
        {sections.map(section => (
          <View key={section.title} style={{ marginBottom: Spacing.base, paddingHorizontal: Spacing.base }}>
            <Text style={{ color: colors.textMuted, fontSize: Typography.xs, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: Spacing.sm, marginLeft: 4 }}>
              {section.title}
            </Text>
            <View style={{ backgroundColor: colors.bgCard, borderRadius: Radius.xl, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' }}>
              {section.items.map((item, idx) => (
                <TouchableOpacity key={item.label}
                  style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.base, paddingVertical: 16, borderBottomWidth: idx < section.items.length - 1 ? 1 : 0, borderBottomColor: colors.border }}
                  onPress={!(item as any).isToggle ? item.onPress : undefined}
                  activeOpacity={(item as any).isToggle ? 1 : 0.7}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
                    <Ionicons name={item.icon} size={20} color={(item as any).isDanger ? colors.error : ((item as any).iconColor ?? colors.textSecondary)} />
                    <Text style={{ color: (item as any).isDanger ? colors.error : colors.textPrimary, fontSize: Typography.base }}>
                      {item.label}
                    </Text>
                  </View>
                  {(item as any).isToggle ? (
                    <Switch value={(item as any).value} onValueChange={(item as any).onToggle}
                      trackColor={{ false: colors.border, true: `${colors.primary}60` }}
                      thumbColor={(item as any).value ? colors.primary : colors.textMuted}
                      ios_backgroundColor={colors.border} />
                  ) : (
                    <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <Text style={{ color: colors.textMuted, fontSize: Typography.xs, textAlign: 'center', paddingVertical: Spacing.xl }}>
          Souq v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
