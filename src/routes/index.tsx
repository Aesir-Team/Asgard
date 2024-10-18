import { NavigationContainer } from "@react-navigation/native";

import { View } from "react-native";

import { AppNavigator } from "./StackNavigator";

export function Routes() {

  return (

    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>

  )
}