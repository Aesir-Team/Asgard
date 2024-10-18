import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Home from '../screens/Tab/Home';
import Search from '../screens/Tab/Search';
import Download from '../screens/Tab/Download';
import theme from '../theme';

const Tab = createBottomTabNavigator();

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
        tabBarActiveTintColor: theme.colors.purpleLight,
        tabBarInactiveTintColor: theme.colors.white,
        tabBarStyle: {
          backgroundColor: theme.colors.purpleDark, // Cor de fundo da tabBar
        },
        headerStyle: {
          backgroundColor: theme.colors.purpleDark, // Cor de fundo do header (parte superior)
        },
        headerTintColor: theme.colors.white, // Cor dos textos e ícones no header
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen name="Download" component={Download} />
    </Tab.Navigator>
  );
}
