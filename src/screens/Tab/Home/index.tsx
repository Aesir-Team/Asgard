import React from 'react';
import {StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Image } from 'expo-image'

export default function Home() {
  return (
    <SafeAreaView>
      <ScrollView>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
  },
});
