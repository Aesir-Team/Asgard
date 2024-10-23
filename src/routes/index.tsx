import { NavigationContainer } from "@react-navigation/native";

import { AppNavigator } from "./StackNavigator";
import { View } from "react-native";
import theme from "../theme";

export function Routes() {

  return (
    <NavigationContainer >
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <AppNavigator />
      </View>
    </NavigationContainer>
  )
}