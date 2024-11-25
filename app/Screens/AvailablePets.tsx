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
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTabBarVisibility } from '@/context/TabBarContext';

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
}

interface Owner {
  name: string;
}

export default function AvailablePets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [filteredPets, setFilteredPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [selectedPetOwner, setSelectedPetOwner] = useState<Owner | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const { userId } = useTabBarVisibility();

  // Fetch available pets from API
  const fetchAvailablePets = async () => {
    try {
      const response = await fetch(
        'https://pawsibilities-api.onrender.com/api/pets',
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

  // Fetch owner's name by owner ID
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

  useEffect(() => {
    setLoading(true);
    fetchAvailablePets();
  }, []);

  const handleCardPress = (pet: Pet) => {
    setSelectedPet(pet);
    fetchOwnerDetails(pet.owner); // Fetch the owner's name
  };

  const closeModal = () => {
    setSelectedPet(null);
    setSelectedPetOwner(null);
  };

  // Toggle favorite status
  const toggleFavorite = (petId: string) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(petId)
        ? prevFavorites.filter((id) => id !== petId)
        : [...prevFavorites, petId],
    );
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
        }
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

  // Filter pets based on search text
  useEffect(() => {
    if (searchText) {
      const filtered = pets.filter(
        (pet) =>
          pet.breed.toLowerCase().includes(searchText.toLowerCase()) ||
          pet.species.toLowerCase().includes(searchText.toLowerCase()),
      );
      setFilteredPets(filtered);
    } else {
      setFilteredPets(pets);
    }
  }, [searchText, pets]);

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
                onPress={() => handleInterest(selectedPet._id, userId as string | null)}
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
    width: '80%',
    maxWidth: '90%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
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
});
