import { memo } from "react";
import { View } from "react-native";
import { Image, ImageProps } from "expo-image";

type MangaImageProps = ImageProps & {
  uri: string;
  aspectRatio: number;
};

export const MangaImage = memo(({ uri, aspectRatio, ...rest }: MangaImageProps) => {
  return (
    <View style={{ width: '100%', aspectRatio }}>
      <Image
        source={{ uri }}
        style={{ width: '100%', height: '100%' }}
        contentFit="contain"
        {...rest}
      />
    </View>
  );
});