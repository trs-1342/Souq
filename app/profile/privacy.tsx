import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../src/stores/themeStore';
import { Typography, Spacing, Radius } from '../../src/constants/theme';

const SECTIONS = [
  {
    title: '1. Toplanan Veriler',
    body: 'Souq; ad, e-posta, telefon numarası ve konum bilgilerini yalnızca platform işlevselliği için toplar. Bu veriler üçüncü şahıslarla paylaşılmaz ve reklam amaçlı kullanılmaz.',
  },
  {
    title: '2. Verilerin Kullanımı',
    body: 'Toplanan veriler; hesap yönetimi, ilan yayınlama, kullanıcılar arası iletişim ve platform güvenliğinin sağlanması amacıyla kullanılır.',
  },
  {
    title: '3. Veri Güvenliği',
    body: 'Kullanıcı verileri şifrelenmiş ortamlarda saklanır. Şifreler hiçbir zaman düz metin olarak tutulmaz. Güvenlik ihlali tespitinde kullanıcılar derhal bilgilendirilir.',
  },
  {
    title: '4. Çerezler ve Yerel Depolama',
    body: 'Uygulama, kullanıcı tercihlerini ve oturum bilgilerini yerel depoda saklar. Bu veriler yalnızca cihazınızda bulunur ve sunucuya gönderilmez.',
  },
  {
    title: '5. Üçüncü Taraf Hizmetler',
    body: 'Platform, harita ve konum hizmetleri için cihazın konum API\'sini kullanır. Bu veriler Souq sunucularına iletilmez.',
  },
  {
    title: '6. Kullanıcı Hakları (KVKK)',
    body: 'Kişisel Verilerin Korunması Kanunu kapsamında; verilerinize erişme, düzeltme, silme ve taşıma haklarına sahipsiniz. Bu haklarınızı kullanmak için "Bize Ulaşın" sayfasından talepte bulunabilirsiniz.',
  },
  {
    title: '7. Hesap Silme',
    body: 'Hesabınızı ve tüm verilerinizi silmek istediğinizde "Bize Ulaşın" sayfası üzerinden talep oluşturabilirsiniz. Talepler 30 gün içinde işleme alınır.',
  },
  {
    title: '8. Politika Değişiklikleri',
    body: 'Bu gizlilik politikası önceden bildirilmeksizin güncellenebilir. Önemli değişikliklerde kullanıcılar e-posta veya uygulama bildirimi aracılığıyla bilgilendirilir.',
  },
];

export default function PrivacyScreen() {
  const colors = useColors();
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4, marginRight: Spacing.md }}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={{ flex: 1, color: colors.textPrimary, fontSize: Typography.lg, fontWeight: '700' }}>Gizlilik Politikası</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: Spacing.base, paddingBottom: 40 }}>
        <Text style={{ color: colors.textMuted, fontSize: Typography.xs, marginBottom: Spacing.xl }}>Son güncelleme: Mart 2026</Text>

        <Text style={{ color: colors.textSecondary, fontSize: Typography.sm, lineHeight: 24, marginBottom: Spacing.xl }}>
          Souq olarak kullanıcılarımızın gizliliğine saygı duyar ve kişisel verilerin korunmasını öncelikli görevimiz olarak kabul ederiz.
        </Text>

        <View style={{ gap: Spacing.lg }}>
          {SECTIONS.map(section => (
            <View key={section.title} style={{ backgroundColor: colors.bgCard, borderRadius: Radius.xl, borderWidth: 1, borderColor: colors.border, padding: Spacing.xl, gap: Spacing.sm }}>
              <Text style={{ color: colors.textPrimary, fontSize: Typography.base, fontWeight: '700' }}>{section.title}</Text>
              <Text style={{ color: colors.textSecondary, fontSize: Typography.sm, lineHeight: 22 }}>{section.body}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
