import React, {createContext, useState} from 'react';

interface User {
  id: string;
  cui: string;
  name: string;
  obra: any[];
}

interface AppContextProps {
  isInArea: boolean;
  setIsInArea: (value: boolean) => void;
  obraName: string;
  cui: string;
  token: string | null;
  setToken: (value: string | null) => void;
  userData: User | null;
  setUserData: (value: User | null) => void;
}

export const AppContext = createContext<AppContextProps>({} as AppContextProps);

export const AppContextProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [isInArea, setIsInArea] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<User | null>(null);

  const obraName =
    'MEJORAMIENTO Y AMPLIACION DE LOS SERVICIOS DEL SANTUARIO DE LA MEMORIA LA HOYADA EN EL DISTRITO DE ANDRES AVELINO CACERES - PROVINCIA DE HUAMANGA - DEPARTAMENTO DE AYACUCHO';
  const cui = '2449300';

  return (
    <AppContext.Provider
      value={{
        isInArea,
        setIsInArea,
        obraName,
        cui,
        token,
        setToken,
        userData,
        setUserData,
      }}>
      {children}
    </AppContext.Provider>
  );
};
