import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../src/constants/theme';
import { CATEGORIES } from '../../src/constants/categories';
import { CategorySlug, ListingCondition, PriceType } from '../../src/types';

type Step = 'category' | 'details' | 'price' | 'photos' | 'location' | 'review';

const STEPS: Step[] = ['category', 'details', 'price', 'photos', 'location', 'review'];
const STEP_LABELS: Record<Step, string> = {
  category: 'Kategori',
  details: 'Detaylar',
  price: 'Fiyat',
  photos: 'Fotoğraflar',
  location: 'Konum',
  review: 'İnceleme',
};

const CONDITIONS: { value: ListingCondition; label: string; desc: string }[] = [
  { value: 'new', label: 'Sıfır', desc: 'Hiç kullanılmamış, ambalajında' },
  { value: 'like-new', label: 'Sıfır Gibi', desc: 'Çok az kullanılmış' },
  { value: 'good', label: 'İyi', desc: 'Normal kullanım izleri var' },
  { value: 'fair', label: 'Orta', desc: 'Belirgin yıpranma var' },
  { value: 'poor', label: 'Kötü', desc: 'Hasarlı, onarım gerekebilir' },
];

const PRICE_TYPES: { value: PriceType; label: string; icon: string }[] = [
  { value: 'fixed', label: 'Sabit Fiyat', icon: 'lock-closed-outline' },
  { value: 'negotiable', label: 'Pazarlık', icon: 'chatbubble-outline' },
  { value: 'swap', label: 'Takas', icon: 'swap-horizontal-outline' },
  { value: 'free', label: 'Ücretsiz', icon: 'gift-outline' },
];

