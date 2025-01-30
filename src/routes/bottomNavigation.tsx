/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import IonIcon from '../components/IonIcon';
import Notifications from '../screens/Notifications';
import SettingsNavigation from './SettingsNavigation';
import GalleryNavigation from './GalleryNavigation';

const Tab = createBottomTabNavigator();

const BottomNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          title: 'Inicio',
          tabBarIcon: ({color}) => <IonIcon name="home" color={color} />,
        }}
      />
      <Tab.Screen
        name="Gallery"
        component={GalleryNavigation}
        options={{
          title: 'Galeria',
          tabBarIcon: ({color}) => <IonIcon name="images" color={color} />,
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={Notifications}
        options={{
          title: 'Notificaciones',
          tabBarIcon: ({color}) => (
            <IonIcon name="notifications" color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsNavigation}
        options={{
          title: 'Ajustes',
          tabBarIcon: ({color}) => <IonIcon name="settings" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigation;
