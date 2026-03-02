import { ScrollView, TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../stores/themeStore';
import { Typography, Spacing, Radius } from '../../constants/theme';
import { CATEGORIES } from '../../constants/categories';
import { CategorySlug } from '../../types';

interface Props {
  selected?: CategorySlug;
  onSelect: (slug: CategorySlug | undefined) => void;
}

export function CategoryPills({ selected, onSelect }: Props) {
  const colors = useColors();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: Spacing.base, gap: Spacing.sm, paddingVertical: 4 }}>
      <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: !selected ? colors.textPrimary : colors.bgElevated, borderWidth: 1, borderColor: !selected ? colors.textPrimary : colors.border, borderRadius: Radius.full, paddingHorizontal: 14, paddingVertical: 8 }}
        onPress={() => onSelect(undefined)}>
        <Ionicons name="apps" size={16} color={!selected ? colors.textInverse : colors.textSecondary} />
        <Text style={{ color: !selected ? colors.textInverse : colors.textSecondary, fontSize: Typography.sm, fontWeight: !selected ? '700' : '500' }}>Tümü</Text>
      </TouchableOpacity>
      {CATEGORIES.map(cat => {
        const active = selected === cat.slug;
        return (
          <TouchableOpacity key={cat.id} onPress={() => onSelect(cat.slug)} activeOpacity={0.75}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: active ? cat.color : colors.bgElevated, borderWidth: 1, borderColor: active ? cat.color : colors.border, borderRadius: Radius.full, paddingHorizontal: 14, paddingVertical: 8 }}>
            <Ionicons name={cat.icon as any} size={16} color={active ? colors.textInverse : cat.color} />
            <Text style={{ color: active ? colors.textInverse : colors.textSecondary, fontSize: Typography.sm, fontWeight: active ? '700' : '500' }}>{cat.label}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
