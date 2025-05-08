import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function CarCard({ car }: { car: any }) {
  return (
    <View style={styles.card}>
      {car.images && car.images.length > 0 ? (
        <Image source={{ uri: car.images[0] }} style={styles.image} />
      ) : (
        <View style={styles.noImage}>
          <Text style={styles.noImageText}>Няма изображение</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.model}>{car.model}</Text>
        <Text style={styles.license}>{car.license}</Text>
        <Text style={styles.extra}>Добавена на: {car.createdAt.split('T')[0]}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 6,
    marginVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  image: {
    width: 120,
    height: 120,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  noImage: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  noImageText: {
    color: '#555',
    fontSize: 14,
  },
  info: {
    padding: 15,
    flex: 1,
  },
  model: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  license: {
    fontSize: 18,
    color: '#555',
    marginVertical: 6,
  },
  extra: {
    fontSize: 16,
    color: '#777',
  },
});
