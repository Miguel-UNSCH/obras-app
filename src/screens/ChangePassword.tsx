import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
// Ejemplo con IonIcons (instala: npm i react-native-vector-icons)
// O usa cualquier otra librería de íconos que prefieras
import Ionicons from 'react-native-vector-icons/Ionicons';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [secureCurrent, setSecureCurrent] = useState(true);

  const [newPassword, setNewPassword] = useState('');
  const [secureNew, setSecureNew] = useState(true);

  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureConfirm, setSecureConfirm] = useState(true);

  const handleSaveChanges = () => {
    // Aquí podrías validar contraseñas, conectarte a tu backend, etc.
    console.log('Cambios guardados');
    console.log('Contraseña actual:', currentPassword);
    console.log('Nueva contraseña:', newPassword);
    console.log('Confirmación:', confirmPassword);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Cambiar Contraseña</Text>

        {/* Contraseña actual */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contraseña actual</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={styles.input}
              onChangeText={setCurrentPassword}
              value={currentPassword}
              secureTextEntry={secureCurrent}
              placeholder="Ingresa tu contraseña actual"
            />
            <Pressable
              style={styles.eyeIcon}
              onPress={() => setSecureCurrent(!secureCurrent)}>
              <Ionicons
                name={secureCurrent ? 'eye-off' : 'eye'}
                size={20}
                color="#666"
              />
            </Pressable>
          </View>
        </View>

        {/* Nueva contraseña */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nueva contraseña</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={styles.input}
              onChangeText={setNewPassword}
              value={newPassword}
              secureTextEntry={secureNew}
              placeholder="Ingresa la nueva contraseña"
            />
            <Pressable
              style={styles.eyeIcon}
              onPress={() => setSecureNew(!secureNew)}>
              <Ionicons
                name={secureNew ? 'eye-off' : 'eye'}
                size={20}
                color="#666"
              />
            </Pressable>
          </View>
        </View>

        {/* Confirmar nueva contraseña */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirmar nueva contraseña</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={styles.input}
              onChangeText={setConfirmPassword}
              value={confirmPassword}
              secureTextEntry={secureConfirm}
              placeholder="Confirma la nueva contraseña"
            />
            <Pressable
              style={styles.eyeIcon}
              onPress={() => setSecureConfirm(!secureConfirm)}>
              <Ionicons
                name={secureConfirm ? 'eye-off' : 'eye'}
                size={20}
                color="#666"
              />
            </Pressable>
          </View>
        </View>

        <Pressable style={styles.saveButton} onPress={handleSaveChanges}>
          <Text style={styles.saveButtonText}>Guardar cambios</Text>
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
  },
  input: {
    flex: 1,
    padding: 10,
  },
  eyeIcon: {
    paddingHorizontal: 10,
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
