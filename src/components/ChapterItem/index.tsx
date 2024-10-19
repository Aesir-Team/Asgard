import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Chapter } from "../../models/Manga";
import { styles } from "./styles";

type ChapterItemProps = TouchableOpacityProps & {
  data: Chapter;
}

export function ChapterItem({ data, ...rest }: ChapterItemProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      {...rest}
    >
      <Text style={styles.text}>
        {data.title}
      </Text>
    </TouchableOpacity>)
}

