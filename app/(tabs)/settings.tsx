import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, Button, TextInput, Alert, Pressable, Modal, FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { toggleNotifications, toggleEmailNotifications, setLanguage, logout } from '@/store/userSlice';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const dispatch = useDispatch();
  const { language, notificationsEnabled, emailNotificationsEnabled } = useSelector((state: RootState) => state.user);

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Грешка', 'Новите пароли не съвпадат');
      return;
    }

    try {
      const token = 'Bearer ' + (await AsyncStorage.getItem('token'));
      await axios.post(
        'https://car-app-backend-1o4y.onrender.com/auth/change-password',
        { oldPassword, newPassword },
        { headers: { Authorization: token } }
      );
      Alert.alert('Успех', 'Паролата е сменена успешно');
      setShowChangePassword(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      Alert.alert('Грешка', 'Неуспешна смяна на паролата');
      console.error(error);
    }
  };

  const languages = [
    { label: 'English', value: 'en' },
    { label: 'Български', value: 'bg' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Настройки</Text>

      {/* Language Selection */}
      <View style={styles.section}>
        <Text style={styles.label}>Език</Text>
        <Pressable style={styles.dropdown} onPress={() => setShowLanguageModal(true)}>
          <Text style={styles.dropdownText}>{language === 'bg' ? 'Български' : 'English'}</Text>
        </Pressable>

        <Modal visible={showLanguageModal} transparent animationType="slide">
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Изберете език</Text>
              <FlatList
                data={languages}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.modalItem}
                    onPress={() => {
                      dispatch(setLanguage(item.value));
                      setShowLanguageModal(false);
                    }}
                  >
                    <Text style={styles.modalItemText}>{item.label}</Text>
                  </Pressable>
                )}
              />
              <Button title="Затвори" onPress={() => setShowLanguageModal(false)} />
            </View>
          </View>
        </Modal>
      </View>

      {/* Notifications */}
      <View style={styles.section}>
        <Text style={styles.label}>Push Нотификации</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={() => dispatch(toggleNotifications())}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Email Нотификации</Text>
        <Switch
          value={emailNotificationsEnabled}
          onValueChange={() => dispatch(toggleEmailNotifications())}
        />
      </View>

      {/* Change Password */}
      <View style={styles.section}>
        <Button
          title={showChangePassword ? 'Отказ' : 'Смяна на паролата'}
          onPress={() => setShowChangePassword((prev) => !prev)}
          color="#1e88e5"
        />
        {showChangePassword && (
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Настояща парола"
              secureTextEntry
              value={oldPassword}
              onChangeText={setOldPassword}
              style={styles.input}
            />
            <TextInput
              placeholder="Нова парола"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              style={styles.input}
            />
            <TextInput
              placeholder="Потвърдете новата парола"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={styles.input}
            />
            <Button title="Запази" onPress={handleChangePassword} color="#4caf50" />
          </View>
        )}
      </View>

      {/* Logout */}
      <View style={styles.logoutSection}>
        <Button title="Изход" onPress={handleLogout} color="#d9534f" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    color: '#555',
  },
  dropdown: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dropdownText: {
    fontSize: 16,
  },
  passwordContainer: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    height: 40,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  logoutSection: {
    marginTop: 20,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 30,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  modalItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalItemText: {
    fontSize: 16,
  },
});
