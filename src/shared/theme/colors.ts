export const palette = {
  primary: '#4dd1c4',
  primaryLight: 'rgba(77, 209, 196, 0.2)',
  primaryDark: '#3bb5a9',
  accent: '#F687B3',
  accentLight: 'rgba(246, 135, 179, 0.2)',
  white: '#ffffff',
  black: '#000000',
} as const;

export const Colors = {
  light: {
    text: '#1a202c',
    textSecondary: '#718096',
    textTertiary: '#a0aec0',
    background: '#eef1f3',
    backgroundCard: '#f7f8fa',
    backgroundElement: '#e8ecf0',
    border: 'transparent',
    primary: palette.primary,
    primaryLight: palette.primaryLight,
    accent: palette.accent,
    accentLight: palette.accentLight,
    tabBar: 'rgba(238,241,243,0.92)',
    tabInactive: '#a0aec0',
  },
  dark: {
    text: '#ffffff',
    textSecondary: 'rgba(255,255,255,0.6)',
    textTertiary: 'rgba(255,255,255,0.4)',
    background: '#131f1e',
    backgroundCard: 'rgba(255,255,255,0.05)',
    backgroundElement: '#2D3748',
    border: 'transparent',
    primary: palette.primary,
    primaryLight: palette.primaryLight,
    accent: palette.accent,
    accentLight: palette.accentLight,
    tabBar: 'rgba(30,37,50,0.95)',
    tabInactive: 'rgba(255,255,255,0.4)',
  },
} as const;

export type AppThemeColors = {
  [K in keyof typeof Colors.light]: string;
};
