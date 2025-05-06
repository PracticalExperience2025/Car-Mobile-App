import { View, StyleSheet, FlatList, Text } from 'react-native';
import CarTable from '@/components/CarList';
import CarHeader from '@/components/CarHeader';
import { useState, useEffect } from 'react';
import axios from 'axios';

const carS = [
  {
    id: '1',
    brand: 'BMW',
    model: 'X6',
    license: 'CA1234AB',
    vignetteDate: '2025-01-01',
    registrationDate: '2023-03-01',
    insuranceDate: '2024-06-01',
    inspectionDate: '2024-12-01',
    images: ['https://hips.hearstapps.com/hmg-prod/images/2024-bmw-x6-112-1675791922.jpg'],
  },
];


export default function HomeScreen() {

  const [cars, setCars] = useState([]);
  const [refresh, setRefresh] = useState(false); // used to re-trigger fetching

  const fetchCars = async () => {
    try {
      const res = await axios.get('http://localhost:3001/cars');
      setCars(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [refresh]); // re-fetch cars when `refresh` changes

  return (
    <View style={styles.container}>
      <CarHeader onAddSuccess={() => setRefresh(prev => !prev)} />
      <Text style={styles.header}>Available Cars</Text>
      <CarTable cars={cars} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});
