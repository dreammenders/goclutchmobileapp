import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';

import MainNavigator from './src/navigation/MainNavigator';
import { CartProvider } from './src/context/CartContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <CartProvider>
        <NavigationContainer>
          <StatusBar style="dark" backgroundColor="#FFFFFF" translucent={false} />
          <View style={{ flex: 1 }}>
            <MainNavigator />
          </View>
        </NavigationContainer>
      </CartProvider>
    </SafeAreaProvider>
  );
}
