import { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, Alert, Image, FlatList, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useColors } from '../../src/stores/themeStore';
import { useAppStore } from '../../src/stores/appStore';
import { CATEGORIES } from '../../src/constants/categories';
import { searchCities, searchDistricts } from '../../src/constants/cities';
import { Typography, Spacing, Radius } from '../../src/constants/theme';
import { CategorySlug, ListingCondition, PriceType, ListingImage } from '../../src/types';

type Step = 'category' | 'details' | 'price' | 'photos' | 'location' | 'review';
const STEPS: Step[] = ['category', 'details', 'price', 'photos', 'location', 'review'];
const STEP_LABELS: Record<Step, string> = { category: 'Kategori', details: 'Detaylar', price: 'Fiyat', photos: 'Fotoğraflar', location: 'Konum', review: 'İnceleme' };

const CONDITIONS: { value: ListingCondition; label: string; desc: string }[] = [
  { value: 'new', label: 'Sıfır', desc: 'Hiç kullanılmamış' },
  { value: 'like-new', label: 'Sıfır Gibi', desc: 'Çok az kullanılmış' },
  { value: 'good', label: 'İyi', desc: 'Normal kullanım izleri' },
  { value: 'fair', label: 'Orta', desc: 'Belirgin yıpranma' },
  { value: 'poor', label: 'Kötü', desc: 'Hasarlı' },
];

const PRICE_TYPES: { value: PriceType; label: string; icon: any }[] = [
  { value: 'fixed', label: 'Sabit Fiyat', icon: 'lock-closed-outline' },
  { value: 'negotiable', label: 'Pazarlık', icon: 'chatbubble-outline' },
  { value: 'swap', label: 'Takas', icon: 'swap-horizontal-outline' },
  { value: 'free', label: 'Ücretsiz', icon: 'gift-outline' },
];

