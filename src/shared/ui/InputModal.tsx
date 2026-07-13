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

type Props = {
  visible: boolean;
  title: string;
  message?: string;
  placeholder?: string;
  defaultValue?: string;
  keyboardType?: 'default' | 'number-pad';
  confirmLabel?: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
};

export function InputModal({
  visible,
  title,
  message,
  placeholder,
  defaultValue = '',
  keyboardType = 'default',
  confirmLabel = '확인',
  onConfirm,
  onCancel,
}: Props) {
  const theme = useAppTheme();
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (visible) setValue(defaultValue);
  }, [visible, defaultValue]);

  const handleConfirm = () => {
    onConfirm(value);
    setValue('');
  };

  const handleCancel = () => {
    onCancel();
    setValue('');
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleCancel}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.container, { backgroundColor: theme.backgroundCard }]}>
          <Text style={[styles.title, { color: theme.text, fontFamily: fontFamily.krBold }]}>
            {title}
          </Text>
          {message ? (
            <Text
              style={[
                styles.message,
                { color: theme.textSecondary, fontFamily: fontFamily.krRegular },
              ]}>
              {message}
            </Text>
          ) : null}
          <TextInput
            style={[
              styles.input,
              {
                color: theme.text,
                backgroundColor: theme.background,
                fontFamily: fontFamily.krRegular,
              },
            ]}
            placeholder={placeholder}
            placeholderTextColor={theme.textTertiary}
            value={value}
            onChangeText={setValue}
            keyboardType={keyboardType}
            autoFocus
          />
          <View style={styles.buttons}>
            <Pressable style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
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
                {confirmLabel}
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
    gap: spacing.md,
  },
  title: { fontSize: 18 },
  message: { fontSize: 14 },
  input: {
    fontSize: 16,
    padding: spacing.lg,
    borderRadius: radius.md,
  },
  buttons: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  button: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  cancelButton: {},
  buttonText: { fontSize: 16 },
});
