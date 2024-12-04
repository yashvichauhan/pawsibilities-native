/**
 * View Pets Screen for Pet Owners to view their posted pets
 */
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTabBarVisibility } from '@/context/TabBarContext';
import emailjs from '@emailjs/browser';
import axios from 'axios';

// Define the type for Adopter
interface Adopter {
  _id: string;
  username: string;
  email: string;
}

export default function ViewPets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdoptersModal, setShowAdoptersModal] = useState(false);
  const [adopters, setAdopters] = useState<Adopter[]>([]); // Explicitly type the adopters state
  const { userId, username } = useTabBarVisibility();

   // State to track input values for each adopter (Pet Owner -> Pet Adopter communication)
   const [inputValues, setInputValues] = React.useState<Record<string, string>>({});

   // Function to handle input changes For Pet Owner -> Pet Adopter communication
   const handleInputChange = (id: any, value: any) => {
     setInputValues((prevState) => ({
       ...prevState,
       [id]: value,
     }));
   };

  /**
   * Fetch pets posted by the logged-in user
   *
   */
  const fetchUserPets = async () => {
    try {
      const response = await fetch(
        'https://pawsibilities-api.onrender.com/api/user/' + userId + '/pets',
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        },
      );
      console.log(
        `https://pawsibilities-api.onrender.com/api/user/${userId}/pets`,
      );

      const petsData = await response.json();
      setPets(petsData);
      console.log('Fetched pets:', petsData);
    } catch (error) {
      console.error('Error fetching user pets:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a pet
   * @param petId
   */
  const handleDelete = async (petId: string) => {
    try {
      const response = await fetch(
        `https://pawsibilities-api.onrender.com/api/pet/${petId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.ok) {
        Alert.alert('Success', 'Pet deleted successfully');
        fetchUserPets(); // Refresh the list after deletion
      } else {
        Alert.alert('Error', 'Failed to delete pet');
      }
    } catch (error) {
      console.error('Error deleting pet:', error);
      Alert.alert('Error', 'An error occurred while deleting the pet');
    }
  };

  /**
   * Fetch interested adopters for a pet
   * @param petId
   */
  const handleViewInterestedAdopters = async (petId: string) => {
    try {
      const response = await fetch(
        `https://pawsibilities-api.onrender.com/api/pet/${petId}/interested-adopters`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      if (response.ok) {
        const adoptersData = await response.json();
        setAdopters(adoptersData);
        setShowAdoptersModal(true); // Show the modal with adopters
      } else {
        Alert.alert('Error', 'Failed to fetch interested adopters');
      }
    } catch (error) {
      console.error('Error fetching interested adopters:', error);
      Alert.alert('Error', 'An error occurred while fetching adopters');
    }
  };

   /**
   * Allow Pet Owner to contact interested Pet Adopters
   * @param adopterEmail
   * @param adopterName
   * @param ownerName
   * @param msg
   */
  const handleContactAdopter = async (adopterEmail: string, adopterName: string, ownerName: string | null, msg: string, ) => {

    try {
      const payload = {
          service_id: 'service_ef1x93d',
          template_id: 'template_w1zmtnv',
          user_id: '1Ffx3G6iIfEiMMG6-', //this includes a dash that is part of my key
          accessToken: 'NVYlA1xYTnF_H56l2jNK_',
          template_params: {
              to_name: adopterName,
              from_name: ownerName,
              message: msg,
              to_email: adopterEmail
          }
      };
      const headers = { "Content-Type": "application/json" };
      const { status } = await axios.post('https://api.emailjs.com/api/v1.0/email/send', payload, { headers });
      if(status === 200) {
        Alert.alert('Success', 'Email sent successfully');
      }
  } catch (error) {
    Alert.alert('Error', error as any);
   }

  };

  // Render the modal with adopters' details
  const renderAdoptersModal = () => {
    
    return (
      <Modal
        visible={showAdoptersModal}
        animationType="slide"
        onRequestClose={() => setShowAdoptersModal(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Interested Adopters</Text>

          {adopters.length === 0 ? (
            <Text style={styles.noAdoptersText}>
              No interested adopters found
            </Text>
          ) : (
            <FlatList
              data={adopters}
              renderItem={({ item }) => (
                <View style={styles.adopterCard}>
                  <Text style={styles.adopterText}>
                    Username: {item.username}
                  </Text>
                  <Text style={styles.adopterText}>Email: {item.email}</Text>

                   {/* Text input for message */}
                <TextInput
                  style={styles.textInput}
                  placeholder="Type your message here"
                  value={inputValues[item._id] || ""}
                  onChangeText={(value) => handleInputChange(item._id, value)}
                />

                  <TouchableOpacity
                      style={styles.contactButton}
                      onPress={() => handleContactAdopter(item.email, item.username, username, inputValues[item._id] || "")}
                    >
                      <Text style={styles.buttonText}>Send Message</Text>
                    </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item) => item._id}
              contentContainerStyle={styles.listContainer}
            />
          )}

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowAdoptersModal(false)}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };

  /**
   * Update pet availability status (toggle between available and adopted)
   * @param petId
   * @param currentAvailability
   */
  const handleToggleAvailability = async (
    petId: string,
    currentAvailability: boolean,
  ) => {
    try {
      const response = await fetch(
        `https://pawsibilities-api.onrender.com/api/pet/${petId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ available: !currentAvailability }),
        },
      );

      if (response.ok) {
        Alert.alert('Success', 'Pet status updated successfully');
        fetchUserPets(); // Refresh the list after updating
      } else {
        Alert.alert('Error', 'Failed to update pet status');
      }
    } catch (error) {
      console.error('Error updating pet status:', error);
      Alert.alert('Error', 'An error occurred while updating the pet status');
    }
  };

  // Fetch pets whenever the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      setLoading(true); // Show loading indicator
      fetchUserPets();
    }, []),
  );

  // Render individual pet details in a card
  interface Pet {
    _id: string;
    imageUrl: string;
    name: string;
    species: string;
    breed: string;
    age: string;
    gender: string;
    size: string;
    color: string;
    description: string;
    available: boolean;
  }

  const renderPetItem = ({ item }: { item: any }) => (
    <View style={styles.petCard}>
      <Image source={{ uri: item.imageUrl }} style={styles.petImage} />
      <View style={styles.petDetails}>
        <Text style={styles.petName}>{item.name}</Text>
        <Text style={styles.petInfo}>Breed: {item.breed}</Text>
        <Text style={styles.petInfo}>Age: {item.age}</Text>
        <Text style={styles.petInfo}>Gender: {item.gender}</Text>
        <Text style={styles.petInfo}>Size: {item.size}</Text>
        <Text style={styles.petInfo}>Color: {item.color}</Text>
        <Text style={styles.petInfo}>Description: {item.description}</Text>
        <Text style={styles.petInfo}>Species: {item.species}</Text>
        <Text style={styles.petInfo}>
          Available for Adoption: {item.available ? 'Yes' : 'No'}
        </Text>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[
              styles.button,
              item.available ? styles.adoptedButton : styles.unadoptedButton,
            ]}
            onPress={() => handleToggleAvailability(item._id, item.available)}
          >
            <Text style={styles.buttonText}>
              {item.available ? 'Mark as Adopted' : 'Mark as Available'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.interestedButton]}
            onPress={() => handleViewInterestedAdopters(item._id)} // Open interested adopters modal
          >
            <Text style={styles.buttonText}>Interested Adopters</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={() => handleDelete(item._id)}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Show loading indicator while data is being fetched
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text>Loading pets...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Posted Pets</Text>
      <FlatList
        data={pets}
        renderItem={renderPetItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
      />
      {renderAdoptersModal()}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  petCard: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
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
    marginRight: 15,
  },
  petDetails: {
    flex: 1,
    justifyContent: 'space-between',
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
  actionButtons: {
    flexDirection: 'row',
    marginTop: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#4caf50',
  },
  adoptedButton: {
    backgroundColor: '#4caf50',
  },
  unadoptedButton: {
    backgroundColor: '#ffa500',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  adopterCard: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  adopterText: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 15,
    alignItems: 'center',
  },
  interestedButton: {
    backgroundColor: '#6200ee',
  },
  noAdoptersText: {
    fontSize: 18,
    color: '#777',
    textAlign: 'center',
    marginVertical: 20,
  },
  contactButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 8,
    marginTop: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  textInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    marginTop: 10
  }
});
