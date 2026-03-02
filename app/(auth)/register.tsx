import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../src/stores/appStore';
import { useColors } from '../../src/stores/themeStore';
import { Typography, Spacing, Radius } from '../../src/constants/theme';

export default function RegisterScreen() {
  const colors = useColors();
  const router = useRouter();
  const { register } = useAppStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Ad soyad zorunlu';
    if (!email.trim()) e.email = 'E-posta zorunlu';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Geçerli bir e-posta girin';
    if (!password) e.password = 'Şifre zorunlu';
    else if (password.length < 6) e.password = 'En az 6 karakter';
    if (password !== passwordConfirm) e.passwordConfirm = 'Şifreler eşleşmiyor';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const result = register(name.trim(), email.trim(), password);
    setLoading(false);
    if (!result.success) setErrors({ email: result.error });
  };

  const s = makeStyles(colors);

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={s.header}>
            <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
              <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <View style={s.titleArea}>
            <Text style={s.title}>Hesap Oluştur</Text>
            <Text style={s.subtitle}>Hemen ücretsiz kaydol</Text>
          </View>

          <View style={s.form}>
            {[
              { key: 'name', label: 'Ad Soyad', value: name, set: setName, placeholder: 'Adınız Soyadınız', icon: 'person-outline', type: 'default' },
              { key: 'email', label: 'E-posta', value: email, set: setEmail, placeholder: 'ornek@email.com', icon: 'mail-outline', type: 'email-address' },
            ].map(field => (
              <View key={field.key} style={s.fieldGroup}>
                <Text style={s.label}>{field.label}</Text>
                <View style={[s.inputWrapper, errors[field.key] ? s.inputError : null]}>
                  <Ionicons name={field.icon as any} size={18} color={colors.textMuted} />
                  <TextInput style={s.input} value={field.value} onChangeText={field.set}
                    placeholder={field.placeholder} placeholderTextColor={colors.textMuted}
                    keyboardType={field.type as any} autoCapitalize={field.key === 'email' ? 'none' : 'words'} />
                </View>
                {errors[field.key] && <Text style={s.errorText}>{errors[field.key]}</Text>}
              </View>
            ))}

            <View style={s.fieldGroup}>
              <Text style={s.label}>Şifre</Text>
              <View style={[s.inputWrapper, errors.password ? s.inputError : null]}>
                <Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} />
                <TextInput style={s.input} value={password} onChangeText={setPassword}
                  placeholder="••••••••" placeholderTextColor={colors.textMuted} secureTextEntry={!showPass} />
                <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                  <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.textMuted} />
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={s.errorText}>{errors.password}</Text>}
            </View>

            <View style={s.fieldGroup}>
              <Text style={s.label}>Şifre Tekrar</Text>
              <View style={[s.inputWrapper, errors.passwordConfirm ? s.inputError : null]}>
                <Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} />
                <TextInput style={s.input} value={passwordConfirm} onChangeText={setPasswordConfirm}
                  placeholder="••••••••" placeholderTextColor={colors.textMuted} secureTextEntry={!showPass} />
              </View>
              {errors.passwordConfirm && <Text style={s.errorText}>{errors.passwordConfirm}</Text>}
            </View>

            <TouchableOpacity style={[s.btn, loading && { opacity: 0.7 }]} onPress={handleRegister} disabled={loading}>
              <Text style={s.btnText}>{loading ? 'Kaydediliyor...' : 'Kayıt Ol'}</Text>
            </TouchableOpacity>
          </View>

          <View style={s.footer}>
            <Text style={s.footerText}>Zaten hesabın var mı? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={s.footerLink}>Giriş Yap</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const makeStyles = (colors: any) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { flexGrow: 1, padding: Spacing.base },
  header: { marginBottom: Spacing.base },
  backBtn: { padding: 4, alignSelf: 'flex-start' },
  titleArea: { marginBottom: Spacing['2xl'] },
  title: { color: colors.textPrimary, fontSize: Typography['2xl'], fontWeight: '800' },
  subtitle: { color: colors.textMuted, fontSize: Typography.base, marginTop: 4 },
  form: { backgroundColor: colors.bgCard, borderRadius: Radius.xl, padding: Spacing.xl, borderWidth: 1, borderColor: colors.border, marginBottom: Spacing.xl },
  fieldGroup: { marginBottom: Spacing.base },
  label: { color: colors.textSecondary, fontSize: Typography.sm, fontWeight: '600', marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bgInput, borderRadius: Radius.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: Spacing.base, gap: Spacing.sm, height: 52 },
  inputError: { borderColor: colors.error },
  input: { flex: 1, color: colors.textPrimary, fontSize: Typography.base, paddingVertical: 0 },
  errorText: { color: colors.error, fontSize: Typography.xs, marginTop: 4 },
  btn: { backgroundColor: colors.primary, borderRadius: Radius.lg, paddingVertical: 16, alignItems: 'center', marginTop: Spacing.md, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  btnText: { color: colors.white, fontSize: Typography.md, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center' },
  footerText: { color: colors.textMuted, fontSize: Typography.base },
  footerLink: { color: colors.primary, fontSize: Typography.base, fontWeight: '700' },
});
