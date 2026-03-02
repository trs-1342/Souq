import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../src/stores/themeStore';
import { Typography, Spacing, Radius } from '../../src/constants/theme';

type NotifType = 'message' | 'favorite' | 'price' | 'system';

interface Notif {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const MOCK_NOTIFS: Notif[] = [
  { id: 'n1', type: 'message', title: 'Yeni mesaj', body: 'Selin Kaya: "Hâlâ satılık mı?"', time: '5 dk önce', read: false },
  { id: 'n2', type: 'favorite', title: 'İlanın favorilendi', body: 'iPhone 15 Pro ilanın 3 kişi tarafından favorilendi.', time: '1 saat önce', read: false },
  { id: 'n3', type: 'price', title: 'Fiyat düşüşü', body: 'Takip ettiğin MacBook Air M3 ilanı %10 indirim yapıldı.', time: '3 saat önce', read: true },
  { id: 'n4', type: 'system', title: 'Hoş geldin!', body: 'Souq\'a katıldığın için teşekkürler. İlk ilanını vermek ister misin?', time: '2 gün önce', read: true },
];

const typeConfig: Record<NotifType, { icon: any; color: string }> = {
  message: { icon: 'chatbubble', color: '#4A9EFF' },
  favorite: { icon: 'heart', color: '#FF4757' },
  price: { icon: 'pricetag', color: '#FFD700' },
  system: { icon: 'notifications', color: '#007A3D' },
};

export default function NotificationsScreen() {
  const colors = useColors();
  const router = useRouter();
  const [notifs, setNotifs] = useState(MOCK_NOTIFS);

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4, marginRight: Spacing.md }}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={{ flex: 1, color: colors.textPrimary, fontSize: Typography.lg, fontWeight: '700' }}>
          Bildirimler {unreadCount > 0 ? `(${unreadCount})` : ''}
        </Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllRead}>
            <Text style={{ color: colors.primary, fontSize: Typography.sm, fontWeight: '600' }}>Tümünü Okundu Say</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={notifs}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingVertical: Spacing.sm, paddingBottom: 40 }}
        renderItem={({ item }) => {
          const cfg = typeConfig[item.type];
          return (
            <TouchableOpacity
              onPress={() => setNotifs(prev => prev.map(n => n.id === item.id ? { ...n, read: true } : n))}
              style={{ flexDirection: 'row', gap: Spacing.md, paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, backgroundColor: item.read ? 'transparent' : `${colors.primary}08`, borderBottomWidth: 1, borderBottomColor: colors.border }}>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: `${cfg.color}20`, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Ionicons name={cfg.icon} size={20} color={cfg.color} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                  <Text style={{ color: colors.textPrimary, fontSize: Typography.base, fontWeight: item.read ? '500' : '700', flex: 1 }}>{item.title}</Text>
                  {!item.read && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginLeft: Spacing.sm, marginTop: 4 }} />}
                </View>
                <Text style={{ color: colors.textSecondary, fontSize: Typography.sm, lineHeight: 20 }}>{item.body}</Text>
                <Text style={{ color: colors.textMuted, fontSize: Typography.xs, marginTop: 6 }}>{item.time}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingVertical: 80, gap: Spacing.lg }}>
            <Ionicons name="notifications-off-outline" size={64} color={colors.textMuted} />
            <Text style={{ color: colors.textPrimary, fontSize: Typography.lg, fontWeight: '700' }}>Bildirim yok</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
