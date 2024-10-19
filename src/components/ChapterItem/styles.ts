import { StyleSheet } from "react-native";
import theme from "../../theme";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 50,
    backgroundColor: theme.colors.purpleLight,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    marginBottom: 12,
  },
  text: {
    fontFamily: theme.font_family.bold,
    fontSize: theme.font_size.regular,
    color: theme.colors.white,
  },
});
