import React, { useState, useEffect } from 'react'; 
import { View, FlatList, Text, TextInput, StyleSheet, Modal, TouchableOpacity, Dimensions, Image } from 'react-native';
import PetCard from '../../components/PetCard';
import petData from '../../pets.json';
import Toast from 'react-native-toast-message';

const AvailablePets = () => {
  interface Pet {
    id: number;
    name: string;
    status: string;
    image: string;
    age: string;
    breed: string;
    description: string;
  }

  const [pets, setPets] = useState<Pet[]>([]);
  const [filteredPets, setFilteredPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  useEffect(() => {
    setPets(petData);
    setFilteredPets(petData);
  }, []);

  const searchFilter = (text: string) => {
    const filtered = pets.filter((pet) =>
      pet.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredPets(filtered);
  };

  const handleCardPress = (pet: Pet) => {
    setSelectedPet(pet);
  };

  const closeModal = () => {
    setSelectedPet(null);
  };

  const { width } = Dimensions.get('window');
  const numColumns = Math.floor(width / 180);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Available Pets for Adoption</Text>
      <TextInput
        style={styles.searchBox}
        placeholder="Search Pets..."
        onChangeText={searchFilter}
      />
      <FlatList
        data={filteredPets}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleCardPress(item)}>
            <PetCard pet={item} />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.flatListContent}
      />

      {/* Modal for Pet Details */}
      <Modal
        visible={!!selectedPet}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedPet && (
              <View style={styles.modalRow}>
                <Image source={{ uri: selectedPet.image }} style={styles.modalImage} />
                <View style={styles.modalTextContainer}>
                  <Text style={styles.modalTitle}>{selectedPet.name}</Text>
                  <Text style={styles.modalText}>Status: {selectedPet.status}</Text>
                  <Text style={styles.modalText}>Age: {selectedPet.age}</Text>
                  <Text style={styles.modalText}>Breed: {selectedPet.breed}</Text>
                  <Text style={styles.modalText}>{selectedPet.description}</Text>
                </View>
              </View>
            )}
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Toast Component for Notifications */}
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  searchBox: {
    marginBottom: 16,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    width: '90%',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  flatListContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    maxWidth: '80%',  // Limit width on larger screens
  },
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  modalTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginVertical: 3,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AvailablePets;
