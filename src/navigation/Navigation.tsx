import React from 'react';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import Wallets from '../screens/Wallets';
import Token from '../screens/TokenItem';
import Profile from '../screens/Profile';
import SwapScreen from '../screens/SwapScreen';
const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, // This provides a slide from right animation
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="Wallets"
        component={Wallets}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: 'black'},
          headerTintColor: '#fff',
          headerTitleStyle: {fontFamily: 'Poppins'},
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="WalletDetails"
        component={Token}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: 'black'},
          headerTintColor: '#fff',
          headerTitleStyle: {fontFamily: 'Poppins'},
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: 'black'},
          headerTintColor: '#fff',
          headerTitleStyle: {fontFamily: 'Poppins'},
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="Swap"
        component={SwapScreen}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: 'black'},
          headerTintColor: '#fff',
          headerTitleStyle: {fontFamily: 'Poppins'},
          headerTitleAlign: 'center',
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
