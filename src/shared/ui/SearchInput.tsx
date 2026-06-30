import { StyleSheet, TextInput, View } from 'react-native';

import { Search } from 'lucide-react-native';
import { useAppTheme } from '@/shared/lib/useAppTheme';
import { fontFamily, radius, spacing } from '@/shared/theme';

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

export function SearchInput({ placeholder = '검색...', value, onChangeText }: SearchInputProps) {
  const theme = useAppTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundCard }]}>
      <Search size={16} color={theme.textTertiary} strokeWidth={1.8} />
      <TextInput
        style={[styles.input, { color: theme.text, fontFamily: fontFamily.krRegular }]}
        placeholder={placeholder}
        placeholderTextColor={theme.textTertiary}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  input: { fontSize: 14, flex: 1 },
});
