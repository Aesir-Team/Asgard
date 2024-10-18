// MangaItem.tsx
import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { Manga } from '../../models/Manga';
import { useNavigation } from '@react-navigation/native';

interface MangaItemProps {
  manga: Manga;
}
export function MangaItem({ manga }: MangaItemProps) {
  const navigation = useNavigation();

  const handleOnPress = () => {
    navigation.navigate('MangaDetail', { manga });
  }

  return (
    <TouchableOpacity style={styles.mangaItem} onPress={handleOnPress}>
      {manga.image ? <Image source={{ uri: manga.image }} style={styles.mangaImage} /> : null}
      <Text style={styles.mangaTitle}>{manga.title}</Text>
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
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

export default MangaItem;
