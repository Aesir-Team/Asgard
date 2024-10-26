import { Image } from "expo-image";
import { TouchableOpacity } from "react-native";
import bannerImage from '../../assets/banner.webp';
import { styles } from "./styles";


type DiscordBannerProps = {
  onPress: () => void;
}

export function DiscordBanner({ onPress }: DiscordBannerProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image style={styles.image} source={bannerImage} contentFit='fill' />
    </TouchableOpacity>
  )
}