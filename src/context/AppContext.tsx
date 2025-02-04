import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import {authLogin} from '../actions/auth';

interface User {
  id: string;
  cui: string;
  name: string;
  propietario_id: string;
  image: string | null;
  state: string;
  obra: {
    id: string;
    state: string;
    propietario_id: string;
    resident: string;
    projectType: string;
    cui: string;
    name: string;
    areaOrLength: string;
    points: string;
    createdAt: string;
    updatedAt: string;
  } | null;
}

interface AppContextProps {
  isLoading: boolean;
  token: string | null;
  userData: User | null;
  isInArea: boolean;
  setIsInArea: (value: boolean) => void;
  coordinates: {latitude: number; longitude: number}[] | null;
  login: (user: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AppContext = createContext<AppContextProps>({} as AppContextProps);

export const AppContextProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [isInArea, setIsInArea] = useState(false);
  const [coordinates, setCoordinates] = useState<
    {latitude: number; longitude: number}[] | null
  >(null);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUser = await AsyncStorage.getItem('userData');

        if (storedToken && storedUser) {
          const decodedToken: any = jwtDecode(storedToken);
          const isExpired = decodedToken.exp * 1000 < Date.now();

          if (!isExpired) {
            setToken(storedToken);
            setUserData(JSON.parse(storedUser));
            const obra = JSON.parse(storedUser).obra;
            if (obra && obra.points) {
              try {
                const parsedPoints = JSON.parse(obra.points).map(
                  ([lon, lat]: [number, number]) => ({
                    latitude: lat,
                    longitude: lon,
                  }),
                );
                setCoordinates(parsedPoints);
              } catch (error) {
                console.error('Error al convertir las coordenadas:', error);
              }
            }
          } else {
            logout();
          }
        }
      } catch (error) {
        console.error('Error cargando sesión:', error);
      }
      setIsLoading(false);
    };

    loadSession();
  }, []);

  const login = async (user: string, password: string) => {
    try {
      const response = await authLogin(user, password);

      if (response.token && response.user) {
        setIsLoading(true);
        await AsyncStorage.setItem('token', response.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.user));

        setToken(response.token);
        setUserData(response.user);

        // ✅ Guardar coordenadas en el estado
        if (response.user.obra?.points) {
          try {
            const parsedPoints = JSON.parse(response.user.obra.points).map(
              ([lon, lat]: [number, number]) => ({
                latitude: lat,
                longitude: lon,
              }),
            );
            setCoordinates(parsedPoints);
          } catch (error) {
            console.error('Error al convertir las coordenadas:', error);
          }
        }
      } else {
        throw new Error('Error en la autenticación');
      }
    } catch (error: any) {
      console.error('Error en login:', error);
      throw new Error(error.message || 'Error en la autenticación');
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userData');
    setToken(null);
    setUserData(null);
    setCoordinates(null);
  };

  return (
    <AppContext.Provider
      value={{
        isLoading,
        token,
        userData,
        isInArea,
        setIsInArea,
        coordinates,
        login,
        logout,
      }}>
      {children}
    </AppContext.Provider>
  );
};
