import { Image } from 'expo-image';
import { Package } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/shared/lib/useAppTheme';
import { fontFamily } from '@/shared/theme';
import { Badge, Card, ProgressBar } from '@/shared/ui';
import type { Ingredient } from '../model/types';

interface IngredientCardProps {
  item: Ingredient;
}

function getExpiryVariant(daysLeft: number) {
  if (daysLeft <= 0) return 'danger' as const;
  if (daysLeft <= 3) return 'danger' as const;
  if (daysLeft <= 7) return 'warning' as const;
  return 'safe' as const;
}

function getExpiryLabel(daysLeft: number) {
  if (daysLeft <= 0) return '오늘 만료';
  return `D-${daysLeft}`;
}

export function IngredientCard({ item }: IngredientCardProps) {
  const theme = useAppTheme();
  const variant = getExpiryVariant(item.daysLeft);
  const label = getExpiryLabel(item.daysLeft);

  return (
    <Card>
      <View style={styles.header}>
        <View style={styles.info}>
          <View style={[styles.imageBox, { backgroundColor: theme.backgroundElement }]}>
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={styles.image} contentFit="cover" />
            ) : (
              <Package size={22} color={theme.textTertiary} strokeWidth={1.5} />
            )}
          </View>
          <View>
            <Text style={[styles.name, { color: theme.text, fontFamily: fontFamily.krBold }]}>
              {item.name}
            </Text>
            <Text
              style={[
                styles.meta,
                { color: theme.textTertiary, fontFamily: fontFamily.krRegular },
              ]}>
              {item.storage} · {item.category}
            </Text>
          </View>
        </View>
        <Badge label={label} variant={variant} />
      </View>
      <ProgressBar progress={item.remainingPercent} label="남은 양" value={item.remainingAmount} />
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  info: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  imageBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: { width: '100%', height: '100%' },
  name: { fontSize: 18 },
  meta: { fontSize: 12, marginTop: 2 },
});
