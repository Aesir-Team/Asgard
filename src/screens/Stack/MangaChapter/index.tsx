import { FlatList, Image as ImageRN, Dimensions, View, TouchableOpacity, Text, Alert } from "react-native";
import { useEffect, useState } from "react";
import { Loading } from "../../../components/Loading";
import { MangaImage } from "../../../components/MangaImage";
import { StackRoutes } from '../../../types/navigation';
import theme from "../../../theme";
import { MangaApi } from "../../../services/api";
import { normalizeTitle } from "../../../utils";

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
    const initialize = async () => {
      await onPageLoad();
      await getImages();
      navigation.setOptions({ title: chapterName });
    };
    initialize();
  }, []);

  const navigateToChapter = async (chapter: string, isNext: boolean) => {
    setLoading(true);
    try {
      const normalizedMangaName = normalizeTitle(mangaName);
      const normalizedChapterName = normalizeTitle(chapter);
      const response = initialRoute === 'Search'
        ? await mangaApi.getImages(normalizedMangaName, normalizedChapterName)
        : await mangaApi.getDownloadedImages(mangaName, chapter);

      navigation.replace('MangaChapter', {
        imagesUrls: response,
        chapterName: chapter,
        initialRoute,
        mangaName,
        chaptersList
      });
    } catch (error) {
      Alert.alert("Erro", `Não foi possível carregar o capítulo ${isNext ? 'seguinte' : 'anterior'}.`);
    } finally {
      setLoading(false);
    }
  };

  const handleBackPress = async () => {
    setLoading(true);
    try {
      const indexOfActualChapter = chaptersList.indexOf(chapterName);
      let previousChapter;

      if (indexOfActualChapter < chaptersList.length - 1) {
        previousChapter = chaptersList[indexOfActualChapter + 1]; // Próximo na lista invertida
      } else {
        Alert.alert("Aviso", "Você já está no último capítulo.");
        return; // Retorna se não houver capítulo
      }

      if (initialRoute === 'Search') {
        const response = await mangaApi.getImages(normalizeTitle(mangaName), normalizeTitle(previousChapter));
        navigation.replace('MangaChapter', {
          imagesUrls: response,
          chapterName: previousChapter,
          initialRoute,
          mangaName,
          chaptersList
        });
      } else {
        const response = await mangaApi.getDownloadedImages(mangaName, previousChapter);
        navigation.replace('MangaChapter', {
          imagesUrls: response,
          chapterName: previousChapter,
          initialRoute,
          mangaName,
          chaptersList
        });
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar o próximo capítulo.");
    } finally {
      setLoading(false);
    }
  };

  const handleNextPress = async () => {
    setLoading(true);
    try {
      const indexOfActualChapter = chaptersList.indexOf(chapterName);
      if (indexOfActualChapter > 0) {
        const nextChapter = chaptersList[indexOfActualChapter - 1]; // Capítulo anterior na lista, mas "seguinte" na narrativa

        if (initialRoute === 'Search') {
          const response = await mangaApi.getImages(normalizeTitle(mangaName), normalizeTitle(nextChapter));
          navigation.replace('MangaChapter', {
            imagesUrls: response,
            chapterName: nextChapter,
            initialRoute,
            mangaName,
            chaptersList
          });
        } else {
          const response = await mangaApi.getDownloadedImages(mangaName, nextChapter);
          navigation.replace('MangaChapter', {
            imagesUrls: response,
            chapterName: nextChapter,
            initialRoute,
            mangaName,
            chaptersList
          });
        }
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar o capítulo anterior.");
    } finally {
      setLoading(false);
    }
  };

  const getImages = async () => {
    setLoading(true);
    const sizes: { width: number; height: number }[] = [];
    const loadingStatus = new Array(imagesUrls.length).fill(true);
    setImageLoadingStatus(loadingStatus);

    const promises = imagesUrls.map((imageUri: string, index: number) =>
      new Promise((resolve) => {
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
      })
    );

    await Promise.all(promises);
    setImageSizes(sizes);
    setLoading(false);
  };

  const onPageLoad = async () => {
    const indexOfActualChapter = chaptersList.indexOf(chapterName);
    setHasBack(indexOfActualChapter < chaptersList.length - 1); // Se houver próximo capítulo
    setHasNext(indexOfActualChapter > 0); // Se houver capítulo anterior
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
            {imageLoadingStatus[index] && <Loading />}
            <MangaImage
              uri={item}
              aspectRatio={aspectRatio}
              onLoad={() => handleImageLoad(index)} // Atualiza o status quando a imagem for carregada
            />
          </View>
        );
      }}
      ListFooterComponent={() => (
        <View style={{ flex: 1, width: "100%", height: 80, backgroundColor: theme.colors.white, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10, flexDirection: 'row', gap: 10, borderTopWidth: 2 }} >
          {hasBack && (
            <TouchableOpacity onPress={handleBackPress} style={{ flex: 1, height: 60, backgroundColor: theme.colors.purpleDark, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ textAlign: 'center', color: theme.colors.white, fontSize: theme.font_size.large }}>Anterior</Text>
            </TouchableOpacity>
          )}
          {hasNext && (
            <TouchableOpacity onPress={handleNextPress} style={{ flex: 1, height: 60, backgroundColor: theme.colors.purpleDark, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ textAlign: 'center', color: theme.colors.white, fontSize: theme.font_size.large }}>Próximo</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    />
  );
}
