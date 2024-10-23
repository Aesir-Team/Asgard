import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TabRoutes, TabRoutesProps } from './TabNavigator'; // Importe o TabNavigator
import MangaDetail from '../screens/Stack/MangaDetail';
import theme from '../theme'; // Certifique-se de que o theme está importado corretamente
import { MangaChapter } from '../screens/Stack/MangaChapter';
import { NavigatorScreenParams, useNavigation } from '@react-navigation/native';


export type StackRoutesProps = {
  Tab: NavigatorScreenParams<TabRoutesProps>;
  MangaDetail: {
    mangaName: string;
    initialRoute: string;
  };
  MangaChapter: {
    imagesUrls: string[];
    chaptersList: string[];
    chapterName: string;
    initialRoute: string;
    mangaName: string;
  };
}

const Stack = createStackNavigator<StackRoutesProps>();

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
          headerTintColor: theme.colors.white,
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="MangaChapter"
        component={MangaChapter}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: theme.colors.background }, // Define a cor de fundo do cabeçalho corretamente
          headerTintColor: theme.colors.white,
          headerTitleAlign: 'center',
        }}
      />
    </Stack.Navigator>
  );
}