export default function PostScreen() {
  const [step, setStep] = useState<Step>('category');
  const [form, setForm] = useState({
    categorySlug: undefined as CategorySlug | undefined,
    subcategoryId: undefined as string | undefined,
    title: '',
    description: '',
    condition: undefined as ListingCondition | undefined,
    priceType: 'fixed' as PriceType,
    price: '',
    city: '',
    district: '',
  });

  const stepIndex = STEPS.indexOf(step);
  const progress = (stepIndex + 1) / STEPS.length;

  const updateForm = (key: string, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const goNext = () => {
    const next = STEPS[stepIndex + 1];
    if (next) setStep(next);
  };

  const goBack = () => {
    const prev = STEPS[stepIndex - 1];
    if (prev) setStep(prev);
  };

  const handlePublish = () => {
    Alert.alert('✅ İlan Yayında!', 'İlanınız başarıyla oluşturuldu.');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Üst Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={stepIndex === 0 ? undefined : goBack}
          style={[styles.backBtn, stepIndex === 0 && { opacity: 0 }]}
        >
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.stepInfo}>
          <Text style={styles.stepLabel}>{STEP_LABELS[step]}</Text>
          <Text style={styles.stepCount}>
            {stepIndex + 1} / {STEPS.length}
          </Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ─── Kategori Seçimi ─── */}
          {step === 'category' && (
            <View>
              <Text style={styles.stepTitle}>Hangi kategoride?</Text>
              <Text style={styles.stepDesc}>İlanınıza en uygun kategoriyi seçin.</Text>
              <View style={styles.categoryGrid}>
                {CATEGORIES.map((cat) => {
                  const isSelected = form.categorySlug === cat.slug;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.catItem,
                        isSelected && { borderColor: cat.color, backgroundColor: `${cat.color}15` },
                      ]}
                      onPress={() => {
                        updateForm('categorySlug', cat.slug);
                        updateForm('subcategoryId', undefined);
                      }}
                      activeOpacity={0.75}
                    >
                      <View
                        style={[
                          styles.catIcon,
                          { backgroundColor: isSelected ? cat.color : Colors.bgElevated },
                        ]}
                      >
                        <Ionicons
                          name={cat.icon as any}
                          size={20}
                          color={isSelected ? Colors.white : cat.color}
                        />
                      </View>
                      <Text
                        style={[
                          styles.catLabel,
                          isSelected && { color: cat.color, fontWeight: Typography.bold },
                        ]}
                      >
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Alt kategori */}
              {form.categorySlug && (() => {
                const cat = CATEGORIES.find((c) => c.slug === form.categorySlug);
                if (!cat?.subcategories?.length) return null;
                return (
                  <View style={styles.subSection}>
                    <Text style={styles.subTitle}>Alt Kategori (opsiyonel)</Text>
                    <View style={styles.subGrid}>
                      {cat.subcategories.map((sub) => (
                        <TouchableOpacity
                          key={sub.id}
                          style={[
                            styles.subItem,
                            form.subcategoryId === sub.id && styles.subItemActive,
                          ]}
                          onPress={() => updateForm('subcategoryId', sub.id)}
                        >
                          <Text
                            style={[
                              styles.subLabel,
                              form.subcategoryId === sub.id && styles.subLabelActive,
                            ]}
                          >
                            {sub.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                );
              })()}
            </View>
          )}

          {/* ─── İlan Detayları ─── */}
          {step === 'details' && (
            <View>
              <Text style={styles.stepTitle}>İlan Detayları</Text>
              <Text style={styles.stepDesc}>Alıcıların göreceği bilgileri girin.</Text>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>İlan Başlığı *</Text>
                <TextInput
                  style={styles.input}
                  value={form.title}
                  onChangeText={(v) => updateForm('title', v)}
                  placeholder="Örn: iPhone 15 Pro Max 256GB"
                  placeholderTextColor={Colors.textMuted}
                  maxLength={80}
                />
                <Text style={styles.charCount}>{form.title.length}/80</Text>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Açıklama *</Text>
                <TextInput
                  style={[styles.input, styles.textarea]}
                  value={form.description}
                  onChangeText={(v) => updateForm('description', v)}
                  placeholder="Ürünü detaylıca açıklayın. Ne kadar çok bilgi verirseniz o kadar hızlı satarsınız."
                  placeholderTextColor={Colors.textMuted}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                  maxLength={2000}
                />
                <Text style={styles.charCount}>{form.description.length}/2000</Text>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Durum *</Text>
                {CONDITIONS.map((cond) => (
                  <TouchableOpacity
                    key={cond.value}
                    style={[
                      styles.condItem,
                      form.condition === cond.value && styles.condItemActive,
                    ]}
                    onPress={() => updateForm('condition', cond.value)}
                  >
                    <View style={styles.condRadio}>
                      {form.condition === cond.value && <View style={styles.condDot} />}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          styles.condLabel,
                          form.condition === cond.value && { color: Colors.primary },
                        ]}
                      >
                        {cond.label}
                      </Text>
                      <Text style={styles.condDesc}>{cond.desc}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* ─── Fiyat ─── */}
          {step === 'price' && (
            <View>
              <Text style={styles.stepTitle}>Fiyat Belirleyin</Text>
              <Text style={styles.stepDesc}>Doğru fiyat daha hızlı satış demek.</Text>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Fiyat Türü *</Text>
                <View style={styles.priceTypeGrid}>
                  {PRICE_TYPES.map((pt) => (
                    <TouchableOpacity
                      key={pt.value}
                      style={[
                        styles.priceTypeItem,
                        form.priceType === pt.value && styles.priceTypeItemActive,
                      ]}
                      onPress={() => updateForm('priceType', pt.value)}
                    >
                      <Ionicons
                        name={pt.icon as any}
                        size={20}
                        color={form.priceType === pt.value ? Colors.primary : Colors.textSecondary}
                      />
                      <Text
                        style={[
                          styles.priceTypeLabel,
                          form.priceType === pt.value && { color: Colors.primary },
                        ]}
                      >
                        {pt.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {(form.priceType === 'fixed' || form.priceType === 'negotiable') && (
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Fiyat (₺) *</Text>
                  <View style={styles.priceInputWrapper}>
                    <Text style={styles.currencySymbol}>₺</Text>
                    <TextInput
                      style={styles.priceInput}
                      value={form.price}
                      onChangeText={(v) => updateForm('price', v.replace(/[^0-9]/g, ''))}
                      placeholder="0"
                      placeholderTextColor={Colors.textMuted}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              )}
            </View>
          )}

          {/* ─── Fotoğraflar ─── */}
          {step === 'photos' && (
            <View>
              <Text style={styles.stepTitle}>Fotoğraf Ekle</Text>
              <Text style={styles.stepDesc}>
                En fazla 10 fotoğraf ekleyebilirsiniz. İlk fotoğraf kapak olarak görünür.
              </Text>

              <TouchableOpacity style={styles.photoUpload} activeOpacity={0.7}>
                <Ionicons name="camera-outline" size={40} color={Colors.textMuted} />
                <Text style={styles.photoUploadTitle}>Fotoğraf Seç</Text>
                <Text style={styles.photoUploadDesc}>Galeriden veya kameradan</Text>
              </TouchableOpacity>

              <View style={styles.photoTips}>
                <Text style={styles.tipsTitle}>💡 İpuçları</Text>
                <Text style={styles.tip}>• İyi aydınlatılmış, net fotoğraflar çekin</Text>
                <Text style={styles.tip}>• Tüm açılardan fotoğrafı ekleyin</Text>
                <Text style={styles.tip}>• Hasarlar varsa gösterin — güven oluşturur</Text>
              </View>
            </View>
          )}

          {/* ─── Konum ─── */}
          {step === 'location' && (
            <View>
              <Text style={styles.stepTitle}>Konum Bilgisi</Text>
              <Text style={styles.stepDesc}>Alıcılar size daha kolay ulaşsın.</Text>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Şehir *</Text>
                <TextInput
                  style={styles.input}
                  value={form.city}
                  onChangeText={(v) => updateForm('city', v)}
                  placeholder="Örn: İstanbul"
                  placeholderTextColor={Colors.textMuted}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>İlçe *</Text>
                <TextInput
                  style={styles.input}
                  value={form.district}
                  onChangeText={(v) => updateForm('district', v)}
                  placeholder="Örn: Kadıköy"
                  placeholderTextColor={Colors.textMuted}
                />
              </View>

              <TouchableOpacity style={styles.locationAutoBtn} activeOpacity={0.75}>
                <Ionicons name="locate-outline" size={20} color={Colors.info} />
                <Text style={styles.locationAutoBtnText}>Konumumu Otomatik Al</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ─── İnceleme ─── */}
          {step === 'review' && (
            <View>
              <Text style={styles.stepTitle}>İlanı İnceleyin</Text>
              <Text style={styles.stepDesc}>Yayına almadan önce bilgileri kontrol edin.</Text>

              {[
                {
                  icon: 'grid-outline',
                  label: 'Kategori',
                  value: CATEGORIES.find((c) => c.slug === form.categorySlug)?.label ?? '—',
                },
                { icon: 'document-text-outline', label: 'Başlık', value: form.title || '—' },
                {
                  icon: 'pricetag-outline',
                  label: 'Fiyat',
                  value:
                    form.priceType === 'free'
                      ? 'Ücretsiz'
                      : form.priceType === 'swap'
                      ? 'Takas'
                      : form.price
                      ? `${Number(form.price).toLocaleString('tr-TR')} ₺`
                      : '—',
                },
                {
                  icon: 'location-outline',
                  label: 'Konum',
                  value: [form.district, form.city].filter(Boolean).join(', ') || '—',
                },
              ].map((row) => (
                <View key={row.label} style={styles.reviewRow}>
                  <Ionicons name={row.icon as any} size={20} color={Colors.textSecondary} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reviewLabel}>{row.label}</Text>
                    <Text style={styles.reviewValue}>{row.value}</Text>
                  </View>
                </View>
              ))}

              <View style={styles.publishNote}>
                <Ionicons name="shield-checkmark-outline" size={20} color={Colors.secondary} />
                <Text style={styles.publishNoteText}>
                  İlanınız kurallarımıza uygun olduğunda onay sürecine alınır ve yayımlanır.
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Alt Buton */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.nextBtn,
            step === 'category' && !form.categorySlug && styles.nextBtnDisabled,
          ]}
          onPress={step === 'review' ? handlePublish : goNext}
          disabled={step === 'category' && !form.categorySlug}
          activeOpacity={0.85}
        >
          <Text style={styles.nextBtnText}>
            {step === 'review' ? '🚀 İlanı Yayınla' : 'Devam Et'}
          </Text>
          {step !== 'review' && (
            <Ionicons name="arrow-forward" size={20} color={Colors.white} />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  backBtn: { padding: 4 },
  stepInfo: { alignItems: 'center' },
  stepLabel: {
    color: Colors.textPrimary,
    fontSize: Typography.md,
    fontWeight: Typography.bold,
  },
  stepCount: { color: Colors.textMuted, fontSize: Typography.xs, marginTop: 2 },
  progressTrack: {
    height: 3,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.base,
    borderRadius: Radius.full,
    overflow: 'hidden',
    marginBottom: Spacing.base,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
  },
  content: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xl,
  },
  stepTitle: {
    color: Colors.textPrimary,
    fontSize: Typography['2xl'],
    fontWeight: Typography.heavy,
    marginBottom: Spacing.xs,
  },
  stepDesc: {
    color: Colors.textMuted,
    fontSize: Typography.base,
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  // Kategori Grid
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  catItem: {
    width: '30%',
    flexGrow: 1,
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  catIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.xs,
    fontWeight: Typography.medium,
    textAlign: 'center',
  },
  subSection: { marginTop: Spacing.xl },
  subTitle: {
    color: Colors.textSecondary,
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    marginBottom: Spacing.md,
  },
  subGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  subItem: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  subItemActive: { borderColor: Colors.primary, backgroundColor: `${Colors.primary}15` },
  subLabel: { color: Colors.textSecondary, fontSize: Typography.sm },
  subLabelActive: { color: Colors.primary, fontWeight: Typography.semibold },
  // Fields
  fieldGroup: { marginBottom: Spacing.xl },
  fieldLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: Colors.bgInput,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.base,
    paddingVertical: 14,
    color: Colors.textPrimary,
    fontSize: Typography.base,
  },
  textarea: {
    height: 140,
    paddingTop: 14,
  },
  charCount: {
    color: Colors.textMuted,
    fontSize: Typography.xs,
    textAlign: 'right',
    marginTop: 6,
  },
  // Condition
  condItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.base,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.bgCard,
    marginBottom: Spacing.sm,
  },
  condItemActive: { borderColor: Colors.primary, backgroundColor: `${Colors.primary}10` },
  condRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  condDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  condLabel: {
    color: Colors.textPrimary,
    fontSize: Typography.base,
    fontWeight: Typography.medium,
  },
  condDesc: {
    color: Colors.textMuted,
    fontSize: Typography.sm,
    marginTop: 2,
  },
  // Price Type
  priceTypeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  priceTypeItem: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.bgCard,
  },
  priceTypeItemActive: { borderColor: Colors.primary, backgroundColor: `${Colors.primary}10` },
  priceTypeLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
  },
  priceInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgInput,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.base,
  },
  currencySymbol: {
    color: Colors.textMuted,
    fontSize: Typography.xl,
    marginRight: Spacing.sm,
  },
  priceInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    paddingVertical: 16,
  },
  // Photos
  photoUpload: {
    height: 200,
    borderRadius: Radius.xl,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.bgCard,
    marginBottom: Spacing.xl,
  },
  photoUploadTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.md,
    fontWeight: Typography.bold,
  },
  photoUploadDesc: { color: Colors.textMuted, fontSize: Typography.sm },
  photoTips: {
    backgroundColor: Colors.bgElevated,
    padding: Spacing.base,
    borderRadius: Radius.lg,
    gap: Spacing.xs,
  },
  tipsTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    marginBottom: 4,
  },
  tip: { color: Colors.textSecondary, fontSize: Typography.sm, lineHeight: 20 },
  // Location
  locationAutoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.base,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.info,
    backgroundColor: `${Colors.info}10`,
    marginTop: Spacing.sm,
  },
  locationAutoBtnText: {
    color: Colors.info,
    fontSize: Typography.base,
    fontWeight: Typography.medium,
  },
  // Review
  reviewRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    padding: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  reviewLabel: { color: Colors.textMuted, fontSize: Typography.xs, marginBottom: 2 },
  reviewValue: {
    color: Colors.textPrimary,
    fontSize: Typography.base,
    fontWeight: Typography.medium,
  },
  publishNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    backgroundColor: `${Colors.secondary}15`,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    marginTop: Spacing.xl,
    borderWidth: 1,
    borderColor: `${Colors.secondary}30`,
  },
  publishNoteText: {
    color: Colors.textSecondary,
    fontSize: Typography.sm,
    lineHeight: 20,
    flex: 1,
  },
  // Footer
  footer: {
    padding: Spacing.base,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: 16,
    ...Shadow.glow,
  },
  nextBtnDisabled: { opacity: 0.4 },
  nextBtnText: {
    color: Colors.white,
    fontSize: Typography.md,
    fontWeight: Typography.bold,
  },
});
