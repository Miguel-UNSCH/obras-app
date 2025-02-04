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
        timeout: 10000,
      }
    );

    return response.data;
  } catch (error: any) {
    console.log('Error en authLogin:', error);

    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Si el error tiene una respuesta del servidor (error 404, 401, 500, etc.)
        console.log('Detalles del error:', error.response.data);

        throw new Error(
          error.response.data.error || 
          error.response.data.message || 
          `Error ${error.response.status}: ${error.response.statusText}`
        );
      } else if (error.request) {
        // Si la solicitud fue hecha pero no se recibió respuesta
        throw new Error('No se recibió respuesta del servidor. Verifica tu conexión.');
      }
    }

    // Cualquier otro error no relacionado con Axios
    throw new Error('Ocurrió un error inesperado.');
  }
};
