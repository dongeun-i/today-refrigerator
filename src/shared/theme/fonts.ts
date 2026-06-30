import { Platform } from 'react-native';

export const fontFamily = Platform.select({
  ios: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
    krRegular: 'NotoSansKR_400Regular',
    krMedium: 'NotoSansKR_500Medium',
    krSemibold: 'NotoSansKR_600SemiBold',
    krBold: 'NotoSansKR_700Bold',
  },
  android: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
    krRegular: 'NotoSansKR_400Regular',
    krMedium: 'NotoSansKR_500Medium',
    krSemibold: 'NotoSansKR_600SemiBold',
    krBold: 'NotoSansKR_700Bold',
  },
  default: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
    krRegular: 'NotoSansKR_400Regular',
    krMedium: 'NotoSansKR_500Medium',
    krSemibold: 'NotoSansKR_600SemiBold',
    krBold: 'NotoSansKR_700Bold',
  },
})!;
