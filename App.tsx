import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './src/navigation/Navigation';
import { Provider } from 'react-redux'; // import Provider
import store from './src/redux/store'; // import your Redux store
import SplashScreen from 'react-native-splash-screen';
import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid} from 'react-native';

export default function App() {

  async function requestUserPermission() {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    } catch (error) {
      console.error('Failed to request user permission:', error);
    }
  }

  const getToken = async () => {
    try {
      const token = await messaging().getToken();
    } catch (error) {
      console.error('Failed to get FCM token:', error);
    }
  }

  useEffect(() => {
    requestUserPermission();
    getToken();
  }, []);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({});
