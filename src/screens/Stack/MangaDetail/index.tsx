
import React from 'react';
import { View, Text } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Manga } from '../../../models/Manga';

type RouteParams = {
  manga: Manga;
}

export function MangaDetail() {
  const route = useRoute();
  const { manga } = route.params as RouteParams;

  return (
    <View>
      <Text>{manga.title}</Text>
    </View>

  );

};



export default MangaDetail;
