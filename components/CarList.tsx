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
import { useState } from 'react';
import CarDetailsModal from './modals/CardDetailsModal';

export default function CarTable({ cars }: { cars: any[] }) {
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedCar, setSelectedCar] = useState<any>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  const openCarousel = (images: string[]) => {
    setSelectedImages(images);
    setImageModalVisible(true);
  };

  const openDetails = (car: any) => {
    setSelectedCar(car);
    setDetailsModalVisible(true);
  };

  const columns = [
    'Brand',
    'Model',
    'License',
    'Vignette',
    'Registration',
    'Insurance',
    'Inspection',
    'Photos',
    'Details',
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
      <Pressable onPress={() => openCarousel(item.images)}>
        <Text style={[styles.cell, styles.link]}>View</Text>
      </Pressable>
      <Pressable onPress={() => openDetails(item)}>
        <Text style={[styles.cell, styles.link]}>Details</Text>
      </Pressable>
    </View>
  );

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
          {cars.map((item) => (
            <View key={item.id.toString()} style={styles.row}>
              <Text style={styles.cell}>{item.brand}</Text>
              <Text style={styles.cell}>{item.model}</Text>
              <Text style={styles.cell}>{item.license}</Text>
              <Text style={styles.cell}>{item.vignetteDate}</Text>
              <Text style={styles.cell}>{item.registrationDate}</Text>
              <Text style={styles.cell}>{item.insuranceDate}</Text>
              <Text style={styles.cell}>{item.inspectionDate}</Text>
              <Pressable onPress={() => openCarousel(item.images)}>
                <Text style={[styles.cell, styles.link]}>View</Text>
              </Pressable>
              <Pressable onPress={() => openDetails(item)}>
                <Text style={[styles.cell, styles.link]}>Details</Text>
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
    width: 120,
    padding: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  cell: {
    width: 120,
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
});
