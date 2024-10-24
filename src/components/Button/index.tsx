import { Text, TouchableOpacity } from "react-native";
import { styles } from "./styles";

type ButtonProps = {
  title: string;
  onPress?: () => void;
}

export function Button({ onPress, title }: ButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  )
}
