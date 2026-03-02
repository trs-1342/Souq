import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../src/stores/appStore';
import { useColors } from '../../src/stores/themeStore';
import { Typography, Spacing, Radius } from '../../src/constants/theme';

export default function LoginScreen() {
  const colors = useColors();
  const router = useRouter();
  const { login } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim()) e.email = 'E-posta zorunlu';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Geçerli bir e-posta girin';
    if (!password) e.password = 'Şifre zorunlu';
    else if (password.length < 6) e.password = 'En az 6 karakter';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const result = login(email.trim(), password);
    setLoading(false);
    if (!result.success) Alert.alert('Giriş Başarısız', result.error);
  };

  const s = makeStyles(colors);

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">

          {/* Logo */}
          <View style={s.logoArea}>
            <View style={s.logoCircle}>
              <Image
                source={require('../../assets/icon.png')}
                style={s.logoImage}
                resizeMode="cover"
              />
            </View>
            <Text style={s.appName}>Souq</Text>
            <Text style={s.tagline}>Akıllı alışverişin adresi</Text>
          </View>

          {/* Form */}
          <View style={s.form}>
            <Text style={s.formTitle}>Giriş Yap</Text>

            <View style={s.fieldGroup}>
              <Text style={s.label}>E-posta</Text>
              <View style={[s.inputWrapper, errors.email ? s.inputError : null]}>
                <Ionicons name="mail-outline" size={18} color={colors.textMuted} />
                <TextInput
                  style={s.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="ornek@email.com"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {errors.email && <Text style={s.errorText}>{errors.email}</Text>}
            </View>

            <View style={s.fieldGroup}>
              <Text style={s.label}>Şifre</Text>
              <View style={[s.inputWrapper, errors.password ? s.inputError : null]}>
                <Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} />
                <TextInput
                  style={s.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showPass}
                />
                <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                  <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.textMuted} />
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={s.errorText}>{errors.password}</Text>}
            </View>

            <TouchableOpacity
              style={[s.btn, loading && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={s.btnText}>{loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}</Text>
            </TouchableOpacity>
          </View>

          {/* Kayıt ol */}
          <View style={s.footer}>
            <Text style={s.footerText}>Hesabın yok mu? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={s.footerLink}>Kayıt Ol</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const makeStyles = (colors: any) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { flexGrow: 1, padding: Spacing.base, justifyContent: 'center' },
  logoArea: { alignItems: 'center', marginBottom: Spacing['3xl'] },
  logoCircle: {
    width: 100, height: 100, borderRadius: 50,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  logoImage: { width: '100%', height: '100%' },
  appName: { color: colors.textPrimary, fontSize: Typography['2xl'], fontWeight: '800', letterSpacing: 2 },
  tagline: { color: colors.textMuted, fontSize: Typography.sm, marginTop: 4 },
  form: {
    backgroundColor: colors.bgCard, borderRadius: Radius.xl,
    padding: Spacing.xl, borderWidth: 1, borderColor: colors.border, marginBottom: Spacing.xl,
  },
  formTitle: { color: colors.textPrimary, fontSize: Typography.xl, fontWeight: '700', marginBottom: Spacing.xl },
  fieldGroup: { marginBottom: Spacing.base },
  label: {
    color: colors.textSecondary, fontSize: Typography.sm, fontWeight: '600',
    marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bgInput,
    borderRadius: Radius.md, borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: Spacing.base, gap: Spacing.sm, height: 52,
  },
  inputError: { borderColor: colors.error },
  input: { flex: 1, color: colors.textPrimary, fontSize: Typography.base, paddingVertical: 0 },
  errorText: { color: colors.error, fontSize: Typography.xs, marginTop: 4 },
  btn: {
    backgroundColor: colors.primary, borderRadius: Radius.lg, paddingVertical: 16,
    alignItems: 'center', marginTop: Spacing.md,
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  btnText: { color: colors.white, fontSize: Typography.md, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { color: colors.textMuted, fontSize: Typography.base },
  footerLink: { color: colors.primary, fontSize: Typography.base, fontWeight: '700' },
});
