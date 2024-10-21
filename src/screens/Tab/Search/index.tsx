import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList } from 'react-native';
import { MangaApi } from '../../../services/api';
import MangaItem from '../../../components/MangaItem';
import { MangaResponseProps } from '../../../models/Manga';
import { styles } from './styles';
import theme from '../../../theme';
import { useNavigation } from '@react-navigation/native';

//CRIAR LOADING E APLICAR
export default function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [mangaList, setMangaList] = useState<MangaResponseProps[]>([]);
  const [downloadedMangas, setDownloadedMangas] = useState<string[]>([]); // Lista de mangás baixados
  const mangaApi = new MangaApi();
  const navigation = useNavigation();

  useEffect(() => {
    loadDownloadedMangas();
  });

  const loadDownloadedMangas = async () => {
    const downloaded = await mangaApi.getAllDownloadedMangas();
    setDownloadedMangas(downloaded);
  };
  const handleSearchSubmit = async () => {
    try {
      // Faz a requisição de busca na API
      const response = await mangaApi.searchManga(searchTerm);
      const mangasList = response.map((manga: { title: string, imageUrl: string | null }) => ({
        title: manga.title,
        image: manga.imageUrl
      }));

      // Atualiza o estado com a lista de mangás
      setMangaList(mangasList);
    } catch (error) {
      console.error('Erro ao buscar mangás:', error);
    }
  };

  const handleOnMangaPress = (mangaName: string) => {
    navigation.navigate('MangaDetail', { mangaName, initialRoute: 'Search' });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Buscar mangá..."
        cursorColor={theme.colors.white}
        placeholderTextColor={theme.colors.white}
        selectionColor={theme.colors.white}
        value={searchTerm}
        onChangeText={setSearchTerm}
        onSubmitEditing={handleSearchSubmit}
      />

      <FlatList
        data={mangaList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <MangaItem
            manga={item}
            downloaded={downloadedMangas.includes(item.title)} // Verifica se o mangá está baixado
            onPress={handleOnMangaPress}
          />
        )}
      />
    </View>
  );
}
