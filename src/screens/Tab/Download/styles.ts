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
  listHeaderTopContainer: {
    flex: 1,
    width: "90%",
    backgroundColor: theme.colors.purpleLight,
    alignSelf: "center",
    marginVertical: 20,
    justifyContent: "center",
    borderRadius: 12,
    borderColor: theme.colors.white,
    borderWidth:1
  },
  listHeaderTopTitle: {
    textAlign: "center",
    color: theme.colors.white,
    fontSize: theme.font_size.xlarge,
    fontFamily: theme.font_family.bold,
    margin: 10,
  },
  itemText: {
    fontSize: 16,
    color: theme.colors.white,
  },
});
