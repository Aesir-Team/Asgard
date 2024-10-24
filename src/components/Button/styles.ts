import { StyleSheet } from "react-native";
import theme from "../../theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 60,
    backgroundColor: theme.colors.purpleDark,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    textAlign: "center",
    color: theme.colors.white,
    fontSize: theme.font_size.large,
  },
});
