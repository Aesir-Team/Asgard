import { StyleSheet } from "react-native";
import theme from "../../../theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  image: {
    width: 75,
    height: 106,
    borderRadius: 5,
  },
  textContainer: {
    marginLeft: 10,
    flex: 1,
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
    borderWidth: 1,
  },
  listHeaderTopTitle: {
    textAlign: "center",
    color: theme.colors.white,
    fontSize: theme.font_size.xlarge,
    fontFamily: theme.font_family.bold,
    margin: 10,
  },
  title: {
    fontFamily: theme.font_family.bold,
    fontSize: theme.font_size.regular,
    color: theme.colors.white,
  },
});
