import React, { useCallback, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import MangaItem from '../../../components/MangaItem';
import { MangaApi } from '../../../services/api';
import theme from '../../../theme';

export default function Download() {
  const [directories, setDirectories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const mangaApi = new MangaApi();

  useFocusEffect(
    useCallback(() => {
      fetchDirectories();
    }, []) // Chama ao focar na tela
  );

  const fetchDirectories = async () => {
    try {
      setLoading(true);
      const downloadedMangas = await mangaApi.getAllDownloadedMangas();
      setDirectories(downloadedMangas);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleOnMangaItemPress = (mangaName: string) => {
    navigation.navigate('MangaDetail', { mangaName, initialRoute: 'Download' });
  };

  return (
    <View style={styles.container}>
      {directories.length === 0 ? (
        <View style={styles.noDownloadedContainer}>
          <Text style={styles.noDownloadedTitle}>Nenhum Mangá Baixado!</Text>
        </View>
      ) : (
        <FlatList
          data={directories}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item: mangaName }) => (
            <MangaItem manga={{ title: mangaName }} onPress={() => handleOnMangaItemPress(mangaName)} />
          )}
        />
      )}
    </View>
  );
}
