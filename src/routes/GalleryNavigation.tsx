import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Gallery from '../screens/Gallery';
import Camera from '../screens/Camera';

const Stack = createStackNavigator();

const GalleryNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Gallery"
        component={Gallery}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="Camera" component={Camera} options={{
        title: 'Agregar nuevo',
      }}/>
    </Stack.Navigator>
  );
};

export default GalleryNavigation;
