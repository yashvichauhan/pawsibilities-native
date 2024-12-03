/**
 * Favorites Screen
 * Displays a list of favorite pets for the logged-in user
 * Fetches favorite pets from the API and displays them in a grid
 * Clicking on a pet card opens a modal with detailed pet information
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
  owner: {
    _id: string;
    username: string;
  };
  interestedAdopters: string[]; // Interested Adopters;
  isFavorite: boolean;
}

interface Owner {
  name: string;
}

export default function Favorites() {
  const [favoritePets, setFavoritePets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [selectedPetOwner, setSelectedPetOwner] = useState<Owner | null>(null);
  const { userId } = useTabBarVisibility();

  /**
   * Fetch favorite pets for the logged-in user
   * @returns list of favorite pets
   */
  const fetchFavoritePets = async () => {
    if (!userId) {
      alert('User not logged in!');
      return;
    }

    try {
      const response = await fetch(
        `https://pawsibilities-api.onrender.com/api/user/${userId}/favorites`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to fetch favorite pets');
      }

      const data = await response.json();
      console.log('Fetched favorite pets:', data);
      setFavoritePets(data); // Update state with favorite pets
    } catch (error) {
      console.error('Error fetching favorite pets:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch favorite pets on component mount
  useEffect(() => {
    setLoading(true);
    fetchFavoritePets();
  }, [userId]);

  // Handle card press event to display pet details
  const handleCardPress = (pet: Pet) => {
    setSelectedPet(pet);
  };

  //  Close the modal
  const closeModal = () => {
    setSelectedPet(null);
    setSelectedPetOwner(null);
  };

  // Render each pet item in the list
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
        <Text>Loading favorite pets...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Favorite Pets</Text>

      <FlatList
        data={favoritePets}
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
              {/* Display heart icon for favorites */}
              <FontAwesome
                name="heart"
                size={24}
                color="red"
                style={styles.favoriteIcon}
              />
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
                Owner: {selectedPet?.owner?.username || 'Loading...'}
              </Text>

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
  favoriteIcon: {
    marginBottom: 10,
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
  loadingContainer: {
    // Added the loadingContainer style here
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
