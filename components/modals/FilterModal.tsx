import { Modal, View, Text, Switch, Button, StyleSheet, TextInput, ScrollView } from 'react-native';
import { useState } from 'react';

const categories = [
  'Марка',
  'Модел',
  'Регистрационен номер',
  'Винетка',
  'Регистрация',
  'Застраховка',
  'Преглед',
];

export default function FilterModal({ visible, onClose, onApply }: { visible: boolean; onClose: () => void; onApply: (filters: Record<string, string | boolean>) => void }) {
  const [insuredOnly, setInsuredOnly] = useState(false);
  const [filters, setFilters] = useState<Record<string, string | boolean>>({});

  const handleInputChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApply({ ...filters, insuredOnly });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modal}>
        <Text style={styles.title}>Опции за филтриране</Text>
        <ScrollView contentContainerStyle={styles.scroll}>
          {categories.map((category) => (
            <View key={category} style={styles.row}>
              <Text style={styles.label}>{category}</Text>
              <TextInput
                style={styles.input}
                placeholder={`Въведи ${category}`}
                onChangeText={(value) => handleInputChange(category, value)}
              />
            </View>
          ))}
          <View style={styles.row}>
            <Text style={styles.label}>Само застраховани</Text>
            <Switch value={insuredOnly} onValueChange={setInsuredOnly} />
          </View>
        </ScrollView>
        <Button title="Запазавне" onPress={handleApply} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  scroll: {
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    flex: 1,
  },
  input: {
    flex: 2,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
});
