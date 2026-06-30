import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { useAppTheme } from '@/shared/lib/useAppTheme';
import { fontFamily, palette, radius, spacing } from '@/shared/theme';

interface ChipFilterProps {
  items: string[];
  selected: string;
  onSelect: (item: string) => void;
}

export function ChipFilter({ items, selected, onSelect }: ChipFilterProps) {
  const theme = useAppTheme();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
      {items.map((item) => {
        const isSelected = item === selected;
        return (
          <Pressable
            key={item}
            onPress={() => onSelect(item)}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected ? palette.primary : theme.backgroundCard,
                borderColor: isSelected ? palette.primary : theme.border,
              },
            ]}>
            <Text
              style={[
                styles.chipText,
                { color: isSelected ? '#ffffff' : theme.textSecondary },
                isSelected && styles.chipTextSelected,
              ]}>
              {item}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 0 },
  chip: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    marginRight: spacing.sm,
    borderWidth: 1,
  },
  chipText: { fontSize: 14, fontFamily: fontFamily.krMedium },
  chipTextSelected: { fontFamily: fontFamily.krSemibold },
});
