import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { useAppTheme } from '@/shared/lib/useAppTheme';
import { fontFamily, palette } from '@/shared/theme';

interface FreshnessGaugeProps {
  score: number; // 0-100
}

const SIZE = 200;
const STROKE_WIDTH = 14;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function FreshnessGauge({ score }: FreshnessGaugeProps) {
  const theme = useAppTheme();
  const offset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE;

  return (
    <View style={styles.container}>
      <Svg width={SIZE} height={SIZE} style={styles.svg}>
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={theme.backgroundElement}
          strokeWidth={STROKE_WIDTH}
          fill="transparent"
        />
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={palette.primary}
          strokeWidth={STROKE_WIDTH}
          fill="transparent"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          strokeLinecap="round"
          rotation={-90}
          origin={`${SIZE / 2}, ${SIZE / 2}`}
        />
      </Svg>
      <View style={styles.label}>
        <Text style={[styles.score, { color: palette.primary, fontFamily: fontFamily.bold }]}>{score}%</Text>
        <Text style={[styles.subtitle, { color: theme.textTertiary, fontFamily: fontFamily.krMedium }]}>신선도 점수</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  svg: { transform: [{ rotateZ: '0deg' }] },
  label: {
    position: 'absolute',
    alignItems: 'center',
  },
  score: { fontSize: 40 },
  subtitle: { fontSize: 11, letterSpacing: 1, marginTop: 2 },
});
