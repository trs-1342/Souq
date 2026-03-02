import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../src/stores/themeStore';
import { useAppStore } from '../../src/stores/appStore';
import { Typography, Spacing, Radius } from '../../src/constants/theme';

export default function EditListingScreen() {
  const colors = useColors();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { listings, updateListing, currentUser } = useAppStore();
  const listing = listings.find(l => l.id === id);

  if (!listing || listing.userId !== currentUser?.id) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }} edges={['top']}>
        <Text style={{ color: colors.textMuted }}>Bu ilan bulunamadı veya düzenleme yetkiniz yok.</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: colors.primary }}>Geri Dön</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const [title, setTitle] = useState(listing.title);
  const [description, setDescription] = useState(listing.description);
  const [price, setPrice] = useState(listing.price > 0 ? String(listing.price) : '');
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    if (!title.trim()) { Alert.alert('Başlık boş', 'Başlık zorunludur.'); return; }
    setSaving(true);
    setTimeout(() => {
      updateListing(listing.id, { title: title.trim(), description: description.trim(), price: Number(price) || 0 });
      setSaving(false);
      router.back();
    }, 400);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4, marginRight: Spacing.md }}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={{ flex: 1, color: colors.textPrimary, fontSize: Typography.lg, fontWeight: '700' }}>İlanı Düzenle</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving}
          style={{ backgroundColor: colors.primary, paddingHorizontal: Spacing.md, paddingVertical: 8, borderRadius: Radius.full, opacity: saving ? 0.6 : 1 }}>
          <Text style={{ color: '#fff', fontSize: Typography.sm, fontWeight: '700' }}>{saving ? 'Kaydediliyor...' : 'Kaydet'}</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: Spacing.base, gap: Spacing.xl, paddingBottom: 60 }} keyboardShouldPersistTaps="handled">
          <View>
            <Text style={{ color: colors.textSecondary, fontSize: Typography.sm, fontWeight: '600', marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 }}>Başlık *</Text>
            <TextInput style={{ backgroundColor: colors.bgInput, borderWidth: 1, borderColor: colors.border, borderRadius: Radius.md, paddingHorizontal: Spacing.base, paddingVertical: 14, color: colors.textPrimary, fontSize: Typography.base }}
              value={title} onChangeText={setTitle} maxLength={80} placeholder="Başlık..." placeholderTextColor={colors.textMuted} />
            <Text style={{ color: colors.textMuted, fontSize: Typography.xs, textAlign: 'right', marginTop: 4 }}>{title.length}/80</Text>
          </View>

          <View>
            <Text style={{ color: colors.textSecondary, fontSize: Typography.sm, fontWeight: '600', marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 }}>Açıklama</Text>
            <TextInput style={{ backgroundColor: colors.bgInput, borderWidth: 1, borderColor: colors.border, borderRadius: Radius.md, paddingHorizontal: Spacing.base, paddingTop: 14, color: colors.textPrimary, fontSize: Typography.base, height: 160, textAlignVertical: 'top' }}
              value={description} onChangeText={setDescription} maxLength={2000} multiline placeholder="Açıklama..." placeholderTextColor={colors.textMuted} />
            <Text style={{ color: colors.textMuted, fontSize: Typography.xs, textAlign: 'right', marginTop: 4 }}>{description.length}/2000</Text>
          </View>

          {(listing.priceType === 'fixed' || listing.priceType === 'negotiable') && (
            <View>
              <Text style={{ color: colors.textSecondary, fontSize: Typography.sm, fontWeight: '600', marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 }}>Fiyat (₺)</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bgInput, borderWidth: 1, borderColor: colors.border, borderRadius: Radius.md, paddingHorizontal: Spacing.base }}>
                <Text style={{ color: colors.textMuted, fontSize: Typography.xl, marginRight: Spacing.sm }}>₺</Text>
                <TextInput style={{ flex: 1, color: colors.textPrimary, fontSize: Typography.xl, fontWeight: '700', paddingVertical: 16 }}
                  value={price} onChangeText={v => setPrice(v.replace(/[^0-9]/g, ''))} placeholder="0" placeholderTextColor={colors.textMuted} keyboardType="numeric" />
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
