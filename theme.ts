export const Colors = {
  // Ana Renkler
  primary: '#FF4757',
  primaryLight: '#FF6B81',
  primaryDark: '#C0392B',
  secondary: '#2ED573',

  // Arka Planlar
  bg: '#0A0A0F',
  bgCard: '#13131A',
  bgElevated: '#1C1C28',
  bgInput: '#1A1A24',

  // Border
  border: '#2A2A3A',
  borderLight: '#3A3A4A',

  // Text
  textPrimary: '#F0F0F5',
  textSecondary: '#9090A0',
  textMuted: '#5A5A70',
  textInverse: '#0A0A0F',

  // Özel
  gold: '#FFD700',
  info: '#4A9EFF',
  warning: '#FF9F43',
  error: '#FF4757',

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const Typography = {
  // Boyutlar
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  '2xl': 30,
  '3xl': 38,

  // Ağırlıklar
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  heavy: '800' as const,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
  '4xl': 64,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  glow: {
    shadowColor: '#FF4757',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
};
