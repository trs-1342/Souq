import { create } from 'zustand';

export type ThemeMode = 'dark' | 'light';

interface ThemeState {
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: 'dark',
  toggleTheme: () => set((s) => ({ mode: s.mode === 'dark' ? 'light' : 'dark' })),
  setTheme: (mode) => set({ mode }),
}));

// ─── Renkler ───────────────────────────────────────────────────────────────────
const dark = {
  primary: '#007A3D',
  primaryLight: '#00A352',
  primaryDark: '#005C2E',
  secondary: '#FFD700',
  bg: '#0A0A0F',
  bgCard: '#13131A',
  bgElevated: '#1C1C28',
  bgInput: '#1A1A24',
  border: '#2A2A3A',
  borderLight: '#3A3A4A',
  textPrimary: '#F0F0F5',
  textSecondary: '#9090A0',
  textMuted: '#5A5A70',
  textInverse: '#FFFFFF',
  gold: '#FFD700',
  info: '#4A9EFF',
  warning: '#FF9F43',
  error: '#FF4757',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  tabBar: '#13131A',
  statusBar: 'light' as const,
};

const light = {
  primary: '#007A3D',
  primaryLight: '#00A352',
  primaryDark: '#005C2E',
  secondary: '#F0A500',
  bg: '#F5F5F7',
  bgCard: '#FFFFFF',
  bgElevated: '#EBEBF0',
  bgInput: '#F0F0F5',
  border: '#E0E0E8',
  borderLight: '#D0D0D8',
  textPrimary: '#0A0A0F',
  textSecondary: '#5A5A70',
  textMuted: '#9090A0',
  textInverse: '#FFFFFF',
  gold: '#F0A500',
  info: '#2B7BE9',
  warning: '#E07B00',
  error: '#FF4757',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  tabBar: '#FFFFFF',
  statusBar: 'dark' as const,
};

export type ColorScheme = typeof dark;

export const themes = { dark, light };

export const useColors = (): ColorScheme => {
  const mode = useThemeStore((s) => s.mode);
  return themes[mode];
};
