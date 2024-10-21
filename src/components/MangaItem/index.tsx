import React from 'react';
import { TouchableOpacity, Text, Image, View } from 'react-native';
import { SearchResponseProps } from '../../models/Manga';
import { styles } from './styles';
import { Check } from 'phosphor-react-native'; // Ícone de download
import theme from '../../theme';

type MangaItemProps = {
  manga: SearchResponseProps;
  onPress?: (mangaName: string) => void;
  downloaded?: boolean; // Prop para indicar se o mangá está baixado
}

export function MangaItem({ manga, onPress, downloaded }: MangaItemProps) {
  return (
    <TouchableOpacity style={styles.mangaItem} onPress={() => { onPress && onPress(manga.title) }}>
      {manga.image ? <Image source={{ uri: manga.image }} style={styles.mangaImage} /> : null}
      
      <View style={styles.mangaContent}>
        <Text style={styles.mangaTitle}>{manga.title}</Text>
        {downloaded && <Check size={24} color={theme.colors.purpleDark} style={styles.downloadIcon} weight='bold' />}
      </View>
    </TouchableOpacity>
  );
}

export default MangaItem;
