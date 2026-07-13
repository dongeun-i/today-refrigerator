import { useState } from 'react';
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

type Props = {
  visible: boolean;
  onConfirm: (title: string, budget?: number) => void;
  onCancel: () => void;
};

export function CreateTripModal({ visible, onConfirm, onCancel }: Props) {
  const theme = useAppTheme();
  const [title, setTitle] = useState('');
  const [budget, setBudget] = useState('');

  const handleConfirm = () => {
    if (!title.trim()) return;
    const budgetNum = budget ? parseInt(budget, 10) : undefined;
    onConfirm(title.trim(), budgetNum && !isNaN(budgetNum) ? budgetNum : undefined);
    setTitle('');
    setBudget('');
  };

  const handleCancel = () => {
    onCancel();
    setTitle('');
    setBudget('');
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleCancel}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.container, { backgroundColor: theme.backgroundCard }]}>
          <Text style={[styles.title, { color: theme.text, fontFamily: fontFamily.krBold }]}>
            새 장보기 목록
          </Text>

          <View style={styles.field}>
            <Text
              style={[
                styles.label,
                { color: theme.textSecondary, fontFamily: fontFamily.krMedium },
              ]}>
              제목
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: theme.text,
                  backgroundColor: theme.background,
                  fontFamily: fontFamily.krRegular,
                },
              ]}
              placeholder="예: 롯데마트 장보기"
              placeholderTextColor={theme.textTertiary}
              value={title}
              onChangeText={setTitle}
              autoFocus
            />
          </View>

          <View style={styles.field}>
            <Text
              style={[
                styles.label,
                { color: theme.textSecondary, fontFamily: fontFamily.krMedium },
              ]}>
              예산 (선택)
            </Text>
            <View
              style={[
                styles.budgetRow,
                { backgroundColor: theme.background },
              ]}>
              <TextInput
                style={[
                  styles.budgetInput,
                  { color: theme.text, fontFamily: fontFamily.krRegular },
                ]}
                placeholder="50,000"
                placeholderTextColor={theme.textTertiary}
                value={budget}
                onChangeText={setBudget}
                keyboardType="number-pad"
              />
              <Text
                style={[
                  styles.budgetUnit,
                  { color: theme.textTertiary, fontFamily: fontFamily.krRegular },
                ]}>
                원
              </Text>
            </View>
          </View>

          <View style={styles.buttons}>
            <Pressable style={styles.button} onPress={handleCancel}>
              <Text
                style={[
                  styles.buttonText,
                  { color: theme.textSecondary, fontFamily: fontFamily.krMedium },
                ]}>
                취소
              </Text>
            </Pressable>
            <Pressable
              style={[styles.button, { backgroundColor: palette.primary }]}
              onPress={handleConfirm}>
              <Text style={[styles.buttonText, { color: '#fff', fontFamily: fontFamily.krMedium }]}>
                만들기
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
    padding: spacing['2xl'],
    gap: spacing.lg,
  },
  title: { fontSize: 18 },
  field: { gap: spacing.xs },
  label: { fontSize: 13 },
  input: {
    fontSize: 16,
    padding: spacing.lg,
    borderRadius: radius.md,
  },
  budgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    paddingRight: spacing.lg,
  },
  budgetInput: {
    flex: 1,
    fontSize: 16,
    padding: spacing.lg,
  },
  budgetUnit: { fontSize: 14 },
  buttons: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs },
  button: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  buttonText: { fontSize: 16 },
});
