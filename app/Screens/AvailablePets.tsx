/**
 * Available Pets Screen for Pet Adopters to view pets available for adoption and express interest in them.
 */

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useTabBarVisibility } from '@/context/TabBarContext';

// Define the Pet and Owner interfaces
interface Pet {
  _id: string;
  imageUrl: string;
  name: string;
  breed: string;
  species: string;
  age: string;
  gender: string;
  size: string;
  color: string;
  description: string;
  available: boolean;
  owner: string; // Owner ID
  interestedAdopters: string[]; // Interested Adopters;
  isFavorite: boolean;
}

interface Owner {
  name: string;
}

// Define the AvailablePets component
export default function AvailablePets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [filteredPets, setFilteredPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [selectedPetOwner, setSelectedPetOwner] = useState<Owner | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const { userId } = useTabBarVisibility();
  const [filters, setFilters] = useState({
    gender: '', // Initially, no gender filter is applied
    color: '', // Initially, no color filter is applied
  });
  const resetFilters = () => {
    setSearchText(''); // Clear search
    setFilters({
      gender: '', // Reset gender filter
      color: '', // Reset color filter
    });
  };

  // Fetch available pets from API and set the state
  const fetchAvailablePets = async () => {
    try {
      const response = await fetch(
        `https://pawsibilities-api.onrender.com/api/pets`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      const petsData = await response.json();
      setPets(petsData);
      setFilteredPets(petsData);
      console.log('Fetched pets:', petsData);
    } catch (error) {
      console.error('Error fetching available pets:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch owner's name by owner ID and set the state
  const fetchOwnerDetails = async (ownerId: string) => {
    try {
      const response = await fetch(
        `https://pawsibilities-api.onrender.com/api/user/${ownerId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        },
      );
      const ownerData = await response.json();
      setSelectedPetOwner({ name: ownerData.username });
      console.log('Fetched owner details:', ownerData);
    } catch (error) {
      console.error('Error fetching owner details:', error);
    }
  };

  // Fetch available pets and owner details on component mount
  useEffect(() => {
    setLoading(true);
    fetchAvailablePets();
  }, []);

  // Handle card press to show pet details and owner name
  const handleCardPress = (pet: Pet) => {
    setSelectedPet(pet);
    fetchOwnerDetails(pet.owner); // Fetch the owner's name
  };

  // Close the modal
  const closeModal = () => {
    setSelectedPet(null);
    setSelectedPetOwner(null);
  };

  // Add pet to favorite list and update the backend
  const toggleFavorite = async (petId: string) => {
    if (!userId) {
      alert('User not logged in!');
      return;
    }

    const updatedFavorites = favorites.includes(petId)
      ? favorites.filter((id) => id !== petId)
      : [...favorites, petId];

    setFavorites(updatedFavorites); // Update local state immediately

    try {
      const response = await fetch(
        `https://pawsibilities-api.onrender.com/api/pet/${petId}/favorite`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to update favorites');
      }

      const data = await response.json();
      console.log('Favorite status updated on backend:', data);
      Alert.alert('Success', 'Favorite status updated successfully');
    } catch (error) {
      console.error('Error updating favorite status:', error);
      console.log(`${petId} and ${userId}`);
      setFavorites(favorites); // Revert local state if the backend fails
    }
  };

  // Handle Interest in Pet
  const handleInterest = async (petId: string, paramUserId: string | null) => {
    const userId = paramUserId;

    try {
      const response = await fetch(
        `https://pawsibilities-api.onrender.com/api/pet/${petId}/interest`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
        console.error('Error adding interest:', errorData);
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
      console.error('Error adding interest:', error);
    }
  };

  // Filter pets based on search text and filters
  useEffect(() => {
    let filtered = pets;

    if (searchText) {
      filtered = filtered.filter(
        (pet) =>
          pet.breed.toLowerCase().includes(searchText.toLowerCase()) ||
          pet.species.toLowerCase().includes(searchText.toLowerCase()),
      );
    }

    if (filters.gender) {
      filtered = filtered.filter((pet) =>
        pet.gender.toLowerCase().match(filters.gender.toLowerCase()),
      );
    }

    if (filters.color) {
      filtered = filtered.filter((pet) =>
        pet.color.toLowerCase().match(filters.color.toLowerCase()),
      );
    }

    console.log('Filtered pets:', filtered); // Check the filtered pets
    setFilteredPets(filtered);
  }, [searchText, pets, filters]);

  // Render each pet item in the FlatList
  const renderPetItem = ({ item }: { item: Pet }) => (
    <TouchableOpacity
      onPress={() => handleCardPress(item)}
      style={styles.petCard}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.petImage} />
      <View style={styles.petDetails}>
        <Text style={styles.petName}>{item.name}</Text>
        <Text style={styles.petInfo}>Breed: {item.breed}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text>Loading available pets...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Available Pets for Adoption</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBox}
        placeholder="Search by breed or species..."
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />

      {/* Filters: Gender, Color, Size in the same row */}
      <View style={styles.filteredrow}>
        <Picker
          selectedValue={filters.gender}
          style={styles.picker}
          onValueChange={(value) => {
            setFilters((prevFilters) => ({ ...prevFilters, gender: value }));
          }}
        >
          <Picker.Item label="All Genders" value="" />
          <Picker.Item label="Male" value="Male" />
          <Picker.Item label="Female" value="Female" />
        </Picker>

        <Picker
          selectedValue={filters.color}
          style={styles.picker}
          onValueChange={(value) => {
            setFilters({ ...filters, color: value });
          }}
        >
          <Picker.Item label="All Colors" value="" />
          <Picker.Item label="White" value="White" />
          <Picker.Item label="Black" value="Black" />
          <Picker.Item label="Brown" value="Brown" />
          <Picker.Item label="Gray" value="Gray" />
        </Picker>
      </View>
      {/* Reset Filters Button */}
      <TouchableOpacity onPress={resetFilters} style={styles.resetButton}>
        <Text style={styles.resetButtonText}>Reset Filters</Text>
      </TouchableOpacity>

      <FlatList
        data={filteredPets}
        renderItem={renderPetItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        numColumns={2} // Show two cards in a row
      />

      {/* Modal for Pet Details */}
      {selectedPet && (
        <Modal
          visible={!!selectedPet}
          transparent={true}
          animationType="slide"
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, { width: '90%' }]}>
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={() => toggleFavorite(selectedPet._id)}
              >
                <FontAwesome
                  name={
                    favorites.includes(selectedPet._id) ? 'heart' : 'heart-o'
                  }
                  size={24}
                  color={favorites.includes(selectedPet._id) ? 'red' : 'gray'}
                />
              </TouchableOpacity>
              <Image
                source={{ uri: selectedPet.imageUrl }}
                style={styles.modalImage}
              />
              <Text style={styles.modalTitle}>{selectedPet.name}</Text>
              <Text style={styles.modalText}>Breed: {selectedPet.breed}</Text>
              <Text style={styles.modalText}>
                Species: {selectedPet.species}
              </Text>
              <Text style={styles.modalText}>Age: {selectedPet.age}</Text>
              <Text style={styles.modalText}>Gender: {selectedPet.gender}</Text>
              <Text style={styles.modalText}>Size: {selectedPet.size}</Text>
              <Text style={styles.modalText}>Color: {selectedPet.color}</Text>
              <Text style={styles.modalText}>
                Description: {selectedPet.description}
              </Text>
              <Text style={styles.modalText}>
                Available for Adoption: {selectedPet.available ? 'Yes' : 'No'}
              </Text>
              <Text style={styles.modalText}>
                Owner: {selectedPetOwner ? selectedPetOwner.name : 'Loading...'}
              </Text>

              {/* "I'm Interested" Button */}
              <TouchableOpacity
                onPress={() =>
                  handleInterest(selectedPet._id, userId as string | null)
                }
                style={styles.interestButton}
              >
                <Text style={styles.interestButtonText}>I'm Interested</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  searchBox: {
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  petCard: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
    margin: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  petImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  petDetails: {
    alignItems: 'center',
  },
  petName: {
    fontSize: 20,
    fontWeight: '600',
  },
  petInfo: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
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
    width: '90%', // Adjust to fit screen size better
    maxWidth: '100%',
  },

  favoriteButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
  },
  resetButton: {
    marginTop: 5,
    padding: 10,
    backgroundColor: '#f44336', // Red color for reset
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 24,
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
    backgroundColor: '#6200ee',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  interestButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#28a745',
    borderRadius: 5,
    alignItems: 'center',
  },
  interestButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  filteredrow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },
  picker: {
    height: 25,
    width: '48%',
    marginBottom: 0,
    borderRadius: 8, // Optional: add a border-radius for smoother edges
    backgroundColor: '#f1f1f1', // Optional: light background for picker
  },
<<<<<<< Updated upstream
=======
  filterButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 5,
  },
  filterButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
>>>>>>> Stashed changes
});
