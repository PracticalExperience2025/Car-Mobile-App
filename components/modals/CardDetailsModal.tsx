// CarDetailsModal.tsx
import { Modal, View, Text, StyleSheet, Button, Image, ScrollView } from 'react-native';

export default function CarDetailsModal({ visible, onClose, car }: any) {
  if (!car) return null;

  return (
    <Modal visible={visible} animationType="slide">
      <ScrollView contentContainerStyle={styles.modalContent}>
        <Text style={styles.title}>{car.brand} {car.model}</Text>
        <Text style={styles.field}>Регистрационен номер: {car.license}</Text>
        <Text style={styles.field}>Винетка: {car.vignetteDate}</Text>
        <Text style={styles.field}>Регистрация: {car.registrationDate}</Text>
        <Text style={styles.field}>Застраховка: {car.insuranceDate}</Text>
        <Text style={styles.field}>Технически преглед: {car.inspectionDate}</Text>
        <Text style={styles.field}>Снимки: </Text>
        {car.images?.map((img: string, idx: number) => (
          <Image key={idx} source={{ uri: img }} style={styles.image} />
        ))}
        <Button title="Затваряне" onPress={onClose} />
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContent: { padding: 20 },
  title: { fontSize: 22, marginBottom: 10 },
  field: { marginVertical: 5 },
  image: { width: '100%', height: 200, marginVertical: 10 },
});
