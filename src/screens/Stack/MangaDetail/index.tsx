import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { MangaResponseProps } from '../../../models/Manga';
import { Image } from 'expo-image';
import { MangaApi } from '../../../services/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChapterItem } from '../../../components/ChapterItem';
import { styles } from './styles';
import { Loading } from '../../../components/Loading';
import { normalizeTitle } from '../../../utils';
import { StackRoutes } from '../../../types/navigation';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { DownloadSimple } from 'phosphor-react-native';
import theme from '../../../theme';
import * as FileSystem from 'expo-file-system';

export function MangaDetail({ route, navigation }: StackRoutes<'MangaDetail'>) {
  const { mangaName, initialRoute } = route.params;
  const [mangaDetail, setMangaDetail] = useState<MangaResponseProps | null>(null);
  const [downloadedChapters, setDownloadedChapters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingChapters, setLoadingChapters] = useState<string[]>([]);

  const mangaApi = new MangaApi();

  useEffect(() => {
    if (initialRoute === 'Search') {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity style={{ paddingRight: 20 }} onPress={handleOnDownloadPress}>
            <DownloadSimple size={30} weight="bold" color={theme.colors.white} />
          </TouchableOpacity>
        ),
      });
    }
  });

  useEffect(() => {
    fetchMangaDetail();
  }, []);

  const fetchMangaDetail = async () => {
    try {
      if (initialRoute === 'Search') {
        const response = await mangaApi.getManga(normalizeTitle(mangaName));
        setMangaDetail(response[0]);
        console.log(mangaDetail)
        const downloaded = await mangaApi.getDownloadedChapters(mangaName);
        if (downloaded) {
          setDownloadedChapters(downloaded);
        }
      } else {
        const baseDirectoryUri = `${FileSystem.documentDirectory}media/${mangaName}/`;
        const items = await FileSystem.readDirectoryAsync(baseDirectoryUri);
        const dirList = items.filter(item => item !== '.DS_Store');
        const chapters = dirList.map(chapter => ({ title: chapter }));
        setMangaDetail({ title: mangaName, chapters });
      }
    } catch (error) {
      setError('Não foi possível carregar os detalhes do manga.');
    } finally {
      setLoading(false);
    }
  };

  const handleChapterPress = async (chapterName: string) => {
    if (initialRoute === 'Search') {
      try {
        if (!mangaDetail?.chapters) return;

        const mangaTitle = normalizeTitle(mangaDetail.title);
        const chapter = normalizeTitle(chapterName);

        setLoading(true);
        const imagesUrls = await mangaApi.getImages(mangaTitle, chapter);

        if (imagesUrls?.length) {
          setLoading(false);
          navigation.navigate('MangaChapter', { imagesUrls, chapterName });
        } else {
          setLoading(false);
          console.error('Nenhuma imagem encontrada para este capítulo.');
        }
      } catch (error) {
        console.error('Erro ao carregar imagens do capítulo:', error);
        setLoading(false);
      }
    } else {
      const baseDirectoryUri = `${FileSystem.documentDirectory}media/${mangaName}/${chapterName}`;
      const items = await FileSystem.readDirectoryAsync(baseDirectoryUri);
      const dirList = items.filter(item => item !== '.DS_Store');
      const sortedImages = dirList.sort((a, b) => {
        const matchA = a.match(/\d+/);
        const matchB = b.match(/\d+/);
        const numA = matchA ? parseInt(matchA[0]) : 0;
        const numB = matchB ? parseInt(matchB[0]) : 0;
        return numA - numB;
      });
      const imagesUrls = sortedImages.map(imageName => `${baseDirectoryUri}/${imageName}`);

      navigation.navigate('MangaChapter', { imagesUrls, chapterName });
    }
  };

  const handleOnDownloadPress = async () => {
    if (!mangaDetail || !mangaDetail.chapters) return;

    const mangaTitle = normalizeTitle(mangaDetail.title);
    // Set all chapters to loading
    const allChapterNames = mangaDetail.chapters.map(chapter => normalizeTitle(chapter.title));
    setLoadingChapters(allChapterNames); // Mark all chapters as loading

    for (const chapter of mangaDetail.chapters) {
      const chapterName = normalizeTitle(chapter.title);
      //console.log(`Processando o capítulo: ${chapterName}`);

      try {
        const imageUrls = await mangaApi.getImages(mangaTitle, chapterName);
        //console.log(`Imagens para baixar do capítulo ${chapterName}:`, imageUrls);

        const folderUri = `${FileSystem.documentDirectory}media/${mangaDetail.title}/${chapter.title}/`;
        const dirInfo = await FileSystem.getInfoAsync(folderUri);
        if (!dirInfo.exists) {
          //console.log("Criando diretório:", folderUri);
          await FileSystem.makeDirectoryAsync(folderUri, { intermediates: true });
        }

        const downloadPromises = imageUrls.map((imageUri: string, i: number) => {
          const fileUri = `${folderUri}image-${i + 1}.jpg`;
          //console.log(`Baixando a imagem: ${imageUri} para ${fileUri}`);
          const downloadResumable = FileSystem.createDownloadResumable(imageUri, fileUri);
          return downloadResumable.downloadAsync()
            .then(downloadResult => {
              if (downloadResult && downloadResult.uri) {
                //console.log(`Imagem ${i + 1} do capítulo ${chapterName} salva em: ${downloadResult.uri}`);
              }
            })
            .catch(error => {
              console.error(`Erro ao baixar a imagem ${i + 1} do capítulo ${chapterName}:`, error);
            });
        });

        await Promise.all(downloadPromises);
        setDownloadedChapters(prev => [...prev, chapter.title]);
      } catch (error) {
        console.error(`Erro ao obter as imagens do capítulo ${chapterName}:`, error);
      } finally {
        // Remove chapter from loading state after it's downloaded
        setLoadingChapters(prev => prev.filter(chapter => chapter !== chapterName));
      }
    }
    alert('Todas as imagens de todos os capítulos foram baixadas!');
  };


  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={mangaDetail?.chapters}
      style={styles.container}
      ListHeaderComponent={
        <SafeAreaView style={styles.headerContainer}>
          {mangaDetail?.imageUrl && (
            <Image
              source={{ uri: mangaDetail.imageUrl }}
              style={styles.headerBanner}
              contentFit="contain"
            />
          )}
          <Text style={styles.headerTitle}>{mangaDetail?.title}</Text>
          {mangaDetail?.description && (
            <View style={styles.headerSinopseView}>
              <Text style={styles.headerSinopse}>Sinopse</Text>
              <Text style={styles.headerDescription}>{mangaDetail?.description}</Text>
            </View>
          )}
        </SafeAreaView>
      }
      keyExtractor={(item, index) => index.toString()}
      removeClippedSubviews={true}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      renderItem={({ item }) => {
        console.log(loadingChapters, item.title)
        return (
          <ChapterItem
            chapterName={item.title}
            onPress={() => handleChapterPress(item.title)}
            downloaded={downloadedChapters.includes(item.title)} // Verifica se o capítulo foi baixado
            loading={loadingChapters.includes(normalizeTitle(item.title))} // Verifica se o capítulo está em download
          />
        )
      }
      }
    />
  );
}

export default MangaDetail;
