import React, { useState, useEffect, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  const [hasSeenCarousel, setHasSeenCarousel] = useState(false);
  const [carouselChecked, setCarouselChecked] = useState(false);

  useEffect(() => {
    const checkCarouselStatus = async () => {
      const seenCarousel = await AsyncStorage.getItem('hasSeenCarousel');
      setHasSeenCarousel(seenCarousel === 'true');
      setCarouselChecked(true);
    };
    checkCarouselStatus();
  }, []);

  if (isLoading || !carouselChecked) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6a23de" />
      </View>
    );
  }

  const getInitialRoute = () => {
    if (!hasSeenCarousel) return 'Carousel';
    if (!token) return 'Login';
    return 'Main';
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={getInitialRoute()}>
        <Stack.Screen name="Carousel" component={CarouselScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={BottomNavigation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default InitialNavigation;
