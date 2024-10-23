import { memo } from "react";
import { View } from "react-native";
import { Image, ImageProps } from "expo-image";

type MangaImageProps = {
  uri: string;
  aspectRatio: number;
  onLoad?: () => void;
};

export const MangaImage = memo(({ uri, aspectRatio, onLoad }: MangaImageProps) => {
  return (
    <View style={{ width: '100%', aspectRatio }}>
      <Image
        source={{ uri }}
        style={{ width: '100%', height: '100%' }}
        contentFit="contain"
        onLoad={onLoad}
      />
    </View>
  );
});