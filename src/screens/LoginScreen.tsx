import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../context/AppContext';

const LoginScreen = () => {
  const navigation = useNavigation();
  const { login, isLoading } = useContext(AppContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onLogin = async () => {
    if (!username || !password) {
      setErrorMessage('Por favor, ingresa tu usuario y contraseña.');
      return;
    }

    try {
      await login(username, password);
      navigation.navigate('Main' as never);
    } catch (error: any) {
      setErrorMessage(error.message || 'Error de autenticación.');
    }
  };

  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    value: string
  ) => {
    setter(value);
    if (errorMessage && username && password) {
      setErrorMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor={'#00000055'} />
      <Image
        source={{
          uri: 'https://img.freepik.com/free-vector/mobile-login-concept-illustration_114360-135.jpg',
        }}
        style={styles.logo}
      />
      <Text style={styles.title}>Inicia sesión</Text>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Usuario"
        placeholderTextColor="#aaa"
        value={username}
        onChangeText={(value) => handleInputChange(setUsername, value)}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Contraseña"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={(value) => handleInputChange(setPassword, value)}
          secureTextEntry={!isPasswordVisible}
        />
        <Pressable
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          style={styles.togglePasswordButton}
        >
          <Text style={styles.togglePasswordText}>
            {isPasswordVisible ? 'Ocultar' : 'Mostrar'}
          </Text>
        </Pressable>
      </View>

      <Pressable style={styles.loginButton} onPress={onLogin} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginButtonText}>Iniciar sesión</Text>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
    borderRadius: 75,
    backgroundColor: '#ddd',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  errorText: {
    color: '#ff3333',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
  },
  togglePasswordButton: {
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  togglePasswordText: {
    fontSize: 14,
    color: '#6a23de',
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#6a23de',
    paddingVertical: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
