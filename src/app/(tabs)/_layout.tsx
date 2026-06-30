import { Tabs } from 'expo-router';
import {
  BarChart3,
  ChefHat,
  Home,
  Refrigerator,
  ShoppingCart,
  type LucideIcon,
} from 'lucide-react-native';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '@/shared/lib/useAppTheme';
import { fontFamily, palette } from '@/shared/theme';

type TabIconProps = {
  label: string;
  icon: LucideIcon;
  focused: boolean;
};

function TabIcon({ label, icon: Icon, focused }: TabIconProps) {
  const theme = useAppTheme();
  const color = focused ? palette.primary : theme.tabInactive;

  return (
    <View style={styles.tabItem}>
      <Icon size={22} color={color} strokeWidth={focused ? 2.2 : 1.8} />
      <Text
        style={[
          styles.tabLabel,
          { color, fontFamily: focused ? fontFamily.krSemibold : fontFamily.krMedium },
        ]}>
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.tabBar,
          borderTopColor: theme.border,
          height: Platform.OS === 'ios' ? 80 + insets.bottom : 70,
          paddingTop: 8,
          position: 'absolute',
        },
        tabBarShowLabel: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon={Home} label="홈" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={Refrigerator} label="냉장고" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="shopping"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={ShoppingCart} label="장보기" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="recipe"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={ChefHat} label="레시피" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={BarChart3} label="리포트" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem: { alignItems: 'center', gap: 3 },
  tabLabel: { fontSize: 10 },
});
