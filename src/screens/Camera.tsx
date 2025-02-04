import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CameraAdapter} from '../config/adapters/camera.adapter';
import {AppContext} from '../context/AppContext';
import {PhotoDetail, uploadPhotosToServer} from '../actions/upload';

const LOCAL_STORAGE_KEY = 'my_photos';

const Camera = () => {
  const {userData} = useContext(AppContext);
  const [photos, setPhotos] = useState<PhotoDetail[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    loadLocalPhotos();
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(!!state.isConnected);
    });
    return () => {
      unsubscribe();
    };
  }, []);

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

  const storePhotosLocally = async (photosToStore: PhotoDetail[]) => {
    try {
      await AsyncStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify(photosToStore),
      );
    } catch (error) {
      console.error('Error al guardar fotos localmente:', error);
    }
  };

  const takePicture = async () => {
    try {
      const photo = await CameraAdapter.takePicture();
      if (photo) {
        const formattedPhoto: PhotoDetail = {
          ...photo,
          timestamp: Number(photo.timestamp),
          latitude: photo.latitude ?? undefined,
          longitude: photo.longitude ?? undefined,
        };

        const updatedPhotos: PhotoDetail[] = [...photos, formattedPhoto];
        setPhotos(updatedPhotos);

        await storePhotosLocally(updatedPhotos);
      } else {
        console.log('No se capturó ninguna foto.');
      }
    } catch (error) {
      console.error('Error al tomar la foto:', error);
    }
  };

  const handleSave = async () => {
    if (!photos.length) {
      return;
    }

    if (!userData || !userData.propietario_id || !userData.cui) {
      Alert.alert('Error', 'No se encontró información del usuario.');
      return;
    }

    if (isConnected) {
      const success = await uploadPhotosToServer(
        photos,
        userData.propietario_id,
        userData.cui,
      );
      if (success) {
        await AsyncStorage.removeItem(LOCAL_STORAGE_KEY);
        setPhotos([]);
        console.log('Fotos eliminadas de local tras la subida exitosa.');
      }
    } else {
      Alert.alert(
        'Sin conexión',
        'No hay conexión a internet. Las fotos se guardarán localmente.',
      );
    }
  };

  const renderPhoto = ({item}: {item: PhotoDetail}) => (
    <View style={styles.card}>
      <Image source={{uri: item.uri}} style={styles.image} />
      <Text style={styles.details}>Latitud: {item.latitude ?? 'N/A'}</Text>
      <Text style={styles.details}>Longitud: {item.longitude ?? 'N/A'}</Text>
      <Text style={styles.details}>
        Fecha y Hora: {new Date(item.timestamp).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={photos}
        keyExtractor={(item, index) => `${item.uri}-${index}`}
        renderItem={renderPhoto}
        contentContainerStyle={styles.list}
      />

      <Pressable style={styles.cameraButton} onPress={takePicture}>
        <Text style={styles.cameraText}>Tomar una foto</Text>
      </Pressable>

      <Pressable
        style={[
          styles.saveButton,
          (photos.length === 0 || !isConnected) && styles.disabledButton,
        ]}
        onPress={handleSave}
        disabled={photos.length === 0 || !isConnected}>
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
