import React, {useState, useEffect, useContext, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import DatePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {DateTime, Settings} from 'luxon';
import {useNavigation} from '@react-navigation/native';
import {AppContext} from '../context/AppContext';

Settings.defaultLocale = 'es';

interface ImageItem {
  id: string;
  url: string;
  latitud: number | null;
  longitud: number | null;
  date: string;
}

const Gallery: React.FC = () => {
  const navigation = useNavigation();
  const {userData, isInArea} = useContext(AppContext);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://geobras.regionayacucho.gob.pe/api/images',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: userData?.propietario_id,
            cui: userData?.cui,
            date: DateTime.fromJSDate(selectedDate).toFormat('yyyy-MM-dd'),
          }),
        },
      );
      const data: ImageItem[] = await response.json();
      setImages(data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
    setLoading(false);
  }, [userData?.propietario_id, userData?.cui, selectedDate]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleImageClick = (image: ImageItem) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const handleAddImage = () => {
    navigation.navigate('Camera' as never);
  };

  const renderImageItem = ({item}: {item: ImageItem}) => (
    <TouchableOpacity
      onPress={() => handleImageClick(item)}
      style={styles.imageTouchable}>
      <Image source={{uri: item.url}} style={styles.image} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.datePickerContainer}>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateText}>
            {DateTime.fromJSDate(selectedDate).toFormat(
              "d 'de' LLLL 'del' yyyy",
            )}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DatePicker
            value={selectedDate}
            mode="date"
            display="calendar"
            onChange={handleDateChange}
          />
        )}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#6a23de" />
      ) : (
        <FlatList
          data={images}
          renderItem={renderImageItem}
          keyExtractor={item => item.id}
          numColumns={2}
          style={styles.gallery}
        />
      )}

      <Pressable
        onPress={handleAddImage}
        style={[styles.buttonAdd, !isInArea && styles.disabledButton]}
        disabled={!isInArea}>
        <Text style={styles.textButton}>Agregar imagen</Text>
      </Pressable>

      {modalVisible && selectedImage && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Image
                source={{uri: selectedImage.url}}
                style={styles.modalImage}
              />
              <Text style={styles.modalTitle}>Detalles de la Imagen</Text>
              <Text style={styles.modalDetailText}>
                Fecha y hora:{' '}
                {DateTime.fromISO(selectedImage.date).toFormat(
                  "d 'de' LLL yyyy, HH:mm",
                )}
              </Text>
              <Text style={styles.modalDetailText}>
                Ubicación: {selectedImage.latitud ?? 'Desconocida'},{' '}
                {selectedImage.longitud ?? 'Desconocida'}
              </Text>
              <Pressable
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default Gallery;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 10},
  datePickerContainer: {
    marginBottom: 5,
    padding: 5,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6a23de',
  },
  dateText: {fontSize: 16, color: '#6a23de'},
  gallery: {flex: 1},
  imageTouchable: {width: '50%'},
  image: {width: '95%', height: 150, margin: 5, borderRadius: 8},
  buttonAdd: {
    borderRadius: 10,
    backgroundColor: '#6a23de',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButton: {color: '#fff', textAlign: 'center', fontWeight: '500'},
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: 300,
    marginBottom: 20,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  modalTitle: {fontSize: 18, fontWeight: 'bold', marginBottom: 10},
  modalDetailText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
    marginBottom: 6,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#6a23de',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeButtonText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
  disabledButton: {
    backgroundColor: '#9E9E9E',
  },
});
