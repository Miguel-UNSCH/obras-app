import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AppContext} from '../context/AppContext';
import {useNavigation} from '@react-navigation/native';

const ChangePassword = () => {
  const navigation = useNavigation();

  const {userData, logout} = useContext(AppContext);
  const [currentPassword, setCurrentPassword] = useState('');
  const [secureCurrent, setSecureCurrent] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [secureNew, setSecureNew] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureConfirm, setSecureConfirm] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSaveChanges = async () => {
    setError(null);
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        'https://geobras.regionayacucho.gob.pe/api/change-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user: userData?.propietario_id,
            cui: userData?.cui,
            password: currentPassword,
            newPassword: newPassword,
          }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error al cambiar la contraseña');
      }

      Alert.alert('Éxito', 'Contraseña actualizada correctamente', [
        {
          text: 'OK',
          onPress: () => {
            logout();
            navigation.navigate('Login' as never);
          },
        },
      ]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Ocurrió un error inesperado',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Cambiar Contraseña</Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contraseña actual</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={styles.input}
              onChangeText={setCurrentPassword}
              value={currentPassword}
              secureTextEntry={secureCurrent}
              placeholder="Ingresa tu contraseña actual"
              placeholderTextColor="#666"
            />
            <Pressable onPress={() => setSecureCurrent(!secureCurrent)}>
              <Ionicons
                name={secureCurrent ? 'eye-off' : 'eye'}
                size={20}
                color="#666"
              />
            </Pressable>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nueva contraseña</Text>
          <View style={styles.passwordRow}>asdaadd
            <TextInput
              style={styles.input}
              onChangeText={setNewPassword}
              value={newPassword}
              secureTextEntry={secureNew}
              placeholder="Ingresa la nueva contraseña"
              placeholderTextColor="#666"
            />
            <Pressable onPress={() => setSecureNew(!secureNew)}>
              <Ionicons
                name={secureNew ? 'eye-off' : 'eye'}
                size={20}
                color="#666"
              />
            </Pressable>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirmar nueva contraseña</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={styles.input}
              onChangeText={setConfirmPassword}
              value={confirmPassword}
              secureTextEntry={secureConfirm}
              placeholder="Confirma la nueva contraseña"
              placeholderTextColor="#666"
            />
            <Pressable onPress={() => setSecureConfirm(!secureConfirm)}>
              <Ionicons
                name={secureConfirm ? 'eye-off' : 'eye'}
                size={20}
                color="#666"
              />
            </Pressable>
          </View>
        </View>

        <Pressable
          style={styles.saveButton}
          onPress={handleSaveChanges}
          disabled={loading}>
          <Text style={styles.saveButtonText}>
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  scroll: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontWeight: '500',
    marginBottom: 5,
    fontSize: 16,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#6a23de',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
