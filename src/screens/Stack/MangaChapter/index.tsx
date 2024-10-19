import { useRoute } from "@react-navigation/native";
import { FlatList, Image as ImageRN, Dimensions } from "react-native";
import { MangaApi } from "../../../services/api";
import { normalizeTitle } from "../../../utils";
import { useEffect, useState } from "react";
import { Image } from "expo-image";

type RouteParams = {
  chapterName: string;
  mangaName: string;
}

const { width } = Dimensions.get('window'); // Obter apenas a largura da tela

export function MangaChapter() {
  const [mangaUrlList, setMangaUrlList] = useState<string[]>([]);
  const [imageSizes, setImageSizes] = useState<{ width: number; height: number }[]>([]);
  const route = useRoute();
  const { chapterName, mangaName } = route.params as RouteParams;
  const mangaApi = new MangaApi();

  useEffect(() => {
    getChapters();
  }, []);

  const getChapters = async () => {
    const normalizedMangaName = normalizeTitle(mangaName);
    const normalizedChapterName = normalizeTitle(chapterName);
    const response = await mangaApi.getImages(normalizedMangaName, normalizedChapterName);
    setMangaUrlList(response);

    const sizes: { width: number; height: number }[] = [];
    for (let i = 0; i < response.length; i++) {
      ImageRN.getSize(response[i], (imgWidth, imgHeight) => {
        sizes[i] = { width: imgWidth, height: imgHeight };
        if (sizes.length === response.length) {
          setImageSizes(sizes);
        }
      },
        (error) => {
          console.error(`Erro ao obter a dimensão da imagem ${response[i]}:`, error);
        });
    }
  };

  return (
    <FlatList
      style={{ flex: 1 }}
      data={mangaUrlList}
      keyExtractor={(item, index) => String(index)}
      maxToRenderPerBatch={1}
      renderItem={({ item, index }) => {
        const imgWidth = imageSizes[index]?.width || width;
        const imgHeight = imageSizes[index]?.height || 1; // Evitar divisão por zero
        const aspectRatio = imgWidth / imgHeight; // Calcular a proporção da imagem

        return (
          <Image
            source={{ uri: item }}
            style={{
              width: '100%',
              aspectRatio// Mantém a proporção da imagem automaticamente
            }}
            contentFit="contain" // Ajusta a imagem para caber na tela mantendo a proporção
          />
        );
      }}
      windowSize={2}
      updateCellsBatchingPeriod={50}
      removeClippedSubviews={true}
    />
  );
}
