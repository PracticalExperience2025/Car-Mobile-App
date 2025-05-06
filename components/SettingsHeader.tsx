import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Settings</Text>
      <Pressable onPress={() => alert('Calendar sync coming soon')}>
        <Ionicons name="calendar-outline" size={24} color="#1e88e5" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 15,
    backgroundColor: '#f1f3f4',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
  },
});
