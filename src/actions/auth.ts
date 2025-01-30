
import axios from 'axios';

export const authLogin = async (user: string, password: string) => {
  try {
    const response = await axios.post(
      'https://geobras.regionayacucho.gob.pe/api/login-app',
      { user, password },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 10000, // Tiempo de espera en milisegundos
      }
    );

    return response.data;
  } catch (error) {
    console.log('Error en authLogin:', error);
    if (error) {
      console.log('Detalles del error:', error);
    }
    throw error;
  }
};
