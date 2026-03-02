import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../src/stores/themeStore';
import { Typography, Spacing, Radius } from '../../src/constants/theme';

export default function AboutScreen() {
  const colors = useColors();
  const router = useRouter();

  const open = (url: string) => Linking.openURL(url);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4, marginRight: Spacing.md }}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={{ flex: 1, color: colors.textPrimary, fontSize: Typography.lg, fontWeight: '700' }}>Hakkında</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: Spacing.base, gap: Spacing.xl, paddingBottom: 60 }}>

        {/* Logo & Uygulama */}
        <View style={{ alignItems: 'center', paddingVertical: Spacing.xl, gap: Spacing.md }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: `${colors.primary}20`, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 40 }}>🛒</Text>
          </View>
          <View style={{ alignItems: 'center', gap: 4 }}>
            <Text style={{ color: colors.textPrimary, fontSize: Typography['2xl'], fontWeight: '800', letterSpacing: 2 }}>Souq</Text>
            <Text style={{ color: colors.textMuted, fontSize: Typography.sm }}>Versiyon 1.0.0</Text>
            <Text style={{ color: colors.textMuted, fontSize: Typography.xs }}>Mart 2026</Text>
          </View>
          <View style={{ backgroundColor: `${colors.primary}15`, paddingHorizontal: Spacing.lg, paddingVertical: 8, borderRadius: Radius.full, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons name="logo-github" size={16} color={colors.primary} />
            <Text style={{ color: colors.primary, fontSize: Typography.sm, fontWeight: '700' }}>Açık Kaynak</Text>
          </View>
        </View>

        {/* Hakkında */}
        <View style={{ backgroundColor: colors.bgCard, borderRadius: Radius.xl, borderWidth: 1, borderColor: colors.border, padding: Spacing.xl, gap: Spacing.md }}>
          <Text style={{ color: colors.textPrimary, fontSize: Typography.md, fontWeight: '700' }}>Souq Nedir?</Text>
          <Text style={{ color: colors.textSecondary, fontSize: Typography.sm, lineHeight: 24 }}>
            Souq, Türkiye'nin modern ikinci el pazar yeri uygulamasıdır. Kullanıcılar arasında güvenli, hızlı ve şeffaf alışveriş deneyimi sunmayı hedefler.
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: Typography.sm, lineHeight: 24 }}>
            React Native ve Expo ile geliştirilmiş, tamamen açık kaynaklı bu proje topluluk katkısına açıktır.
          </Text>
        </View>

        {/* Geliştirici */}
        <View>
          <Text style={{ color: colors.textMuted, fontSize: Typography.xs, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: Spacing.md }}>Geliştirici</Text>
          <View style={{ backgroundColor: colors.bgCard, borderRadius: Radius.xl, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' }}>
            <View style={{ padding: Spacing.xl, flexDirection: 'row', alignItems: 'center', gap: Spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}>
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#fff', fontSize: Typography.lg, fontWeight: '800' }}>T</Text>
              </View>
              <View>
                <Text style={{ color: colors.textPrimary, fontSize: Typography.base, fontWeight: '700' }}>trs-1342</Text>
                <Text style={{ color: colors.textMuted, fontSize: Typography.sm, marginTop: 2 }}>Full Stack Developer</Text>
              </View>
            </View>

            {[
              { icon: 'globe-outline', label: 'Web Sitesi', url: 'https://hattab.vercel.app', value: 'hattab.vercel.app' },
              { icon: 'logo-github', label: 'GitHub', url: 'https://github.com/trs-1342', value: 'github.com/trs-1342' },
            ].map((link, idx, arr) => (
              <TouchableOpacity key={link.label} onPress={() => open(link.url)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.base, borderBottomWidth: idx < arr.length - 1 ? 1 : 0, borderBottomColor: colors.border }}>
                <Ionicons name={link.icon as any} size={20} color={colors.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.textMuted, fontSize: Typography.xs }}>{link.label}</Text>
                  <Text style={{ color: colors.primary, fontSize: Typography.sm, fontWeight: '600' }}>{link.value}</Text>
                </View>
                <Ionicons name="open-outline" size={16} color={colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Açık Kaynak */}
        <View>
          <Text style={{ color: colors.textMuted, fontSize: Typography.xs, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: Spacing.md }}>Açık Kaynak</Text>
          <TouchableOpacity onPress={() => open('https://github.com/trs-1342/Souq')}
            style={{ backgroundColor: colors.bgCard, borderRadius: Radius.xl, borderWidth: 1, borderColor: colors.border, padding: Spacing.xl, gap: Spacing.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
              <Ionicons name="logo-github" size={28} color={colors.textPrimary} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.textPrimary, fontSize: Typography.base, fontWeight: '700' }}>trs-1342/Souq</Text>
                <Text style={{ color: colors.textMuted, fontSize: Typography.sm, marginTop: 2 }}>github.com/trs-1342/Souq</Text>
              </View>
              <Ionicons name="open-outline" size={18} color={colors.textMuted} />
            </View>
            <Text style={{ color: colors.textSecondary, fontSize: Typography.sm, lineHeight: 22 }}>
              Bu proje MIT lisansı altında açık kaynak olarak yayınlanmıştır. Katkıda bulunmak, hata bildirmek veya geliştirmeleri takip etmek için GitHub reposunu ziyaret edin.
            </Text>
            <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
              {['MIT Lisansı', 'React Native', 'Expo', 'TypeScript'].map(tag => (
                <View key={tag} style={{ backgroundColor: colors.bgElevated, paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full }}>
                  <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: '600' }}>{tag}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        </View>

        {/* Teknolojiler */}
        <View>
          <Text style={{ color: colors.textMuted, fontSize: Typography.xs, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: Spacing.md }}>Kullanılan Teknolojiler</Text>
          <View style={{ backgroundColor: colors.bgCard, borderRadius: Radius.xl, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' }}>
            {[
              { label: 'React Native', value: '0.81.5' },
              { label: 'Expo SDK', value: '54' },
              { label: 'Expo Router', value: '6.x' },
              { label: 'Zustand', value: 'State Yönetimi' },
              { label: 'TypeScript', value: 'Tip Güvenliği' },
            ].map((tech, idx, arr) => (
              <View key={tech.label} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.base, borderBottomWidth: idx < arr.length - 1 ? 1 : 0, borderBottomColor: colors.border }}>
                <Text style={{ color: colors.textPrimary, fontSize: Typography.base }}>{tech.label}</Text>
                <Text style={{ color: colors.textMuted, fontSize: Typography.sm }}>{tech.value}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={{ color: colors.textMuted, fontSize: Typography.xs, textAlign: 'center', lineHeight: 20 }}>
          © 2026 Souq. MIT Lisansı ile açık kaynak.{'\n'}Sevgiyle yapıldı 🖤
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}
