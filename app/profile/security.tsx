import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../src/stores/themeStore';
import { Typography, Spacing, Radius } from '../../src/constants/theme';

export default function SecurityScreen() {
  const colors = useColors();
  const router = useRouter();
  const [emailVerify, setEmailVerify] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChangePassword = () => {
    const e: Record<string, string> = {};
    if (!currentPw) e.currentPw = 'Mevcut şifre zorunlu';
    if (!newPw) e.newPw = 'Yeni şifre zorunlu';
    else if (newPw.length < 6) e.newPw = 'En az 6 karakter';
    if (newPw !== confirmPw) e.confirmPw = 'Şifreler eşleşmiyor';
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    Alert.alert('Başarılı', 'Şifreniz güncellendi.', [{ text: 'Tamam', onPress: () => { setCurrentPw(''); setNewPw(''); setConfirmPw(''); } }]);
  };

  const pwFields = [
    { key: 'currentPw', label: 'Mevcut Şifre', value: currentPw, set: setCurrentPw, show: showCurrent, toggle: () => setShowCurrent(!showCurrent) },
    { key: 'newPw', label: 'Yeni Şifre', value: newPw, set: setNewPw, show: showNew, toggle: () => setShowNew(!showNew) },
    { key: 'confirmPw', label: 'Yeni Şifre Tekrar', value: confirmPw, set: setConfirmPw, show: showNew, toggle: () => setShowNew(!showNew) },
  ];

  const strengthScore = !newPw ? 0 : newPw.length < 6 ? 1 : newPw.length < 10 ? 2 : /[A-Z]/.test(newPw) && /[0-9]/.test(newPw) ? 4 : 3;
  const strengthLabel = ['', 'Zayıf', 'Orta', 'Güçlü', 'Çok Güçlü'];
  const strengthColor = ['', colors.error, colors.warning, colors.secondary, colors.primary];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4, marginRight: Spacing.md }}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={{ flex: 1, color: colors.textPrimary, fontSize: Typography.lg, fontWeight: '700' }}>Güvenlik & Şifre</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: Spacing.base, gap: Spacing.xl, paddingBottom: 40 }}>

        {/* Şifre Değiştir */}
        <View>
          <Text style={{ color: colors.textMuted, fontSize: Typography.xs, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: Spacing.md }}>Şifre Değiştir</Text>
          <View style={{ backgroundColor: colors.bgCard, borderRadius: Radius.xl, borderWidth: 1, borderColor: colors.border, padding: Spacing.xl, gap: Spacing.base }}>
            {pwFields.map(field => (
              <View key={field.key}>
                <Text style={{ color: colors.textSecondary, fontSize: Typography.sm, fontWeight: '600', marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 }}>{field.label}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bgInput, borderRadius: Radius.md, borderWidth: 1, borderColor: errors[field.key] ? colors.error : colors.border, paddingHorizontal: Spacing.base, height: 52, gap: Spacing.sm }}>
                  <Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} />
                  <TextInput style={{ flex: 1, color: colors.textPrimary, fontSize: Typography.base, paddingVertical: 0 }}
                    value={field.value} onChangeText={field.set}
                    placeholder="••••••••" placeholderTextColor={colors.textMuted}
                    secureTextEntry={!field.show} />
                  <TouchableOpacity onPress={field.toggle}>
                    <Ionicons name={field.show ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.textMuted} />
                  </TouchableOpacity>
                </View>
                {errors[field.key] && <Text style={{ color: colors.error, fontSize: Typography.xs, marginTop: 4 }}>{errors[field.key]}</Text>}
              </View>
            ))}

            {/* Şifre gücü */}
            {newPw.length > 0 && (
              <View style={{ gap: 6 }}>
                <View style={{ flexDirection: 'row', gap: 4 }}>
                  {[1, 2, 3, 4].map(i => (
                    <View key={i} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: i <= strengthScore ? strengthColor[strengthScore] : colors.border }} />
                  ))}
                </View>
                <Text style={{ color: strengthColor[strengthScore], fontSize: Typography.xs, fontWeight: '600' }}>{strengthLabel[strengthScore]}</Text>
              </View>
            )}

            <TouchableOpacity onPress={handleChangePassword} style={{ backgroundColor: colors.primary, borderRadius: Radius.lg, paddingVertical: 14, alignItems: 'center', marginTop: Spacing.sm }}>
              <Text style={{ color: '#fff', fontSize: Typography.base, fontWeight: '700' }}>Şifreyi Güncelle</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Doğrulama Ayarları */}
        <View>
          <Text style={{ color: colors.textMuted, fontSize: Typography.xs, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: Spacing.md }}>Giriş Güvenliği</Text>
          <View style={{ backgroundColor: colors.bgCard, borderRadius: Radius.xl, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' }}>
            {[
              { label: 'E-posta ile Giriş Doğrulama', desc: 'Her girişte e-postanıza doğrulama kodu gönderilir.', icon: 'mail-outline', value: emailVerify, set: setEmailVerify },
              { label: 'İki Faktörlü Doğrulama', desc: 'Ekstra güvenlik katmanı ekler (yakında).', icon: 'shield-checkmark-outline', value: twoFactor, set: setTwoFactor, disabled: true },
            ].map((item, idx, arr) => (
              <View key={item.label} style={{ flexDirection: 'row', alignItems: 'center', padding: Spacing.base, borderBottomWidth: idx < arr.length - 1 ? 1 : 0, borderBottomColor: colors.border, opacity: item.disabled ? 0.5 : 1 }}>
                <View style={{ width: 40, height: 40, borderRadius: Radius.md, backgroundColor: `${colors.primary}15`, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md }}>
                  <Ionicons name={item.icon as any} size={20} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.textPrimary, fontSize: Typography.base, fontWeight: '500' }}>{item.label}</Text>
                  <Text style={{ color: colors.textMuted, fontSize: Typography.xs, marginTop: 2, lineHeight: 16 }}>{item.desc}</Text>
                </View>
                <Switch value={item.value} onValueChange={item.disabled ? undefined : item.set}
                  trackColor={{ false: colors.border, true: `${colors.primary}60` }}
                  thumbColor={item.value ? colors.primary : colors.textMuted}
                  ios_backgroundColor={colors.border} />
              </View>
            ))}
          </View>
        </View>

        {/* Oturumlar */}
        <View>
          <Text style={{ color: colors.textMuted, fontSize: Typography.xs, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: Spacing.md }}>Aktif Oturumlar</Text>
          <View style={{ backgroundColor: colors.bgCard, borderRadius: Radius.xl, borderWidth: 1, borderColor: colors.border, padding: Spacing.base }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
              <Ionicons name="phone-portrait-outline" size={24} color={colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.textPrimary, fontSize: Typography.base, fontWeight: '600' }}>Bu Cihaz</Text>
                <Text style={{ color: colors.textMuted, fontSize: Typography.xs, marginTop: 2 }}>Şu an aktif • iOS</Text>
              </View>
              <View style={{ backgroundColor: `${colors.secondary}20`, paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full }}>
                <Text style={{ color: colors.secondary, fontSize: Typography.xs, fontWeight: '700' }}>Aktif</Text>
              </View>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
