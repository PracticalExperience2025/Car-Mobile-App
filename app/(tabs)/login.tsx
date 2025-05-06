import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Modal, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerVisible, setRegisterVisible] = useState(false);
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const login = async () => {
    try {
      const res = await axios.post('http://localhost:3001/auth/login', { email, password });
      await AsyncStorage.setItem('token', res.data.access_token);
      router.replace('/');
    } catch (err) {
      Alert.alert('Login Failed', 'Invalid credentials');
    }
  };

  const register = async () => {
    try {
      await axios.post('http://localhost:3001/users/register', { email: registerEmail, password: registerPassword });
      Alert.alert('Registration Successful', 'You can now log in.');
      setRegisterVisible(false);
    } catch (err) {
      Alert.alert('Registration Failed', 'Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Staff Login</Text>
      <TextInput style={styles.input} placeholder="Email" onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry onChangeText={setPassword} />
      <Button title="Login" onPress={login} />
      <TouchableOpacity onPress={() => setRegisterVisible(true)}>
        <Text style={styles.registerLink}>Don't have an account? Register</Text>
      </TouchableOpacity>

      <Modal visible={registerVisible} animationType="slide" onRequestClose={() => setRegisterVisible(false)}>
        <View style={styles.modal}>
          <Text style={styles.title}>Register</Text>
          <TextInput style={styles.input} placeholder="Email" onChangeText={setRegisterEmail} />
          <TextInput style={styles.input} placeholder="Password" secureTextEntry onChangeText={setRegisterPassword} />
          <Button title="Register" onPress={register} />
          <Button title="Cancel" onPress={() => setRegisterVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginVertical: 10, borderRadius: 5 },
  registerLink: { color: 'blue', marginTop: 10, textAlign: 'center' },
  modal: { flex: 1, justifyContent: 'center', padding: 20 },
});
