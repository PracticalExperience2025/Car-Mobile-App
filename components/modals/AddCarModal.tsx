// AddCarModal.tsx
import { useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet, Platform, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';

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
      await axios.post('http://localhost:3001/cars', {
        brand, model, license,
        vignetteDate, registrationDate, insuranceDate, inspectionDate,
        images
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
        <Text style={styles.title}>Add New Car</Text>
        <TextInput placeholder="Brand" style={styles.input} onChangeText={setBrand} />
        <TextInput placeholder="Model" style={styles.input} onChangeText={setModel} />
        <TextInput placeholder="License" style={styles.input} onChangeText={setLicense} />

        {[
          { label: 'Vignette Date', value: vignetteDate, key: 'vignette' },
          { label: 'Registration Date', value: registrationDate, key: 'registration' },
          { label: 'Insurance Date', value: insuranceDate, key: 'insurance' },
          { label: 'Inspection Date', value: inspectionDate, key: 'inspection' },
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

        <Button title="Save" onPress={addCar} />
        <Button title="Cancel" onPress={onClose} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: { flex: 1, padding: 20, backgroundColor: '#fff', justifyContent: 'center' },
  title: { fontSize: 20, marginBottom: 20 },
  input: { borderBottomWidth: 1, marginBottom: 15, padding: 8 },
  dateField: { paddingVertical: 10, borderBottomWidth: 1, marginBottom: 10 },
});
