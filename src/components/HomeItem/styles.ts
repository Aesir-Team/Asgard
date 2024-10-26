import { StyleSheet } from "react-native";
import theme from "../../theme";

export const styles = StyleSheet.create({
  itemContainer: {
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  touchable: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
  },
  image: {
    width: 75,
    height: 106,
    borderRadius: 8,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    color: theme.colors.white,
    fontSize: theme.font_size.regular,
    fontFamily: theme.font_family.bold,
    marginBottom: 10,
  },
  lastChapter: {
    fontFamily: theme.font_family.regular,
    fontSize: theme.font_size.small,
    color: "#ccc",
  },
});
