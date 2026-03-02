import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../src/stores/themeStore';
import { Typography, Spacing, Radius } from '../../src/constants/theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQS = [
  { q: 'Souq ücretsiz mi?', a: 'Evet, Souq\'u kullanmak tamamen ücretsizdir. İlan vermek, aramak ve mesajlaşmak için herhangi bir ücret alınmaz.' },
  { q: 'İlan nasıl oluştururum?', a: 'Alt menüdeki "+" butonuna basarak 6 adımlı ilan formunu doldurabilirsiniz. Kategori, başlık, açıklama, fiyat, fotoğraf ve konum bilgilerini girdikten sonra ilanınız anında yayına girer.' },
  { q: 'Fotoğraf kaç tane ekleyebilirim?', a: 'Her ilana en fazla 10 fotoğraf ekleyebilirsiniz. Fotoğraf eklemek ilanınızın görüntülenme sayısını ve satış ihtimalini artırır.' },
  { q: 'Alıcıyla nasıl iletişime geçirim?', a: 'İlan detay sayfasındaki "Mesaj Gönder" butonuyla satıcıya doğrudan mesaj atabilirsiniz. Mesajlaşma tamamen platform içinden gerçekleşir.' },
  { q: 'İlanımı nasıl silerim veya düzenlerim?', a: '"İlanlarım" sayfasından kendi ilanlarınıza ulaşarak düzenleme veya silme işlemi yapabilirsiniz. Bu özellik yakında aktif olacak.' },
  { q: 'Güvenli alışveriş için öneriler?', a: 'Tanımadığınız kişilere peşin ödeme yapmayın. Mümkünse ürünü bizzat teslim alın. Şüpheli durumları bize bildirin.' },
  { q: 'İlanım neden onaylanmadı?', a: 'İlanlar platformun kullanım koşullarına aykırı içerik barındırıyorsa reddedilebilir. Yasadışı ürünler, yanıltıcı bilgiler veya uygunsuz görseller içeren ilanlar kabul edilmez.' },
  { q: 'Hesabımı nasıl silerim?', a: 'Hesap silme işlemi için "Bize Ulaşın" sayfasından bizimle iletişime geçin. En kısa sürede yardımcı oluruz.' },
];

export default function HelpScreen() {
  const colors = useColors();
  const router = useRouter();
  const [open, setOpen] = useState<number | null>(null);

  const toggle = (idx: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(prev => prev === idx ? null : idx);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4, marginRight: Spacing.md }}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={{ flex: 1, color: colors.textPrimary, fontSize: Typography.lg, fontWeight: '700' }}>Yardım & SSS</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: Spacing.base, paddingBottom: 40 }}>
        <Text style={{ color: colors.textMuted, fontSize: Typography.sm, marginBottom: Spacing.xl, lineHeight: 22 }}>
          Sık sorulan sorular aşağıda listelenmiştir. Aradığınızı bulamazsanız "Bize Ulaşın" sayfasından yardım alabilirsiniz.
        </Text>

        <View style={{ backgroundColor: colors.bgCard, borderRadius: Radius.xl, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' }}>
          {FAQS.map((faq, idx) => (
            <View key={idx} style={{ borderBottomWidth: idx < FAQS.length - 1 ? 1 : 0, borderBottomColor: colors.border }}>
              <TouchableOpacity onPress={() => toggle(idx)}
                style={{ flexDirection: 'row', alignItems: 'center', padding: Spacing.base, gap: Spacing.md }}>
                <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: `${colors.primary}15`, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Text style={{ color: colors.primary, fontSize: Typography.xs, fontWeight: '800' }}>S</Text>
                </View>
                <Text style={{ flex: 1, color: colors.textPrimary, fontSize: Typography.base, fontWeight: open === idx ? '700' : '500', lineHeight: 22 }}>{faq.q}</Text>
                <Ionicons name={open === idx ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textMuted} />
              </TouchableOpacity>
              {open === idx && (
                <View style={{ paddingHorizontal: Spacing.base, paddingBottom: Spacing.base, paddingLeft: Spacing.base + 28 + Spacing.md }}>
                  <Text style={{ color: colors.textSecondary, fontSize: Typography.sm, lineHeight: 22 }}>{faq.a}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <TouchableOpacity onPress={() => router.push('/profile/contact' as any)}
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, backgroundColor: `${colors.primary}10`, borderWidth: 1, borderColor: `${colors.primary}30`, borderRadius: Radius.xl, padding: Spacing.base, marginTop: Spacing.xl }}>
          <Ionicons name="chatbubble-outline" size={20} color={colors.primary} />
          <Text style={{ color: colors.primary, fontSize: Typography.base, fontWeight: '600' }}>Sorunu bulamadın mı? Bize Ulaş</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
