import { StyleSheet } from "react-native";
import theme from "../../theme";

export const styles = StyleSheet.create({
  Container: {
    width: "100%",
    height: 1,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    marginBottom: 10,
  },
  mangaItem: {
    borderWidth: 1,
    borderColor: theme.colors.white,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: theme.colors.purpleLight,
    padding: 10, // Adiciona um pouco de espaçamento ao redor do item
  },

  mangaImage: {
    width: 70,
    height: 90,
    borderRadius: 8,
  },

  mangaContent: {
    flex: 1, // Ocupa o espaço restante
    flexDirection: "row", // Define a direção das linhas e ícones
    alignItems: "center", // Alinha verticalmente
    justifyContent: "space-between", // Espaça o texto e o ícone
    marginLeft: 10, // Dá um espaço entre a imagem e o conteúdo
  },

  mangaTitle: {
    fontSize: theme.font_size.regular,
    fontFamily: theme.font_family.bold,
    color: theme.colors.white,
    flexShrink: 1, // Permite que o texto encolha e quebre em linhas
    flexWrap: "wrap", // Permite que o texto quebre em múltiplas linhas
  },

  downloadIcon: {
    marginRight: 10, // Espaço entre o título e o ícone
  },
});
