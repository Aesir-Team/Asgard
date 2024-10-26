import React, { useCallback, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import MangaItem from '../../../components/MangaItem';
import { MangaApi } from '../../../services/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Loading } from '../../../components/Loading';


export default function Download() {
  const [directories, setDirectories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const mangaApi = new MangaApi();

  useFocusEffect(
    useCallback(() => {
      fetchDirectories();
    }, [])
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

  if (loading) {
    return <Loading />
  }

  // ADICIONAR UM TEXT COM O NOME MANGÁS BAIXADOS
  return (
    <SafeAreaView style={styles.container}>
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
          ListHeaderComponent={() => {
            return (
              <View style={styles.listHeaderTopContainer}>
                <Text style={styles.listHeaderTopTitle}>
                  Baixados</Text>
              </View>
            )
          }
          }
        />
      )}
    </SafeAreaView>
  );
}
