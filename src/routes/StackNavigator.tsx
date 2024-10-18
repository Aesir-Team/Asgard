import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TabRoutes } from './TabNavigator'; // Importe o TabNavigator
import MangaDetail from '../screens/Stack/MangaDetail';

const Stack = createStackNavigator();

export function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tab"
        component={TabRoutes} // O TabNavigator é usado aqui
        options={{ headerShown: false }} // Oculta o cabeçalho na tela Home
      />
      <Stack.Screen
        name="MangaDetail"
        component={MangaDetail}
        options={{ headerShown: true }} // Mostra o cabeçalho na tela de detalhes
      />
    </Stack.Navigator>
  );
}
