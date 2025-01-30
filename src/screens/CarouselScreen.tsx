import React, {useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  FlatList,
  Dimensions,
  StatusBar,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

type ViewableItem = {
  index: number | null;
  isViewable: boolean;
  item: {
    id: string;
    title: string;
    description: string;
    image: string;
  };
};

type ViewableItemsChangedInfo = {
  viewableItems: ViewableItem[];
  changed: ViewableItem[];
};

const CarouselScreen = () => {
  const navigation = useNavigation();

  const slides = [
    {
      id: '1',
      title: 'Captura instantánea de tus avances',
      description:
        'Registra el progreso de la obra en tiempo real tomando fotos directaente desde la aplicación.',
      image: 'https://images.pexels.com/photos/93400/pexels-photo-93400.jpeg',
    },
    {
      id: '2',
      title: 'Historial de tus visitas',
      description:
        'Consulta todas las fotos que has tomado en tus visitas anteriores, organizadas por fecha y hora.',
      image:
        'https://images.pexels.com/photos/13715366/pexels-photo-13715366.jpeg',
    },
    {
      id: '3',
      title: 'Reporta tu asistencia con evidencia',
      description:
        'Demuestra tu compromiso enviando fotos como prueba de tu presencia en la obra.',
      image: 'https://images.pexels.com/photos/93400/pexels-photo-93400.jpeg',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const onViewableItemsChanged = ({
    viewableItems,
  }: ViewableItemsChangedInfo) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setCurrentIndex(viewableItems[0].index);
    }
  };

  const viewabilityConfig = {
    viewAreaCoveragePercentThreshold: 50,
  };

  const onDone = async () => {
    await AsyncStorage.setItem('hasSeenCarousel', 'true');
    navigation.navigate('Login' as never);
  };

  const renderItem = ({
    item,
  }: {
    item: {id: string; title: string; description: string; image: string};
  }) => (
    <ImageBackground source={{uri: item.image}} style={styles.slide}>
      <View style={styles.overlay}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </ImageBackground>
  );

  return (
    <View style={styles.carouselContainer}>
      <StatusBar translucent backgroundColor={'#00000000'} />
      <FlatList
        data={slides}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
      <View style={styles.indicatorContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              currentIndex === index && styles.activeIndicator,
            ]}
          />
        ))}
      </View>
      {currentIndex === slides.length - 1 && (
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={onDone}>
            <Text style={styles.textButton}>Comenzar</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  slide: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#888',
    marginHorizontal: 5,
  },
  activeIndicator: {
    backgroundColor: '#fff',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#6a23de',
    padding: 8,
    borderRadius: 10,
    width: '40%',
  },
  textButton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CarouselScreen;
