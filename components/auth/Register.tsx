import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';

export default function RegisterScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const handleRegister = async () => {
      try {
        await axios.post('http://<IP>:3000/users/register', { email, password });
        Alert.alert('Success', 'Registered successfully!');
      } catch (e: any) {
        Alert.alert('Error', e.response?.data?.message || 'Unknown error');
      }
    };
  
    return (
      <View style={{ padding: 20 }}>
        <TextInput placeholder="Email" onChangeText={setEmail} />
        <TextInput placeholder="Password" onChangeText={setPassword} secureTextEntry />
        <Button title="Register" onPress={handleRegister} />
      </View>
    );
  }
  