import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { MangaApi } from '../../../services/api'; // Importe sua classe MangaApi

import MangaItem from '../../../components/MangaItem'; // Importe o componente MangaItem
import { Manga } from '../../../models/Manga';


export default function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [mangaList, setMangaList] = useState<Manga[]>([]);
  const mangaApi = new MangaApi();

  const handleSearchSubmit = async () => {
    try {
      // Faz a requisição de busca na API
      const response = await mangaApi.searchManga(searchTerm);

      // Mapeia a resposta da API para extrair o título
      const mangasList = response.map((manga: { title: string, imageUrl: string | null }) => ({
        title: manga.title,
        image: manga.imageUrl
      }));

      // Atualiza o estado com a lista de mangás
      setMangaList(mangasList);
      console.log(mangasList);
    } catch (error) {
      console.error('Erro ao buscar mangás:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Buscar mangá..."
        cursorColor={'gray'}
        value={searchTerm}
        onChangeText={setSearchTerm} // Atualiza o valor do termo de busca
        onSubmitEditing={handleSearchSubmit} // Executa a busca ao pressionar Enter
      />
      <Button title="Buscar" onPress={handleSearchSubmit} />

      {/* Exibe a lista de mangás encontrados */}
      <FlatList
        data={mangaList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <MangaItem manga={item} />} // Renderiza cada item da lista
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    borderColor: 'gray',
  },
});
