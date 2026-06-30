import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/shared/lib/useAppTheme';
import { fontFamily, palette } from '@/shared/theme';

interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  value?: string;
}

export function ProgressBar({ progress, label, value }: ProgressBarProps) {
  const theme = useAppTheme();
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <View style={styles.container}>
      {(label || value) && (
        <View style={styles.labelRow}>
          {label && (
            <Text style={[styles.label, { color: theme.textSecondary, fontFamily: fontFamily.krMedium }]}>{label}</Text>
          )}
          {value && <Text style={[styles.value, { color: palette.primary, fontFamily: fontFamily.semibold }]}>{value}</Text>}
        </View>
      )}
      <View style={[styles.track, { backgroundColor: theme.backgroundElement }]}>
        <View
          style={[styles.fill, { width: `${clampedProgress}%`, backgroundColor: palette.primary }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontSize: 12 },
  value: { fontSize: 12 },
  track: { height: 8, borderRadius: 9999, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 9999 },
});
