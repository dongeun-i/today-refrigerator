import { Image } from 'expo-image';
import { ArrowRight, UtensilsCrossed } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/shared/lib/useAppTheme';
import { fontFamily, palette, radius, spacing } from '@/shared/theme';
import type { Recipe } from '../model/types';

interface RecipeCardProps {
  item: Recipe;
  onPress?: () => void;
}

export function RecipeCard({ item, onPress }: RecipeCardProps) {
  const theme = useAppTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        { backgroundColor: theme.backgroundCard },
      ]}>
      <View style={[styles.imageBox, { backgroundColor: theme.backgroundElement }]}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.image} contentFit="cover" />
        ) : (
          <UtensilsCrossed size={24} color={theme.textTertiary} strokeWidth={1.5} />
        )}
      </View>
      <View style={styles.content}>
        <Text style={[styles.name, { color: theme.text, fontFamily: fontFamily.krBold }]}>
          {item.name}
        </Text>
        <Text
          style={[
            styles.desc,
            { color: theme.textSecondary, fontFamily: fontFamily.krRegular },
          ]}>
          {item.description}
        </Text>
      </View>
      <View style={[styles.arrow, { backgroundColor: palette.primaryLight }]}>
        <ArrowRight size={18} color={palette.primary} strokeWidth={2} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.lg,
  },
  imageBox: {
    width: 64,
    height: 64,
    borderRadius: radius.sm,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: { width: '100%', height: '100%' },
  content: { flex: 1, marginLeft: spacing.lg },
  name: { fontSize: 14 },
  desc: { fontSize: 12, marginTop: 2 },
  arrow: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
