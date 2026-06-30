import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/shared/lib/useAppTheme';
import { fontFamily, palette, radius, spacing } from '@/shared/theme';

interface Stat {
  value: number | string;
  label: string;
  accent?: boolean;
}

interface StatCardsProps {
  stats: Stat[];
}

export function StatCards({ stats }: StatCardsProps) {
  const theme = useAppTheme();
  return (
    <View style={styles.container}>
      {stats.map((stat, i) => (
        <View
          key={i}
          style={[styles.card, { backgroundColor: theme.backgroundCard }]}>
          <Text style={[styles.value, { color: stat.accent ? palette.accent : palette.primary, fontFamily: fontFamily.bold }]}>
            {stat.value}
          </Text>
          <Text style={[styles.label, { color: theme.textTertiary, fontFamily: fontFamily.krSemibold }]}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  card: {
    flex: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
  value: { fontSize: 20 },
  label: { fontSize: 10, marginTop: 4 },
});
