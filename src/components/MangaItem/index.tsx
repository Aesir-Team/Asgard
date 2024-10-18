// MangaItem.tsx
import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { MangaSearchResponse } from '../../models/Manga';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';

interface MangaItemProps {
  manga: MangaSearchResponse;
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


export default MangaItem;
