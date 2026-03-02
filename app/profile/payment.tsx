import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../src/stores/themeStore';
import { Typography, Spacing, Radius } from '../../src/constants/theme';

export default function PaymentScreen() {
  const colors = useColors();
  const router = useRouter();

  const soon = () => Alert.alert('Yakında', 'Bu özellik yakında aktif olacak.');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4, marginRight: Spacing.md }}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={{ flex: 1, color: colors.textPrimary, fontSize: Typography.lg, fontWeight: '700' }}>Ödeme Yöntemleri</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: Spacing.base, gap: Spacing.xl, paddingBottom: 40 }}>

        {/* Bilgi Kartı */}
        <View style={{ backgroundColor: `${colors.primary}12`, borderRadius: Radius.xl, borderWidth: 1, borderColor: `${colors.primary}30`, padding: Spacing.xl, gap: Spacing.md }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
            <Ionicons name="information-circle" size={24} color={colors.primary} />
            <Text style={{ color: colors.primary, fontSize: Typography.md, fontWeight: '700' }}>Ödeme Sistemi Hakkında</Text>
          </View>
          <Text style={{ color: colors.textSecondary, fontSize: Typography.sm, lineHeight: 22 }}>
            Souq şu an için alıcı ve satıcıları buluşturan bir platformdur. Ödemeler taraflar arasında doğrudan gerçekleşir.
            Güvenli ödeme sistemi yakında hayata geçecek.
          </Text>
        </View>

        {/* Kayıtlı Yöntemler */}
        <View>
          <Text style={{ color: colors.textMuted, fontSize: Typography.xs, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: Spacing.md }}>Kayıtlı Yöntemler</Text>
          <View style={{ backgroundColor: colors.bgCard, borderRadius: Radius.xl, borderWidth: 1, borderColor: colors.border, padding: Spacing.xl, alignItems: 'center', gap: Spacing.md }}>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: colors.bgElevated, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="card-outline" size={28} color={colors.textMuted} />
            </View>
            <Text style={{ color: colors.textPrimary, fontSize: Typography.base, fontWeight: '600' }}>Henüz ödeme yöntemi yok</Text>
            <Text style={{ color: colors.textMuted, fontSize: Typography.sm, textAlign: 'center', lineHeight: 20 }}>Güvenli ödeme sistemi aktif olduğunda banka kartınızı ve IBAN bilgilerinizi buraya ekleyebileceksiniz.</Text>
          </View>
        </View>

        {/* Yakında gelecek özellikler */}
        <View>
          <Text style={{ color: colors.textMuted, fontSize: Typography.xs, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: Spacing.md }}>Yakında</Text>
          <View style={{ backgroundColor: colors.bgCard, borderRadius: Radius.xl, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' }}>
            {[
              { icon: 'card-outline', label: 'Kredi / Banka Kartı', desc: 'Visa, Mastercard destekli güvenli ödeme' },
              { icon: 'phone-portrait-outline', label: 'Mobil Ödeme', desc: 'Papara, Sipay ve diğer cüzdanlar' },
              { icon: 'business-outline', label: 'IBAN ile Transfer', desc: 'Satış bedelini doğrudan IBAN\'ına al' },
              { icon: 'shield-checkmark-outline', label: 'Emanet Sistemi (Escrow)', desc: 'Ürün teslim onaylanana kadar ödeme bekler' },
            ].map((item, idx, arr) => (
              <TouchableOpacity key={item.label} onPress={soon}
                style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.base, borderBottomWidth: idx < arr.length - 1 ? 1 : 0, borderBottomColor: colors.border, opacity: 0.6 }}>
                <View style={{ width: 40, height: 40, borderRadius: Radius.md, backgroundColor: `${colors.primary}15`, alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name={item.icon as any} size={20} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.textPrimary, fontSize: Typography.base, fontWeight: '500' }}>{item.label}</Text>
                  <Text style={{ color: colors.textMuted, fontSize: Typography.xs, marginTop: 2 }}>{item.desc}</Text>
                </View>
                <View style={{ backgroundColor: colors.bgElevated, paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full }}>
                  <Text style={{ color: colors.textMuted, fontSize: 10, fontWeight: '600' }}>YAKINDA</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
