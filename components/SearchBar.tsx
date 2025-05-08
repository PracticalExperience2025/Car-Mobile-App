import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SearchBar({ onFilterPress }: { onFilterPress: () => void }) {
  return (
    <View style={styles.container}>
      <TextInput placeholder="Търсене на коли..." style={styles.input} />
      <Pressable onPress={onFilterPress} style={styles.button}>
        <Ionicons name="options" size={20} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#1e88e5',
    padding: 10,
    marginLeft: 5,
    borderRadius: 8,
  },
});
