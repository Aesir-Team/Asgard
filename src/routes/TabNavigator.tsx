import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Home from '../screens/Tab/Home';
import Search from '../screens/Tab/Search';
import Download from '../screens/Tab/Download';
import theme from '../theme';
import NetInfo from '@react-native-community/netinfo';

export type TabRoutesProps = {
  Home: undefined;
  Search: undefined;
  Download: undefined;
};

const Tab = createBottomTabNavigator<TabRoutesProps>();

export function TabRoutes() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const checkInitialConnection = async () => {
      const netState = await NetInfo.fetch();
      setIsConnected(netState.isConnected);
    };
    checkInitialConnection();

    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  if (isConnected === null) {
    return null;
  }

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
              iconName = 'home';
          }

          return <Ionicons name={iconName as keyof typeof Ionicons.glyphMap} size={size} color={color} />;
        },
        headerShown: false,
        lazy: true,
        tabBarActiveTintColor: theme.colors.purpleLight,
        tabBarInactiveTintColor: theme.colors.white,
        tabBarStyle: {
          backgroundColor: theme.colors.purpleDark,
        },
        headerTintColor: theme.colors.white,
      })}
    >
      {isConnected ? (
        <>
          <Tab.Screen name="Home" component={Home} options={{ headerTitleAlign: 'center', tabBarLabel: 'Home' }} />
          <Tab.Screen name="Search" component={Search} options={{ headerTitleAlign: 'center', tabBarLabel: 'Procurar' }} />
          <Tab.Screen name="Download" component={Download} options={{ headerTitleAlign: 'center', tabBarLabel: 'Baixados' }} />
        </>
      ) : (
        <Tab.Screen name="Download" component={Download} options={{ headerTitleAlign: 'center', tabBarLabel: 'Baixados' }} />
      )}
    </Tab.Navigator>
  );
}
