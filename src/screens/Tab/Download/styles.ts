import { StyleSheet } from "react-native";
import theme from "../../../theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.background,
  },
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.purple,
  },
  itemText: {
    fontSize: 16,
    color: theme.colors.white,
  },
});
