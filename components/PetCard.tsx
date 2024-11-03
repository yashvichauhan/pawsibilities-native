import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

type Pet = {
  id: number;
  name: string;
  status: string;
  image: string;
};

type PetCardProps = {
  pet: Pet;
};

const PetCard: React.FC<PetCardProps> = ({ pet }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);

    // Show toast based on the favorite action
    if (!isFavorite) {
      Toast.show({
        type: 'success',
        text1: 'Added to Favorites',
        text2: `${pet.name} has been added to your favorites.`,
      });
    } else {
      Toast.show({
        type: 'info',
        text1: 'Removed from Favorites',
        text2: `${pet.name} has been removed from your favorites.`,
      });
    }
  };

  return (
    <View style={styles.card}>
      <Image source={{ uri: pet.image }} style={styles.image} />
      <TouchableOpacity style={styles.heartIcon} onPress={toggleFavorite}>
        <FontAwesome
          name="heart"
          size={24}
          color={isFavorite ? 'red' : 'gray'}
        />
      </TouchableOpacity>
      <Text style={styles.name}>{pet.name}</Text>
      <Text style={[styles.status, pet.status === 'Available' ? styles.available : styles.adopted]}>
        {pet.status}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 8,
    margin: 8,
    width: 160,  // Set a fixed width for each card
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginBottom: 8,
  },
  heartIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  status: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  available: {
    backgroundColor: 'green',
  },
  adopted: {
    backgroundColor: 'red',
  },
});

export default PetCard;
