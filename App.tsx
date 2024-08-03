import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './src/navigation/Navigation';

export default function App() {

  return (
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
