import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
} from 'react-native';
import DatePicker, {DateTimePickerEvent} from '@react-native-community/datetimepicker';
import {DateTime, Settings} from 'luxon';
import {useNavigation} from '@react-navigation/native';

Settings.defaultLocale = 'es';

interface ImageItem {
  id: string;
  uri: string;
  data: {
    latitude: number;
    longitude: number;
    date: string;
  };
}

const Gallery: React.FC = () => {
  const navigation = useNavigation();

  // Función para formatear la fecha y hora con Luxon
  const formatDateTime = (dateStr: string) => {
    const dt = DateTime.fromISO(dateStr);
    // Si la fecha es válida, formateamos. Si no, mostramos el string tal cual.
    return dt.isValid ? dt.toFormat("d 'de' LLL yyyy, HH:mm") : dateStr;
  };

  // Función para verificar si la fecha seleccionada es hoy
  const isToday = (date: Date) => {
    const now = new Date();
    return (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  };

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  // Lista de imágenes de prueba
  const [images] = useState<ImageItem[]>([
    {
      id: '1',
      uri: 'https://www.hermanosotero.com/que-es-una-obra-civil_img81647t1.jpg',
      data: {
        latitude: -14.76532,
        longitude: -73.12234,
        date: '2024-02-01',
      },
    },
    {
      id: '2',
      uri: 'https://www.grupopazos.es/wp-content/uploads/2022/11/tipos-de-obras-de-construccion.jpg',
      data: {
        latitude: -14.76532,
        longitude: -73.12234,
        date: '2024-02-01',
      },
    },
    {
      id: '3',
      uri: 'https://larepublica.cronosmedia.glr.pe/migration/images/LR5CTDHRV5DA3M6KIFR5D3Q4QM.jpg',
      data: {
        latitude: -14.76532,
        longitude: -73.12234,
        date: '2024-02-01',
      },
    },
    {
      id: '4',
      uri: 'https://www.efreyre.com/wp-content/uploads/2019/04/Remote-Location-Constructions-Sites.jpg',
      data: {
        latitude: -14.76532,
        longitude: -73.12234,
        date: '2024-02-01',
      },
    },
    {
      id: '5',
      uri: 'https://encuentro.pe/wp-content/uploads/2023/10/IMG_2926-1024x683.jpg',
      data: {
        latitude: -14.76532,
        longitude: -73.12234,
        date: '2024-02-01',
      },
    },
  ]);

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);

  const handleImageClick = (image: ImageItem) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  // Manejador de la fecha
  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleAddImage = () => {
    // Navegación a tu cámara
    navigation.navigate('Camera' as never);
  };

  const renderImageItem = ({item}: {item: ImageItem}) => (
    <TouchableOpacity
      onPress={() => handleImageClick(item)}
      style={styles.imageTouchable}>
      <Image source={{uri: item.uri}} style={styles.image} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Selector de fecha */}
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

      {/* Galería de imágenes */}
      <FlatList
        data={images}
        renderItem={renderImageItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        style={styles.gallery}
      />

      {/* Botón para agregar nuevas imágenes */}
      <Pressable
        onPress={handleAddImage}
        style={[
          styles.buttonAdd,
          !isToday(selectedDate) && styles.disabledButton, // Agrega estilo si no es hoy
        ]}
        disabled={!isToday(selectedDate)} // Deshabilita el Pressable si no es hoy
      >
        <Text style={styles.textButton}>Agregar imagen</Text>
      </Pressable>

      {/* Modal para ver detalles de la imagen */}
      {modalVisible && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Image
                source={{uri: selectedImage?.uri}}
                style={styles.modalImage}
              />
              <Text style={styles.modalTitle}>Detalles de la Imagen</Text>
              <Text style={styles.modalDetailText}>
                Fecha y hora: {formatDateTime(selectedImage?.data.date ?? '')}
              </Text>
              <Text style={styles.modalDetailText}>
                Ubicación: {selectedImage?.data.latitude},{' '}
                {selectedImage?.data.longitude}
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
  container: {
    flex: 1,
    padding: 10,
  },
  datePickerContainer: {
    marginBottom: 5,
    padding: 5,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6a23de',
  },
  dateText: {
    fontSize: 16,
    color: '#6a23de',
  },
  gallery: {
    flex: 1,
  },
  imageTouchable: {
    width: '50%',
  },
  image: {
    width: '95%',
    height: 150,
    margin: 5,
    borderRadius: 8,
  },
  buttonAdd: {
    borderRadius: 10,
    backgroundColor: '#6a23de',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  /* Estilo para el botón deshabilitado */
  disabledButton: {
    backgroundColor: '#999',
  },
  textButton: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
  },
  /* Modal */
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
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
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
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
