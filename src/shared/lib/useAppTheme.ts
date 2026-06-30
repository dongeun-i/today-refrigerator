import { useColorScheme } from 'react-native';

import { Colors, type AppThemeColors } from '@/shared/theme';

export function useAppTheme(): AppThemeColors {
  const scheme = useColorScheme();
  return Colors[scheme === 'dark' ? 'dark' : 'light'];
}
