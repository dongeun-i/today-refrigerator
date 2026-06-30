import { ArrowUpRight, Calendar, Download, Lightbulb, TrendingUp } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '@/shared/lib/useAppTheme';
import { MOCK_REPORT } from '@/shared/lib/mock-data';
import { fontFamily, palette, radius, spacing } from '@/shared/theme';
import { Card, ChipFilter } from '@/shared/ui';

const PERIODS = ['주간', '월간', '연간'];

export default function ReportScreen() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const [period, setPeriod] = useState('월간');
  const data = MOCK_REPORT;

  const maxCat = Math.max(...data.categories.map((c) => c.current));

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: theme.background }]}
      contentContainerStyle={{ paddingTop: insets.top + spacing.lg, paddingBottom: 100 }}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.title, { color: theme.text, fontFamily: fontFamily.krBold }]}>
              식비 리포트
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: theme.textSecondary, fontFamily: fontFamily.krRegular },
              ]}>
              이번 달 소비 및 낭비 통계
            </Text>
          </View>
          <View style={[styles.calendarIcon, { backgroundColor: theme.backgroundCard }]}>
            <Calendar size={20} color={theme.text} strokeWidth={1.8} />
          </View>
        </View>
      </View>

      <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.xl }}>
        <ChipFilter items={PERIODS} selected={period} onSelect={setPeriod} />
      </View>

      {/* Waste Card */}
      <View style={[styles.wasteCard, { backgroundColor: palette.primary }]}>
        <View style={styles.wasteHeader}>
          <Text style={[styles.wasteLabel, { fontFamily: fontFamily.krRegular }]}>낭비된 금액</Text>
          <TrendingUp size={20} color="rgba(255,255,255,0.6)" strokeWidth={1.8} />
        </View>
        <Text style={[styles.wasteAmount, { fontFamily: fontFamily.bold }]}>
          ₩{data.wastedAmount.toLocaleString()}
        </Text>
        <View style={styles.wasteChangeRow}>
          <View style={styles.wasteChangeBadge}>
            <ArrowUpRight size={12} color="#fff" strokeWidth={2.5} />
            <Text style={[styles.wasteChangeText, { fontFamily: fontFamily.semibold }]}>
              지난달 대비 {data.wastedChange}%
            </Text>
          </View>
        </View>
        <Text style={[styles.wasteHint, { fontFamily: fontFamily.krRegular }]}>
          이 금액은 약 14끼의 식사를 버린 것과 같습니다.
        </Text>
      </View>

      {/* Category Chart */}
      <Card style={{ marginHorizontal: spacing.lg, marginTop: spacing.xl }}>
        <View style={styles.chartHeader}>
          <Text
            style={[styles.chartTitle, { color: theme.text, fontFamily: fontFamily.krSemibold }]}>
            카테고리별 소비 통계
          </Text>
          <View style={[styles.totalBadge, { backgroundColor: palette.primaryLight }]}>
            <Text
              style={{
                color: palette.primary,
                fontSize: 12,
                fontFamily: fontFamily.semibold,
              }}>
              합계: ₩{data.totalSpend.toLocaleString()}
            </Text>
          </View>
        </View>
        <View style={styles.chart}>
          {data.categories.map((cat) => (
            <View key={cat.name} style={styles.barGroup}>
              <View style={styles.barWrap}>
                <View
                  style={[
                    styles.barPrev,
                    {
                      height: `${(cat.prev / maxCat) * 100}%`,
                      backgroundColor: theme.backgroundElement,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.barCurrent,
                    {
                      height: `${(cat.current / maxCat) * 100}%`,
                      backgroundColor: palette.primary,
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.barLabel,
                  { color: theme.textSecondary, fontFamily: fontFamily.krRegular },
                ]}>
                {cat.name}
              </Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Frequent Buy & Waste */}
      <View style={styles.twoCol}>
        <Card style={{ flex: 1 }}>
          <Text
            style={[
              styles.miniTitle,
              { color: theme.textSecondary, fontFamily: fontFamily.krSemibold },
            ]}>
            주로 구매함
          </Text>
          {data.frequentBuy.map((item) => (
            <View key={item.name} style={styles.miniRow}>
              <Text
                style={[styles.miniName, { color: theme.text, fontFamily: fontFamily.krMedium }]}>
                {item.name}
              </Text>
              <Text
                style={[
                  styles.miniValue,
                  { color: theme.textSecondary, fontFamily: fontFamily.semibold },
                ]}>
                {item.count}회
              </Text>
            </View>
          ))}
        </Card>
        <Card style={{ flex: 1 }}>
          <Text
            style={[
              styles.miniTitle,
              { color: theme.textSecondary, fontFamily: fontFamily.krSemibold },
            ]}>
            주로 버려짐
          </Text>
          {data.frequentWaste.map((item) => (
            <View key={item.name} style={styles.miniRow}>
              <Text
                style={[styles.miniName, { color: theme.text, fontFamily: fontFamily.krMedium }]}>
                {item.name}
              </Text>
              <Text
                style={[
                  styles.miniValue,
                  { color: palette.accent, fontFamily: fontFamily.semibold },
                ]}>
                {item.percent}%
              </Text>
            </View>
          ))}
        </Card>
      </View>

      {/* Smart Tip */}
      <View
        style={[
          styles.tipCard,
          { backgroundColor: theme.backgroundCard },
        ]}>
        <View style={styles.tipHeader}>
          <Lightbulb size={18} color={palette.primary} strokeWidth={1.8} />
          <Text
            style={[styles.tipTitle, { color: theme.text, fontFamily: fontFamily.krBold }]}>
            스마트 팁
          </Text>
        </View>
        <Text
          style={[styles.tipText, { color: theme.textSecondary, fontFamily: fontFamily.krRegular }]}>
          구매하신 시금치의 60%가 버려지고 있어요. 다음번엔 냉동 시금치를 사거나 소량만 구매하면
          월 약 12,000원을 절약할 수 있습니다.
        </Text>
      </View>

      {/* Export Button */}
      <Pressable
        style={[styles.exportBtn, { backgroundColor: theme.backgroundCard }]}>
        <Download size={18} color={palette.primary} strokeWidth={1.8} />
        <Text
          style={[styles.exportText, { color: palette.primary, fontFamily: fontFamily.krSemibold }]}>
          전체 리포트 내보내기 (PDF)
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { paddingHorizontal: spacing['2xl'], marginBottom: spacing.lg },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 28 },
  subtitle: { fontSize: 14, marginTop: 4 },
  calendarIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wasteCard: {
    marginHorizontal: spacing.lg,
    borderRadius: radius.xl,
    padding: spacing['2xl'],
  },
  wasteHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  wasteLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  wasteAmount: { color: '#fff', fontSize: 36, marginTop: spacing.xs },
  wasteChangeRow: { flexDirection: 'row', marginTop: spacing.sm },
  wasteChangeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  wasteChangeText: { color: '#fff', fontSize: 12 },
  wasteHint: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: spacing.md },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  chartTitle: { fontSize: 16 },
  totalBadge: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: 6 },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 140,
  },
  barGroup: { alignItems: 'center', flex: 1, gap: spacing.sm },
  barWrap: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: '100%' },
  barPrev: { width: 16, borderRadius: 4 },
  barCurrent: { width: 16, borderRadius: 4 },
  barLabel: { fontSize: 10 },
  twoCol: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  miniTitle: { fontSize: 12, marginBottom: spacing.md },
  miniRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  miniName: { fontSize: 14 },
  miniValue: { fontSize: 14 },
  tipCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    padding: spacing.lg,
    borderRadius: radius.xl,
  },
  tipHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  tipTitle: { fontSize: 16 },
  tipText: { fontSize: 13, lineHeight: 20 },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    padding: spacing.lg,
    borderRadius: radius.xl,
  },
  exportText: { fontSize: 14 },
});
