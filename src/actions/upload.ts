import {Alert} from 'react-native';

const UPLOAD_URL = 'http://172.16.21.194:3000/api/uploads';

export interface PhotoDetail {
  uri: string;
  timestamp: number;
  latitude?: number;
  longitude?: number;
}

export const uploadPhotosToServer = async (
  photos: PhotoDetail[],
  propietarioId: string,
  cui: string,
): Promise<boolean> => {
  try {
    console.log('Iniciando subida de fotos al servidor...');
    console.log(photos);

    for (const photo of photos) {
      const formData = new FormData();
      formData.append('file', {
        uri: photo.uri,
        name: photo.uri.split('/').pop(),
        type: 'image/jpeg',
      });
      formData.append('id', propietarioId);
      formData.append('cui', cui);
      formData.append('latitud', String(photo.latitude ?? '0'));
      formData.append('longitud', String(photo.longitude ?? '0'));
      formData.append('date', new Date(photo.timestamp).toISOString());

      const response = await fetch(UPLOAD_URL, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error al subir la imagen');
      }

      console.log(`Foto subida: ${data.image.url}`);
    }

    Alert.alert('Éxito', 'Todas las fotos fueron subidas correctamente');
    return true;
  } catch (error) {
    console.error('Error al subir las fotos:', error);
    Alert.alert(
      'Error',
      'Hubo un problema al subir las fotos. Intenta más tarde.',
    );
    return false;
  }
};
