import { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../stores/themeStore';
import { Typography, Spacing, Radius } from '../../constants/theme';
import { useAppStore } from '../../stores/appStore';

interface Props {
  onFocus?: () => void;
  placeholder?: string;
  readOnly?: boolean;
}

export function SearchBar({ onFocus, placeholder = 'Ne arıyorsunuz?', readOnly }: Props) {
  const colors = useColors();
  const { filters, setFilters } = useAppStore();
  const [local, setLocal] = useState(filters.query ?? '');

  return (
    <TouchableOpacity
      style={{ paddingHorizontal: Spacing.base }}
      activeOpacity={readOnly ? 0.7 : 1}
      onPress={readOnly ? onFocus : undefined}>
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bgInput, borderRadius: Radius.lg, borderWidth: 1, borderColor: colors.border, paddingHorizontal: Spacing.md, height: 48, gap: Spacing.sm }}>
        <Ionicons name="search" size={18} color={colors.textMuted} />
        {readOnly ? (
          <View style={{ flex: 1 }}>
            <TextInput
              style={{ flex: 1, color: colors.textPrimary, fontSize: Typography.base, paddingVertical: 0 }}
              value={local}
              editable={false}
              placeholder={placeholder}
              placeholderTextColor={colors.textMuted}
            />
          </View>
        ) : (
          <>
            <TextInput
              style={{ flex: 1, color: colors.textPrimary, fontSize: Typography.base, paddingVertical: 0 }}
              value={local}
              onChangeText={v => { setLocal(v); setFilters({ query: v }); }}
              onFocus={onFocus}
              placeholder={placeholder}
              placeholderTextColor={colors.textMuted}
              returnKeyType="search"
              autoCorrect={false}
            />
            {local.length > 0 && (
              <TouchableOpacity onPress={() => { setLocal(''); setFilters({ query: '' }); }}>
                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </>
        )}
        <View style={{ width: 1, height: 20, backgroundColor: colors.border }} />
        <TouchableOpacity style={{ padding: 4 }}>
          <Ionicons name="options-outline" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
