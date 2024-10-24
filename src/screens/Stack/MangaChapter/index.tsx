import { FlatList, Image as ImageRN, Dimensions, View, Alert } from "react-native";
import { useEffect, useState } from "react";
import { Loading } from "../../../components/Loading";
import { MangaImage } from "../../../components/MangaImage";
import { StackRoutes } from '../../../types/navigation';
import theme from "../../../theme";
import { MangaApi } from "../../../services/api";
import { normalizeTitle } from "../../../utils";
import { Button } from "../../../components/Button";

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

  const handleBackPress = async () => {
    setLoading(true);
    try {
      const indexOfActualChapter = chaptersList.indexOf(chapterName);
      if (indexOfActualChapter < chaptersList.length - 1) {
        const previousChapter = chaptersList[indexOfActualChapter + 1];
        const response = initialRoute === 'Search'
          ? await mangaApi.getImages(normalizeTitle(mangaName), normalizeTitle(previousChapter))
          : await mangaApi.getDownloadedImages(mangaName, previousChapter);

        navigation.replace('MangaChapter', {
          imagesUrls: response,
          chapterName: previousChapter,
          initialRoute,
          mangaName,
          chaptersList
        });
      } else {
        Alert.alert("Aviso", "Você já está no último capítulo.");
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
        const nextChapter = chaptersList[indexOfActualChapter - 1];
        const response = initialRoute === 'Search'
          ? await mangaApi.getImages(normalizeTitle(mangaName), normalizeTitle(nextChapter))
          : await mangaApi.getDownloadedImages(mangaName, nextChapter);

        navigation.replace('MangaChapter', {
          imagesUrls: response,
          chapterName: nextChapter,
          initialRoute,
          mangaName,
          chaptersList
        });
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
            resolve(null);
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
    setHasBack(indexOfActualChapter < chaptersList.length - 1);
    setHasNext(indexOfActualChapter > 0);
  };

  const handleImageLoad = (index: number) => {
    setImageLoadingStatus(prevStatus => {
      const newStatus = [...prevStatus];
      newStatus[index] = false;
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
      initialNumToRender={2}
      maxToRenderPerBatch={3}
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
              onLoad={() => handleImageLoad(index)}
            />
          </View>
        );
      }}
      ListFooterComponent={() => (
        <View style={{
          flex: 1, width: "100%", height: 80, backgroundColor: theme.colors.white,
          justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10,
          flexDirection: 'row', gap: 10, borderTopWidth: 2
        }}>
          {hasBack && <Button onPress={handleBackPress} title="Anterior" />}
          {hasNext && <Button onPress={handleNextPress} title="Próximo" />}
        </View>
      )}
    />
  );
}
