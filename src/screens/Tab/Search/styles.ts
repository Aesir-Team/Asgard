import { StyleSheet } from "react-native";
import theme from "../../../theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.background,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    borderColor: theme.colors.white,
    color: theme.colors.white,
    fontSize: theme.font_size.medium,
    fontFamily: theme.font_family.medium,
  },
});
