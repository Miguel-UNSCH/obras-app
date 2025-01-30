import {launchCamera} from 'react-native-image-picker';
import Geolocation from '@react-native-community/geolocation';

export interface PhotoDetail {
  uri: string;
  latitude: number | null;
  longitude: number | null;
  timestamp: string;
}

export class CameraAdapter {
  static async getCurrentLocation(): Promise<{latitude: number | null; longitude: number | null}> {
    return new Promise((resolve) => {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error al obtener la ubicación:', error);
          // En caso de error, devolvemos null en ambas coordenadas
          resolve({latitude: null, longitude: null});
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    });
  }

  static async takePicture(): Promise<PhotoDetail | null> {
    try {
      const response = await launchCamera({
        mediaType: 'photo',
        quality: 0.5,
        cameraType: 'back',
      });

      console.log('Camera response:', response);

      // Caso en que el usuario cancela
      if (response.didCancel) {
        console.log('El usuario canceló la captura.');
        return null;
      }

      // Caso en que ocurra algún error
      if (response.errorMessage) {
        console.error('Error al usar la cámara:', response.errorMessage);
        return null;
      }

      // Si tenemos al menos un asset con URI
      if (response.assets && response.assets[0].uri) {
        const location = await this.getCurrentLocation();
        return {
          uri: response.assets[0].uri,
          latitude: location.latitude,
          longitude: location.longitude,
          timestamp: new Date().toISOString(),
        };
      }

      // Si no hay assets o no hay URI
      return null;
    } catch (error) {
      console.error('Error al tomar la foto:', error);
      return null;
    }
  }
}
