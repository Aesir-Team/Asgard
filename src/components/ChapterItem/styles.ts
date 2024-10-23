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
    flexDirection: "row", // Alinha o texto e o ícone na horizontal
    paddingHorizontal: 10, // Adiciona um pouco de espaçamento horizontal
  },
  text: {
    fontFamily: theme.font_family.bold,
    fontSize: theme.font_size.regular,
    color: theme.colors.white,
    textAlign: "center", // Centraliza o texto
    flex: 1, // Permite que o texto ocupe o espaço restante
  },
  downloadIcon: {
    marginRight: 10, // Adiciona espaço entre o texto e o ícone
  },
});
