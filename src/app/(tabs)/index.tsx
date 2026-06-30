import { Bell, User } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ExpiringItem } from '@/entities/ingredient';
import { RecipeCard } from '@/entities/recipe';
import { FreshnessGauge } from '@/features/freshness-score';
import { StatCards } from '@/features/stat-summary';
import { useAppTheme } from '@/shared/lib/useAppTheme';
import { MOCK_EXPIRING_QUICK, MOCK_RECIPES } from '@/shared/lib/mock-data';
import { fontFamily, palette, spacing } from '@/shared/theme';
import { SectionHeader } from '@/shared/ui';

export default function DashboardScreen() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: theme.background }]}
      contentContainerStyle={{ paddingTop: insets.top + spacing.lg, paddingBottom: 100 }}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: theme.text, fontFamily: fontFamily.krBold }]}>
            안녕하세요, 서아님!
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: theme.textSecondary, fontFamily: fontFamily.krRegular },
            ]}>
            현재 주방의 신선도는 85%입니다.
          </Text>
        </View>
        <View style={[styles.avatar, { borderColor: palette.primary }]}>
          <User size={20} color={palette.primary} strokeWidth={1.8} />
          <View style={[styles.notifDot, { borderColor: theme.background }]} />
        </View>
      </View>

      {/* Freshness Gauge */}
      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.text, fontFamily: fontFamily.krSemibold, paddingHorizontal: spacing.lg },
          ]}>
          종합 신선도
        </Text>
        <View style={styles.gaugeWrap}>
          <FreshnessGauge score={85} />
        </View>
      </View>

      {/* Stat Cards */}
      <StatCards
        stats={[
          { value: 24, label: '전체 품목' },
          { value: 4, label: '유통기한 임박', accent: true },
          { value: 12, label: '추천 레시피' },
        ]}
      />

      {/* Expiring Soon */}
      <View style={styles.expiringSection}>
        <SectionHeader title="빨리 드세요!" actionLabel="전체보기" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.expiringScroll}>
          {MOCK_EXPIRING_QUICK.map((item, i) => (
            <ExpiringItem key={i} {...item} />
          ))}
        </ScrollView>
      </View>

      {/* Recipes */}
      <View style={{ marginTop: spacing['3xl'] }}>
        <SectionHeader title="맞춤 레시피" />
        <View style={styles.recipeList}>
          {MOCK_RECIPES.slice(0, 2).map((recipe) => (
            <RecipeCard key={recipe.id} item={recipe} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing['2xl'],
    marginBottom: spacing['2xl'],
  },
  greeting: { fontSize: 24, letterSpacing: -0.5 },
  subtitle: { fontSize: 14, marginTop: 4 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F687B3',
    borderWidth: 2,
  },
  section: { marginBottom: spacing['2xl'] },
  sectionTitle: { fontSize: 18, marginBottom: spacing.lg },
  gaugeWrap: { alignItems: 'center', paddingVertical: spacing.lg },
  expiringSection: { marginTop: spacing['3xl'] },
  expiringScroll: { paddingHorizontal: spacing.lg, paddingVertical: spacing.xs },
  recipeList: { paddingHorizontal: spacing.lg, gap: spacing.md },
});
