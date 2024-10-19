import { useRoute } from "@react-navigation/native";
import { ScrollView, Image as ImageRN, Dimensions, View, ActivityIndicator } from "react-native";
import { MangaApi } from "../../../services/api";
import { normalizeTitle } from "../../../utils";
import { useEffect, useState, memo } from "react";
import { Image } from "expo-image";

type RouteParams = {
  chapterName: string;
  mangaName: string;
};

const { width } = Dimensions.get('window');

const MangaImage = memo(({ uri, aspectRatio }: { uri: string, aspectRatio: number }) => {
  return (
    <View style={{ width: '100%', aspectRatio }}>
      <Image
        source={{ uri }}
        style={{ width: '100%', height: '100%' }}
        contentFit="contain"
      />
    </View>
  );
});

export function MangaChapter() {
  const [mangaUrlList, setMangaUrlList] = useState<string[]>([]);
  const [imageSizes, setImageSizes] = useState<{ width: number; height: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const route = useRoute();
  const { chapterName, mangaName } = route.params as RouteParams;
  const mangaApi = new MangaApi();

  useEffect(() => {
    getChapters();
  }, []);

  const getChapters = async () => {
    setLoading(true);
    const normalizedMangaName = normalizeTitle(mangaName);
    const normalizedChapterName = normalizeTitle(chapterName);
    const response = await mangaApi.getImages(normalizedMangaName, normalizedChapterName);
    setMangaUrlList(response);

    const sizes: { width: number; height: number }[] = [];
    let promises = response.map((imageUri: string, index: number) => {
      return new Promise((resolve) => {
        ImageRN.getSize(
          imageUri,
          (imgWidth, imgHeight) => {
            sizes[index] = { width: imgWidth, height: imgHeight };
            resolve(null);
          },
          (error) => {
            console.error(`Erro ao obter a dimensão da imagem ${imageUri}:`, error);
            resolve(null); // Ignora erro
          }
        );
      });
    });

    await Promise.all(promises);
    setImageSizes(sizes);
    setLoading(false);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      {mangaUrlList.map((item, index) => {
        const imgWidth = imageSizes[index]?.width || width;
        const imgHeight = imageSizes[index]?.height || 1;
        const aspectRatio = imgWidth / imgHeight;

        if (!imageSizes[index]) {
          // Placeholder para imagem que ainda não teve o tamanho calculado
          return (
            <View key={index} style={{ width: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="small" color="#0000ff" />
            </View>
          );
        }

        return <MangaImage key={index} uri={item} aspectRatio={aspectRatio} />;
      })}
    </ScrollView>
  );
}
