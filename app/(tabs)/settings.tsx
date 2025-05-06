import { View, Text, StyleSheet } from 'react-native';
import SettingsHeader from '@/components/SettingsHeader';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <SettingsHeader/>
      <Text style={styles.title}>Settings</Text>
      <Text>• Change password</Text>
      <Text>• Toggle notifications</Text>
      <Text>• Sync calendar</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});
