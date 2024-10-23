import React from 'react';
import { StyleSheet, SafeAreaView, ScrollView, View, Text } from 'react-native';
import { Image } from 'expo-image'

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Em desenvolvimento!</Text>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2f1464',
  },
  text: {
    fontSize: 24,
    color: '#fff',
  },
});
