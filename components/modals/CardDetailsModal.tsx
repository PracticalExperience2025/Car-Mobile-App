// CarDetailsModal.tsx
import { Modal, View, Text, StyleSheet, Button, Image, ScrollView } from 'react-native';

export default function CarDetailsModal({ visible, onClose, car }: any) {
  if (!car) return null;

  return (
    <Modal visible={visible} animationType="slide">
      <ScrollView contentContainerStyle={styles.modalContent}>
        <Text style={styles.title}>{car.brand} {car.model}</Text>
        <Text style={styles.field}>License: {car.license}</Text>
        <Text style={styles.field}>Vignette Date: {car.vignetteDate}</Text>
        <Text style={styles.field}>Registration Date: {car.registrationDate}</Text>
        <Text style={styles.field}>Insurance Date: {car.insuranceDate}</Text>
        <Text style={styles.field}>Inspection Date: {car.inspectionDate}</Text>
        <Text style={styles.field}>Images:</Text>
        {car.images?.map((img: string, idx: number) => (
          <Image key={idx} source={{ uri: img }} style={styles.image} />
        ))}
        <Button title="Close" onPress={onClose} />
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
