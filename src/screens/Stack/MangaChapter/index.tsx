import { FlatList, Image as ImageRN, Dimensions, View } from "react-native";
import { useEffect, useState } from "react";
import { Loading } from "../../../components/Loading";
import { MangaImage } from "../../../components/MangaImage";
import { StackRoutes } from '../../../types/navigation';

const { width } = Dimensions.get('window');

export function MangaChapter({ route, navigation }: StackRoutes<'MangaChapter'>) {
  const [imageSizes, setImageSizes] = useState<{ width: number; height: number }[]>([]);
  const [imageLoadingStatus, setImageLoadingStatus] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(true);
  const { imagesUrls, chapterName } = route.params

  useEffect(() => {
    navigation.setOptions({ title: chapterName });
    getChapters();
  }, []);

  const getChapters = async () => {
    setLoading(true);

    const sizes: { width: number; height: number }[] = [];
    const loadingStatus = new Array(imagesUrls.length).fill(true);
    setImageLoadingStatus(loadingStatus);

    let promises = imagesUrls.map((imageUri: string, index: number) => {
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

  const handleImageLoad = (index: number) => {
    setImageLoadingStatus(prevStatus => {
      const newStatus = [...prevStatus];
      newStatus[index] = false; // Atualiza o status de carregamento da imagem
      return newStatus;
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <FlatList
      data={imagesUrls}
      keyExtractor={(item, index) => String(index)}
      initialNumToRender={2} // Renderiza 2 imagens inicialmente
      maxToRenderPerBatch={3} // Renderiza 3 imagens por vez ao rolar
      removeClippedSubviews={true}
      renderItem={({ item, index }) => {
        const imgWidth = imageSizes[index]?.width || width;
        const imgHeight = imageSizes[index]?.height || 1;
        const aspectRatio = imgWidth / imgHeight;

        return (
          <View key={index} style={{ width: '100%', aspectRatio }}>
            {imageLoadingStatus[index] && (
              <Loading />
            )}
            <MangaImage
              uri={item}
              aspectRatio={aspectRatio}
              onLoad={() => handleImageLoad(index)} // Atualiza o status quando a imagem for carregada
            />
          </View>
        );
      }}
    />
  );
}
