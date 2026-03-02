import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../src/stores/themeStore';
import { useAppStore } from '../../src/stores/appStore';
import { Typography, Spacing, Radius } from '../../src/constants/theme';

export default function ProfileEditScreen() {
  const colors = useColors();
  const router = useRouter();
  const { currentUser, updateUser } = useAppStore();

  const [name, setName] = useState(currentUser?.name ?? '');
  const [phone, setPhone] = useState(currentUser?.phone ?? '');
  const [bio, setBio] = useState(currentUser?.bio ?? '');
  const [city, setCity] = useState(currentUser?.location?.city ?? '');

  const handleSave = () => {
    if (!name.trim()) { Alert.alert('Hata', 'Ad soyad boş olamaz.'); return; }
    updateUser({ name: name.trim(), phone: phone.trim(), bio: bio.trim(), location: city ? { city, district: '' } : undefined });
    Alert.alert('Kaydedildi', 'Profiliniz güncellendi.', [{ text: 'Tamam', onPress: () => router.back() }]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4, marginRight: Spacing.md }}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={{ flex: 1, color: colors.textPrimary, fontSize: Typography.lg, fontWeight: '700' }}>Profili Düzenle</Text>
        <TouchableOpacity onPress={handleSave} style={{ backgroundColor: colors.primary, paddingHorizontal: Spacing.base, paddingVertical: 8, borderRadius: Radius.full }}>
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: Typography.sm }}>Kaydet</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: Spacing.base, gap: Spacing.base }}>
        {/* Avatar */}
        <View style={{ alignItems: 'center', paddingVertical: Spacing.xl }}>
          <View style={{ width: 90, height: 90, borderRadius: 45, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md }}>
            <Text style={{ color: '#fff', fontSize: Typography['2xl'], fontWeight: '800' }}>
              {name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </Text>
          </View>
          <TouchableOpacity onPress={() => Alert.alert('Yakında', 'Fotoğraf yükleme yakında aktif olacak.')}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.bgElevated, paddingHorizontal: Spacing.base, paddingVertical: 8, borderRadius: Radius.full }}>
            <Ionicons name="camera-outline" size={16} color={colors.textSecondary} />
            <Text style={{ color: colors.textSecondary, fontSize: Typography.sm, fontWeight: '600' }}>Fotoğraf Değiştir</Text>
          </TouchableOpacity>
        </View>

        {/* Alanlar */}
        {[
          { label: 'Ad Soyad *', value: name, set: setName, placeholder: 'Adınız Soyadınız', icon: 'person-outline', multi: false },
          { label: 'Telefon', value: phone, set: setPhone, placeholder: '+90 5XX XXX XX XX', icon: 'call-outline', multi: false, keyboard: 'phone-pad' },
          { label: 'Şehir', value: city, set: setCity, placeholder: 'İstanbul', icon: 'location-outline', multi: false },
        ].map(field => (
          <View key={field.label}>
            <Text style={{ color: colors.textSecondary, fontSize: Typography.sm, fontWeight: '600', marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {field.label}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bgInput, borderRadius: Radius.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: Spacing.base, gap: Spacing.sm, height: 52 }}>
              <Ionicons name={field.icon as any} size={18} color={colors.textMuted} />
              <TextInput
                style={{ flex: 1, color: colors.textPrimary, fontSize: Typography.base, paddingVertical: 0 }}
                value={field.value} onChangeText={field.set}
                placeholder={field.placeholder} placeholderTextColor={colors.textMuted}
                keyboardType={(field as any).keyboard ?? 'default'}
              />
            </View>
          </View>
        ))}

        {/* Bio */}
        <View>
          <Text style={{ color: colors.textSecondary, fontSize: Typography.sm, fontWeight: '600', marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 }}>Hakkımda</Text>
          <TextInput
            style={{ backgroundColor: colors.bgInput, borderRadius: Radius.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, color: colors.textPrimary, fontSize: Typography.base, height: 100, textAlignVertical: 'top' }}
            value={bio} onChangeText={setBio}
            placeholder="Kendinizden bahsedin..." placeholderTextColor={colors.textMuted}
            multiline maxLength={200}
          />
          <Text style={{ color: colors.textMuted, fontSize: Typography.xs, textAlign: 'right', marginTop: 4 }}>{bio.length}/200</Text>
        </View>

        {/* E-posta (readonly) */}
        <View>
          <Text style={{ color: colors.textSecondary, fontSize: Typography.sm, fontWeight: '600', marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 }}>E-posta</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bgElevated, borderRadius: Radius.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: Spacing.base, gap: Spacing.sm, height: 52 }}>
            <Ionicons name="mail-outline" size={18} color={colors.textMuted} />
            <Text style={{ flex: 1, color: colors.textMuted, fontSize: Typography.base }}>{currentUser?.email}</Text>
            <Ionicons name="lock-closed-outline" size={16} color={colors.textMuted} />
          </View>
          <Text style={{ color: colors.textMuted, fontSize: Typography.xs, marginTop: 4 }}>E-posta değiştirilemez.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
