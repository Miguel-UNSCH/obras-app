import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Settings from '../screens/Settings';
import About from '../screens/About';
import ChangePassword from '../screens/ChangePassword';

const Stack = createStackNavigator();

const SettingsNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{
          title: 'Cambiar contraseña',
        }}
      />
      <Stack.Screen
        name="About"
        component={About}
        options={{
          title: 'Acerca de',
        }}
      />
    </Stack.Navigator>
  );
};

export default SettingsNavigation;
