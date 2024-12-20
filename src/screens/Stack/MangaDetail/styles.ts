import { StyleSheet } from "react-native";
import theme from "../../../theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.background,
  },
  headerContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerBanner: {
    width: 400,
    height: 400,
    paddingTop: 20,
    marginBottom: 20,
  },
  headerTitle: {
    color: theme.colors.white,
    fontFamily: theme.font_family.bold,
    fontSize: theme.font_size.xlarge,
    textAlign: "center",
    marginBottom: 20,
  },
  headerSinopse: {
    textAlign: "center",
    fontSize: theme.font_size.large,
    fontFamily: theme.font_family.medium,
    color: theme.colors.white,
    marginBottom: 5,
  },
  headerSinopseView: {
    flex: 1,
    backgroundColor: theme.colors.purpleDark,
    borderRadius: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerDescription: {
    flex: 1,
    color: theme.colors.white,
    fontFamily: theme.font_family.regular,
    fontSize: theme.font_size.small,
    textAlign: "justify",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.purpleDark,
    borderRadius: 20,
  },
});
