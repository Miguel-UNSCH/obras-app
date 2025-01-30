/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useContext, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Alert,
  Pressable,
  Modal,
} from 'react-native';
import MapView, {Polygon} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import IonIcon from '../components/IonIcon';
import {AppContext} from '../context/AppContext';

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

// Polígono
// const areaUnsch = [
//   {latitude: -13.14955, longitude: -74.222592},
//   {latitude: -13.150564, longitude: -74.217914},
//   {latitude: -13.148406, longitude: -74.21476},
//   {latitude: -13.146604, longitude: -74.215634},
//   {latitude: -13.145063, longitude: -74.218606},
//   {latitude: -13.142415, longitude: -74.221734},
//   {latitude: -13.140733, longitude: -74.222726},
//   {latitude: -13.139693, longitude: -74.222501},
//   {latitude: -13.138841, longitude: -74.222817},
//   {latitude: -13.13741, longitude: -74.222388},
//   {latitude: -13.137013, longitude: -74.222576},
//   {latitude: -13.136512, longitude: -74.223649},
//   {latitude: -13.13919, longitude: -74.223761},
//   {latitude: -13.139266, longitude: -74.224373},
//   {latitude: -13.140496, longitude: -74.22423},
//   {latitude: -13.14153, longitude: -74.226143},
//   {latitude: -13.144073, longitude: -74.224333},
//   {latitude: -13.144309, longitude: -74.224722},
//   {latitude: -13.145134, longitude: -74.224124},
//   {latitude: -13.146426, longitude: -74.223997},
//   {latitude: -13.146644, longitude: -74.224287},
//   {latitude: -13.14881, longitude: -74.222741},
//   {latitude: -13.149254, longitude: -74.222575},
// ];

const areaUnsch = [
  {latitude: -13.159975, longitude: -74.225189},
  {latitude: -13.159386, longitude: -74.227405},
  {latitude: -13.158286, longitude: -74.227177},
  {latitude: -13.158800, longitude: -74.224842},
];

// Función para obtener el centro aproximado del polígono
function getPolygonCenter(coords: {latitude: number; longitude: number}[]) {
  let latSum = 0;
  let lonSum = 0;
  coords.forEach(point => {
    latSum += point.latitude;
    lonSum += point.longitude;
  });
  return {
    latitude: latSum / coords.length,
    longitude: lonSum / coords.length,
  };
}

// Ray casting (point in polygon)
function isPointInPolygon(
  lat: number,
  lng: number,
  polygon: {latitude: number; longitude: number}[],
): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    // Asignar x1 y1 a la LONGITUD y LATITUD del vértice
    const x1 = polygon[i].longitude;
    const y1 = polygon[i].latitude;
    const x2 = polygon[j].longitude;
    const y2 = polygon[j].latitude;

    // Comparar con (lng, lat) => (x, y)
    const intersect =
      y1 > lat !== y2 > lat && lng < ((x2 - x1) * (lat - y1)) / (y2 - y1) + x1;

    if (intersect) {
      inside = !inside;
    }
  }
  return inside;
}

const Home = () => {
  const {isInArea, setIsInArea, cui, obraName} = useContext(AppContext);

  // Referencia al MapView
  const mapRef = useRef<MapView>(null);

  // Estado de ubicación
  const [region, setRegion] = useState<Region>({
    latitude: -13.160474,
    longitude: -74.225755,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [, setErrorMsg] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Permiso para acceder a la ubicación',
            message:
              'Esta aplicación necesita acceso a tu ubicación para mostrar el mapa.',
            buttonPositive: 'Aceptar',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          startWatchingLocation();
        } else {
          setErrorMsg('Permiso de ubicación denegado');
          Alert.alert(
            'Permiso de ubicación',
            'Se usará una ubicación por defecto. Por favor, habilita los permisos de ubicación en la configuración si deseas usar tu ubicación real.',
          );
        }
      } catch (err) {
        setErrorMsg('Error al solicitar permisos: ' + err);
      }
    } else {
      startWatchingLocation();
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  // Escucha continua de la posición
  const startWatchingLocation = () => {
    Geolocation.watchPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setRegion(prev => ({
          ...prev,
          latitude,
          longitude,
        }));

        // Verificamos si está dentro del polígono
        const inside = isPointInPolygon(latitude, longitude, areaUnsch);
        setIsInArea(inside);
      },
      error => {
        setErrorMsg('No se pudo obtener la ubicación: ' + error.message);
      },
      {enableHighAccuracy: true, distanceFilter: 1, interval: 5000},
    );
  };

  const handleOpenInfo = () => {
    setModalVisible(true);
  };

  // Botón para centrar el mapa en el polígono (o en su centro)
  const centerPolygon = () => {
    const center = getPolygonCenter(areaUnsch);
    mapRef.current?.animateCamera({
      center,
      zoom: 15,
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation
        initialCamera={{
          center: {
            latitude: region.latitude,
            longitude: region.longitude,
          },
          pitch: 0,
          heading: 0,
          altitude: 1000,
          zoom: 15,
        }}>
        <Polygon
          coordinates={areaUnsch}
          fillColor="#EF535A44"
          strokeColor="#EF535A"
          strokeWidth={2}
        />
      </MapView>

      {/* Botón flotante para centrar la vista en el polígono */}
      <Pressable style={styles.fabButton} onPress={centerPolygon}>
        <IonIcon name="navigate" color="white" size={24} />
      </Pressable>

      {/* Vista flotante de información */}
      <View style={styles.infoContainer}>
        <View style={styles.infoCui}>
          <Text style={styles.cuiText}>CUI: {cui}</Text>
          {isInArea ? (
            <IonIcon name="checkmark-circle" color="green" />
          ) : (
            <IonIcon name="close-circle" color="red" />
          )}
        </View>
        <Pressable style={styles.infoOpen} onPress={handleOpenInfo}>
          <IonIcon name="open" />
        </Pressable>
      </View>

      {/* Modal informativo */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Información de la Obra</Text>
            <Text style={styles.modalText}>CUI: {cui}</Text>
            <Text style={styles.modalText}>Nombre: {obraName}</Text>
            <Text style={styles.modalText}>
              Estado: {isInArea ? 'Dentro del área' : 'Fuera del área'}
            </Text>

            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  fabButton: {
    position: 'absolute',
    bottom: 90,
    right: 10,
    backgroundColor: '#6a23de',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoCui: {
    flexDirection: 'row',
    gap: 5,
    width: '70%',
    alignItems: 'center',
  },
  cuiText: {
    fontWeight: '600',
  },
  infoOpen: {
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Fondo semitransparente
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 6,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#6a23de',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
