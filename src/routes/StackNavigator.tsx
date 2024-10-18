import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TabRoutes } from './TabNavigator'; // Importe o TabNavigator
import MangaDetail from '../screens/Stack/MangaDetail';
import theme from '../theme'; // Certifique-se de que o theme está importado corretamente

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
        options={{
          headerShown: true,
          title: 'Detalhes',
          headerStyle: { backgroundColor: theme.colors.background }, // Define a cor de fundo do cabeçalho corretamente
          headerTintColor: theme.colors.white, // Define a cor do texto do cabeçalho, caso necessário
        }}
      />
    </Stack.Navigator>
  );
}
