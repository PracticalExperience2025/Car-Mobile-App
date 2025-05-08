import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import CarCard from './cards/CarCard';

export default function HomePage() {
  const [cars, setCars] = useState<any[]>([]);
  const [lastAdded, setLastAdded] = useState<any>(null);
  const [soonestAction, setSoonestAction] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const res = await axios.get('https://car-app-backend-1o4y.onrender.com/cars');
      const carList = res.data;
      setCars(carList);
      findImportantCars(carList);
    } catch (err) {
      console.error('Error fetching cars:', err);
    } finally {
      setLoading(false);
    }
  };

  const findImportantCars = (carList: any[]) => {
    if (carList.length === 0) return;

    // Last added car (assuming cars are sorted by ID)
    const lastAddedCar = carList[carList.length - 1];
    setLastAdded(lastAddedCar);

    // Finding the car that needs action the soonest
    const soonestCar = carList.reduce((soonest, car) => {
      const dates = [
        car.vignetteDate,
        car.registrationDate,
        car.insuranceDate,
        car.inspectionDate,
      ].filter(Boolean).map((date) => new Date(date).getTime());

      const minDate = Math.min(...dates);

      if (!soonest || minDate < soonest.date) {
        return { car, date: minDate };
      }

      return soonest;
    }, null);

    setSoonestAction(soonestCar?.car);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e88e5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Начална страница</Text>

      {lastAdded && (
        <>
          <Text style={styles.subtitle}>Последно добавена кола</Text>
          <CarCard car={lastAdded} />
        </>
      )}

      {soonestAction && (
        <>
          <Text style={styles.subtitle}>Най-скоро изискваща действие</Text>
          <CarCard car={soonestAction} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
