import { StyleSheet, Text, View } from 'react-native';

import { fontFamily, palette, radius, spacing } from '@/shared/theme';

type BadgeVariant = 'danger' | 'warning' | 'safe' | 'info';

const variantStyles: Record<BadgeVariant, { bg: string; text: string }> = {
  danger: { bg: palette.accent, text: '#ffffff' },
  warning: { bg: '#ed8936', text: '#ffffff' },
  safe: { bg: palette.primaryLight, text: palette.primary },
  info: { bg: palette.primaryLight, text: palette.primary },
};

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

export function Badge({ label, variant = 'info' }: BadgeProps) {
  const colors = variantStyles[variant];
  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text style={[styles.text, { color: colors.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 10,
    fontFamily: fontFamily.bold,
    letterSpacing: -0.3,
  },
});
