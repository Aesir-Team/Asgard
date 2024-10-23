import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Home from '../screens/Tab/Home';
import Search from '../screens/Tab/Search';
import Download from '../screens/Tab/Download';
import theme from '../theme';
import { } from '@react-navigation/native';

export type TabRoutesProps = {
  Home: undefined;
  Search: undefined;
  Download: undefined;
}

const Tab = createBottomTabNavigator<TabRoutesProps>();

export function TabRoutes() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Search':
              iconName = 'search';
              break;
            case 'Download':
              iconName = 'download';
              break;
            default:
              iconName = 'home'; // Fallback
          }

          return <Ionicons name={iconName as keyof typeof Ionicons.glyphMap} size={size} color={color} />;
        },
        lazy: true,
        tabBarActiveTintColor: theme.colors.purpleLight,
        tabBarInactiveTintColor: theme.colors.white,
        tabBarStyle: {
          backgroundColor: theme.colors.purpleDark,// Cor de fundo da tabBar
        },
        headerStyle: {
          backgroundColor: theme.colors.purpleDark, // Cor de fundo do header (parte superior)
        },
        headerTintColor: theme.colors.white, // Cor dos textos e ícones no header
      })}
    >
      <Tab.Screen name="Home" component={Home} options={{ headerTitleAlign: 'center' }} />
      <Tab.Screen name="Search" component={Search} options={{ headerTitleAlign: 'center' }} />
      <Tab.Screen name="Download" component={Download} options={{ headerTitleAlign: 'center' }} />
    </Tab.Navigator>
  );
}
