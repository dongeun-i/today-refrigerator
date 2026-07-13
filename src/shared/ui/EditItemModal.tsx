import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useAppTheme } from '@/shared/lib/useAppTheme';
import { fontFamily, palette, radius, spacing } from '@/shared/theme';

type ItemData = {
  name: string;
  quantity: number;
  unit: string;
  note: string | null;
  price: number | null;
};

type Props = {
  visible: boolean;
  item: ItemData | null;
  showPrice?: boolean;
  onConfirm: (data: ItemData) => void;
  onCancel: () => void;
};

export function EditItemModal({ visible, item, showPrice = false, onConfirm, onCancel }: Props) {
  const theme = useAppTheme();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('개');
  const [note, setNote] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    if (visible && item) {
      setName(item.name);
      setQuantity(String(item.quantity));
      setUnit(item.unit);
      setNote(item.note ?? '');
      setPrice(item.price != null ? String(item.price) : '');
    }
  }, [visible, item]);

  const handleConfirm = () => {
    if (!name.trim()) return;
    const qty = parseInt(quantity, 10);
    const p = price ? parseInt(price, 10) : null;
    onConfirm({
      name: name.trim(),
      quantity: isNaN(qty) || qty < 1 ? 1 : qty,
      unit: unit.trim() || '개',
      note: note.trim() || null,
      price: p && !isNaN(p) ? p : null,
    });
  };

  const UNITS = ['개', '팩', '박스', '봉', 'kg', 'g', 'L', 'ml'];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.container, { backgroundColor: theme.backgroundCard }]}>
          <Text style={[styles.title, { color: theme.text, fontFamily: fontFamily.krBold }]}>
            항목 편집
          </Text>

          {/* 이름 */}
          <View style={styles.field}>
            <Text
              style={[styles.label, { color: theme.textSecondary, fontFamily: fontFamily.krMedium }]}>
              이름
            </Text>
            <TextInput
              style={[styles.input, { color: theme.text, backgroundColor: theme.background, fontFamily: fontFamily.krRegular }]}
              value={name}
              onChangeText={setName}
              autoFocus
            />
          </View>

          {/* 수량 + 단위 */}
          <View style={styles.field}>
            <Text
              style={[styles.label, { color: theme.textSecondary, fontFamily: fontFamily.krMedium }]}>
              수량 · 단위
            </Text>
            <View style={styles.qtyUnitRow}>
              <TextInput
                style={[styles.qtyInput, { color: theme.text, backgroundColor: theme.background, fontFamily: fontFamily.krRegular }]}
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="number-pad"
              />
              {UNITS.slice(0, 4).map((u) => (
                <Pressable
                  key={u}
                  style={[
                    styles.unitChip,
                    {
                      backgroundColor: unit === u ? palette.primary : theme.background,
                    },
                  ]}
                  onPress={() => setUnit(u)}>
                  <Text
                    style={[
                      styles.unitText,
                      {
                        color: unit === u ? '#fff' : theme.textSecondary,
                        fontFamily: fontFamily.krMedium,
                      },
                    ]}>
                    {u}
                  </Text>
                </Pressable>
                ))}
            </View>
          </View>

          {/* 가격 */}
          {showPrice && (
            <View style={styles.field}>
              <Text
                style={[styles.label, { color: theme.textSecondary, fontFamily: fontFamily.krMedium }]}>
                가격 (선택)
              </Text>
              <View style={[styles.priceRow, { backgroundColor: theme.background }]}>
                <TextInput
                  style={[styles.priceInput, { color: theme.text, fontFamily: fontFamily.krRegular }]}
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="number-pad"
                  placeholder="0"
                  placeholderTextColor={theme.textTertiary}
                />
                <Text style={[styles.priceUnit, { color: theme.textTertiary, fontFamily: fontFamily.krRegular }]}>
                  원
                </Text>
              </View>
            </View>
          )}

          {/* 메모 */}
          <View style={styles.field}>
            <Text
              style={[styles.label, { color: theme.textSecondary, fontFamily: fontFamily.krMedium }]}>
              메모 (선택)
            </Text>
            <TextInput
              style={[styles.input, { color: theme.text, backgroundColor: theme.background, fontFamily: fontFamily.krRegular }]}
              value={note}
              onChangeText={setNote}
              placeholder="예: 2+1 있으면 그거로"
              placeholderTextColor={theme.textTertiary}
            />
          </View>

          {/* 버튼 */}
          <View style={styles.buttons}>
            <Pressable style={styles.button} onPress={onCancel}>
              <Text
                style={[styles.buttonText, { color: theme.textSecondary, fontFamily: fontFamily.krMedium }]}>
                취소
              </Text>
            </Pressable>
            <Pressable
              style={[styles.button, { backgroundColor: palette.primary }]}
              onPress={handleConfirm}>
              <Text style={[styles.buttonText, { color: '#fff', fontFamily: fontFamily.krMedium }]}>
                저장
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing['2xl'],
  },
  container: {
    width: '100%',
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.sm,
  },
  title: { fontSize: 17, marginBottom: spacing.xs },
  field: { gap: 4 },
  label: { fontSize: 12 },
  input: {
    fontSize: 15,
    height: 40,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
  },
  qtyUnitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  qtyInput: {
    fontSize: 15,
    height: 40,
    width: 56,
    textAlign: 'center',
    borderRadius: radius.sm,
  },
  unitChip: {
    height: 40,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unitText: { fontSize: 13 },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderRadius: radius.sm,
    paddingRight: spacing.md,
  },
  priceInput: {
    flex: 1,
    fontSize: 15,
    height: 40,
    paddingHorizontal: spacing.md,
  },
  priceUnit: { fontSize: 13 },
  buttons: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  button: {
    flex: 1,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { fontSize: 15 },
});
