import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import MangaItem from '../../../components/MangaItem';
import { MangaApi } from '../../../services/api';

export default function Download() {
  const [directories, setDirectories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation()
  const mangaApi = new MangaApi();

  useFocusEffect(
    useCallback(() => {
      fetchDirectories()
    }, []) // O array vazio indica que o efeito será executado ao cada vez que a tela for focada
  );

  const fetchDirectories = async () => {
    try {
      setLoading(true);
      const downloadedMangas = await mangaApi.getAllDownloadedMangas();
      setDirectories(downloadedMangas);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao listar diretórios:', error);
    }
  };

  const handleOnMangaItemPress = (mangaName: string) => {
    navigation.navigate('MangaDetail', { mangaName, initialRoute: 'Download' })
  }

  return (
    <View style={styles.container}>
      {directories.length === 0 ? (
        <View>
          <Text>Nenhum diretório encontrado.</Text>
        </View>
      ) : (
        <FlatList
          data={directories}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item: mangaName }) => (
            <MangaItem manga={{ title: mangaName }} onPress={() => {
              handleOnMangaItemPress(mangaName)
            }} />
          )}
        />
      )}
    </View>
  );
};