export default function PostScreen() {
  const colors = useColors();
  const router = useRouter();
  const { addListing, currentUser } = useAppStore();

  const [step, setStep] = useState<Step>('category');
  const [images, setImages] = useState<ListingImage[]>([]);
  const [cityQuery, setCityQuery] = useState('');
  const [districtQuery, setDistrictQuery] = useState('');
  const [showCityList, setShowCityList] = useState(false);
  const [showDistrictList, setShowDistrictList] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [form, setForm] = useState({
    categorySlug: undefined as CategorySlug | undefined,
    subcategoryId: undefined as string | undefined,
    title: '', description: '',
    condition: undefined as ListingCondition | undefined,
    priceType: 'fixed' as PriceType,
    price: '', city: '', district: '',
  });

  const stepIndex = STEPS.indexOf(step);
  const update = (key: string, value: any) => setForm(p => ({ ...p, [key]: value }));
  const goNext = () => { const n = STEPS[stepIndex + 1]; if (n) setStep(n); };
  const goBack = () => { const p = STEPS[stepIndex - 1]; if (p) setStep(p); else router.back(); };

  // ── Fotoğraf seç ──
  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('İzin Gerekli', 'Galeriye erişim izni verin.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true, quality: 0.8, selectionLimit: 10,
    });
    if (!result.canceled) {
      const newImgs: ListingImage[] = result.assets.map((a, i) => ({
        id: `img_${Date.now()}_${i}`, uri: a.uri, order: images.length + i,
      }));
      setImages(prev => [...prev, ...newImgs].slice(0, 10));
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') { Alert.alert('İzin Gerekli', 'Kamera izni verin.'); return; }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!result.canceled) {
      const newImg: ListingImage = { id: `img_${Date.now()}`, uri: result.assets[0].uri, order: images.length };
      setImages(prev => [...prev, newImg].slice(0, 10));
    }
  };

  const removeImage = (id: string) => setImages(prev => prev.filter(i => i.id !== id));

  // ── Konum al ──
  const autoLocation = async () => {
    setLoadingLocation(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') { Alert.alert('İzin Gerekli', 'Konum iznini açın.'); setLoadingLocation(false); return; }
    try {
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const [geo] = await Location.reverseGeocodeAsync({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      if (geo) {
        const city = geo.city ?? geo.region ?? '';
        const district = geo.district ?? geo.subregion ?? '';
        update('city', city); update('district', district);
        setCityQuery(city); setDistrictQuery(district);
      }
    } catch { Alert.alert('Hata', 'Konum alınamadı.'); }
    setLoadingLocation(false);
  };

  // ── İlan oluştur ──
  const submitListing = () => {
    const newListing = {
      id: `l_${Date.now()}`,
      title: form.title, description: form.description,
      price: Number(form.price) || 0,
      priceType: form.priceType, currency: 'TRY' as const,
      condition: form.condition ?? 'good',
      status: 'active' as const,
      categorySlug: form.categorySlug ?? 'diger',
      subcategoryId: form.subcategoryId,
      images, location: { city: form.city, district: form.district },
      userId: currentUser?.id ?? 'u1',
      viewCount: 0, favoriteCount: 0,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      relevanceScore: 0.5,
    };
    addListing(newListing);
    Alert.alert('🎉 İlan Yayında!', 'İlanınız başarıyla oluşturuldu.', [
      { text: 'İlanı Gör', onPress: () => router.push(`/listing/${newListing.id}` as any) },
      { text: 'Ana Sayfa', onPress: () => router.push('/(tabs)') },
    ]);
  };

  const citySuggestions = cityQuery ? searchCities(cityQuery) : [];
  const districtSuggestions = form.city && districtQuery ? searchDistricts(form.city, districtQuery) : [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'bottom']}>
      {/* Top bar */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.base, paddingVertical: Spacing.md }}>
        <TouchableOpacity onPress={goBack} style={{ padding: 4 }}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: colors.textPrimary, fontSize: Typography.md, fontWeight: '700' }}>{STEP_LABELS[step]}</Text>
          <Text style={{ color: colors.textMuted, fontSize: Typography.xs }}>{stepIndex + 1} / {STEPS.length}</Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      {/* Progress */}
      <View style={{ height: 3, backgroundColor: colors.border, marginHorizontal: Spacing.base, borderRadius: 99, overflow: 'hidden', marginBottom: Spacing.base }}>
        <View style={{ height: '100%', backgroundColor: colors.primary, width: `${((stepIndex + 1) / STEPS.length) * 100}%`, borderRadius: 99 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: Spacing.base, paddingBottom: Spacing.xl }} keyboardShouldPersistTaps="handled">

          {/* ── Kategori ── */}
          {step === 'category' && (
            <View>
              <Text style={{ color: colors.textPrimary, fontSize: Typography['2xl'], fontWeight: '800', marginBottom: 4 }}>Hangi kategoride?</Text>
              <Text style={{ color: colors.textMuted, fontSize: Typography.base, marginBottom: Spacing.xl }}>İlanınıza en uygun kategoriyi seçin.</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
                {CATEGORIES.map(cat => {
                  const active = form.categorySlug === cat.slug;
                  return (
                    <TouchableOpacity key={cat.id} onPress={() => { update('categorySlug', cat.slug); update('subcategoryId', undefined); }}
                      style={{ width: '30%', flexGrow: 1, alignItems: 'center', padding: Spacing.md, backgroundColor: active ? `${cat.color}15` : colors.bgCard, borderRadius: Radius.lg, borderWidth: 1.5, borderColor: active ? cat.color : colors.border, gap: Spacing.sm }}>
                      <View style={{ width: 44, height: 44, borderRadius: Radius.md, backgroundColor: active ? cat.color : colors.bgElevated, alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons name={cat.icon as any} size={20} color={active ? '#fff' : cat.color} />
                      </View>
                      <Text style={{ color: active ? cat.color : colors.textSecondary, fontSize: Typography.xs, fontWeight: active ? '700' : '500', textAlign: 'center' }}>{cat.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* ── Detaylar ── */}
          {step === 'details' && (
            <View>
              <Text style={{ color: colors.textPrimary, fontSize: Typography['2xl'], fontWeight: '800', marginBottom: 4 }}>İlan Detayları</Text>
              <Text style={{ color: colors.textMuted, fontSize: Typography.base, marginBottom: Spacing.xl }}>Alıcıların göreceği bilgileri girin.</Text>

              <Text style={{ color: colors.textSecondary, fontSize: Typography.sm, fontWeight: '600', marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 }}>Başlık *</Text>
              <TextInput style={{ backgroundColor: colors.bgInput, borderWidth: 1, borderColor: colors.border, borderRadius: Radius.md, paddingHorizontal: Spacing.base, paddingVertical: 14, color: colors.textPrimary, fontSize: Typography.base, marginBottom: 6 }}
                value={form.title} onChangeText={v => update('title', v)} placeholder="Örn: iPhone 15 Pro Max 256GB" placeholderTextColor={colors.textMuted} maxLength={80} />
              <Text style={{ color: colors.textMuted, fontSize: Typography.xs, textAlign: 'right', marginBottom: Spacing.xl }}>{form.title.length}/80</Text>

              <Text style={{ color: colors.textSecondary, fontSize: Typography.sm, fontWeight: '600', marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 }}>Açıklama *</Text>
              <TextInput style={{ backgroundColor: colors.bgInput, borderWidth: 1, borderColor: colors.border, borderRadius: Radius.md, paddingHorizontal: Spacing.base, paddingTop: 14, color: colors.textPrimary, fontSize: Typography.base, height: 140, textAlignVertical: 'top', marginBottom: 6 }}
                value={form.description} onChangeText={v => update('description', v)} placeholder="Ürünü detaylıca açıklayın..." placeholderTextColor={colors.textMuted} multiline maxLength={2000} />
              <Text style={{ color: colors.textMuted, fontSize: Typography.xs, textAlign: 'right', marginBottom: Spacing.xl }}>{form.description.length}/2000</Text>

              <Text style={{ color: colors.textSecondary, fontSize: Typography.sm, fontWeight: '600', marginBottom: Spacing.md, textTransform: 'uppercase', letterSpacing: 0.5 }}>Durum *</Text>
              {CONDITIONS.map(cond => (
                <TouchableOpacity key={cond.value} onPress={() => update('condition', cond.value)}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.base, borderRadius: Radius.md, borderWidth: 1.5, borderColor: form.condition === cond.value ? colors.primary : colors.border, backgroundColor: form.condition === cond.value ? `${colors.primary}10` : colors.bgCard, marginBottom: Spacing.sm }}>
                  <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: form.condition === cond.value ? colors.primary : colors.border, alignItems: 'center', justifyContent: 'center' }}>
                    {form.condition === cond.value && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary }} />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: form.condition === cond.value ? colors.primary : colors.textPrimary, fontWeight: '600', fontSize: Typography.base }}>{cond.label}</Text>
                    <Text style={{ color: colors.textMuted, fontSize: Typography.sm }}>{cond.desc}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* ── Fiyat ── */}
          {step === 'price' && (
            <View>
              <Text style={{ color: colors.textPrimary, fontSize: Typography['2xl'], fontWeight: '800', marginBottom: 4 }}>Fiyat Belirleyin</Text>
              <Text style={{ color: colors.textMuted, fontSize: Typography.base, marginBottom: Spacing.xl }}>Doğru fiyat daha hızlı satış demek.</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.xl }}>
                {PRICE_TYPES.map(pt => (
                  <TouchableOpacity key={pt.value} onPress={() => update('priceType', pt.value)}
                    style={{ flex: 1, minWidth: '45%', flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.md, borderRadius: Radius.md, borderWidth: 1.5, borderColor: form.priceType === pt.value ? colors.primary : colors.border, backgroundColor: form.priceType === pt.value ? `${colors.primary}10` : colors.bgCard }}>
                    <Ionicons name={pt.icon} size={20} color={form.priceType === pt.value ? colors.primary : colors.textSecondary} />
                    <Text style={{ color: form.priceType === pt.value ? colors.primary : colors.textSecondary, fontWeight: '600', fontSize: Typography.sm }}>{pt.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {(form.priceType === 'fixed' || form.priceType === 'negotiable') && (
                <View>
                  <Text style={{ color: colors.textSecondary, fontSize: Typography.sm, fontWeight: '600', marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 }}>Fiyat (₺) *</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bgInput, borderWidth: 1, borderColor: colors.border, borderRadius: Radius.md, paddingHorizontal: Spacing.base }}>
                    <Text style={{ color: colors.textMuted, fontSize: Typography.xl, marginRight: Spacing.sm }}>₺</Text>
                    <TextInput style={{ flex: 1, color: colors.textPrimary, fontSize: Typography.xl, fontWeight: '700', paddingVertical: 16 }}
                      value={form.price} onChangeText={v => update('price', v.replace(/[^0-9]/g, ''))}
                      placeholder="0" placeholderTextColor={colors.textMuted} keyboardType="numeric" />
                  </View>
                </View>
              )}
            </View>
          )}

          {/* ── Fotoğraflar ── */}
          {step === 'photos' && (
            <View>
              <Text style={{ color: colors.textPrimary, fontSize: Typography['2xl'], fontWeight: '800', marginBottom: 4 }}>Fotoğraf Ekle</Text>
              <Text style={{ color: colors.textMuted, fontSize: Typography.base, marginBottom: Spacing.xl }}>En fazla 10 fotoğraf ekleyebilirsiniz. ({images.length}/10)</Text>

              {/* Seçilen fotoğraflar */}
              {images.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.base }}
                  contentContainerStyle={{ gap: Spacing.sm, paddingVertical: 4 }}>
                  {images.map(img => (
                    <View key={img.id} style={{ position: 'relative' }}>
                      <Image source={{ uri: img.uri }} style={{ width: 100, height: 100, borderRadius: Radius.md }} />
                      <TouchableOpacity onPress={() => removeImage(img.id)}
                        style={{ position: 'absolute', top: -6, right: -6, backgroundColor: colors.error, borderRadius: 12, width: 22, height: 22, alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons name="close" size={14} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              )}

              {images.length < 10 && (
                <View style={{ flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xl }}>
                  <TouchableOpacity onPress={pickImages} style={{ flex: 1, height: 100, borderRadius: Radius.xl, borderWidth: 2, borderColor: colors.border, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: colors.bgCard }}>
                    <Ionicons name="images-outline" size={28} color={colors.textMuted} />
                    <Text style={{ color: colors.textMuted, fontSize: Typography.sm }}>Galeriden Seç</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={takePhoto} style={{ flex: 1, height: 100, borderRadius: Radius.xl, borderWidth: 2, borderColor: colors.border, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: colors.bgCard }}>
                    <Ionicons name="camera-outline" size={28} color={colors.textMuted} />
                    <Text style={{ color: colors.textMuted, fontSize: Typography.sm }}>Kamera</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* ── Konum ── */}
          {step === 'location' && (
            <View>
              <Text style={{ color: colors.textPrimary, fontSize: Typography['2xl'], fontWeight: '800', marginBottom: 4 }}>Konum Bilgisi</Text>
              <Text style={{ color: colors.textMuted, fontSize: Typography.base, marginBottom: Spacing.xl }}>Alıcılar size daha kolay ulaşsın.</Text>

              {/* Otomatik konum */}
              <TouchableOpacity onPress={autoLocation} disabled={loadingLocation}
                style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.base, borderRadius: Radius.md, borderWidth: 1, borderColor: colors.info, backgroundColor: `${colors.info}10`, marginBottom: Spacing.xl }}>
                <Ionicons name={loadingLocation ? 'hourglass-outline' : 'locate-outline'} size={20} color={colors.info} />
                <Text style={{ color: colors.info, fontSize: Typography.base, fontWeight: '600' }}>
                  {loadingLocation ? 'Konum alınıyor...' : 'Konumumu Otomatik Al'}
                </Text>
              </TouchableOpacity>

              {/* Şehir */}
              <Text style={{ color: colors.textSecondary, fontSize: Typography.sm, fontWeight: '600', marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 }}>Şehir *</Text>
              <TextInput
                style={{ backgroundColor: colors.bgInput, borderWidth: 1, borderColor: colors.border, borderRadius: Radius.md, paddingHorizontal: Spacing.base, paddingVertical: 14, color: colors.textPrimary, fontSize: Typography.base, marginBottom: 4 }}
                value={cityQuery} onChangeText={v => { setCityQuery(v); update('city', v); setShowCityList(true); }}
                placeholder="Şehir seçin..." placeholderTextColor={colors.textMuted}
                onFocus={() => setShowCityList(true)} />
              {showCityList && citySuggestions.length > 0 && (
                <View style={{ backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: Radius.md, marginBottom: Spacing.base, maxHeight: 200, overflow: 'hidden' }}>
                  <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled>
                    {citySuggestions.slice(0, 8).map(city => (
                      <TouchableOpacity key={city} onPress={() => { update('city', city); setCityQuery(city); setShowCityList(false); update('district', ''); setDistrictQuery(''); }}
                        style={{ padding: Spacing.base, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                        <Text style={{ color: colors.textPrimary, fontSize: Typography.base }}>{city}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* İlçe */}
              {form.city && (
                <>
                  <Text style={{ color: colors.textSecondary, fontSize: Typography.sm, fontWeight: '600', marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 }}>İlçe *</Text>
                  <TextInput
                    style={{ backgroundColor: colors.bgInput, borderWidth: 1, borderColor: colors.border, borderRadius: Radius.md, paddingHorizontal: Spacing.base, paddingVertical: 14, color: colors.textPrimary, fontSize: Typography.base, marginBottom: 4 }}
                    value={districtQuery} onChangeText={v => { setDistrictQuery(v); update('district', v); setShowDistrictList(true); }}
                    placeholder="İlçe seçin..." placeholderTextColor={colors.textMuted}
                    onFocus={() => setShowDistrictList(true)} />
                  {showDistrictList && districtSuggestions.length > 0 && (
                    <View style={{ backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: Radius.md, maxHeight: 200, overflow: 'hidden' }}>
                      <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled>
                        {districtSuggestions.slice(0, 8).map(d => (
                          <TouchableOpacity key={d} onPress={() => { update('district', d); setDistrictQuery(d); setShowDistrictList(false); }}
                            style={{ padding: Spacing.base, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                            <Text style={{ color: colors.textPrimary, fontSize: Typography.base }}>{d}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </>
              )}
            </View>
          )}

          {/* ── İnceleme ── */}
          {step === 'review' && (
            <View>
              <Text style={{ color: colors.textPrimary, fontSize: Typography['2xl'], fontWeight: '800', marginBottom: 4 }}>İnceleme</Text>
              <Text style={{ color: colors.textMuted, fontSize: Typography.base, marginBottom: Spacing.xl }}>Yayına almadan önce kontrol edin.</Text>
              {[
                { icon: 'grid-outline', label: 'Kategori', value: CATEGORIES.find(c => c.slug === form.categorySlug)?.label ?? '—' },
                { icon: 'document-text-outline', label: 'Başlık', value: form.title || '—' },
                { icon: 'camera-outline', label: 'Fotoğraf', value: `${images.length} fotoğraf` },
                { icon: 'pricetag-outline', label: 'Fiyat', value: form.priceType === 'free' ? 'Ücretsiz' : form.priceType === 'swap' ? 'Takas' : form.price ? `${Number(form.price).toLocaleString('tr-TR')} ₺` : '—' },
                { icon: 'location-outline', label: 'Konum', value: [form.district, form.city].filter(Boolean).join(', ') || '—' },
              ].map(row => (
                <View key={row.label} style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.base, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                  <Ionicons name={row.icon as any} size={20} color={colors.textSecondary} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.textMuted, fontSize: Typography.xs }}>{row.label}</Text>
                    <Text style={{ color: colors.textPrimary, fontSize: Typography.base, fontWeight: '600', marginTop: 2 }}>{row.value}</Text>
                  </View>
                </View>
              ))}
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md, backgroundColor: `${colors.secondary}15`, borderRadius: Radius.lg, padding: Spacing.base, marginTop: Spacing.xl, borderWidth: 1, borderColor: `${colors.secondary}30` }}>
                <Ionicons name="shield-checkmark-outline" size={20} color={colors.secondary} />
                <Text style={{ color: colors.textSecondary, fontSize: Typography.sm, lineHeight: 20, flex: 1 }}>
                  İlanınız kurallara uygunsa onaylanıp yayımlanacak.
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer */}
      <View style={{ padding: Spacing.base, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.bg }}>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, backgroundColor: colors.primary, borderRadius: Radius.lg, paddingVertical: 16, opacity: step === 'category' && !form.categorySlug ? 0.4 : 1 }}
          onPress={step === 'review' ? submitListing : goNext}
          disabled={step === 'category' && !form.categorySlug}>
          <Text style={{ color: '#fff', fontSize: Typography.md, fontWeight: '700' }}>
            {step === 'review' ? '🚀 İlanı Yayınla' : 'Devam Et'}
          </Text>
          {step !== 'review' && <Ionicons name="arrow-forward" size={20} color="#fff" />}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
