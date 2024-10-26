import { Image } from "expo-image";
import { TouchableOpacity } from "react-native";
import bannerImage from '../../assets/banner.webp';

type DiscordBannerProps = {
  onPress: () => void;
}

export function DiscordBanner({ onPress }: DiscordBannerProps) {
  return (
    <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 20 }} onPress={onPress}>
      <Image style={{ width: '90%', height: 150, borderRadius: 20 }} source={bannerImage} contentFit='fill' />
    </TouchableOpacity>
  )
}