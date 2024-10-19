import { StyleSheet } from "react-native";
import theme from "../../theme";

export const styles = StyleSheet.create({
  mangaItem: {
    borderWidth: 1,
    borderColor: theme.colors.white,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: theme.colors.purpleLight,
    padding: 10, // Adiciona um pouco de espaçamento ao redor do item
  },

  mangaImage: {
    width: 70,
    height: 90,
    borderRadius: 8,
  },

  mangaTitle: {
    paddingHorizontal: 5,
    fontSize: theme.font_size.regular,
    fontFamily: theme.font_family.bold,
    color: theme.colors.white,
    flex: 1, // Permite que o título ocupe o espaço restante
  },
});
