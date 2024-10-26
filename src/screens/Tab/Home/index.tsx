import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Linking } from 'react-native';
import { Image } from 'expo-image';
import { MangaApi } from '../../../services/api';
import { styles } from './styles';
import HomeItem from '../../../components/HomeItem';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Loading } from '../../../components/Loading';
import { DiscordBanner } from '../../../components/DiscordBanner';


export default function Home() {
  const mangaApi = new MangaApi();
  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(false)
  const navigation = useNavigation()

  const fetchMostPopularMangas = async () => {
    try {
      setLoading(true)
      const response = await mangaApi.getMostPopulars();
      setMangas(response);
    } catch (error) {
      console.error("Erro ao buscar mangás mais populares:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMostPopularMangas();
  }, []);

  const onBannerPress = async () => {
    const url = 'https://discord.gg/mVjk3KsrsR'; // Substitua pela URL que deseja abrir

    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    }
  };

  const handleOnMangaPress = (mangaName: string) => {
    navigation.navigate('MangaDetail', { mangaName, initialRoute: 'Search' });
  };
  if (loading) {
    return <Loading />
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={mangas}
        keyExtractor={(item) => item.title}
        ListHeaderComponent={
          <View>
            <DiscordBanner onPress={onBannerPress} />
            <View style={styles.listHeaderTopContainer}>
              <Text style={styles.listHeaderTopTitle}>
                Top 10{"\n"}Mais Populares</Text>
            </View>
          </View>
        }
        renderItem={({ item }: { item: { imageUrl: string; title: string; chapters: [{ title: string; }] } }) => {
          return (
            <HomeItem
              lastChapter={item.chapters[0].title}
              imageUrl={item.imageUrl}
              title={item.title}
              onPress={() => { handleOnMangaPress(item.title) }}
            />
          )
        }}
      />
    </SafeAreaView>
  );
}
