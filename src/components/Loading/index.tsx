import { ActivityIndicator, View } from "react-native";
import theme from "../../theme";

export function Loading() {

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
      <ActivityIndicator size="large" color={theme.colors.purpleLight} />
    </View>
  );
}