import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { styles } from './styles';
import theme from '../../theme';


interface HomeItemProps {
  title: string;
  imageUrl: string;
  lastChapter?: string;
  onPress: () => void;
}

export function HomeItem({ title, imageUrl, onPress, lastChapter }: HomeItemProps) {
  console.log(imageUrl)
  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity style={styles.touchable} onPress={onPress} activeOpacity={0.7}>
        <Image source={{ uri: imageUrl }} style={styles.image} contentFit='contain' />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {lastChapter ? <Text style={styles.lastChapter}>{lastChapter}</Text> : null}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default HomeItem;
