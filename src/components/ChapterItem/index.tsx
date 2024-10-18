import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Chapter } from "../../models/Manga";
import { styles } from "./styles";


export function ChapterItem(Data: Chapter) {
  return (
    <TouchableOpacity
      style={styles.container}>
      <Text style={styles.text}>
        {Data.title}
      </Text>
    </TouchableOpacity>)
}

