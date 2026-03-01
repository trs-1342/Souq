import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../src/constants/theme';
import { useAppStore } from '../../src/stores/appStore';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface SettingItem {
  icon: IconName;
  label: string;
  type: 'navigate' | 'toggle' | 'danger';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (v: boolean) => void;
  iconColor?: string;
}

interface SettingSection {
  title: string;
  items: SettingItem[];
}

export default function ProfileScreen() {
  const { currentUser } = useAppStore();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [locationAccess, setLocationAccess] = useState(false);

  const sections: SettingSection[] = [
    {
      title: 'Hesabım',
      items: [
        {
          icon: 'person-outline',
          label: 'Profil Bilgileri',
          type: 'navigate',
          onPress: () => {},
        },
        {
          icon: 'shield-checkmark-outline',
          label: 'Güvenlik & Şifre',
          type: 'navigate',
          onPress: () => {},
          iconColor: Colors.secondary,
        },
        {
          icon: 'card-outline',
          label: 'Ödeme Yöntemleri',
          type: 'navigate',
          onPress: () => {},
        },
        {
          icon: 'star-outline',
          label: 'Pro\'ya Geç',
          type: 'navigate',
          onPress: () => {},
          iconColor: Colors.gold,
        },
      ],
    },
    {
      title: 'Tercihler',
      items: [
        {
          icon: 'notifications-outline',
          label: 'Bildirimler',
          type: 'toggle',
          value: notifications,
          onToggle: setNotifications,
        },
        {
          icon: 'moon-outline',
          label: 'Karanlık Mod',
          type: 'toggle',
          value: darkMode,
          onToggle: setDarkMode,
        },
        {
          icon: 'location-outline',
          label: 'Konum Erişimi',
          type: 'toggle',
          value: locationAccess,
          onToggle: setLocationAccess,
        },
        {
          icon: 'language-outline',
          label: 'Dil',
          type: 'navigate',
          onPress: () => {},
        },
      ],
    },
    {
      title: 'Destek',
      items: [
        {
          icon: 'help-circle-outline',
          label: 'Yardım & SSS',
          type: 'navigate',
          onPress: () => {},
        },
        {
          icon: 'chatbubble-outline',
          label: 'Bize Ulaşın',
          type: 'navigate',
          onPress: () => {},
        },
        {
          icon: 'document-text-outline',
          label: 'Gizlilik Politikası',
          type: 'navigate',
          onPress: () => {},
        },
        {
          icon: 'information-circle-outline',
          label: 'Hakkında',
          type: 'navigate',
          onPress: () => {},
        },
      ],
    },
    {
      title: 'Hesap İşlemleri',
      items: [
        {
          icon: 'log-out-outline',
          label: 'Çıkış Yap',
          type: 'danger',
          onPress: () =>
            Alert.alert('Çıkış Yap', 'Hesabınızdan çıkmak istediğinizden emin misiniz?', [
              { text: 'İptal', style: 'cancel' },
              { text: 'Çıkış Yap', style: 'destructive', onPress: () => {} },
            ]),
          iconColor: Colors.error,
        },
        {
          icon: 'trash-outline',
          label: 'Hesabı Sil',
          type: 'danger',
          onPress: () => {},
          iconColor: Colors.error,
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Profil</Text>
          <TouchableOpacity>
            <Ionicons name="create-outline" size={22} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Kullanıcı Kartı */}
        <View style={styles.profileCard}>
          {/* Avatar */}
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {currentUser?.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)}
              </Text>
            </View>
            {currentUser?.isVerified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark" size={10} color={Colors.white} />
              </View>
            )}
          </View>

          <Text style={styles.userName}>{currentUser?.name}</Text>
          {currentUser?.email && (
            <Text style={styles.userEmail}>{currentUser.email}</Text>
          )}

          {/* Stats */}
          <View style={styles.statsRow}>
            {[
              { label: 'İlan', value: currentUser?.listingCount ?? 0 },
              { label: 'Puan', value: currentUser?.rating.toFixed(1) ?? '—' },
              { label: 'Yorum', value: currentUser?.reviewCount ?? 0 },
            ].map((stat, i) => (
              <React.Fragment key={stat.label}>
                {i > 0 && <View style={styles.statDivider} />}
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              </React.Fragment>
            ))}
          </View>

          <TouchableOpacity style={styles.editProfileBtn} activeOpacity={0.75}>
            <Text style={styles.editProfileBtnText}>Profili Düzenle</Text>
          </TouchableOpacity>
        </View>

        {/* İlanlarım Kısa Yolu */}
        <View style={styles.quickActions}>
          {[
            { icon: 'list-outline', label: 'İlanlarım', count: currentUser?.listingCount },
            { icon: 'heart-outline', label: 'Favoriler', count: 0 },
            { icon: 'chatbubbles-outline', label: 'Mesajlar', count: 3 },
            { icon: 'eye-outline', label: 'İzlenenler', count: 0 },
          ].map((qa) => (
            <TouchableOpacity key={qa.label} style={styles.qaItem} activeOpacity={0.75}>
              <View style={styles.qaIcon}>
                <Ionicons name={qa.icon as IconName} size={22} color={Colors.primary} />
              </View>
              <Text style={styles.qaLabel}>{qa.label}</Text>
              {!!qa.count && (
                <View style={styles.qaBadge}>
                  <Text style={styles.qaBadgeText}>{qa.count}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Ayarlar */}
        {sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, idx) => (
                <TouchableOpacity
                  key={item.label}
                  style={[
                    styles.settingRow,
                    idx < section.items.length - 1 && styles.settingRowBorder,
                    item.type === 'danger' && styles.settingRowDanger,
                  ]}
                  onPress={item.type !== 'toggle' ? item.onPress : undefined}
                  activeOpacity={item.type === 'toggle' ? 1 : 0.7}
                >
                  <View style={styles.settingLeft}>
                    <Ionicons
                      name={item.icon}
                      size={20}
                      color={
                        item.iconColor ??
                        (item.type === 'danger' ? Colors.error : Colors.textSecondary)
                      }
                    />
                    <Text
                      style={[
                        styles.settingLabel,
                        item.type === 'danger' && { color: Colors.error },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </View>
                  {item.type === 'toggle' ? (
                    <Switch
                      value={item.value}
                      onValueChange={item.onToggle}
                      trackColor={{ false: Colors.border, true: `${Colors.primary}60` }}
                      thumbColor={item.value ? Colors.primary : Colors.textMuted}
                      ios_backgroundColor={Colors.border}
                    />
                  ) : (
                    <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Versiyon */}
        <Text style={styles.version}>Pazaryeri v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.base,
  },
  pageTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.xl,
    fontWeight: Typography.heavy,
  },
  // Profile Card
  profileCard: {
    marginHorizontal: Spacing.base,
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.base,
    ...Shadow.md,
  },
  avatarWrapper: { position: 'relative', marginBottom: Spacing.md },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.glow,
  },
  avatarText: {
    color: Colors.white,
    fontSize: Typography['2xl'],
    fontWeight: Typography.heavy,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.bgCard,
  },
  userName: {
    color: Colors.textPrimary,
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
  },
  userEmail: {
    color: Colors.textMuted,
    fontSize: Typography.sm,
    marginTop: 4,
    marginBottom: Spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginBottom: Spacing.lg,
  },
  stat: { alignItems: 'center', flex: 1 },
  statValue: {
    color: Colors.textPrimary,
    fontSize: Typography.xl,
    fontWeight: Typography.heavy,
  },
  statLabel: { color: Colors.textMuted, fontSize: Typography.xs, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: Colors.border },
  editProfileBtn: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: 10,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  editProfileBtnText: {
    color: Colors.textSecondary,
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
  },
  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    marginHorizontal: Spacing.base,
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.base,
    marginBottom: Spacing.base,
  },
  qaItem: { flex: 1, alignItems: 'center', gap: 6, position: 'relative' },
  qaIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: `${Colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qaLabel: { color: Colors.textSecondary, fontSize: Typography.xs, fontWeight: Typography.medium },
  qaBadge: {
    position: 'absolute',
    top: -4,
    right: 8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  qaBadgeText: { color: Colors.white, fontSize: 10, fontWeight: Typography.bold },
  // Settings Sections
  section: { marginBottom: Spacing.base, paddingHorizontal: Spacing.base },
  sectionTitle: {
    color: Colors.textMuted,
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: 16,
  },
  settingRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingRowDanger: {},
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  settingLabel: {
    color: Colors.textPrimary,
    fontSize: Typography.base,
  },
  version: {
    color: Colors.textMuted,
    fontSize: Typography.xs,
    textAlign: 'center',
    paddingVertical: Spacing.xl,
  },
});
