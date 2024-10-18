import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Tab/Home';
import Search from '../screens/Tab/Search';
import Download from '../screens/Tab/Download';
import { Ionicons } from '@expo/vector-icons';  // Ícones
import { RouteProp } from '@react-navigation/native';

type TabParamList = {
  Home: undefined;
  Search: undefined;
  Download: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function Routes() {
  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: RouteProp<TabParamList> }) => ({
        tabBarIcon: ({ color, size }: { color: string, size: number }) => {
          let iconName: string = '';

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Search') {
            iconName = 'search';
          } else if (route.name === 'Download') {
            iconName = 'download';
          }

          return <Ionicons name={iconName as keyof typeof Ionicons.glyphMap} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen name="Download" component={Download} />
    </Tab.Navigator>
  );
}
