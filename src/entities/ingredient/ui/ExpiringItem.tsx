import { Image } from 'expo-image';
import { Bell, Salad } from 'lucide-react-native';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/shared/lib/useAppTheme';
import { fontFamily, palette, radius, spacing } from '@/shared/theme';

interface ExpiringItemProps {
  name: string;
  location: string;
  daysLeft: number;
  imageUrl?: string;
}

export function ExpiringItem({ name, location, daysLeft, imageUrl }: ExpiringItemProps) {
  const theme = useAppTheme();
  const isUrgent = daysLeft <= 1;
  const accentColor = isUrgent ? palette.accent : palette.primary;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.backgroundCard,
          borderLeftColor: accentColor,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
            },
            android: { elevation: 2 },
            default: {},
          }),
        },
      ]}>
      {/* Top row: D-day badge + bell */}
      <View style={styles.topRow}>
        <View style={[styles.ddayBadge, { backgroundColor: isUrgent ? palette.accentLight : palette.primaryLight }]}>
          <Text
            style={[
              styles.ddayText,
              { color: accentColor, fontFamily: fontFamily.bold },
            ]}>
            D-{daysLeft}
          </Text>
        </View>
        <Bell size={14} color={theme.textTertiary} strokeWidth={1.5} />
      </View>

      {/* Image */}
      <View style={[styles.imageBox, { backgroundColor: theme.backgroundElement }]}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} contentFit="cover" />
        ) : (
          <Salad size={24} color={accentColor} strokeWidth={1.5} />
        )}
      </View>

      {/* Name + Location */}
      <Text
        style={[styles.name, { color: theme.text, fontFamily: fontFamily.krBold }]}
        numberOfLines={1}>
        {name}
      </Text>
      <Text
        style={[
          styles.location,
          { color: theme.textTertiary, fontFamily: fontFamily.krRegular },
        ]}>
        {location}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 152,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderLeftWidth: 4,
    marginRight: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  ddayBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ddayText: {
    fontSize: 11,
    letterSpacing: -0.3,
  },
  imageBox: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    overflow: 'hidden',
    marginBottom: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: { width: '100%', height: '100%' },
  name: { fontSize: 15, lineHeight: 20 },
  location: { fontSize: 11, marginTop: 3, letterSpacing: 0.2 },
});
