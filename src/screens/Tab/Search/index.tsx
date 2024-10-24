import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList } from 'react-native';
import { MangaApi } from '../../../services/api';
import MangaItem from '../../../components/MangaItem';
import { MangaResponseProps } from '../../../models/Manga';
import { styles } from './styles';
import theme from '../../../theme';
import { useNavigation } from '@react-navigation/native';
import { useDebounce } from '../../../hooks/useDebounce';

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [mangaList, setMangaList] = useState<MangaResponseProps[]>([]);
  const [downloadedMangas, setDownloadedMangas] = useState<string[]>([]);
  const mangaApi = new MangaApi();
  const navigation = useNavigation();

  useEffect(() => {
    loadDownloadedMangas();
  }); // Chama apenas uma vez ao montar

  const loadDownloadedMangas = async () => {
    const downloaded = await mangaApi.getAllDownloadedMangas();
    setDownloadedMangas(downloaded);
  };

  const handleSearchSubmit = async (term: string) => {
    try {
      const response = await mangaApi.searchManga(term);
      const mangasList = response.map((manga: { title: string, imageUrl: string | null }) => ({
        title: manga.title,
        image: manga.imageUrl
      }));

      setMangaList(mangasList);
    } catch (error) {
      console.error('Erro ao buscar mangás:', error);
    }
  };

  const handleOnMangaPress = (mangaName: string) => {
    navigation.navigate('MangaDetail', { mangaName, initialRoute: 'Search' });
  };

  const handleSearchSubmitEditing = () => {
    if (searchTerm.trim()) {
      handleSearchSubmit(searchTerm.trim());
    }
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
        onSubmitEditing={handleSearchSubmitEditing} // Adiciona o manipulador
        returnKeyType="search" // Define o tipo de tecla de retorno
      />

      <FlatList
        data={mangaList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <MangaItem
            manga={item}
            downloaded={downloadedMangas.includes(item.title)}
            onPress={handleOnMangaPress}
          />
        )}
      />
    </View>
  );
}
