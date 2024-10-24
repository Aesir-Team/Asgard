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

const mangaApi = new MangaApi();

export function MangaDetail({ route, navigation }: StackRoutes<'MangaDetail'>) {
  const { mangaName, initialRoute } = route.params;
  const [mangaDetail, setMangaDetail] = useState<MangaResponseProps | null>(null);
  const [downloadedChapters, setDownloadedChapters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingChapters, setLoadingChapters] = useState<string[]>([]);

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
    setLoading(true);
    try {
      if (initialRoute === 'Search') {
        const [response, downloaded] = await Promise.all([
          mangaApi.getManga(normalizeTitle(mangaName)),
          mangaApi.getDownloadedChapters(mangaName)
        ]);
        if (downloaded) {
          setDownloadedChapters(downloaded || []);
        }
        setMangaDetail(response[0]);
      } else {
        const chapters = await mangaApi.getDownloadedChapters(mangaName);
        setMangaDetail({
          title: mangaName,
          chapters: (chapters || []).map(chapter => ({ title: chapter }))
        });
      }
    } catch (error) {
      setError('Não foi possível carregar os detalhes do manga.');
    } finally {
      setLoading(false);
    }
  };

  const handleChapterPress = async (chapterName: string) => {
    setLoading(true);
    try {
      const chapter = normalizeTitle(chapterName);
      let imagesUrls;

      // Verifica se o capítulo já foi baixado
      if (downloadedChapters.includes(chapterName)) {
        const baseDirectoryUri = `${FileSystem.documentDirectory}media/${mangaName}/${chapterName}`;
        const items = await FileSystem.readDirectoryAsync(baseDirectoryUri);
        const sortedImages = items
          .filter(item => item !== '.DS_Store')
          .sort((a, b) => parseInt(a.match(/\d+/)?.[0] || '0') - parseInt(b.match(/\d+/)?.[0] || '0'));
        imagesUrls = sortedImages.map(imageName => `${baseDirectoryUri}/${imageName}`);

        // Navega para MangaChapter com a rota "Download"
        navigation.navigate('MangaChapter', {
          imagesUrls,
          chapterName,
          initialRoute: 'Download', // Define a rota como Download
          mangaName,
          chaptersList: mangaDetail?.chapters?.map(chapter => chapter.title) || []
        });
      } else {
        // Se não estiver baixado, use o método normal
        const mangaTitle = normalizeTitle(mangaDetail?.title || '');
        imagesUrls = await mangaApi.getImages(mangaTitle, chapter);

        if (imagesUrls?.length) {
          navigation.navigate('MangaChapter', {
            imagesUrls,
            chapterName,
            initialRoute, // Rota original
            mangaName,
            chaptersList: mangaDetail?.chapters?.map(chapter => chapter.title) || []
          });
        } else {
          console.error('Nenhuma imagem encontrada para este capítulo.');
        }
      }
    } catch (error) {
      console.error('Erro ao carregar o capítulo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOnDownloadPress = async () => {
    if (!mangaDetail || !mangaDetail.chapters) return;

    const mangaTitle = normalizeTitle(mangaDetail.title);
    const allChapterNames = mangaDetail.chapters.map(chapter => normalizeTitle(chapter.title));
    setLoadingChapters(allChapterNames);

    const downloadPromises = mangaDetail.chapters.map(async (chapter) => {
      const chapterName = normalizeTitle(chapter.title);
      try {
        const imageUrls = await mangaApi.getImages(mangaTitle, chapterName);
        const folderUri = `${FileSystem.documentDirectory}media/${mangaDetail.title}/${chapter.title}/`;
        const dirInfo = await FileSystem.getInfoAsync(folderUri);

        if (!dirInfo.exists) {
          await FileSystem.makeDirectoryAsync(folderUri, { intermediates: true });
        }

        await Promise.all(imageUrls.map((imageUri: string, i: number) => {
          const fileUri = `${folderUri}image-${i + 1}.jpg`;
          const downloadResumable = FileSystem.createDownloadResumable(imageUri, fileUri);
          return downloadResumable.downloadAsync();
        }));

        setDownloadedChapters(prev => [...prev, chapter.title]);
      } catch (error) {
        console.error(`Erro ao obter as imagens do capítulo ${chapterName}:`, error);
      } finally {
        setLoadingChapters(prev => prev.filter(chapter => chapter !== chapterName));
      }
    });

    await Promise.all(downloadPromises);
    alert('Todas as imagens de todos os capítulos foram baixadas!');
  };

  if (loading) return <Loading />;

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
      keyExtractor={(item) => normalizeTitle(item.title)}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={5}
      renderItem={({ item }) => (
        <ChapterItem
          chapterName={item.title}
          onPress={() => handleChapterPress(item.title)}
          downloaded={downloadedChapters.includes(item.title)}
          loading={loadingChapters.includes(normalizeTitle(item.title))}
        />
      )}
    />
  );
}

export default MangaDetail;
