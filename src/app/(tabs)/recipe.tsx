import { Flame, Leaf, Sparkles } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RecipeCard } from '@/entities/recipe';
import { useAppTheme } from '@/shared/lib/useAppTheme';
import { MOCK_RECIPES } from '@/shared/lib/mock-data';
import { fontFamily, palette, radius, spacing } from '@/shared/theme';
import { Badge } from '@/shared/ui';

export default function RecipeScreen() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: theme.background }]}
      contentContainerStyle={{ paddingTop: insets.top + spacing.lg, paddingBottom: 100 }}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.title, { color: theme.text, fontFamily: fontFamily.krBold }]}>
              레시피 추천
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: theme.textSecondary, fontFamily: fontFamily.krRegular },
              ]}>
              냉장고 식재료 기반 추천
            </Text>
          </View>
          <View style={[styles.sparkleIcon, { backgroundColor: palette.primaryLight }]}>
            <Sparkles size={20} color={palette.primary} strokeWidth={1.8} />
          </View>
        </View>
      </View>

      <View style={styles.filterRow}>
        <View style={[styles.filterChip, { backgroundColor: palette.primaryLight }]}>
          <Leaf size={12} color={palette.primary} strokeWidth={2} />
          <Text style={[styles.filterText, { color: palette.primary, fontFamily: fontFamily.krMedium }]}>
            전체
          </Text>
        </View>
        <View style={[styles.filterChip, { backgroundColor: palette.accentLight }]}>
          <Flame size={12} color={palette.accent} strokeWidth={2} />
          <Text style={[styles.filterText, { color: palette.accent, fontFamily: fontFamily.krMedium }]}>
            임박 활용
          </Text>
        </View>
        <Badge label="간편 요리" variant="safe" />
      </View>

      <View style={styles.list}>
        {MOCK_RECIPES.map((recipe) => (
          <View key={recipe.id} style={styles.recipeItem}>
            <RecipeCard item={recipe} />
            <View style={styles.recipeInfo}>
              <View style={styles.infoRow}>
                <View style={[styles.infoBadge, { backgroundColor: palette.primaryLight }]}>
                  <Text
                    style={[
                      styles.infoText,
                      { color: palette.primary, fontFamily: fontFamily.krMedium },
                    ]}>
                    식재료 {recipe.matchingIngredients}개 매칭
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { paddingHorizontal: spacing['2xl'], marginBottom: spacing.xl },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 28 },
  subtitle: { fontSize: 14, marginTop: 4 },
  sparkleIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  filterText: { fontSize: 12 },
  list: { paddingHorizontal: spacing.lg, gap: spacing.lg },
  recipeItem: { gap: spacing.sm },
  recipeInfo: { paddingLeft: spacing.xs },
  infoRow: { flexDirection: 'row', gap: spacing.sm },
  infoBadge: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: 6 },
  infoText: { fontSize: 11 },
});
