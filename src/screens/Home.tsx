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
import MapView, {Polygon, Polyline} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import IonIcon from '../components/IonIcon';
import {AppContext} from '../context/AppContext';

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface Coordinate {
  latitude: number;
  longitude: number;
}

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

const isPointInPolygon = (
  lat: number,
  lng: number,
  polygon: {latitude: number; longitude: number}[],
): boolean => {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const x1 = polygon[i].longitude;
    const y1 = polygon[i].latitude;
    const x2 = polygon[j].longitude;
    const y2 = polygon[j].latitude;

    const intersect =
      y1 > lat !== y2 > lat && lng < ((x2 - x1) * (lat - y1)) / (y2 - y1) + x1;
    if (intersect) {
      inside = !inside;
    }
  }
  return inside;
};

const getDistanceFromLine = (
  lat: number,
  lng: number,
  line: Coordinate[],
): number => {
  if (!line || line.length < 2) {
    return Infinity;
  }

  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371000; // Radio de la Tierra en metros
  let minDistance = Infinity;

  for (let i = 0; i < line.length - 1; i++) {
    const lat1 = toRad(line[i].latitude);
    const lon1 = toRad(line[i].longitude);
    const lat2 = toRad(line[i + 1].latitude);
    const lon2 = toRad(line[i + 1].longitude);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d1 = R * c;

    minDistance = Math.min(minDistance, d1);
  }
  return minDistance;
};

const Home = () => {
  const {coordinates, userData, isInArea, setIsInArea} = useContext(AppContext);

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
        setRegion(prev => ({...prev, latitude, longitude}));

        let inside = false;
        if (userData?.obra?.projectType === 'Superficie') {
          inside = isPointInPolygon(latitude, longitude, coordinates || []);
        } else {
          const distance = getDistanceFromLine(
            latitude,
            longitude,
            coordinates || [],
          );
          inside = distance <= 150;
        }
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
    const center = getPolygonCenter(coordinates || []);
    mapRef.current?.animateCamera({
      center,
      zoom: 15,
    });
  };

  console.log(coordinates);

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
        {userData?.obra?.projectType === 'Superficie' ? (
          <Polygon
            coordinates={coordinates || []}
            fillColor="#EF535A44"
            strokeColor="#EF535A"
            strokeWidth={2}
          />
        ) : (
          <Polyline
            coordinates={coordinates || []}
            strokeColor="blue"
            strokeWidth={3}
          />
        )}
      </MapView>

      {/* Botón flotante para centrar la vista en el polígono */}
      <Pressable style={styles.fabButton} onPress={centerPolygon}>
        <IonIcon name="navigate" color="white" size={24} />
      </Pressable>

      {/* Vista flotante de información */}
      <View style={styles.infoContainer}>
        <View style={styles.infoCui}>
          <Text style={styles.cuiText}>CUI: {userData?.obra?.cui}</Text>
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
            <Text style={styles.modalText}>CUI: {userData?.obra?.cui}</Text>
            <Text style={styles.modalText}>Nombre: {userData?.obra?.name}</Text>
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
