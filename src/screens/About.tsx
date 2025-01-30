import React from 'react';
import {View, Text, Image, StyleSheet, SafeAreaView } from 'react-native';

const About = () => {
  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          {/* Logo de la entidad. Puedes usar una imagen local o remota */}
          <Image
            style={styles.logo}
            source={{
              uri: 'https://res.cloudinary.com/dmr9ef5cl/image/upload/v1736513062/ar7rsbcqb9xqogx8tftq.png',
            }}
          />
          <Text style={styles.title}>Acerca de la Aplicación</Text>
        </View>

        <Text style={styles.sectionTitle}>Gobierno Regional de Ayacucho</Text>
        <Text style={styles.sectionText}>
          Oficina: Oficina de Tecnologías de la Información y Comunicación
        </Text>

        <Text style={styles.sectionTitle}>Versión de la Aplicación</Text>
        <Text style={styles.sectionText}>1.0.0</Text>

        {/* <Text style={styles.sectionTitle}>Desarrollado por:</Text>
        <Text style={styles.sectionText}>Aldahir</Text> */}

        <Text style={styles.footerText}>
          © {new Date().getFullYear()} Gobierno Regional de Ayacucho
        </Text>
    </SafeAreaView>
  );
};

export default About;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7f7f7',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 5,
    textAlign: 'center',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 5,
    textAlign: 'center',
  },
  sectionText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
    marginBottom: 10,
  },
  footerText: {
    marginTop: 40,
    fontSize: 12,
    color: '#aaa',
    textAlign: 'center',
  },
});
