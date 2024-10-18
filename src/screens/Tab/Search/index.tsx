import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MangaApi } from '../../../services/api'; // Importe sua classe MangaApi

interface Manga {
  title: string;
  image: string | null;
}

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

  const renderMangaItem = ({ item }: { item: Manga }) => (
    <TouchableOpacity style={styles.mangaItem}>
      {item.image ? <Image source={{ uri: item.image }} style={styles.mangaImage} /> : null}
      <Text style={styles.mangaTitle} >{item.title}</Text>
    </TouchableOpacity>
  );

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
        renderItem={renderMangaItem} // Renderiza cada item da lista
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
  mangaItem: {
    borderWidth: 1,
    borderColor: 'gray',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 8,
    padding: 10, // Adiciona um pouco de espaçamento ao redor do item
  },
  mangaImage: {

    width: 70,
    height: 90,
    borderRadius: 8,
  },
  mangaTitle: {
    paddingLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'gray',
    flex: 1, // Permite que o título ocupe o espaço restante
  },
});
