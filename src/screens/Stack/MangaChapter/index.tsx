import { FlatList, Image as ImageRN, Dimensions, View, TouchableOpacity, Text, Alert } from "react-native";
import { useEffect, useState } from "react";
import { Loading } from "../../../components/Loading";
import { MangaImage } from "../../../components/MangaImage";
import { StackRoutes } from '../../../types/navigation';
import theme from "../../../theme";
import { MangaApi } from "../../../services/api";

const { width } = Dimensions.get('window');

export function MangaChapter({ route, navigation }: StackRoutes<'MangaChapter'>) {
  const [imageSizes, setImageSizes] = useState<{ width: number; height: number }[]>([]);
  const [imageLoadingStatus, setImageLoadingStatus] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(true);
  const { imagesUrls, chapterName, initialRoute, mangaName, chaptersList } = route.params;
  const [hasNext, setHasNext] = useState<boolean>(true);
  const [hasBack, setHasBack] = useState<boolean>(true);
  const mangaApi = new MangaApi();

  useEffect(() => {
    onPageLoad();
    getImages();
    navigation.setOptions({ title: chapterName });
  }, []);

  const handleNextPress = async () => {
    setLoading(true);
    try {
      const indexOfActualChapter = chaptersList.indexOf(chapterName);
      if (indexOfActualChapter > 0) {
        const nextChapter = chaptersList[indexOfActualChapter - 1];
        const response = await mangaApi.getDownloadedImages(mangaName, nextChapter);
        navigation.replace('MangaChapter', {
          imagesUrls: response,
          chapterName: nextChapter,
          initialRoute: initialRoute,
          mangaName: mangaName,
          chaptersList
        });
      } else {
        Alert.alert("Aviso", "Você já está no primeiro capítulo.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível carregar o próximo capítulo.");
    } finally {
      setLoading(false);
    }
  };

  const getImages = async () => {
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

  const onPageLoad = async () => {
    const indexOfActualChapter = chaptersList.indexOf(chapterName);
    setHasBack(indexOfActualChapter < chaptersList.length - 1);
    setHasNext(indexOfActualChapter > 0);
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
      windowSize={5}
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
      ListFooterComponent={() => {
        return (
          <View style={{ flex: 1, width: "100%", height: 80, backgroundColor: theme.colors.white, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10, flexDirection: 'row', gap: 10, borderTopWidth: 2 }} >
            {hasBack ?
              <TouchableOpacity onPress={handleNextPress} style={{ flex: 1, height: 60, backgroundColor: theme.colors.purpleDark, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ textAlign: 'center', color: theme.colors.white, fontSize: theme.font_size.large }}>Anterior</Text>
              </TouchableOpacity> : null}
            {hasNext ?
              <TouchableOpacity onPress={handleNextPress} style={{ flex: 1, height: 60, backgroundColor: theme.colors.purpleDark, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ textAlign: 'center', color: theme.colors.white, fontSize: theme.font_size.large }}>Próximo</Text>
              </TouchableOpacity> : null}
          </View>
        );
      }}
    />
  );
}
