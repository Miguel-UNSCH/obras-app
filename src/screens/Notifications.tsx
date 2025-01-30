import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { DateTime, Settings } from 'luxon';
import IonIcon from '../components/IonIcon';

Settings.defaultLocale = 'es';

// Datos de ejemplo
const notifications = [
  {
    id: '1',
    title: 'Actualización disponible',
    description: 'Hay una nueva actualización para la app.',
    priority: 'alta',
    icon: 'alert',
    date: '2025-01-02T10:29:44',
  },
  {
    id: '2',
    title: 'Recordatorio',
    description: 'No olvides subir las fotos.',
    priority: 'media',
    icon: 'notifications',
    date: '2025-01-02T09:15:30',
  },
  {
    id: '3',
    title: 'Bienvenido',
    description: 'Gracias por unirte a nuestra plataforma.',
    priority: 'baja',
    icon: 'checkmark-circle-outline',
    date: '2025-01-01T18:45:00',
  },
];

interface PropsNotify {
  title: string;
  description: string;
  priority: string;
  icon: string;
  date: string;
}

const NotificationCard = ({ title, description, priority, icon, date }: PropsNotify) => {
  const getBorderColor = (priorityLevel: string) => {
    switch (priorityLevel) {
      case 'alta':
        return '#FF4C4C';
      case 'media':
        return '#FFA500';
      case 'baja':
        return '#0e59e9';
      default:
        return '#CCCCCC';
    }
  };

  const formattedDate = DateTime.fromISO(date).toFormat("d 'de' LLLL 'del' yyyy, HH:mm:ss");

  return (
    <TouchableOpacity style={[styles.card, { borderColor: getBorderColor(priority) }]}>
      <IonIcon name={icon} size={24} color={getBorderColor(priority)} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>
    </TouchableOpacity>
  );
};

const Notifications = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notificaciones</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationCard
            title={item.title}
            description={item.description}
            priority={item.priority}
            icon={item.icon}
            date={item.date}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: 12,
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});

export default Notifications;
