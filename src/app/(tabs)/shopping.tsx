import { Check, ClipboardList, Plus, ScanLine } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '@/shared/lib/useAppTheme';
import { MOCK_SHOPPING } from '@/shared/lib/mock-data';
import { fontFamily, palette, radius, spacing } from '@/shared/theme';
import { ChipFilter } from '@/shared/ui';

const QUICK_TAGS = ['즐겨찾기', '최근 구매', '우유', '아보카도'];

export default function ShoppingScreen() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState(MOCK_SHOPPING);
  const [selectedTag, setSelectedTag] = useState('즐겨찾기');

  const checkedCount = items.filter((i) => i.checked).length;

  const toggleItem = (id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)));
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.lg }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.title, { color: theme.text, fontFamily: fontFamily.krBold }]}>
              장보기 목록
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: theme.textSecondary, fontFamily: fontFamily.krRegular },
              ]}>
              {items.length}개의 품목이 있습니다
            </Text>
          </View>
          <View style={[styles.listIcon, { backgroundColor: palette.primaryLight }]}>
            <ClipboardList size={20} color={palette.primary} strokeWidth={1.8} />
          </View>
        </View>
      </View>

      <View style={styles.tagSection}>
        <Text
          style={[
            styles.tagLabel,
            { color: theme.textSecondary, fontFamily: fontFamily.krMedium },
          ]}>
          빠른 추가
        </Text>
        <ChipFilter items={QUICK_TAGS} selected={selectedTag} onSelect={setSelectedTag} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 160 }}>
        <View style={styles.list}>
          {items.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => toggleItem(item.id)}
              style={[
                styles.itemCard,
                { backgroundColor: theme.backgroundCard },
              ]}>
              <View
                style={[
                  styles.checkbox,
                  item.checked
                    ? { backgroundColor: palette.primary, borderColor: palette.primary }
                    : { borderColor: theme.textTertiary },
                ]}>
                {item.checked && <Check size={14} color="#fff" strokeWidth={3} />}
              </View>
              <View style={styles.itemContent}>
                <Text
                  style={[
                    styles.itemName,
                    { color: item.checked ? theme.textTertiary : theme.text },
                    { fontFamily: fontFamily.krSemibold },
                    item.checked && styles.itemChecked,
                  ]}>
                  {item.name}
                </Text>
                {item.note ? (
                  <Text
                    style={[
                      styles.itemNote,
                      { color: theme.textTertiary, fontFamily: fontFamily.krRegular },
                    ]}>
                    {item.note}
                  </Text>
                ) : null}
              </View>
              {item.quantity ? (
                <Text
                  style={[
                    styles.quantity,
                    { color: palette.primary, fontFamily: fontFamily.semibold },
                  ]}>
                  {item.quantity}
                </Text>
              ) : null}
            </Pressable>
          ))}
        </View>

        <Pressable style={[styles.addRow, { borderColor: theme.textTertiary }]}>
          <Plus size={16} color={theme.textTertiary} strokeWidth={1.8} />
          <Text
            style={{
              color: theme.textTertiary,
              fontSize: 14,
              fontFamily: fontFamily.krRegular,
            }}>
            항목을 추가하려면 탭하세요...
          </Text>
        </Pressable>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 80 }]}>
        <View style={[styles.scanHint, { backgroundColor: palette.primaryLight }]}>
          <ScanLine size={14} color={palette.primary} strokeWidth={1.8} />
          <Text
            style={{
              color: palette.primary,
              fontSize: 12,
              fontFamily: fontFamily.krMedium,
            }}>
            스마트 OCR 스캔 사용 가능
          </Text>
        </View>
        <Pressable style={[styles.ctaButton, { backgroundColor: palette.primary }]}>
          <Text style={[styles.ctaText, { fontFamily: fontFamily.krBold }]}>냉장고에 일괄 추가</Text>
          <View style={styles.ctaBadge}>
            <Text style={[styles.ctaBadgeText, { fontFamily: fontFamily.semibold }]}>
              {checkedCount}개 선택됨
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { paddingHorizontal: spacing['2xl'], marginBottom: spacing.lg },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 28 },
  subtitle: { fontSize: 14, marginTop: 4 },
  listIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagSection: { paddingHorizontal: spacing.lg, marginBottom: spacing.lg, gap: spacing.sm },
  tagLabel: { fontSize: 12 },
  list: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: radius.lg,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  itemContent: { flex: 1 },
  itemName: { fontSize: 16 },
  itemChecked: { textDecorationLine: 'line-through' },
  itemNote: { fontSize: 12, marginTop: 2 },
  quantity: { fontSize: 14 },
  addRow: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  scanHint: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    gap: spacing.sm,
  },
  ctaText: { color: '#fff', fontSize: 16 },
  ctaBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  ctaBadgeText: { color: '#fff', fontSize: 12 },
});
