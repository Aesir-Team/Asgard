import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Routes from './src/routes/routes';  // Importando o arquivo de rotas

export default function App() {
  return (
    <NavigationContainer>
      <Routes />  
    </NavigationContainer>
  );
}
