import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {CameraAdapter, PhotoDetail} from '../config/adapters/camera.adapter';

const LOCAL_STORAGE_KEY = 'my_photos';

const Camera = () => {
  const [photos, setPhotos] = useState<PhotoDetail[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // 1. Al montar el componente, cargamos las fotos existentes en local.
  useEffect(() => {
    loadLocalPhotos();
  }, []);

  // 2. Suscribirse a los cambios en la conexión a internet.
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(!!state.isConnected);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Cargar fotos desde AsyncStorage
  const loadLocalPhotos = async () => {
    try {
      const savedPhotos = await AsyncStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedPhotos) {
        setPhotos(JSON.parse(savedPhotos));
      }
    } catch (error) {
      console.error('Error al cargar fotos desde local:', error);
    }
  };

  // Guardar fotos en AsyncStorage
  const storePhotosLocally = async (photosToStore: PhotoDetail[]) => {
    try {
      await AsyncStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(photosToStore));
      console.log('Fotos guardadas localmente:', photosToStore.length);
    } catch (error) {
      console.error('Error al guardar fotos localmente:', error);
    }
  };

  // Tomar foto y guardarla localmente
  const takePicture = async () => {
    try {
      const photo = await CameraAdapter.takePicture();
      if (photo) {
        // Agregamos la foto al estado
        const updatedPhotos = [...photos, photo];
        setPhotos(updatedPhotos);

        // Guardamos las fotos en AsyncStorage para persistir
        await storePhotosLocally(updatedPhotos);
      } else {
        console.log('No se capturó ninguna foto.');
      }
    } catch (error) {
      console.error('Error al tomar la foto:', error);
    }
  };

  // Subir fotos al servidor (simulación)
  const uploadPhotosToServer = async (photosToUpload: PhotoDetail[]) => {
    // Aquí iría tu lógica real para subir las fotos a tu servidor
    // Por ejemplo, con fetch o axios, enviando los datos en JSON o archivos.
    // Este ejemplo simula un retraso de 2 segundos.
    console.log('Iniciando subida de fotos al servidor...');
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log('Fotos subidas exitosamente al servidor:', photosToUpload.length);
  };

  // Manejar botón "Guardar"
  //  - Sube las fotos al servidor.
  //  - Si es exitoso, limpia almacenamiento local y estado.
  const handleSave = async () => {
    if (!photos.length) return;
    if (isConnected) {
      try {
        await uploadPhotosToServer(photos);
        // Si la subida es exitosa, eliminamos las fotos locales
        await AsyncStorage.removeItem(LOCAL_STORAGE_KEY);
        setPhotos([]);
        console.log('Fotos eliminadas de local tras la subida exitosa.');
      } catch (error) {
        console.error('Error al subir fotos al servidor:', error);
      }
    } else {
      console.log('No hay conexión; no se subirán las fotos ahora.');
    }
  };

  // Render de cada tarjeta en el FlatList
  const renderPhoto = ({item}: {item: PhotoDetail}) => (
    <View style={styles.card}>
      <Image source={{uri: item.uri}} style={styles.image} />
      <Text style={styles.details}>
        Latitud: {item.latitude !== null ? item.latitude : 'N/A'}
      </Text>
      <Text style={styles.details}>
        Longitud: {item.longitude !== null ? item.longitude : 'N/A'}
      </Text>
      <Text style={styles.details}>
        Fecha y Hora: {new Date(item.timestamp).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Listado de fotos en tarjetas */}
      <FlatList
        data={photos}
        keyExtractor={(item, index) => `${item.uri}-${index}`}
        renderItem={renderPhoto}
        contentContainerStyle={styles.list}
      />

      {/* Botón para tomar fotos */}
      <Pressable style={styles.cameraButton} onPress={takePicture}>
        <Text style={styles.cameraText}>Tomar una foto</Text>
      </Pressable>

      {/* Botón para "Guardar" (subir) */}
      {/* Se habilita solo si hay fotos y conexión a internet */}
      <Pressable
        style={[
          styles.saveButton,
          (photos.length === 0 || !isConnected) && styles.disabledButton,
        ]}
        onPress={handleSave}
        disabled={photos.length === 0 || !isConnected}
      >
        <Text style={styles.saveButtonText}>Guardar</Text>
      </Pressable>
    </View>
  );
};

export default Camera;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  list: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  details: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  cameraButton: {
    backgroundColor: 'blue',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  cameraText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: 'green',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#9E9E9E',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
