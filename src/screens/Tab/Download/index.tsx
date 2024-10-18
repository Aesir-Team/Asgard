import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme from '../../../theme';

export default function Download() {
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
    backgroundColor: theme.colors.background,
  },
  text: {
    fontSize: 24,
    color: '#fff',
  },
});
