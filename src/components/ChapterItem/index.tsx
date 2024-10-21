import { Text, TouchableOpacity, TouchableOpacityProps, View } from "react-native";
import { styles } from "./styles";
import { Check } from 'phosphor-react-native'; // Importa o ícone
import theme from "../../theme";

type ChapterItemProps = TouchableOpacityProps & {
  chapterName: string;
  downloaded?: boolean; // Adiciona a propriedade para indicar se o capítulo foi baixado
}

export function ChapterItem({ chapterName, downloaded, ...rest }: ChapterItemProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      {...rest}
    >
      <Text style={downloaded ? [styles.text, { paddingLeft: 30 }] : styles.text} numberOfLines={1} ellipsizeMode="tail">
        {chapterName}
      </Text>
      {downloaded && <Check size={24} color={theme.colors.purpleDark} style={styles.downloadIcon} weight='bold' />}
    </TouchableOpacity>
  );
}
