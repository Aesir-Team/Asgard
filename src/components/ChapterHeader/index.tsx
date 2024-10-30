import React from 'react';
import { View, TextInput, Text } from 'react-native';
import { Image } from 'expo-image';
import { styles } from './styles'; // Supondo que você tenha um arquivo de estilos
import theme from '../../theme';
import { SafeAreaView } from 'react-native-safe-area-context';

type ChapterHeaderProps = {
  mangaDetail: any; // Substitua por seu tipo apropriado
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: () => void;
};

export const ChapterHeader: React.FC<ChapterHeaderProps> = ({ mangaDetail, searchQuery, setSearchQuery, onSearch }) => {
  return (
    <SafeAreaView style={styles.headerContainer}>
      {mangaDetail?.imageUrl && (
        <Image
          source={{ uri: mangaDetail.imageUrl }}
          style={styles.headerBanner}
          contentFit="contain"
        />
      )}
      <Text style={styles.headerTitle}>{mangaDetail?.title}</Text>
      {mangaDetail?.description && (
        <View style={styles.headerSinopseView}>
          <Text style={styles.headerSinopse}>Sinopse</Text>
          <Text style={styles.headerDescription}>{mangaDetail?.description}</Text>
        </View>
      )}
      <TextInput
        style={styles.input}
        placeholder="Procure o Capítulo. Ex: 10"
        cursorColor={theme.colors.white}
        placeholderTextColor={theme.colors.white}
        selectionColor={theme.colors.white}
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={onSearch}
      />
    </SafeAreaView>
  );
};
