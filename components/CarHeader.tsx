import { useState } from 'react';
import { View, StyleSheet, Pressable, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AddCarModal from './modals/AddCarModal';
import FilterModal from './modals/FilterModal';
import SearchBar from './SearchBar';

export default function CarHeader({ onAddSuccess, onApplyFilters }: { onAddSuccess: () => void, onApplyFilters: (filters: Record<string, string | boolean>) => void }) {
  const [isAddVisible, setAddVisible] = useState(false);
  const [isFilterVisible, setFilterVisible] = useState(false);

  return (
    <View style={styles.wrapper}>
      <View style={styles.topRow}>
        <SearchBar onFilterPress={() => setFilterVisible(true)} />
        <Pressable onPress={() => setAddVisible(true)}>
          <Ionicons name="add-circle-outline" size={30} color="#1e88e5" />
        </Pressable>
      </View>

      <AddCarModal visible={isAddVisible} onClose={() => setAddVisible(false)} onSuccess={() => {
          setAddVisible(false);
          onAddSuccess(); // Notify parent to re-fetch
        }}/>
      <FilterModal visible={isFilterVisible} onClose={() => setFilterVisible(false)} onApply={onApplyFilters}/>
    </View>
  );
}

const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  wrapper: {
    padding: 0,
    marginBottom: screenHeight * 0.05
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between"
  },
});
