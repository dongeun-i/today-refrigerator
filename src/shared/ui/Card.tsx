import { type ReactNode } from 'react';
import { Platform, StyleSheet, View, type ViewStyle } from 'react-native';

import { useAppTheme } from '@/shared/lib/useAppTheme';
import { radius, spacing } from '@/shared/theme';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
}

export function Card({ children, style }: CardProps) {
  const theme = useAppTheme();
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.backgroundCard },
        Platform.OS === 'ios' && styles.shadowIos,
        Platform.OS === 'android' && styles.shadowAndroid,
        style,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  shadowIos: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  shadowAndroid: {
    elevation: 1,
  },
});
