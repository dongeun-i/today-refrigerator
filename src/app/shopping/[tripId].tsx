import { Check, ChevronLeft, Coins, Pencil, Plus, Trash2 } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

import { useDatabase } from '@/shared/db';
import {
  getItemsByTrip,
  getTripById,
  createItem,
  updateItem,
  toggleItem as toggleItemDb,
  updateItemPrice,
  deleteItem,
  deleteTrip,
  updateTripTitle,
  updateTripBudget,
  updateTripStatus,
  updateTripSpent,
} from '@/entities/shopping';
import type { ShoppingItem, ShoppingTrip, TripStatus } from '@/entities/shopping';
import { useAppTheme } from '@/shared/lib/useAppTheme';
import { fontFamily, palette, radius, spacing } from '@/shared/theme';
import { InputModal, EditItemModal } from '@/shared/ui';

const STATUS_LABEL: Record<TripStatus, string> = {
  planned: '장보기 시작',
  in_progress: '장보기 완료',
  completed: '완료됨',
};

export default function TripDetailScreen() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const db = useDatabase();

  const [trip, setTrip] = useState<ShoppingTrip | null>(null);
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [newItemName, setNewItemName] = useState('');

  // 모달 상태
  const [showSpentModal, setShowSpentModal] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showEditItemModal, setShowEditItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);

  const loadData = useCallback(async () => {
    const [t, i] = await Promise.all([
      getTripById(db, tripId),
      getItemsByTrip(db, tripId),
    ]);
    setTrip(t);
    setItems(i);
  }, [db, tripId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ─── 아이템 추가 ───
  const handleAddItem = async () => {
    const name = newItemName.trim();
    if (!name) return;
    await createItem(db, { trip_id: tripId, name });
    setNewItemName('');
    await loadData();
  };

  // ─── 아이템 체크 ───
  const handleToggle = async (item: ShoppingItem) => {
    await toggleItemDb(db, item.id);
    await loadData();
  };

  // ─── 가격 입력 ───
  const handlePriceInput = (item: ShoppingItem) => {
    setEditingItem(item);
    setShowPriceModal(true);
  };

  // ─── 아이템 편집 ───
  const handleItemEdit = (item: ShoppingItem) => {
    if (trip?.status === 'completed') return;
    setEditingItem(item);
    setShowEditItemModal(true);
  };

  // ─── 아이템 삭제 ───
  const handleDeleteItem = (id: string, name: string) => {
    Alert.alert('삭제', `"${name}"을(를) 삭제할까요?`, [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          await deleteItem(db, id);
          await loadData();
        },
      },
    ]);
  };

  // ─── 상태 변경 ───
  const handleStatusChange = async () => {
    if (!trip) return;
    if (trip.status === 'planned') {
      await updateTripStatus(db, tripId, 'in_progress');
      await loadData();
    } else if (trip.status === 'in_progress') {
      Alert.alert('장보기 완료', '장보기를 완료할까요?', [
        { text: '취소', style: 'cancel' },
        {
          text: '완료',
          onPress: async () => {
            const totalFromItems = items.reduce((sum, i) => sum + (i.price ?? 0), 0);
            if (totalFromItems > 0) {
              await updateTripSpent(db, tripId, totalFromItems);
            } else {
              setShowSpentModal(true);
              return;
            }
            await updateTripStatus(db, tripId, 'completed');
            await loadData();
          },
        },
      ]);
    }
  };

  // ─── 트립 삭제 ───
  const handleDeleteTrip = () => {
    if (!trip) return;
    Alert.alert('목록 삭제', `"${trip.title}"을(를) 삭제할까요?`, [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          await deleteTrip(db, tripId);
          router.back();
        },
      },
    ]);
  };

  if (!trip) return null;

  const checkedCount = items.filter((i) => i.checked).length;
  const totalPrice = items.reduce((sum, i) => sum + (i.price ?? 0), 0);

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      {/* 헤더 */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <View style={styles.headerTopRow}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color={theme.text} />
          </Pressable>
          <Pressable onPress={handleDeleteTrip} style={{ padding: spacing.xs }}>
            <Trash2 size={20} color={theme.textTertiary} strokeWidth={1.8} />
          </Pressable>
        </View>
        <Pressable onPress={() => setShowTitleModal(true)} style={styles.titleRow}>
          <Text style={[styles.title, { color: theme.text, fontFamily: fontFamily.krBold }]}>
            {trip.title}
          </Text>
          {trip.status !== 'completed' && (
            <Pencil size={16} color={theme.textTertiary} strokeWidth={1.8} />
          )}
        </Pressable>
        <Pressable onPress={() => setShowBudgetModal(true)}>
          <Text
            style={[
              styles.subtitle,
              { color: theme.textSecondary, fontFamily: fontFamily.krRegular },
            ]}>
            {items.length}개 항목 · {checkedCount}개 완료
            {trip.budget
              ? ` · 예산 ${trip.budget.toLocaleString()}원`
              : trip.status !== 'completed'
                ? ' · 예산 설정하기'
                : ''}
          </Text>
        </Pressable>
      </View>

      {/* 실시간 합계 바 */}
      {trip.status === 'in_progress' && totalPrice > 0 && (
        <View style={[styles.priceBar, { backgroundColor: theme.backgroundCard }]}>
          <Text
            style={[
              styles.priceBarLabel,
              { color: theme.textSecondary, fontFamily: fontFamily.krRegular },
            ]}>
            현재 합계
          </Text>
          <Text
            style={[
              styles.priceBarAmount,
              {
                color: trip.budget && totalPrice > trip.budget ? palette.accent : palette.primary,
                fontFamily: fontFamily.bold,
              },
            ]}>
            {totalPrice.toLocaleString()}원
          </Text>
          {trip.budget ? (
            <Text
              style={[
                styles.priceBarBudget,
                { color: theme.textTertiary, fontFamily: fontFamily.krRegular },
              ]}>
              / {trip.budget.toLocaleString()}원
            </Text>
          ) : null}
        </View>
      )}

      {/* 아이템 리스트 */}
      <ScrollView contentContainerStyle={{ paddingBottom: 160 }}>
        <View style={styles.list}>
          {items.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => handleToggle(item)}
              onLongPress={() => handleDeleteItem(item.id, item.name)}
              style={[styles.itemCard, { backgroundColor: theme.backgroundCard }]}>
              <View
                style={[
                  styles.checkbox,
                  item.checked
                    ? { backgroundColor: palette.primary, borderColor: palette.primary }
                    : { borderColor: theme.textTertiary },
                ]}>
                {item.checked ? <Check size={14} color="#fff" strokeWidth={3} /> : null}
              </View>
              <Pressable
                style={styles.itemContent}
                onPress={() => handleItemEdit(item)}>
                <Text
                  style={[
                    styles.itemName,
                    { color: item.checked ? theme.textTertiary : theme.text },
                    { fontFamily: fontFamily.krSemibold },
                    item.checked ? styles.itemChecked : null,
                  ]}>
                  {item.name}
                </Text>
                {item.quantity > 1 && (
                  <Text
                    style={[
                      styles.itemMeta,
                      { color: theme.textTertiary, fontFamily: fontFamily.krRegular },
                    ]}>
                    {item.quantity}{item.unit}
                    {item.note ? ` · ${item.note}` : ''}
                  </Text>
                )}
                {item.quantity <= 1 && item.note ? (
                  <Text
                    style={[
                      styles.itemMeta,
                      { color: theme.textTertiary, fontFamily: fontFamily.krRegular },
                    ]}>
                    {item.note}
                  </Text>
                ) : null}
              </Pressable>
              {item.price != null ? (
                <Pressable onPress={() => handlePriceInput(item)}>
                  <Text
                    style={[
                      styles.itemPrice,
                      { color: item.checked ? theme.textTertiary : palette.primary },
                      { fontFamily: fontFamily.semibold },
                    ]}>
                    {item.price.toLocaleString()}원
                  </Text>
                </Pressable>
              ) : trip?.status === 'in_progress' ? (
                <Pressable
                  style={[styles.priceButton, { backgroundColor: palette.primaryLight }]}
                  onPress={() => handlePriceInput(item)}>
                  <Coins size={16} color={palette.primary} strokeWidth={1.8} />
                </Pressable>
              ) : null}
            </Pressable>
          ))}
        </View>

        {trip.status !== 'completed' && (
          <View style={[styles.addRow, { borderColor: theme.textTertiary }]}>
            <Plus size={16} color={theme.textTertiary} strokeWidth={1.8} />
            <TextInput
              style={[styles.addInput, { color: theme.text, fontFamily: fontFamily.krRegular }]}
              placeholder="항목을 추가하세요..."
              placeholderTextColor={theme.textTertiary}
              value={newItemName}
              onChangeText={setNewItemName}
              onSubmitEditing={handleAddItem}
              returnKeyType="done"
            />
          </View>
        )}
      </ScrollView>

      {/* 하단 CTA */}
      {trip.status !== 'completed' && (
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing.lg }]}>
          <Pressable
            style={[styles.ctaButton, { backgroundColor: palette.primary }]}
            onPress={handleStatusChange}>
            <Text style={[styles.ctaText, { fontFamily: fontFamily.krBold }]}>
              {STATUS_LABEL[trip.status]}
            </Text>
            {trip.status === 'in_progress' && (
              <View style={styles.ctaBadge}>
                <Text style={[styles.ctaBadgeText, { fontFamily: fontFamily.semibold }]}>
                  {checkedCount}/{items.length}
                </Text>
              </View>
            )}
          </Pressable>
        </View>
      )}

      {/* 완료 요약 */}
      {trip.status === 'completed' && (
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing.lg }]}>
          <View style={[styles.summaryCard, { backgroundColor: theme.backgroundCard }]}>
            <Text
              style={[
                styles.summaryLabel,
                { color: theme.textSecondary, fontFamily: fontFamily.krRegular },
              ]}>
              총 사용 금액
            </Text>
            <Text style={[styles.summaryAmount, { color: theme.text, fontFamily: fontFamily.bold }]}>
              {(trip.total_spent ?? totalPrice).toLocaleString()}원
            </Text>
            {trip.budget ? (
              <Text
                style={[
                  styles.summaryBudget,
                  {
                    color:
                      (trip.total_spent ?? totalPrice) > trip.budget
                        ? palette.accent
                        : palette.primary,
                    fontFamily: fontFamily.krMedium,
                  },
                ]}>
                예산 대비 {Math.round(((trip.total_spent ?? totalPrice) / trip.budget) * 100)}%
              </Text>
            ) : null}
          </View>
          <Pressable
            style={[styles.reopenButton, { borderColor: palette.primary }]}
            onPress={() => {
              Alert.alert('다시 진행', '이 장보기를 다시 진행할까요?', [
                { text: '취소', style: 'cancel' },
                {
                  text: '다시 진행',
                  onPress: async () => {
                    await updateTripStatus(db, tripId, 'in_progress');
                    await loadData();
                  },
                },
              ]);
            }}>
            <Text
              style={[
                styles.reopenText,
                { color: palette.primary, fontFamily: fontFamily.krMedium },
              ]}>
              다시 진행하기
            </Text>
          </Pressable>
        </View>
      )}

      {/* ─── 모달들 ─── */}

      {/* 제목 편집 */}
      <InputModal
        visible={showTitleModal}
        title="제목 편집"
        placeholder="장보기 제목"
        defaultValue={trip.title}
        confirmLabel="저장"
        onConfirm={async (value) => {
          setShowTitleModal(false);
          if (value.trim() && value.trim() !== trip.title) {
            await updateTripTitle(db, tripId, value.trim());
            await loadData();
          }
        }}
        onCancel={() => setShowTitleModal(false)}
      />

      {/* 예산 편집 */}
      <InputModal
        visible={showBudgetModal}
        title="예산 설정"
        message="예산 금액을 입력해주세요 (원)"
        placeholder="예: 50000"
        defaultValue={trip.budget ? String(trip.budget) : ''}
        keyboardType="number-pad"
        confirmLabel="저장"
        onConfirm={async (value) => {
          setShowBudgetModal(false);
          const budget = value ? parseInt(value, 10) : null;
          await updateTripBudget(db, tripId, budget && !isNaN(budget) ? budget : null);
          await loadData();
        }}
        onCancel={() => setShowBudgetModal(false)}
      />

      {/* 가격 입력 */}
      <InputModal
        visible={showPriceModal}
        title="가격 입력"
        placeholder="예: 3900"
        defaultValue={editingItem?.price != null ? String(editingItem.price) : ''}
        keyboardType="number-pad"
        confirmLabel="저장"
        onConfirm={async (value) => {
          setShowPriceModal(false);
          if (editingItem) {
            const parsed = value ? parseInt(value, 10) : null;
            const price = parsed && !isNaN(parsed) ? parsed : null;
            await updateItemPrice(db, editingItem.id, price);
            await loadData();
          }
          setEditingItem(null);
        }}
        onCancel={() => {
          setShowPriceModal(false);
          setEditingItem(null);
        }}
      />

      {/* 아이템 편집 */}
      <EditItemModal
        visible={showEditItemModal}
        item={editingItem}
        showPrice={trip.status === 'in_progress'}
        onConfirm={async (data) => {
          setShowEditItemModal(false);
          if (editingItem) {
            await updateItem(db, editingItem.id, {
              name: data.name,
              quantity: data.quantity,
              unit: data.unit,
              note: data.note ?? undefined,
            });
            if (data.price != null) {
              await updateItemPrice(db, editingItem.id, data.price);
            }
            await loadData();
          }
          setEditingItem(null);
        }}
        onCancel={() => {
          setShowEditItemModal(false);
          setEditingItem(null);
        }}
      />

      {/* 총 금액 수동 입력 (가격 미입력 시) */}
      <InputModal
        visible={showSpentModal}
        title="장보기 완료"
        message="총 사용 금액을 입력해주세요 (원)"
        placeholder="예: 50000"
        keyboardType="number-pad"
        confirmLabel="완료"
        onConfirm={async (value) => {
          setShowSpentModal(false);
          const spent = value ? parseInt(value, 10) : undefined;
          if (spent && !isNaN(spent)) {
            await updateTripSpent(db, tripId, spent);
          }
          await updateTripStatus(db, tripId, 'completed');
          await loadData();
        }}
        onCancel={() => setShowSpentModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { paddingHorizontal: spacing['2xl'], marginBottom: spacing.sm },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  backButton: {
    padding: spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: { fontSize: 28 },
  subtitle: { fontSize: 14, marginTop: 4 },

  priceBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    gap: spacing.xs,
  },
  priceBarLabel: { fontSize: 13 },
  priceBarAmount: { fontSize: 16 },
  priceBarBudget: { fontSize: 13 },

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
  itemMeta: { fontSize: 12, marginTop: 2 },
  itemPrice: { fontSize: 14 },
  priceButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addRow: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  addInput: { flex: 1, fontSize: 14, padding: 0 },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
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
  summaryCard: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    alignItems: 'center',
    gap: 4,
  },
  summaryLabel: { fontSize: 12 },
  summaryAmount: { fontSize: 24 },
  summaryBudget: { fontSize: 14 },
  reopenButton: {
    borderWidth: 1.5,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  reopenText: { fontSize: 14 },
});
