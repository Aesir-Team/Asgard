import { Text, TouchableOpacity, TouchableOpacityProps, View, ActivityIndicator } from "react-native";
import { styles } from "./styles";
import { Check } from 'phosphor-react-native';
import theme from "../../theme";

type ChapterItemProps = TouchableOpacityProps & {
  chapterName: string;
  downloaded?: boolean;
  loading?: boolean; // Prop para indicar se o capítulo está em download
}

export function ChapterItem({ chapterName, downloaded, loading, ...rest }: ChapterItemProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      {...rest}
    >
      <Text style={downloaded ? [styles.text, { paddingLeft: 30 }] : styles.text} numberOfLines={1} ellipsizeMode="tail">
        {chapterName}
      </Text>
      {loading ? (
        <ActivityIndicator size={24} color={theme.colors.purpleDark} style={styles.downloadIcon} />
      ) : (
        downloaded && <Check size={24} color={theme.colors.purpleDark} style={styles.downloadIcon} weight='bold' />
      )}
    </TouchableOpacity>
  );
}
