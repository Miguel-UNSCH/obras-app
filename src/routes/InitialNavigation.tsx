import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppContext, AppContextProvider } from '../context/AppContext';
import CarouselScreen from '../screens/CarouselScreen';
import LoginScreen from '../screens/LoginScreen';
import BottomNavigation from './bottomNavigation';
import { ActivityIndicator, View } from 'react-native';

const Stack = createStackNavigator();

const InitialNavigation = () => {
  return (
    <AppContextProvider>
      <AuthNavigator />
    </AppContextProvider>
  );
};

const AuthNavigator = () => {
  const { isLoading, token } = useContext(AppContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6a23de" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={token ? 'Main' : 'Carousel'}>
        <Stack.Screen name="Carousel" component={CarouselScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={BottomNavigation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default InitialNavigation;
