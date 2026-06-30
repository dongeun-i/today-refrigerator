import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/shared/lib/useAppTheme';
import { fontFamily, palette, spacing } from '@/shared/theme';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, actionLabel, onAction }: SectionHeaderProps) {
  const theme = useAppTheme();
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.text, fontFamily: fontFamily.krSemibold }]}>{title}</Text>
      {actionLabel && (
        <Pressable onPress={onAction}>
          <Text style={[styles.action, { color: palette.primary, fontFamily: fontFamily.krMedium }]}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  title: { fontSize: 18 },
  action: { fontSize: 12 },
});
