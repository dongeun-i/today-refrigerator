import { ChevronRight, ClipboardList, Plus, RotateCcw, ShoppingCart } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';

import { useDatabase } from '@/shared/db';
import {
  getActiveTrips,
  getCompletedTrips,
  createTrip,
  deleteTrip,
  duplicateTrip,
} from '@/entities/shopping';
import type { ShoppingTrip } from '@/entities/shopping';
import { useAppTheme } from '@/shared/lib/useAppTheme';
import { fontFamily, palette, radius, spacing } from '@/shared/theme';
import { CreateTripModal } from '@/shared/ui';

export default function ShoppingScreen() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const db = useDatabase();
  const [activeTrips, setActiveTrips] = useState<ShoppingTrip[]>([]);
  const [completedTrips, setCompletedTrips] = useState<ShoppingTrip[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadTrips = useCallback(async () => {
    const [active, completed] = await Promise.all([
      getActiveTrips(db),
      getCompletedTrips(db),
    ]);
    setActiveTrips(active);
    setCompletedTrips(completed);
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      loadTrips();
    }, [loadTrips])
  );

  const handleCreate = async (title: string, budget?: number) => {
    setShowCreateModal(false);
    const id = await createTrip(db, { title, budget });
    await loadTrips();
    router.push(`/shopping/${id}`);
  };

  const handleDuplicate = async (trip: ShoppingTrip) => {
    const id = await duplicateTrip(db, trip.id, trip.title);
    await loadTrips();
    router.push(`/shopping/${id}`);
  };

  const handleDelete = (id: string, title: string) => {
    Alert.alert('삭제', `"${title}"을(를) 삭제할까요?`, [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          await deleteTrip(db, id);
          await loadTrips();
        },
      },
    ]);
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.lg }]}>
        <Text style={[styles.title, { color: theme.text, fontFamily: fontFamily.krBold }]}>
          장보기
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 160 }}>
        {/* 현재 진행 중인 장보기 */}
        {activeTrips.length > 0 ? (
          <View style={styles.section}>
            {activeTrips.map((trip) => (
              <Pressable
                key={trip.id}
                onPress={() => router.push(`/shopping/${trip.id}`)}
                onLongPress={() => handleDelete(trip.id, trip.title)}
                style={[styles.activeCard, { backgroundColor: palette.primary }]}>
                <View style={styles.activeCardContent}>
                  <ShoppingCart size={20} color="#fff" strokeWidth={1.8} />
                  <View style={styles.activeCardInfo}>
                    <Text style={[styles.activeTitle, { fontFamily: fontFamily.krBold }]}>
                      {trip.title}
                    </Text>
                    <Text style={[styles.activeMeta, { fontFamily: fontFamily.krRegular }]}>
                      {trip.status === 'planned' ? '계획 중' : '장보는 중'}
                      {trip.budget ? ` · 예산 ${trip.budget.toLocaleString()}원` : ''}
                    </Text>
                  </View>
                  <ChevronRight size={20} color="rgba(255,255,255,0.7)" />
                </View>
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={styles.section}>
            <Pressable
              style={[styles.emptyActiveCard, { borderColor: palette.primary }]}
              onPress={() => setShowCreateModal(true)}>
              <Plus size={24} color={palette.primary} strokeWidth={2} />
              <Text
                style={[
                  styles.emptyActiveText,
                  { color: palette.primary, fontFamily: fontFamily.krMedium },
                ]}>
                새 장보기 시작하기
              </Text>
            </Pressable>
          </View>
        )}

        {/* 이전 장보기 기록 */}
        {completedTrips.length > 0 && (
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                { color: theme.textSecondary, fontFamily: fontFamily.krSemibold },
              ]}>
              이전 장보기
            </Text>
            {completedTrips.map((trip) => (
              <Pressable
                key={trip.id}
                onPress={() => router.push(`/shopping/${trip.id}`)}
                onLongPress={() => handleDelete(trip.id, trip.title)}
                style={[styles.historyCard, { backgroundColor: theme.backgroundCard }]}>
                <View style={styles.historyContent}>
                  <View style={styles.historyInfo}>
                    <Text
                      style={[
                        styles.historyTitle,
                        { color: theme.text, fontFamily: fontFamily.krMedium },
                      ]}>
                      {trip.title}
                    </Text>
                    <Text
                      style={[
                        styles.historyMeta,
                        { color: theme.textTertiary, fontFamily: fontFamily.krRegular },
                      ]}>
                      {trip.completed_at
                        ? new Date(trip.completed_at).toLocaleDateString('ko-KR')
                        : new Date(trip.created_at).toLocaleDateString('ko-KR')}
                      {trip.total_spent != null
                        ? ` · ${trip.total_spent.toLocaleString()}원`
                        : ''}
                    </Text>
                  </View>
                  <Pressable
                    style={[styles.reorderButton, { backgroundColor: palette.primaryLight }]}
                    onPress={() => handleDuplicate(trip)}>
                    <RotateCcw size={14} color={palette.primary} strokeWidth={2} />
                  </Pressable>
                </View>
              </Pressable>
            ))}
          </View>
        )}

        {activeTrips.length === 0 && completedTrips.length === 0 && (
          <View style={styles.emptyState}>
            <ClipboardList size={48} color={theme.textTertiary} strokeWidth={1.2} />
            <Text
              style={[
                styles.emptyText,
                { color: theme.textTertiary, fontFamily: fontFamily.krRegular },
              ]}>
              아직 장보기 목록이 없어요
            </Text>
          </View>
        )}
      </ScrollView>

      {activeTrips.length > 0 && (
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 80 }]}>
          <Pressable
            style={[styles.ctaButton, { backgroundColor: palette.primary }]}
            onPress={() => setShowCreateModal(true)}>
            <Plus size={20} color="#fff" strokeWidth={2.5} />
            <Text style={[styles.ctaText, { fontFamily: fontFamily.krBold }]}>
              새 장보기 목록 만들기
            </Text>
          </Pressable>
        </View>
      )}

      <CreateTripModal
        visible={showCreateModal}
        onConfirm={handleCreate}
        onCancel={() => setShowCreateModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { paddingHorizontal: spacing['2xl'], marginBottom: spacing.lg },
  title: { fontSize: 28 },
  section: { paddingHorizontal: spacing.lg, marginBottom: spacing['2xl'], gap: spacing.sm },
  sectionTitle: { fontSize: 13, marginBottom: spacing.xs },

  // 현재 장보기 카드
  activeCard: {
    borderRadius: radius.xl,
    padding: spacing.xl,
  },
  activeCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  activeCardInfo: { flex: 1 },
  activeTitle: { color: '#fff', fontSize: 17 },
  activeMeta: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 2 },

  // 비어있을 때
  emptyActiveCard: {
    borderRadius: radius.xl,
    borderWidth: 2,
    borderStyle: 'dashed',
    padding: spacing['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  emptyActiveText: { fontSize: 15 },

  // 이전 장보기
  historyCard: {
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  historyContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyInfo: { flex: 1 },
  historyTitle: { fontSize: 15 },
  historyMeta: { fontSize: 12, marginTop: 2 },
  reorderButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 공통
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: spacing.md,
  },
  emptyText: { fontSize: 14 },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
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
});
