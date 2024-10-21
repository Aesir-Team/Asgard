import { NavigationContainer } from "@react-navigation/native";

import { AppNavigator } from "./StackNavigator";

export function Routes() {

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  )
}