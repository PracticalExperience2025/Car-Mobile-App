import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Image,
  FlatList,
  Button,
  ScrollView,
} from 'react-native';
import { useState, useEffect } from 'react';
import CarDetailsModal from './modals/CardDetailsModal';
import { registerForPushNotificationsAsync } from '@/permissions/pushNotificationPermission';
import { immediateNotification, scheduleNotification } from '@/permissions/scheduleNotifications';
import axios from 'axios';
import { Alert } from 'react-native';

export default function CarTable({ cars, onCarDeleted }: { cars: Array<any>, onCarDeleted: () => void }) {
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedCar, setSelectedCar] = useState<any>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  useEffect(() => {
    const setupNotifications = async () => {
      await registerForPushNotificationsAsync();

      const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

      console.log(today);
      cars.forEach((car) => {
        const dates = [
          { label: 'Винетка', date: car.vignetteDate },
          { label: 'Регистрация', date: car.registrationDate },
          { label: 'Застраховка', date: car.insuranceDate },
          { label: 'Преглед', date: car.inspectionDate },
        ];

        dates.forEach(async ({ label, date }) => {
          if (date.split('T')[0] === today) {
            console.log("TODAY-TODAY-TODAY");
            await scheduleNotification(
              new Date(),
              `Днес изтича: ${label}`,
              `${car.brand} ${car.model} - ${car.license}`
            );
            await immediateNotification(
              `Днес изтича: ${label}`,
              `${car.brand} ${car.model} - ${car.license}`
            )
          } else {
            const notificationDate = new Date(date);
            if (notificationDate > new Date()) {
              await scheduleNotification(
                notificationDate,
                `Изтича скоро: ${label}`,
                `${car.brand} ${car.model} - ${car.license}`
              );
            }
          }
        });
      });
    };

    setupNotifications();
  }, [cars]);

  const openCarousel = (images: string[]) => {
    setSelectedImages(images);
    setImageModalVisible(true);
  };

  const openDetails = (car: any) => {
    setSelectedCar(car);
    setDetailsModalVisible(true);
  };

  const columns = [
    'Марка',
    'Модел',
    'Регистрационен номер',
    'Винетка',
    'Регистрация',
    'Застраховка',
    'Преглед',
    'Подробности',
    'Изтриване'
  ];

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.brand}</Text>
      <Text style={styles.cell}>{item.model}</Text>
      <Text style={styles.cell}>{item.license}</Text>
      <Text style={styles.cell}>{item.vignetteDate}</Text>
      <Text style={styles.cell}>{item.registrationDate}</Text>
      <Text style={styles.cell}>{item.insuranceDate}</Text>
      <Text style={styles.cell}>{item.inspectionDate}</Text>
      <Pressable onPress={() => openDetails(item)}>
        <Text style={[styles.cell, styles.link]}>Details</Text>
      </Pressable>
    </View>
  );

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`https://car-app-backend-1o4y.onrender.com/cars/${id}`);
      Alert.alert("Успех", "Автомобилът беше успешно изтрит!");
      onCarDeleted(); // Refresh the car list
    } catch (err) {
      Alert.alert("Грешка", "Неуспешно изтриване на автомобила.");
      console.error("Delete error:", err);
    }
  };

  const confirmDelete = (id: string) => {
    Alert.alert(
      "Потвърждение",
      "Сигурни ли сте, че искате да изтриете този автомобил?",
      [
        { text: "Отказ", style: "cancel" },
        { text: "Изтрий", style: "destructive", onPress: () => handleDelete(id) },
      ]
    );
  };

  return (
    <>
      <ScrollView horizontal>
        <View>
          {/* Table Header */}
          <View style={styles.rowHeader}>
            {columns.map((col) => (
              <Text key={col} style={styles.cellHeader}>
                {col}
              </Text>
            ))}
          </View>

          {/* Table Rows */}
          {cars?.map((item) => (
            <View key={item.id.toString()} style={styles.row}>
              <Text style={styles.cell}>{item.brand}</Text>
              <Text style={styles.cell}>{item.model}</Text>
              <Text style={styles.cell}>{item.license}</Text>
              <Text style={styles.cell}>{item.vignetteDate.split('T')[0]}</Text>
              <Text style={styles.cell}>{item.registrationDate.split('T')[0]}</Text>
              <Text style={styles.cell}>{item.insuranceDate.split('T')[0]}</Text>
              <Text style={styles.cell}>{item.inspectionDate.split('T')[0]}</Text>
              <Pressable onPress={() => openDetails(item)}>
                <Text style={[styles.cell, styles.link]}>Детайли</Text>
              </Pressable>
                            {/* Delete Button */}
              <Pressable onPress={() => confirmDelete(item.id)}>
                <Text style={[styles.cell, styles.delete]}>Изтриване</Text>
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Image Modal */}
      <Modal visible={imageModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <FlatList
            horizontal
            pagingEnabled
            data={selectedImages}
            keyExtractor={(item, index) => `${item}-${index}`}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={styles.image}
                resizeMode="contain"
              />
            )}
          />
          <Button title="Close" onPress={() => setImageModalVisible(false)} />
        </View>
      </Modal>

      {/* Car Details Modal */}
      <CarDetailsModal
        visible={detailsModalVisible}
        onClose={() => setDetailsModalVisible(false)}
        car={selectedCar}
      />
    </>
  );
}

const styles = StyleSheet.create({
  rowHeader: {
    flexDirection: 'row',
    backgroundColor: '#1e88e5',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cellHeader: {
    width: 175,
    padding: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  cell: {
    width: 175,
    padding: 10,
  },
  link: {
    color: '#1e88e5',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '80%',
    alignSelf: 'center',
  },
  delete: {
    color: '#e53935',
    fontWeight: '600',
  },
});
