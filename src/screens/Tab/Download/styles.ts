import { StyleSheet } from "react-native";
import theme from "../../../theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.background,
  },
  noDownloadedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noDownloadedTitle: {
    textAlign: "center",
    color: theme.colors.white,
    fontSize: theme.font_size.large,
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
