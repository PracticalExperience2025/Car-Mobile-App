import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Modal, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import HomePage from '@/components/Home';
import { AppDispatch, RootState, store } from '@/store/store';
import { setUser } from '@/store/userSlice';
import i18n from '@/translations/i18n';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerVisible, setRegisterVisible] = useState(false);
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);

  const language = useSelector((state: RootState) => state.user.language);
  
  // useEffect used for managing user login session (checks if there is a saved token)
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const storedUser = await AsyncStorage.getItem('user');
  
        if (token && storedUser) {
          const user = JSON.parse(storedUser);
          dispatch(setUser(user));
        }
      } catch (error) {
        console.error('Error retrieving auth token:', error);
      }
    };
  
    checkAuthStatus();
  }, []);
  // i18n.locale = "bg";

  const login = async () => {
    try {
      const res = await axios.post('https://car-app-backend-1o4y.onrender.com/auth/login', { email, password });
      await AsyncStorage.setItem('token', res.data.access_token);
      await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
      dispatch(setUser(res.data.user));
      router.replace('/');
    } catch (err) {
      Alert.alert('Login Failed', 'Invalid credentials');
    }
  };

  const register = async () => {
    try {
      await axios.post('https://car-app-backend-1o4y.onrender.com/users/register', { email: registerEmail, password: registerPassword });
      Alert.alert('Registration Successful', 'You can now log in.');
      setRegisterVisible(false);
    } catch (err) {
      Alert.alert('Registration Failed', 'Please try again.');
    }
  };

  if(user.id) return <HomePage/>

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Вход в системата</Text>
      <TextInput style={styles.input} placeholder="Email" onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Парола" secureTextEntry onChangeText={setPassword} />
      <Button title="Вход" onPress={login} />
      <TouchableOpacity onPress={() => setRegisterVisible(true)}>
        <Text style={styles.registerLink}>Нямате акаунт? Регистрирайте се</Text>
      </TouchableOpacity>

      <Modal visible={registerVisible} animationType="slide" onRequestClose={() => setRegisterVisible(false)}>
        <View style={styles.modal}>
          <Text style={styles.title}>Регистрация</Text>
          <TextInput style={styles.input} placeholder="Email" onChangeText={setRegisterEmail} />
          <TextInput style={styles.input} placeholder="Парола" secureTextEntry onChangeText={setRegisterPassword} />
          <Button title="Регистрация" onPress={register} />
          <Button title="Отказ" onPress={() => setRegisterVisible(false)} />
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
