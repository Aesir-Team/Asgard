import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, Alert, Text } from 'react-native';
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
import { ChapterHeader } from '../../../components/ChapterHeader'; // Novo componente

const mangaApi = new MangaApi();

export function MangaDetail({ route, navigation }: StackRoutes<'MangaDetail'>) {
  const { mangaName, initialRoute } = route.params;
  const [mangaDetail, setMangaDetail] = useState<MangaResponseProps | null>(null);
  const [downloadedChapters, setDownloadedChapters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingChapters, setLoadingChapters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);

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
  }, [initialRoute, navigation]);

  useEffect(() => {
    fetchMangaDetail();
  }, [mangaName]);

  const fetchMangaDetail = async () => {
    setLoading(true);
    try {
      const [response, downloaded] = await Promise.all([
        mangaApi.getManga(normalizeTitle(mangaName)),
        mangaApi.getDownloadedChapters(mangaName),
      ]);
      setDownloadedChapters(downloaded || []);
      setMangaDetail(response[0]);
    } catch {
      setError('Não foi possível carregar os detalhes do manga.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
    } else if (mangaDetail?.chapters) {
      const filteredChapters = mangaDetail.chapters
        .map(chapter => chapter.title)
        .filter(title => title.toLowerCase().includes(searchQuery.toLowerCase()));
      setSearchResults(filteredChapters);
    }
  }, [searchQuery, mangaDetail]);

  const handleChapterPress = useCallback(async (chapterName: string) => {
    const chapter = normalizeTitle(chapterName);
    setLoading(true);
    try {
      let imagesUrls;
      const mangaTitle = normalizeTitle(mangaDetail?.title || '');
      imagesUrls = await mangaApi.getImages(mangaTitle, chapter);

      if (imagesUrls?.length) {
        navigation.navigate('MangaChapter', {
          imagesUrls,
          chapterName,
          initialRoute,
          mangaName,
          chaptersList: mangaDetail?.chapters?.map(chapter => chapter.title) || [],
        });
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }, [initialRoute, mangaDetail, mangaName, navigation]);

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
      } finally {
        setLoadingChapters(prev => prev.filter(chapter => chapter !== chapterName));
      }
    });

    await Promise.all(downloadPromises);
    Alert.alert('Sucesso', 'Todas as imagens de todos os capítulos foram baixadas!');
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
      data={searchResults.length > 0 ? searchResults : mangaDetail?.chapters?.map(chapter => chapter.title)}
      style={styles.container}
      ListHeaderComponent={
        <ChapterHeader
          mangaDetail={mangaDetail}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleSearch}
        />
      }
      keyExtractor={(item) => normalizeTitle(item)}
      removeClippedSubviews={true}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={5}
      renderItem={({ item }) => (
        <ChapterItem
          chapterName={item}
          onPress={() => handleChapterPress(item)}
          downloaded={downloadedChapters.includes(item)}
          loading={loadingChapters.includes(normalizeTitle(item))}
        />
      )}
      ListFooterComponent={<View style={{ height: 100 }} />}
    />
  );
}

export default MangaDetail;
