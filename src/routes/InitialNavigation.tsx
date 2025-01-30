import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createStackNavigator} from '@react-navigation/stack';
import {AppContextProvider} from '../context/AppContext';
import CarouselScreen from '../screens/CarouselScreen';
import LoginScreen from '../screens/LoginScreen';
import BottomNavigation from './bottomNavigation';

const Stack = createStackNavigator();

const InitialNavigation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasSeenCarousel, setHasSeenCarousel] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      const seenCarousel = await AsyncStorage.getItem('hasSeenCarousel');
      const loggedIn = await AsyncStorage.getItem('isLoggedIn');
      setHasSeenCarousel(seenCarousel === 'true');
      setIsLoggedIn(loggedIn === 'true');
      setIsLoading(false);
    };
    checkStatus();
  }, []);

  if (isLoading) {
    return null; // Puedes agregar un spinner aquí
  }

  const getInitialRoute = () => {
    if (!hasSeenCarousel) {
      return 'Carousel';
    }
    if (!isLoggedIn) {
      return 'Login';
    }
    return 'Main';
  };

  return (
    <AppContextProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{headerShown: false}}
          initialRouteName={getInitialRoute()}>
          <Stack.Screen name="Carousel" component={CarouselScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Main" component={BottomNavigation} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppContextProvider>
  );
};

export default InitialNavigation;
