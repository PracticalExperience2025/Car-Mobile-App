import { useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet, Platform, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';
import RNBlobUtil from 'react-native-blob-util';
import userSlice from '@/store/userSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function AddCarModal({ visible, onClose, onSuccess }: any) {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [license, setLicense] = useState('');
  const [vignetteDate, setVignetteDate] = useState<Date>(new Date());
  const [registrationDate, setRegistrationDate] = useState<Date>(new Date());
  const [insuranceDate, setInsuranceDate] = useState<Date>(new Date());
  const [inspectionDate, setInspectionDate] = useState<Date>(new Date());
  const [images, setImages] = useState<Array<string>>([]);

  const [datePickerVisible, setDatePickerVisible] = useState({ field: '', visible: false });

  const showDatePicker = (field: string) => {
    setDatePickerVisible({ field, visible: true });
  };

  const user = useSelector((state: RootState) => state.user);

  const clearData = () => {
    setBrand('');
    setModel('');
    setLicense('');
    setVignetteDate(new Date())
  }

  const pickImage = Platform.OS === 'web' ? (async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
      base64: true,  // Ensure base64 is returned
    });
  
    if (!result.canceled) {
      const base64 = result.assets[0].base64;
      console.log('Base64:', base64);
  
      const file = base64ToFile(base64!, 'image.jpg', 'image/jpeg');
      await uploadImageWeb(file);  // Pass the file here
    }
  }) : async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 1,
      });
  
      if (!result.canceled) {
        const uri = result.assets[0].uri;
        console.log('Selected Image URI:', uri);
        await uploadImage(uri);  // Pass the URI directly
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };
  
  
  // Convert base64 string to a File object
  const base64ToFile = (base64: string, filename: string, mimeType: string) => {
    const byteCharacters = atob(base64);
    const byteArrays = [];
  
    console.log("FIRST CYCLE: "+byteCharacters.length);
    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);
      const byteNumbers = new Array(slice.length);
  
      console.log("SECOND CYCLE: "+slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
  
    const blob = new Blob(byteArrays, { type: mimeType });
    const file = new File([blob], filename, { type: mimeType });
    console.log("Returning file: "+JSON.stringify(file));
    return file;
  };
  
  const uploadImage = async (uri: string) => {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      } as any);  // Append the file here
  
      const response = await fetch(
        'https://car-app-backend-1o4y.onrender.com/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      );
  
      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Image uploaded successfully:', data.imageUrl);
      setImages((prev) => [...prev, data.imageUrl]);
    } catch (err: any) {
      console.error('Image upload failed (Fetch):', err.message);
    }
  };
  
  const uploadImageWeb = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('image', file);  // Append the file here
  
      const response = await fetch(
        'https://car-app-backend-1o4y.onrender.com/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      );
  
      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Image uploaded successfully:', data.imageUrl);
      setImages((prev) => [...prev, data.imageUrl]);
    } catch (err: any) {
      console.error('Image upload failed (Fetch):', err.message);
    }
  };
  
  
  
  
  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (!selectedDate) {
      setDatePickerVisible({ field: '', visible: false });
      return;
    }

    switch (datePickerVisible.field) {
      case 'vignette':
        setVignetteDate(selectedDate);
        break;
      case 'registration':
        setRegistrationDate(selectedDate);
        break;
      case 'insurance':
        setInsuranceDate(selectedDate);
        break;
      case 'inspection':
        setInspectionDate(selectedDate);
        break;
    }
    setDatePickerVisible({ field: '', visible: false });
  };

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  const addCar = async () => {
    try {
      await axios.post('https://car-app-backend-1o4y.onrender.com/cars', {
        brand, model, license,
        vignetteDate, registrationDate, insuranceDate, inspectionDate,
        images, ownerId: user.id
      });
      onClose();
      onSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modal}>
        <Text style={styles.title}>Добавяне на нов автомобил</Text>
        <TextInput placeholder="Марка" style={styles.input} onChangeText={setBrand} />
        <TextInput placeholder="Модел" style={styles.input} onChangeText={setModel} />
        <TextInput placeholder="Регистрационен номер" style={styles.input} onChangeText={setLicense} />

        {[
          { label: 'Винетка', value: vignetteDate, key: 'vignette' },
          { label: 'Регистрация', value: registrationDate, key: 'registration' },
          { label: 'Застраховка', value: insuranceDate, key: 'insurance' },
          { label: 'Преглед', value: inspectionDate, key: 'inspection' },
        ].map(({ label, value, key }) => (
          <Pressable key={key} onPress={() => showDatePicker(key)} style={styles.dateField}>
            <Text>{label}: {formatDate(value)}</Text>
          </Pressable>
        ))}

        {datePickerVisible.visible && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
          />
        )}

        <Button title="Изберете изображение" onPress={pickImage} />

        {images.map((imageUri, index) => (
          <Image key={index} source={{ uri: imageUri }} style={styles.image} />
        ))}

        <Button title="Запазване" onPress={addCar} />
        <Button title="Отказ" onPress={() => {onClose(); clearData();}}/>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: { flex: 1, padding: 20, backgroundColor: '#fff', justifyContent: 'center' },
  title: { fontSize: 20, marginBottom: 20 },
  input: { borderBottomWidth: 1, marginBottom: 15, padding: 8 },
  dateField: { paddingVertical: 10, borderBottomWidth: 1, marginBottom: 10 },
  image: { width: 100, height: 100, marginVertical: 10 },
});
