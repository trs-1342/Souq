import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../src/stores/themeStore';
import { useAppStore } from '../../src/stores/appStore';
import { Typography, Spacing, Radius } from '../../src/constants/theme';

const TOPICS = ['Teknik Sorun', 'Hesap Problemi', 'İlan Sorunu', 'Ödeme', 'Güvenlik', 'Diğer'];

export default function ContactScreen() {
  const colors = useColors();
  const router = useRouter();
  const { currentUser } = useAppStore();
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!topic) { Alert.alert('Konu seçin', 'Lütfen bir konu seçin.'); return; }
    if (message.trim().length < 10) { Alert.alert('Mesaj çok kısa', 'En az 10 karakter yazın.'); return; }
    setSent(true);
  };

  if (sent) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl }} edges={['top']}>
        <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: `${colors.primary}20`, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xl }}>
          <Ionicons name="checkmark-circle" size={44} color={colors.primary} />
        </View>
        <Text style={{ color: colors.textPrimary, fontSize: Typography.xl, fontWeight: '800', textAlign: 'center', marginBottom: Spacing.md }}>Mesajınız Alındı!</Text>
        <Text style={{ color: colors.textMuted, fontSize: Typography.base, textAlign: 'center', lineHeight: 24, marginBottom: Spacing['2xl'] }}>
          En kısa sürede e-posta yoluyla geri dönüş yapacağız.{'\n'}
          Ortalama yanıt süresi: 24 saat.
        </Text>
        <TouchableOpacity onPress={() => router.back()} style={{ backgroundColor: colors.primary, paddingHorizontal: Spacing.xl, paddingVertical: 14, borderRadius: Radius.full }}>
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: Typography.base }}>Geri Dön</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4, marginRight: Spacing.md }}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={{ flex: 1, color: colors.textPrimary, fontSize: Typography.lg, fontWeight: '700' }}>Bize Ulaşın</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: Spacing.base, gap: Spacing.xl, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">

        {/* Direkt kanallar */}
        <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
          {[
            { icon: 'logo-github', label: 'GitHub', url: 'https://github.com/trs-1342/Souq' },
            { icon: 'globe-outline', label: 'Web', url: 'https://hattab.vercel.app' },
          ].map(item => (
            <TouchableOpacity key={item.label} onPress={() => Linking.openURL(item.url)}
              style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.bgCard, borderRadius: Radius.lg, borderWidth: 1, borderColor: colors.border, padding: Spacing.md }}>
              <Ionicons name={item.icon as any} size={20} color={colors.textSecondary} />
              <Text style={{ color: colors.textSecondary, fontSize: Typography.sm, fontWeight: '600' }}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Form */}
        <View style={{ backgroundColor: colors.bgCard, borderRadius: Radius.xl, borderWidth: 1, borderColor: colors.border, padding: Spacing.xl, gap: Spacing.xl }}>
          {/* E-posta (readonly) */}
          <View>
            <Text style={{ color: colors.textSecondary, fontSize: Typography.sm, fontWeight: '600', marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 }}>E-posta</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bgElevated, borderRadius: Radius.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: Spacing.base, height: 52, gap: Spacing.sm }}>
              <Ionicons name="mail-outline" size={18} color={colors.textMuted} />
              <Text style={{ flex: 1, color: colors.textMuted, fontSize: Typography.base }}>{currentUser?.email}</Text>
            </View>
          </View>

          {/* Konu */}
          <View>
            <Text style={{ color: colors.textSecondary, fontSize: Typography.sm, fontWeight: '600', marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 }}>Konu *</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
              {TOPICS.map(t => (
                <TouchableOpacity key={t} onPress={() => setTopic(t)}
                  style={{ paddingHorizontal: Spacing.md, paddingVertical: 8, borderRadius: Radius.full, borderWidth: 1.5, borderColor: topic === t ? colors.primary : colors.border, backgroundColor: topic === t ? `${colors.primary}15` : 'transparent' }}>
                  <Text style={{ color: topic === t ? colors.primary : colors.textSecondary, fontSize: Typography.sm, fontWeight: topic === t ? '700' : '500' }}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Mesaj */}
          <View>
            <Text style={{ color: colors.textSecondary, fontSize: Typography.sm, fontWeight: '600', marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 }}>Mesajınız *</Text>
            <TextInput
              style={{ backgroundColor: colors.bgInput, borderRadius: Radius.md, borderWidth: 1, borderColor: colors.border, padding: Spacing.base, color: colors.textPrimary, fontSize: Typography.base, height: 140, textAlignVertical: 'top' }}
              value={message} onChangeText={setMessage}
              placeholder="Sorununuzu veya önerinizi buraya yazın..." placeholderTextColor={colors.textMuted}
              multiline maxLength={500}
            />
            <Text style={{ color: colors.textMuted, fontSize: Typography.xs, textAlign: 'right', marginTop: 4 }}>{message.length}/500</Text>
          </View>

          <TouchableOpacity onPress={handleSend} style={{ backgroundColor: colors.primary, borderRadius: Radius.lg, paddingVertical: 16, alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: Typography.base, fontWeight: '700' }}>Gönder</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
