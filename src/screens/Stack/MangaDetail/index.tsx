import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { MangaDetailResponse } from '../../../models/Manga';
import { Image } from 'expo-image';
import { MangaApi } from '../../../services/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChapterItem } from '../../../components/ChapterItem';
import { styles } from './styles';
import theme from '../../../theme';
import { Loading } from '../../../components/Loading';
import _ from 'lodash';

type RouteParams = {
  manga: MangaDetailResponse;
}

export function MangaDetail() {
  const [mangaDetail, setMangaDetail] = useState<MangaDetailResponse | null>(null);
  const [loading, setLoading] = useState(true); // Estado para indicar carregamento
  const [error, setError] = useState<string | null>(null); // Estado para capturar erros

  const route = useRoute();
  const { manga } = route.params as RouteParams;
  const mangaApi = new MangaApi();

  function normalizeTitle(title: string): string {
    return _.kebabCase(title); // Converte para kebab case
  }

  useEffect(() => {
    fetchMangaDetail()
  }, []);

  const fetchMangaDetail = async () => {
    try {
      const response = await mangaApi.getManga(normalizeTitle(manga.title));
      setMangaDetail(response[0]);
      console.log(response[0].description);
    } catch (error) {
      setError('Não foi possível carregar os detalhes do manga.');
    } finally {
      setTimeout(
        () => {
          setLoading(false);
        }, 1000
      )
    }
  };
  if (loading) {
    return (<Loading />)
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
          {mangaDetail?.imageUrl &&
            <Image
              source={{ uri: mangaDetail.imageUrl }}
              style={styles.headerBanner}
              contentFit='contain' />}
          <Text style={styles.headerTitle}>{mangaDetail?.title}</Text>
          {mangaDetail?.description &&
            (
              <View style={{ flex: 1, backgroundColor: theme.colors.purpleDark, borderRadius: 20, marginBottom: 20, paddingHorizontal: 20, paddingVertical: 10 }}>
                <Text style={styles.headerSinopse}>Sinopse</Text>
                <Text style={styles.headerDescription}> {mangaDetail?.description}</Text>
              </View>
            )}
        </SafeAreaView>
      }
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) =>
        <ChapterItem
          title={item.title}
          link={item.link}
          releaseDate={item.releaseDate}
        />
      }
    />
  );
}

export default MangaDetail;
