import { Modal, View, Text, Switch, Button, StyleSheet } from 'react-native';
import { useState } from 'react';

export default function FilterModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [insuredOnly, setInsuredOnly] = useState(false);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modal}>
        <Text style={styles.title}>Filter Options</Text>
        <View style={styles.row}>
          <Text>Insured Only</Text>
          <Switch value={insuredOnly} onValueChange={setInsuredOnly} />
        </View>
        <Button title="Apply" onPress={onClose} />
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
    fontSize: 18,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});
