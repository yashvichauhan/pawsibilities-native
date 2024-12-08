import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Toast from 'react-native-toast-message';
import PetCard from '../../components/PetCard';

const AvailablePets = () => {
  interface Pet {
    _id: string;
    name: string;
    species: string;
    breed: string;
    age: number;
    gender: string;
    size: string;
    color: string;
    description: string;
    available: boolean;
    imageUrl: string;
  }

  const [pets, setPets] = useState<Pet[]>([]);
  const [filteredPets, setFilteredPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [showContactModal, setShowContactModal] = useState<boolean>(false);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const response = await fetch(
        'https://pawsibilities-api.onrender.com/api/pets'
      );
      const data = await response.json();
      setPets(data);
      setFilteredPets(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pets:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to load pets',
        text2: 'Please try again later.',
      });
      setLoading(false);
    }
  };

  const searchFilter = (text: string) => {
    const filtered = pets.filter((pet) =>
      pet.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredPets(filtered);
  };

  const handleCardPress = (pet: Pet) => {
    setSelectedPet(pet);
  };

  const closePetModal = () => {
    setSelectedPet(null);
  };

  const sendMessageToOwner = async () => {
    if (!message) {
      Alert.alert('Error', 'Please enter a message.');
      return;
    }

    try {
      const response = await fetch(
        https://pawsibilities-api.onrender.com/api/pet/${selectedPet?._id}/contact-owner,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            adopterId: 'currentUserId', // Replace with actual user ID
            message,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Your message has been sent to the pet owner.');
        setShowContactModal(false);
        setMessage('');
      } else {
        Alert.alert('Error', data.error || 'Failed to send message.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
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
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={filteredPets}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleCardPress(item)}>
              <PetCard pet={item} />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item._id}
          numColumns={numColumns}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.flatListContent}
        />
      )}

      {/* Pet Details Modal */}
      <Modal
        visible={!!selectedPet}
        transparent={true}
        animationType="slide"
        onRequestClose={closePetModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedPet && (
              <View style={styles.modalRow}>
                <Image
                  source={{ uri: selectedPet.imageUrl }}
                  style={styles.modalImage}
                />
                <View style={styles.modalTextContainer}>
                  <Text style={styles.modalTitle}>{selectedPet.name}</Text>
                  <Text style={styles.modalText}>
                    Species: {selectedPet.species}
                  </Text>
                  <Text style={styles.modalText}>
                    Breed: {selectedPet.breed}
                  </Text>
                  <Text style={styles.modalText}>
                    Age: {selectedPet.age} years
                  </Text>
                  <Text style={styles.modalText}>
                    Gender: {selectedPet.gender}
                  </Text>
                  <Text style={styles.modalText}>
                    Size: {selectedPet.size}
                  </Text>
                  <Text style={styles.modalText}>
                    Color: {selectedPet.color}
                  </Text>
                  <Text style={styles.modalText}>
                    {selectedPet.description}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowContactModal(true)}
                    style={styles.contactButton}
                  >
                    <Text style={styles.contactButtonText}>
                      Contact Owner
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            <TouchableOpacity
              onPress={closePetModal}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Contact Owner Modal */}
      <Modal
        visible={showContactModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowContactModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Contact {selectedPet?.owner?.username || 'Owner'}
            </Text>
            <TextInput
              placeholder="Write your message here..."
              style={styles.messageInput}
              multiline
              value={message}
              onChangeText={setMessage}
            />
            <TouchableOpacity
              onPress={sendMessageToOwner}
              style={styles.sendButton}
            >
              <Text style={styles.sendButtonText}>Send Message</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowContactModal(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
  contactButton: {
    marginTop: 8,
    backgroundColor: '#2196F3',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  contactButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  messageInput: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
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
