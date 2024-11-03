import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ViewPets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user pets from API
  const fetchUserPets = async () => {
    try {
      const userID = await AsyncStorage.getItem('userID');
      if (!userID) {
        console.log('No userID found in storage');
        return;
      }

      const response = await fetch(`https://pawsibilities-api.onrender.com/api/user/${userID}/pets`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const petsData = await response.json();
      setPets(petsData);
    } catch (error) {
      console.error('Error fetching user pets:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch pets on component mount
  useEffect(() => {
    fetchUserPets();
  }, []);

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

  const renderPetItem = ({ item }: { item: Pet }) => (
    <View style={styles.petCard}>
      <Image source={{ uri: item.imageUrl }} style={styles.petImage} />
      <View style={styles.petDetails}>
        <Text style={styles.petName}>{item.name}</Text>
        <Text style={styles.petInfo}>Species: {item.species}</Text>
        <Text style={styles.petInfo}>Breed: {item.breed}</Text>
        <Text style={styles.petInfo}>Age: {item.age}</Text>
        <Text style={styles.petInfo}>Gender: {item.gender}</Text>
        <Text style={styles.petInfo}>Size: {item.size}</Text>
        <Text style={styles.petInfo}>Color: {item.color}</Text>
        <Text style={styles.petInfo}>Description: {item.description}</Text>
        <Text style={styles.petInfo}>Available for Adoption: {item.available ? 'Yes' : 'No'}</Text>
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
});
