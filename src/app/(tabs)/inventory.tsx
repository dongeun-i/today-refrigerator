import { Pencil, Search } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IngredientCard } from '@/entities/ingredient';
import { useAppTheme } from '@/shared/lib/useAppTheme';
import { MOCK_EXPIRING, MOCK_FRESH } from '@/shared/lib/mock-data';
import { fontFamily, palette, spacing } from '@/shared/theme';
import { ChipFilter, SearchInput, SectionHeader } from '@/shared/ui';

const FILTERS = ['전체', '냉장', '냉동', '실온'];

export default function InventoryScreen() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const [selectedFilter, setSelectedFilter] = useState('전체');

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      {/* Sticky Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <View style={styles.headerTop}>
          <View>
            <Text
              style={[styles.label, { color: palette.primary, fontFamily: fontFamily.semibold }]}>
              나의 스마트 주방
            </Text>
            <Text style={[styles.title, { color: theme.text, fontFamily: fontFamily.krBold }]}>
              냉장고 (Inventory)
            </Text>
          </View>
          <View
            style={[
              styles.editBtn,
              { backgroundColor: palette.primaryLight, borderColor: palette.primary + '33' },
            ]}>
            <Pencil size={14} color={palette.primary} strokeWidth={2} />
            <Text
              style={[
                styles.editBtnText,
                { color: palette.primary, fontFamily: fontFamily.krMedium },
              ]}>
              편집
            </Text>
          </View>
        </View>
        <ChipFilter items={FILTERS} selected={selectedFilter} onSelect={setSelectedFilter} />
        <View style={{ marginTop: spacing.md }}>
          <SearchInput placeholder="식재료 검색..." />
        </View>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={{ paddingBottom: 100, paddingTop: spacing.md }}>
        <SectionHeader title="유통기한 임박" actionLabel="전체보기" />
        <View style={styles.list}>
          {MOCK_EXPIRING.map((item) => (
            <IngredientCard key={item.id} item={item} />
          ))}
        </View>

        <View style={{ marginTop: spacing['2xl'] }}>
          <SectionHeader title="신선한 식재료" />
          <View style={styles.list}>
            {MOCK_FRESH.map((item) => (
              <IngredientCard key={item.id} item={item} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.lg,
  },
  label: { fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },
  title: { fontSize: 28 },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    borderWidth: 1,
  },
  editBtnText: { fontSize: 14 },
  list: { paddingHorizontal: spacing.lg, gap: spacing.md },
});
