import { View, StyleSheet, FlatList, Text } from 'react-native';
import CarTable from '@/components/CarList';
import CarHeader from '@/components/CarHeader';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function HomeScreen() {

  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [refresh, setRefresh] = useState(false); // used to re-trigger fetching

  const user = useSelector((state: RootState) => state.user);

  const fetchCars = async () => {
    try {
      if(user.id) {
        const res = await axios.get(`https://car-app-backend-1o4y.onrender.com/cars/user/${user.id}`);
        setCars(res.data);
        setFilteredCars(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [refresh, user]); // re-fetch cars when `refresh` changes


  const handleApplyFilters = (filters: Record<string, string | boolean>) => {
    const filtered = cars.filter((car: any) => {
      for (const [key, value] of Object.entries(filters)) {
        if (key === 'insuredOnly' && value && !car.insured) return false;
        if (typeof value === 'string' && value && !car[key.toLowerCase()]?.toString().includes(value)) return false;
      }
      return true;
    });
    setFilteredCars(filtered);
  };

  return (
    <View style={styles.container}>
      <CarHeader onAddSuccess={() => setRefresh(prev => !prev)} onApplyFilters={handleApplyFilters}/>
      <Text style={styles.header}>Налични автомобили</Text>
      <CarTable cars={filteredCars} onCarDeleted={() => setRefresh(prev => !prev)}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});
