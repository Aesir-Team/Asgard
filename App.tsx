import React from 'react';
import { Routes } from './src/routes';
import { StatusBar, View } from 'react-native';
import { useFonts, NunitoSans_400Regular, NunitoSans_600SemiBold, NunitoSans_700Bold } from '@expo-google-fonts/nunito-sans'
import { Loading } from './src/components/Loading';
import theme from './src/theme';

const App = () => {
  const [fontsLoaded, error] = useFonts({ NunitoSans_400Regular, NunitoSans_600SemiBold, NunitoSans_700Bold });
  return (
    fontsLoaded ?
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <Routes />
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      </View> : <Loading />
  );
};

export default App;
