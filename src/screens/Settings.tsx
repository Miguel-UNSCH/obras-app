import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Image,
} from 'react-native';

import IonIcon from '../components/IonIcon';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Settings = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    await AsyncStorage.removeItem('isLoggedIn');
    navigation.navigate('Login' as never);
  };

  return (
    <View style={styles.container}>
      {/* User Information Card */}
      <View style={styles.userCardContainer}>
        <View style={styles.userCard}>
          <Text style={styles.userName}>Crisante Pariona Silvio</Text>
          <Text style={styles.userDetails}>Residente</Text>
          <Text style={styles.userDetails}>
            Obra: MEJORAMIENTO Y AMPLIACION DE LOS SERVICIOS DEL SANTUARIO DE LA
            MEMORIA LA HOYADA EN EL DISTRITO DE ANDRES AVELINO CACERES -
            PROVINCIA DE HUAMANGA - DEPARTAMENTO DE AYACUCHO
          </Text>
          <Text style={styles.userDetails}>CUI: 2449300</Text>
        </View>
        <Image
          source={{
            uri: 'https://blinsegur.com/wp-content/uploads/2023/07/blog-Recuperado-1.webp',
          }}
          style={styles.userImage}
        />
      </View>

      {/* Options */}
      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => navigation.navigate('ChangePassword' as never)}>
        <IonIcon name="lock-closed" size={24} color="#333" />
        <Text style={styles.optionText}>Cambiar contraseña</Text>
        <IonIcon name="arrow-forward" size={24} color="#333" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => navigation.navigate('About' as never)}>
        <IonIcon name="information-circle" size={24} color="#333" />
        <Text style={styles.optionText}>Información</Text>
        <IonIcon name="arrow-forward" size={24} color="#333" />
      </TouchableOpacity>

      {/* Logout Button */}
      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  userCardContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  userCard: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#00000033',
    position: 'absolute',
    top: -50,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 50,
  },
  userDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 50,
    width: '90%',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: 'space-between',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 15,
    borderRadius: 50,
    width: '90%',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Settings;
