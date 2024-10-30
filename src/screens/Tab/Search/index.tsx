import React, { useEffect, useState } from 'react';
import { TextInput, FlatList } from 'react-native';
import { MangaApi } from '../../../services/api';
import MangaItem from '../../../components/MangaItem';
import { MangaResponseProps } from '../../../models/Manga';
import { styles } from './styles';
import theme from '../../../theme';
import { useNavigation } from '@react-navigation/native';
import { Loading } from '../../../components/Loading';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [mangaList, setMangaList] = useState<MangaResponseProps[]>([]);
  const [downloadedMangas, setDownloadedMangas] = useState<string[]>([]);
  const [loading, setLoading] = useState(false)
  const mangaApi = new MangaApi();
  const navigation = useNavigation();

  useEffect(() => {
    loadDownloadedMangas();
  }, []);

  const loadDownloadedMangas = async () => {
    const downloaded = await mangaApi.getAllDownloadedMangas();
    setDownloadedMangas(downloaded);
  };

  const handleSearchSubmit = async (term: string) => {

    try {
      const response = await mangaApi.searchManga(term);
      // Mapeia apenas os títulos dos mangás
      const mangasList = response.map((manga: { title: string; imageUrl?: string; }) => ({
        title: manga.title,
        imageUrl: manga.imageUrl,
      }));

      setMangaList(mangasList);
      setLoading(false)
    } catch {
    }
  };

  const handleOnMangaPress = (mangaName: string) => {
    navigation.navigate('MangaDetail', { mangaName, initialRoute: 'Search' });
  };

  const handleSearchSubmitEditing = () => {

    handleSearchSubmit(searchTerm);
    setLoading(true)
  };

  return (
    <SafeAreaView style={styles.container}>
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
      {
        loading ? <Loading /> :
          <FlatList
            data={mangaList}
            keyExtractor={(item) => item.title} // Usa o título como chave
            renderItem={({ item }) => {
              return (
                <MangaItem
                  manga={item}
                  downloaded={downloadedMangas.includes(item.title)}
                  onPress={handleOnMangaPress}
                />
              )
            }}
            removeClippedSubviews
          />
      }
    </SafeAreaView>
  );
}
